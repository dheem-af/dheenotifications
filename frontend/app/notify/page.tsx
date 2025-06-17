'use client';

import React, { useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  PaperAirplaneIcon,
  ClockIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const CHANNELS = [
  { value: 'email', label: 'Email', icon: EnvelopeIcon },
  { value: 'sms', label: 'SMS', icon: DevicePhoneMobileIcon },
  { value: 'in-app', label: 'In-App', icon: BellIcon },
];

const NotifyPage: React.FC = () => {
  const [to, setTo] = useState('');
  const [channel, setChannel] = useState('email');
  const [message, setMessage] = useState('');
  const [sendAt, setSendAt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = { to, channel, message };
      if (sendAt) {
        payload.sendAt = new Date(sendAt).toISOString();
      }

      const response = await api.post('/notify', payload);
      
      if (sendAt) {
        toast.success('Notification scheduled successfully!');
      } else {
        toast.success('Notification queued successfully!');
      }

      // Reset form
      setTo('');
      setMessage('');
      setSendAt('');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (channel) {
      case 'email':
        return 'Enter email address (e.g., user@example.com)';
      case 'sms':
        return 'Enter phone number (e.g., +1234567890)';
      case 'in-app':
        return 'Enter user ID or identifier';
      default:
        return 'Enter recipient';
    }
  };

  const selectedChannelIcon = CHANNELS.find(c => c.value === channel)?.icon || EnvelopeIcon;
  const SelectedIcon = selectedChannelIcon;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <PaperAirplaneIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
              <p className="text-sm text-gray-500">
                Send instant or scheduled notifications via multiple channels
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Channel
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {CHANNELS.map((channelOption) => {
                  const Icon = channelOption.icon;
                  return (
                    <label
                      key={channelOption.value}
                      className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                        channel === channelOption.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="channel"
                        value={channelOption.value}
                        checked={channel === channelOption.value}
                        onChange={(e) => setChannel(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${
                          channel === channelOption.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          channel === channelOption.value ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {channelOption.label}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Recipient */}
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">
                Recipient
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SelectedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={getPlaceholder()}
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your notification message..."
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Write a clear and concise message for your notification.
              </p>
            </div>

            {/* Schedule */}
            <div>
              <label htmlFor="sendAt" className="block text-sm font-medium text-gray-700">
                Schedule (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="sendAt"
                  value={sendAt}
                  onChange={(e) => setSendAt(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Leave empty to send immediately, or select a future date and time to schedule.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {sendAt ? 'Scheduling...' : 'Sending...'}
                  </>
                ) : (
                  <>
                    {sendAt ? (
                      <ClockIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                    )}
                    {sendAt ? 'Schedule Notification' : 'Send Notification'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NotifyPage;