'use client';

import React from 'react';
import { WebSetting } from '@/src/domain/entity/web-setting.entity';
import {
  Edit,
  Trash2,
  Globe,
  Mail,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Clock,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';

interface WebSettingTableProps {
  settings: WebSetting[];
  onEdit: (setting: WebSetting) => void;
  onDelete: (id: number) => void;
}

const WebSettingTable: React.FC<WebSettingTableProps> = ({ settings, onEdit, onDelete }) => {

  // Dynamic Icon Renderer
  const renderIcon = (iconName: string | undefined) => {
    // Fallback to 'Globe' if the name is invalid or missing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IconComponent = (LucideIcons as any)[iconName || 'Globe'] || Globe;
    return <IconComponent size={18} />;
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Website</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Appearance</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact & Footer</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Updated</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {settings.map((setting) => (
            <tr key={setting.id} className="hover:bg-slate-50 transition-colors">

              {/* Web Name & Logo Preview */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {setting.logoUrl ? (
                      <Image src={setting.logoUrl} alt="Logo" className="h-full w-full object-contain" width={64} height={64} />
                    ) : (
                      <ImageIcon size={20} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{setting.webName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {setting.id}</span>
                  </div>
                </div>
              </td>

              {/* Icon & Appearance */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
                    {renderIcon(setting.headerIcon)}
                  </div>
                  <span className="font-medium">{setting.headerIcon || 'Default'}</span>
                </div>
              </td>

              {/* Contact & Footer */}
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1 max-w-[200px]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <Mail size={12} className="text-slate-400" />
                    <span className="truncate">{setting.contactEmail || 'No email'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate italic">
                    {setting.footerText || 'No footer text set'}
                  </div>
                </div>
              </td>

              {/* Last Updated */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={14} className="text-slate-300" />
                  <span>
                    {setting.updatedAt
                      ? new Date(setting.updatedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
                      : 'Never'}
                  </span>
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                {setting.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle size={10} /> LIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-500 border border-slate-200">
                    <XCircle size={10} /> DRAFT
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(setting)}
                  className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-all active:scale-90 mr-1"
                  title="Edit Settings"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(setting.id)}
                  className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                  title="Delete Settings"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
          {settings.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                No configurations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WebSettingTable;