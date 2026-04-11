'use client';

import React from 'react';
import { History, User, Activity, Clock, Info, Trash2 } from 'lucide-react';
import { ActivityLog } from '@/src/domain/entity/activity-log.entity';

interface ActivityLogTableProps {
  logs: ActivityLog[];
  onDelete?: (id: number) => void;
}

const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs, onDelete }) => {

  const getActionBadge = (action: string) => {
    const baseClasses = "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm";
    const status = action.toUpperCase();

    if (status.includes('DELETE') || status.includes('FAILURE')) {
      return <span className={`${baseClasses} bg-red-50 text-red-700 border border-red-200`}>{action}</span>;
    }
    if (status.includes('CREATE')) {
      return <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`}>{action}</span>;
    }
    if (status.includes('UPDATE')) {
      return <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border border-emerald-200`}>{action}</span>;
    }
    return <span className={`${baseClasses} bg-emerald-50 text-slate-600 border border-slate-200`}>{action}</span>;
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-emerald-50/80">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-tight">Event</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-tight">Performed By</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-tight">Details</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-emerald-800 uppercase tracking-tight">Time (Local)</th>
            {onDelete && <th className="px-6 py-4 text-right text-xs font-bold text-emerald-800 uppercase tracking-tight">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {logs.map((log) => {
            // Safely parse the ISO string: "2026-03-28T16:02:53.343290"
            const dateObj = new Date(log.createdAt);
            const isValidDate = !isNaN(dateObj.getTime());

            return (
              <tr key={log.id} className="hover:bg-emerald-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-9 w-9 flex-shrink-0 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-emerald-900 transition-colors shadow-inner">
                      <Activity size={18} />
                    </div>
                    <div className="ml-4">
                      <div className="mb-1">{getActionBadge(log.action)}</div>
                      <div className="text-sm font-semibold text-slate-950">{log.entityName}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-600">
                    <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center mr-2">
                      <User size={12} className="text-emerald-800" />
                    </div>
                    <span className="font-medium truncate max-w-[150px]">{log.performedBy}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-start max-w-xs">
                    <Info size={14} className="mr-2 mt-0.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-600 line-clamp-2 italic leading-relaxed">
                      {log.details}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap" title={log.createdAt}>
                  {isValidDate ? (
                    <div className="flex flex-col text-xs">
                      <div className="text-slate-800 font-bold flex items-center">
                        <Clock size={12} className="mr-1 text-emerald-900" />
                        {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-slate-400 font-medium ml-[16px]">
                        {dateObj.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-red-400 font-mono">Invalid Date</span>
                  )}
                </td>

                {onDelete && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onDelete(log.id)}
                      className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                      title="Permanently remove log"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}

          {logs.length === 0 && (
            <tr>
              <td colSpan={onDelete ? 5 : 4} className="px-6 py-20 text-center text-slate-400">
                <div className="flex flex-col items-center">
                  <History className="mb-4 opacity-10" size={80} />
                  <p className="text-lg font-semibold text-emerald-800">Audit trail is empty</p>
                  <p className="text-sm">No system activities have been captured yet.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityLogTable;
