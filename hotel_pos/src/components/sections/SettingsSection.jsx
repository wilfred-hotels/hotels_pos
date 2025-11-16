import React, { useState } from 'react';
import AdminHeader from '../common/AdminHeader';
import toast from 'react-hot-toast';

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState('appearance');
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Theme settings
  const [theme, setTheme] = useState({
    mode: localStorage.getItem('theme') || 'system',
    fontSize: localStorage.getItem('fontSize') || 'md'
  });

  // Hotel settings
  const [hotelSettings, setHotelSettings] = useState({
    name: 'Grand Plaza Hotel',
    address: '123 Hotel Street',
    phone: '+1234567890',
    email: 'info@grandplaza.com',
    currency: 'KSH',
    timezone: 'Africa/Nairobi',
    taxRate: 16,
    serviceCharge: 5
  });

  // Print settings
  const [printSettings, setPrintSettings] = useState({
    printLogo: true,
    printQRCode: true,
    printDuplicateCopy: true,
    paperSize: 'A4',
    printerName: 'Default Printer'
  });

  const handleThemeChange = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);

    if (key === 'mode') {
      const isDark = value === 'dark' || (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', value);
    } else if (key === 'fontSize') {
      localStorage.setItem('fontSize', value);
    }
  };

  const handleHotelSettingChange = (key, value) => {
    setHotelSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handlePrintSettingChange = (key, value) => {
    setPrintSettings(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setIsDirty(false);
    toast.success('Settings saved successfully');
  };

  const paperSizes = ['A4', 'A5', 'Letter', 'Roll 80mm', 'Roll 58mm'];

  return (
    <div className="space-y-6 p-4">
      <AdminHeader title="Settings" subtitle="Application and hotel preferences" />
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Hotel Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your hotel settings, preferences, and printing options
          </p>
        </div>

        {isDirty && (
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:transform-none disabled:hover:scale-100"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                💾 Save Changes
              </>
            )}
          </button>
        )}
      </div>

      {/* Settings Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        {['appearance', 'hotel', 'printing'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab
                ? 'bg-gradient-to-r from-blue-500/10 to-green-500/10 text-blue-600 dark:text-blue-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Theme Preferences</h3>

            {/* Theme Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['light', 'dark', 'system'].map(mode => (
                <button
                  key={mode}
                  onClick={() => handleThemeChange('mode', mode)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${theme.mode === mode
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{mode}</span>
                    <span>{
                      mode === 'light' ? '☀️' :
                        mode === 'dark' ? '🌙' : '⚙️'
                    }</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {mode === 'light' && 'Always use light theme'}
                    {mode === 'dark' && 'Always use dark theme'}
                    {mode === 'system' && 'Match system preferences'}
                  </p>
                </button>
              ))}
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Font Size
              </label>
              <div className="flex gap-3">
                {['sm', 'md', 'lg'].map(size => (
                  <button
                    key={size}
                    onClick={() => handleThemeChange('fontSize', size)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${theme.fontSize === size
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                      }`}
                  >
                    <span className={`
                      ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
                    `}>
                      {size.toUpperCase()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hotel Settings */}
        {activeTab === 'hotel' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Hotel Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  value={hotelSettings.name}
                  onChange={(e) => handleHotelSettingChange('name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={hotelSettings.address}
                  onChange={(e) => handleHotelSettingChange('address', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={hotelSettings.phone}
                  onChange={(e) => handleHotelSettingChange('phone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={hotelSettings.email}
                  onChange={(e) => handleHotelSettingChange('email', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Currency
                </label>
                <select
                  value={hotelSettings.currency}
                  onChange={(e) => handleHotelSettingChange('currency', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                >
                  <option value="KSH">KSH - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Timezone
                </label>
                <select
                  value={hotelSettings.timezone}
                  onChange={(e) => handleHotelSettingChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                >
                  <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={hotelSettings.taxRate}
                  onChange={(e) => handleHotelSettingChange('taxRate', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>

              {/* Service Charge */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Service Charge (%)
                </label>
                <input
                  type="number"
                  value={hotelSettings.serviceCharge}
                  onChange={(e) => handleHotelSettingChange('serviceCharge', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Printing Settings */}
        {activeTab === 'printing' && (
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Receipt Printing</h3>

            <div className="space-y-4">
              {/* Print Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Print Logo */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Print Logo</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Include hotel logo on receipts
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={printSettings.printLogo}
                        onChange={() => handlePrintSettingChange('printLogo', !printSettings.printLogo)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Print QR Code */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">QR Code</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Include QR code for digital receipt
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={printSettings.printQRCode}
                        onChange={() => handlePrintSettingChange('printQRCode', !printSettings.printQRCode)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Duplicate Copy */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">Duplicate Copy</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Print duplicate copy for records
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={printSettings.printDuplicateCopy}
                        onChange={() => handlePrintSettingChange('printDuplicateCopy', !printSettings.printDuplicateCopy)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Paper Size */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Paper Size
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {paperSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => handlePrintSettingChange('paperSize', size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${printSettings.paperSize === size
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Printer Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Default Printer
                </label>
                <select
                  value={printSettings.printerName}
                  onChange={(e) => handlePrintSettingChange('printerName', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                >
                  <option value="Default Printer">Default Printer</option>
                  <option value="Kitchen Printer">Kitchen Printer</option>
                  <option value="Bar Printer">Bar Printer</option>
                </select>
              </div>

              {/* Test Print Button */}
              <div className="mt-6">
                <button className="px-6 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <span>🖨️</span>
                  Print Test Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
