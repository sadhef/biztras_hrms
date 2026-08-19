import { useEffect, useRef } from 'react';

/**
 * How far the camera may tilt above or below the wordmark's own plane, in radians.
 * Kept shallow on purpose: the mark is wide and flat, so every degree of tilt swings its width
 * into the vertical axis, which both costs framing room and makes the lettering harder to read.
 */
const MAX_TILT = 0.26;

/** Per-frame ease back toward the front-on view once a drag ends. Small on purpose: this runs
 *  every animation frame, so it reads as a gentle drift home, not a snap. */
const RETURN_EASE = 0.055;

/**
 * The Biztras wordmark as an extruded 3D model on a transparent stage. Static until dragged;
 * orbits by hand only.
 *
 * three.js is ~150KB gzipped, so it is pulled in by dynamic import inside the effect. That keeps
 * it out of the main bundle and off every route that does not render this component.
 *
 * @param {number} [height] - Stage height in px; the stage always fills its container's width.
 * @param {string} [className] - Classes applied to the stage element.
 */
const BiztrasLogo3D = ({ height = 190, className = '' }) => {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    // Set by the cleanup below; every async step checks it so a fast unmount cannot leave a
    // renderer or animation loop running against a detached node.
    let disposed = false;
    let teardown = null;

    (async () => {
      const [THREE, { OrbitControls }, { buildLogo }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('../three/buildLogo.js'),
      ]);
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
      renderer.domElement.style.display = 'block';
      renderer.domElement.style.cursor = 'grab';

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);

      // Neutral studio wash, a key light for the bevels, and a dim rear fill so the silhouette
      // never goes black against the light canvas.
      scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.15));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(4, 7, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xfff4e6, 0.55);
      fill.position.set(-5, 3, -4);
      scene.add(fill);

      const model = buildLogo(THREE);
      scene.add(model);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      // The stage sits inline in a form: wheel and drag-pan must stay with the page.
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.minPolarAngle = Math.PI / 2 - MAX_TILT;
      controls.maxPolarAngle = Math.PI / 2 + MAX_TILT;

      let dragging = false;
      const onStart = () => { dragging = true; renderer.domElement.style.cursor = 'grabbing'; };
      const onEnd = () => { dragging = false; renderer.domElement.style.cursor = 'grab'; };
      controls.addEventListener('start', onStart);
      controls.addEventListener('end', onEnd);
      const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
      const spanX = Math.max(size.x, size.z);
      const spanY = size.y * Math.cos(MAX_TILT) + spanX * Math.sin(MAX_TILT);
      const fit = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        const vFov = (camera.fov * Math.PI) / 180;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        const dist = Math.max(
          spanY / 2 / Math.tan(vFov / 2),
          spanX / 2 / Math.tan(hFov / 2),
        ) * 1.08;
        camera.position.setLength(dist);
        camera.updateProjectionMatrix();
        controls.update();
      };
      // Front-on by default: reads as the flat logo, not a 3D curiosity, until dragged.
      camera.position.set(0, 0, 1);
      fit();

      const observer = new ResizeObserver(fit);
      observer.observe(host);

      const spherical = new THREE.Spherical();
      renderer.setAnimationLoop(() => {
        controls.update();

        if (!dragging) {
          spherical.setFromVector3(camera.position.clone().sub(controls.target));
          // Shortest path back to theta = 0, so a multi-turn drag unwinds the short way rather
          // than spinning all the way back around.
          let theta = spherical.theta % (Math.PI * 2);
          if (theta > Math.PI) theta -= Math.PI * 2;
          else if (theta < -Math.PI) theta += Math.PI * 2;
          const phi = spherical.phi + (Math.PI / 2 - spherical.phi) * RETURN_EASE;
          theta += (0 - theta) * RETURN_EASE;
          if (Math.abs(theta) > 1e-4 || Math.abs(phi - Math.PI / 2) > 1e-4) {
            camera.position.setFromSpherical(new THREE.Spherical(spherical.radius, phi, theta)).add(controls.target);
            camera.lookAt(controls.target);
          }
        }

        renderer.render(scene, camera);
      });

      teardown = () => {
        observer.disconnect();
        renderer.setAnimationLoop(null);
        controls.removeEventListener('start', onStart);
        controls.removeEventListener('end', onEnd);
        controls.dispose();
        model.traverse((o) => {
          if (!o.isMesh) return;
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        });
        renderer.domElement.remove();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      if (teardown) teardown();
    };
  }, []);

  return <div ref={hostRef} className={className} style={{ height }} aria-hidden="true" />;
};

export default BiztrasLogo3D;
