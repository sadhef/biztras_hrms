import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getTypes, applyLeave } from '../services/leaveService.js';
import DatePicker from '../../../shared/components/DatePicker.jsx';

const emptyForm = { leaveTypeId: '', from: '', to: '', reason: '' };

const labelClass = 'min-w-0 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[var(--tx2)]';
const fieldClass = 'mt-[7px] min-w-0 w-full max-w-full rounded-[9px] border border-[#E1E2E7] bg-white px-3.5 py-3 text-[15px] text-[var(--tx)] outline-none focus:border-[var(--ink-2)]';

/** Leave-request modal shared by the Dashboard's "Apply Leave" shortcut and the Leave Requests page. */
const ApplyLeaveModal = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);

  const typesQuery = useQuery({ queryKey: ['leave', 'types'], queryFn: getTypes, enabled: open });

  useEffect(() => {
    if (open && typesQuery.data?.length && !form.leaveTypeId) {
      setForm((f) => ({ ...f, leaveTypeId: String(typesQuery.data[0].id) }));
    }
  }, [open, typesQuery.data, form.leaveTypeId]);

  const applyMutation = useMutation({
    mutationFn: () => applyLeave({
      leaveTypeId: Number(form.leaveTypeId),
      dateFrom: form.from,
      dateTo: form.to,
      description: form.reason,
    }),
    onSuccess: () => {
      toast.success('Leave request submitted for approval');
      queryClient.invalidateQueries({ queryKey: ['leave'] });
      setForm(emptyForm);
      onClose();
    },
    onError: (error) => toast.error(error.message),
  });

  if (!open) return null;

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setDateField = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = () => {
    if (!form.leaveTypeId || !form.from || !form.to) {
      toast.error('Leave type, from date and to date are required.');
      return;
    }
    applyMutation.mutate();
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[210] flex items-start justify-center overflow-y-auto overscroll-contain bg-[rgba(22,38,77,0.5)] p-4 backdrop-blur-[3px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-leave-title"
        className="bz-pop my-auto max-h-[calc(100vh-2rem)] w-full max-w-[520px] overflow-hidden overflow-y-auto overscroll-contain rounded-2xl bg-[var(--surface)] shadow-[0_30px_70px_rgba(22,38,77,0.36)] supports-[height:100dvh]:max-h-[calc(100dvh-2rem)]"
      >
        <div className="bg-[var(--ink)] px-7 py-[22px] text-white">
          <h2 id="apply-leave-title" className="m-0 text-xl font-semibold">New Leave Request</h2>
          <p className="m-0 mt-1 text-sm text-[#A9B7D6]">Routed to your reporting manager for approval.</p>
        </div>

        <div className="flex flex-col gap-[15px] px-7 py-[26px]">
          <label className={labelClass}>
            Leave type
            <select value={form.leaveTypeId} onChange={setField('leaveTypeId')} disabled={typesQuery.isLoading} className={fieldClass}>
              {typesQuery.isLoading && <option>Loading...</option>}
              {(typesQuery.data || []).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <label className={labelClass}>
              From
              <DatePicker value={form.from} onChange={setDateField('from')} />
            </label>
            <label className={labelClass}>
              To
              <DatePicker value={form.to} onChange={setDateField('to')} />
            </label>
          </div>
          <label className={labelClass}>
            Reason
            <textarea
              value={form.reason}
              onChange={setField('reason')}
              rows={3}
              placeholder="Optional note for your manager"
              className={`${fieldClass} resize-y normal-case`}
            />
          </label>
        </div>

        <div className="flex flex-col-reverse justify-end gap-2.5 px-7 pb-[26px] sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 w-full cursor-pointer rounded-[9px] border border-[#E1E2E7] bg-white px-[22px] py-3 text-[15px] font-medium text-[#3A3550] hover:bg-[var(--bg)] sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={applyMutation.isPending}
            className="min-h-11 w-full cursor-pointer rounded-[9px] border-0 bg-[var(--pri)] px-[26px] py-3 text-[15px] font-medium text-white transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(217,28,53,0.32)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {applyMutation.isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ApplyLeaveModal;
