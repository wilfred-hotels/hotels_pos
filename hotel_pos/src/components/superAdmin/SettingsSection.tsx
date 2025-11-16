import React, { useState, useEffect } from 'react';
import { SectionProps } from '../../types/section';
import AdminHeader from '../common/AdminHeader';
import toast from 'react-hot-toast';

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notifyOnNewHotels: boolean;
  notifyOnPayments: boolean;
  notifyOnReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  ipWhitelist: string[];
}

const SettingsSection: React.FC<SectionProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'notifications' | 'security' | 'advanced'>('appearance');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [theme, setTheme] = useState<ThemeSettings>({
    mode: 'system',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    fontSize: 'md'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    notifyOnNewHotels: true,
    notifyOnPayments: true,
    notifyOnReports: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    ipWhitelist: []
  });

  useEffect(() => {
    // Simulating settings fetch
    const loadSettings = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, we would fetch from an API here
    };
    loadSettings();
  }, [userId]);

  const handleThemeChange = (key: keyof ThemeSettings, value: any) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
    
    // Apply theme changes immediately
    if (key === 'mode') {
      const isDark = value === 'dark' || (value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', isDark);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setIsDirty(true);
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
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

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' }
  ];

  return (
    <div className="space-y-6 p-4">
      <AdminHeader title="Settings" subtitle="System configuration & preferences" />
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            System Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your platform settings and preferences
          </p>
        </div>

        {isDirty && (
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 disabled:opacity-70 disabled:transform-none disabled:hover:scale-100"
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
        {(['appearance', 'notifications', 'security', 'advanced'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-600 dark:text-purple-400'
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
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Theme Preferences</h3>
              
              {/* Theme Mode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {(['light', 'dark', 'system'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleThemeChange('mode', mode)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      theme.mode === mode
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
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

              {/* Color Scheme */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Primary Color
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      onClick={() => handleThemeChange('primaryColor', color.value)}
                      className={`h-12 rounded-lg border-2 transition-all duration-300 ${
                        theme.primaryColor === color.value
                          ? 'border-purple-500 scale-105'
                          : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Font Size
                </label>
                <div className="flex gap-3">
                  {(['sm', 'md', 'lg'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => handleThemeChange('fontSize', size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                        theme.fontSize === size
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
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
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {key.split(/(?=[A-Z])/).join(' ')}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {key.includes('email') && 'Receive updates via email'}
                        {key.includes('push') && 'Get instant push notifications'}
                        {key.includes('sms') && 'Get SMS alerts for important updates'}
                        {key.includes('NewHotels') && 'Get notified when new hotels join'}
                        {key.includes('Payments') && 'Get alerts for payment activities'}
                        {key.includes('Reports') && 'Get notified about new reports'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={value}
                        onChange={() => handleNotificationChange(key as keyof NotificationSettings)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Security Preferences</h3>
              
              {/* 2FA */}
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={security.twoFactorAuth}
                      onChange={() => handleSecurityChange('twoFactorAuth', !security.twoFactorAuth)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Session Timeout */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={security.sessionTimeout}
                  onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                />
              </div>

              {/* IP Whitelist */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  IP Whitelist
                </label>
                <div className="space-y-2">
                  {security.ipWhitelist.map((ip, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ip}
                        onChange={(e) => {
                          const newList = [...security.ipWhitelist];
                          newList[index] = e.target.value;
                          handleSecurityChange('ipWhitelist', newList);
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                      />
                      <button
                        onClick={() => {
                          const newList = security.ipWhitelist.filter((_, i) => i !== index);
                          handleSecurityChange('ipWhitelist', newList);
                        }}
                        className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSecurityChange('ipWhitelist', [...security.ipWhitelist, ''])}
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium"
                  >
                    + Add IP Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {activeTab === 'advanced' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Advanced Settings</h3>
              
              <div className="space-y-4">
                {/* System Maintenance */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">System Maintenance</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Schedule maintenance windows and system updates
                  </p>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                    Configure Maintenance
                  </button>
                </div>

                {/* Data Export */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Data Export</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Export system data and analytics
                  </p>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                    Export Data
                  </button>
                </div>

                {/* System Logs */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">System Logs</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    View and download system logs
                  </p>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                    View Logs
                  </button>
                </div>

                {/* Danger Zone */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-500 dark:text-red-300 mb-4">
                    Permanent actions that cannot be undone
                  </p>
                  <button className="px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-600 dark:text-red-300 rounded-lg text-sm font-medium transition-colors">
                    Reset System
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;