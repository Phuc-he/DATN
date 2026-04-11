'use client';

import React, { useEffect, useState } from 'react';
import { WebSetting } from '@/src/domain/entity/web-setting.entity';
import { X, Settings, Globe, Mail, Upload, Layout, CheckCircle2, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface WebSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (setting: WebSetting) => void;
  initialData?: WebSetting | null;
}

const WebSettingModal: React.FC<WebSettingModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<WebSetting>>({
    webName: 'My Bookstore',
    logoUrl: '', // This will store the Base64 string
    headerIcon: 'BookOpen',
    contactEmail: '',
    footerText: '',
    isActive: true,
  });

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData(initialData ? { ...initialData } : {
      webName: 'My Bookstore',
      logoUrl: '',
      headerIcon: 'BookOpen',
      contactEmail: '',
      footerText: '',
      isActive: true,
    });
  }, [initialData, isOpen]);

  // Helper to convert File to Base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: Size limit check (e.g., 1MB)
    if (file.size > 1024 * 1024) {
      alert("Image is too large. Please select a file under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(new WebSetting({ ...formData, id: initialData?.id || 0 }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-slate-950">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="text-emerald-600" size={20} />
            <h2 className="text-xl font-bold text-slate-800">
              {initialData ? 'Update Web Settings' : 'Create Web Settings'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-emerald-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Logo Upload Section */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Brand Logo</label>
            <div className="flex items-center gap-4 p-4 border-2 border-dashed border-slate-200 rounded-xl bg-emerald-50/50">
              {formData.logoUrl ? (
                <div className="relative group">
                  <Image 
                    src={formData.logoUrl} 
                    alt="Preview" 
                    className="h-16 w-16 object-contain bg-white border rounded-lg p-1" 
                    width={100}
                    height={100}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, logoUrl: '' })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 flex items-center justify-center bg-slate-200 text-slate-400 rounded-lg">
                  <Upload size={24} />
                </div>
              )}
              
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label 
                  htmlFor="logo-upload" 
                  className="inline-block px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg cursor-pointer hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  {formData.logoUrl ? 'Change Image' : 'Choose Image'}
                </label>
                <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 1MB</p>
              </div>
            </div>
          </div>

          {/* Web Name */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Globe size={14} /> Website Name
            </label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.webName}
              onChange={(e) => setFormData({ ...formData, webName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Layout size={14} /> Header Icon
              </label>
              <input
                type="text"
                placeholder="e.g. BookOpen"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                value={formData.headerIcon}
                onChange={(e) => setFormData({ ...formData, headerIcon: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail size={14} /> Contact Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Footer Text</label>
            <textarea
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isActive"
              className="w-5 h-5 accent-emerald-600 rounded"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
              Set as active configuration
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-slate-600 font-semibold hover:bg-emerald-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              {initialData ? 'Update Settings' : 'Create Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebSettingModal;
