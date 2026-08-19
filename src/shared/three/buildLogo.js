import { LOGO } from './logoPaths.js';

/*
 * Turns the wordmark's SVG subpaths into extruded, bevelled geometry.
 * SVG path grammar is parsed here rather than pulled from a library so the model stays a plain
 * function over `logoPaths.js` with no runtime dependency beyond three itself.
 */

const NUM = /^[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/;

function scanner(d) {
  let i = 0;
  const sep = () => { while (i < d.length && /[\s,]/.test(d[i])) i++; };
  return {
    done: () => { sep(); return i >= d.length; },
    peekCmd: () => { sep(); return /[a-zA-Z]/.test(d[i]) ? d[i] : null; },
    cmd: () => { sep(); return d[i++]; },
    num: () => {
      sep();
      const m = NUM.exec(d.slice(i));
      if (!m) throw new Error(`bad number at ${i} in ${d.slice(i, i + 12)}`);
      i += m[0].length;
      return parseFloat(m[0]);
    },
    flag: () => { sep(); return d[i++] === '1' ? 1 : 0; },
  };
}

const segCount = (len) => Math.min(56, Math.max(6, Math.ceil(len * 2.6)));

/** Sampled cubic bezier, appended to `pts`. */
function cubic(THREE, pts, p0, p1, p2, p3) {
  const approx = p0.distanceTo(p1) + p1.distanceTo(p2) + p2.distanceTo(p3);
  const n = segCount(approx);
  for (let k = 1; k <= n; k++) {
    const t = k / n, u = 1 - t;
    pts.push(new THREE.Vector2(
      u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    ));
  }
}

function quad(THREE, pts, p0, p1, p2) {
  cubic(THREE, pts, p0,
    new THREE.Vector2(p0.x + (2 / 3) * (p1.x - p0.x), p0.y + (2 / 3) * (p1.y - p0.y)),
    new THREE.Vector2(p2.x + (2 / 3) * (p1.x - p2.x), p2.y + (2 / 3) * (p1.y - p2.y)),
    p2);
}

/** Endpoint-parameterised elliptical arc, sampled. */
function arc(THREE, pts, p0, rxIn, ryIn, rotDeg, largeArc, sweep, p1) {
  if (rxIn === 0 || ryIn === 0) { pts.push(p1.clone()); return; }
  let rx = Math.abs(rxIn), ry = Math.abs(ryIn);
  const phi = (rotDeg * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (p0.x - p1.x) / 2, dy = (p0.y - p1.y) / 2;
  const x1 = cos * dx + sin * dy, y1 = -sin * dx + cos * dy;
  const lam = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry);
  if (lam > 1) { const s = Math.sqrt(lam); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1;
  const den = rx * rx * y1 * y1 + ry * ry * x1 * x1;
  let co = Math.sqrt(Math.max(0, num / den));
  if (largeArc === sweep) co = -co;
  const cxp = (co * rx * y1) / ry, cyp = (-co * ry * x1) / rx;
  const cx = cos * cxp - sin * cyp + (p0.x + p1.x) / 2;
  const cy = sin * cxp + cos * cyp + (p0.y + p1.y) / 2;
  const ang = (ux, uy, vx, vy) => {
    const dot = (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy));
    const a = Math.acos(Math.min(1, Math.max(-1, dot)));
    return ux * vy - uy * vx < 0 ? -a : a;
  };
  const t1 = ang(1, 0, (x1 - cxp) / rx, (y1 - cyp) / ry);
  let dt = ang((x1 - cxp) / rx, (y1 - cyp) / ry, (-x1 - cxp) / rx, (-y1 - cyp) / ry);
  if (!sweep && dt > 0) dt -= Math.PI * 2;
  if (sweep && dt < 0) dt += Math.PI * 2;
  const n = segCount(Math.abs(dt) * Math.max(rx, ry));
  for (let k = 1; k <= n; k++) {
    const t = t1 + (dt * k) / n;
    const ex = rx * Math.cos(t), ey = ry * Math.sin(t);
    pts.push(new THREE.Vector2(cx + cos * ex - sin * ey, cy + sin * ex + cos * ey));
  }
}

/** One `d` attribute to a list of closed point rings. */
function parsePath(THREE, d) {
  const s = scanner(d);
  const subs = [];
  let pts = null, cur = new THREE.Vector2(), start = new THREE.Vector2();
  let prevCtrl = null, cmd = null;
  const open = () => { pts = [cur.clone()]; subs.push(pts); };
  while (!s.done()) {
    if (s.peekCmd()) cmd = s.cmd();
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const px = rel ? cur.x : 0, py = rel ? cur.y : 0;
    if (C === 'M') {
      cur = new THREE.Vector2(s.num() + px, s.num() + py);
      start = cur.clone(); open(); prevCtrl = null;
      cmd = rel ? 'l' : 'L';
    } else if (C === 'Z') {
      if (pts && pts.length) pts.push(start.clone());
      cur = start.clone(); prevCtrl = null;
    } else if (C === 'L' || C === 'H' || C === 'V') {
      const p = C === 'L' ? new THREE.Vector2(s.num() + px, s.num() + py)
        : C === 'H' ? new THREE.Vector2(s.num() + px, cur.y)
          : new THREE.Vector2(cur.x, s.num() + py);
      pts.push(p); cur = p; prevCtrl = null;
    } else if (C === 'C' || C === 'S') {
      const c1 = C === 'C' ? new THREE.Vector2(s.num() + px, s.num() + py)
        : prevCtrl ? new THREE.Vector2(2 * cur.x - prevCtrl.x, 2 * cur.y - prevCtrl.y) : cur.clone();
      const c2 = new THREE.Vector2(s.num() + px, s.num() + py);
      const p = new THREE.Vector2(s.num() + px, s.num() + py);
      cubic(THREE, pts, cur, c1, c2, p); cur = p; prevCtrl = c2;
    } else if (C === 'Q' || C === 'T') {
      const c1 = C === 'Q' ? new THREE.Vector2(s.num() + px, s.num() + py)
        : prevCtrl ? new THREE.Vector2(2 * cur.x - prevCtrl.x, 2 * cur.y - prevCtrl.y) : cur.clone();
      const p = new THREE.Vector2(s.num() + px, s.num() + py);
      quad(THREE, pts, cur, c1, p); cur = p; prevCtrl = c1;
    } else if (C === 'A') {
      const rx = s.num(), ry = s.num(), rot = s.num(), la = s.flag(), sw = s.flag();
      const p = new THREE.Vector2(s.num() + px, s.num() + py);
      arc(THREE, pts, cur, rx, ry, rot, la, sw, p); cur = p; prevCtrl = null;
    } else throw new Error(`unsupported path command ${cmd}`);
  }
  return subs.filter((p) => p.length > 2);
}

const area = (p) => {
  let a = 0;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += p[j].x * p[i].y - p[i].x * p[j].y;
  return a / 2;
};

function inside(pt, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

const bbox = (p) => p.reduce((b, v) => ({
  x0: Math.min(b.x0, v.x), x1: Math.max(b.x1, v.x),
  y0: Math.min(b.y0, v.y), y1: Math.max(b.y1, v.y),
}), { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity });

/** Group rings into solids and their holes, by even-odd nesting depth. */
function toSolids(subs) {
  const rings = subs.map((p) => ({ p, box: bbox(p), a: Math.abs(area(p)) }));
  rings.forEach((r) => {
    r.depth = rings.filter((o) => o !== r && o.a > r.a && inside(r.p[0], o.p)).length;
  });
  const solids = rings.filter((r) => r.depth % 2 === 0);
  const holes = rings.filter((r) => r.depth % 2 === 1);
  solids.forEach((s) => { s.holes = []; });
  holes.forEach((h) => {
    const owner = solids.filter((s) => inside(h.p[0], s.p)).sort((a, b) => a.a - b.a)[0];
    if (owner) owner.holes.push(h);
  });
  return solids;
}

const S = 0.01;      // viewBox unit -> scene unit (wordmark ends up 1.50 wide)
const DEPTH = 0.11;

const MATERIAL_SPEC = {
  '#23376F': { name: 'biztras_navy', color: 0x23376f },
  '#DC1E35': { name: 'biztras_red', color: 0xdc1e35 },
};

/**
 * Builds the extruded Biztras wordmark, centred on the origin.
 * @param {object} THREE - The three module namespace (passed in so this file imports nothing).
 * @returns {object} A `THREE.Group` holding one mesh per glyph cluster.
 */
export function buildLogo(THREE) {
  const bevel = {
    bevelEnabled: true,
    bevelThickness: 0.009,
    bevelSize: 0.005,
    bevelOffset: 0,
    bevelSegments: 4,
    steps: 1,
    depth: DEPTH - 0.009,
  };

  const toShape = (ring) => {
    const map = (p) => p.map((v) => new THREE.Vector2(v.x * S, -v.y * S));
    const shape = new THREE.Shape(map(ring.p));
    ring.holes.forEach((h) => shape.holes.push(new THREE.Path(map(h.p))));
    return shape;
  };

  const group = new THREE.Group();
  group.name = 'biztras_logo';

  const materials = Object.fromEntries(
    Object.entries(MATERIAL_SPEC).map(([hex, spec]) => [
      hex,
      new THREE.MeshStandardMaterial({ name: spec.name, color: spec.color, roughness: 0.34, metalness: 0.22 }),
    ]),
  );

  const byColor = {};
  LOGO.forEach(({ d, fill }) => {
    (byColor[fill] = byColor[fill] || []).push(...toSolids(parsePath(THREE, d)));
  });

  Object.entries(byColor).forEach(([fill, solids]) => {
    solids.sort((a, b) => a.box.x0 - b.box.x0);
    // Merge only when one box sits almost entirely inside another (the dot of the "i" over its
    // stem); kerned neighbours stay separate meshes.
    const clusters = [];
    solids.forEach((s) => {
      const last = clusters[clusters.length - 1];
      const w = Math.min(s.box.x1 - s.box.x0, last ? last.box.x1 - last.box.x0 : 0);
      const overlap = last ? Math.min(s.box.x1, last.box.x1) - Math.max(s.box.x0, last.box.x0) : -1;
      if (last && overlap > 0.8 * w) {
        last.rings.push(s);
        last.box.x1 = Math.max(last.box.x1, s.box.x1);
      } else {
        clusters.push({ rings: [s], box: { ...s.box } });
      }
    });
    clusters.forEach((c, i) => {
      const geo = new THREE.ExtrudeGeometry(c.rings.map(toShape), bevel);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, materials[fill]);
      mesh.name = `part_${fill.slice(1)}_${i}`;
      group.add(mesh);
    });
  });

  // Centre on the origin in all three axes so orbiting spins about the wordmark itself.
  const box = new THREE.Box3().setFromObject(group);
  const centre = box.getCenter(new THREE.Vector3());
  group.position.sub(centre);

  const wrap = new THREE.Group();
  wrap.name = 'biztras_logo_3d';
  wrap.add(group);
  return wrap;
}
