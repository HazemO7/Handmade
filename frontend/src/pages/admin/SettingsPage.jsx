import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../services/api';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatWhatsAppNumber } from '../../utils/whatsapp';
import toast from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { FiSave, FiSettings, FiPhone } from 'react-icons/fi';

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    brandName: '',
    whatsappNumber: '',
    defaultCurrency: 'EGP',
    primaryColor: '#8B6F47',
    secondaryColor: '#D4A574',
    backgroundColor: '#FDF8F4',
    visualStyle: 'warm, minimal, elegant',
    aiInstructions: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const res = await settingsApi.getSettings();
      if (res.data) {
        setFormData({
          brandName: res.data.brandName || 'Handmade Store',
          whatsappNumber: res.data.whatsappNumber || '',
          defaultCurrency: res.data.defaultCurrency || 'EGP',
          primaryColor: res.data.primaryColor || '#8B6F47',
          secondaryColor: res.data.secondaryColor || '#D4A574',
          backgroundColor: res.data.backgroundColor || '#FDF8F4',
          visualStyle: res.data.visualStyle || 'warm, minimal, elegant',
          aiInstructions: res.data.aiInstructions || '',
        });
      }
    } catch (err) {
      toast.error('Failed to load store settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await settingsApi.updateSettings(formData);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err.error?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const formattedPreview = formatWhatsAppNumber(formData.whatsappNumber);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-warm-900 flex items-center">
          <FiSettings className="mr-3 text-brand-600" /> Store Settings
        </h1>
        <p className="text-sm text-warm-600 mt-1">
          Configure your store information, WhatsApp checkout number, and brand preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WhatsApp & Contact Card */}
        <div className="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-green-100 text-green-700 mr-3">
              <FaWhatsapp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-warm-900">WhatsApp Ordering Settings</h2>
              <p className="text-xs text-warm-500">
                Incoming orders from the product page will be routed to this number.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-warm-700 mb-1">
                WhatsApp Phone Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-warm-400">
                  <FiPhone />
                </div>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. +20 101 234 5678 or 01012345678"
                  className="pl-10 w-full p-2.5 border border-warm-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
                />
              </div>
              <p className="mt-1.5 text-xs text-warm-500">
                Include country code or Egyptian local format (e.g. 010xxxxxxxx).
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-warm-50 rounded-lg p-4 border border-warm-200 flex flex-col justify-center">
              <span className="text-xs font-medium text-warm-500 uppercase tracking-wider mb-1">
                Live URL Preview
              </span>
              <p className="text-sm font-mono text-warm-800 break-all">
                {formattedPreview ? (
                  <>
                    wa.me/<span className="font-bold text-green-700">{formattedPreview}</span>
                  </>
                ) : (
                  <span className="text-warm-400 italic">No phone number set</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* General Store Info */}
        <div className="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
          <h2 className="text-lg font-semibold text-warm-900 mb-4">Store Details & Branding</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full p-2.5 border border-warm-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-700 mb-1">Default Currency</label>
              <select
                name="defaultCurrency"
                value={formData.defaultCurrency}
                onChange={handleChange}
                className="w-full p-2.5 border border-warm-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
              >
                <option value="EGP">EGP (Egyptian Pound)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="SAR">SAR (Saudi Riyal)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-warm-700 mb-1">Visual Style</label>
              <input
                type="text"
                name="visualStyle"
                value={formData.visualStyle}
                onChange={handleChange}
                placeholder="e.g. warm, minimal, elegant"
                className="w-full p-2.5 border border-warm-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-warm-700 mb-1">AI Prompt Custom Instructions</label>
              <textarea
                name="aiInstructions"
                value={formData.aiInstructions}
                onChange={handleChange}
                rows={3}
                placeholder="Guidelines for AI when writing copy for products..."
                className="w-full p-2.5 border border-warm-300 rounded-md focus:ring-brand-500 focus:border-brand-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" isLoading={isSaving} className="inline-flex items-center">
            <FiSave className="mr-2" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
