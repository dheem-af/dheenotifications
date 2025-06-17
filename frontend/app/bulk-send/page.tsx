'use client';

import React, { useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const CHANNELS = [
  { value: 'email', label: 'Email', icon: EnvelopeIcon },
  { value: 'sms', label: 'SMS', icon: DevicePhoneMobileIcon },
];

const BulkSendPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [channel, setChannel] = useState('email');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);
      formData.append('channel', channel);
      formData.append('message', message);

      const response = await api.post('/notify/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);
      toast.success(`${response.data.totalRecipients} notifications queued successfully!`);
      
      // Reset form
      setFile(null);
      setMessage('');
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to process bulk upload');
    } finally {
      setLoading(false);
    }
  };

  const selectedChannelIcon = CHANNELS.find(c => c.value === channel)?.icon || EnvelopeIcon;
  const SelectedIcon = selectedChannelIcon;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <CloudArrowUpIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Send Notifications</h1>
              <p className="text-sm text-gray-500">
                Upload a CSV file to send notifications to multiple recipients
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  CSV Format Instructions
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Your CSV file should contain recipient information in one of these formats:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Column header: <code className="bg-blue-100 px-1 rounded">email</code> (for email notifications)</li>
                    <li>Column header: <code className="bg-blue-100 px-1 rounded">phone</code> (for SMS notifications)</li>
                    <li>Column header: <code className="bg-blue-100 px-1 rounded">recipient</code> (generic)</li>
                    <li>Or simply put recipients in the first column without headers</li>
                  </ul>
                  <p className="mt-2">
                    <strong>Example:</strong> email<br />
                    user1@example.com<br />
                    user2@example.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Channel
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

            {/* File Upload */}
            <div>
              <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700">
                CSV File
              </label>
              <div className="mt-1">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="csvFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload a CSV file</span>
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV up to 5MB</p>
                    {file && (
                      <div className="mt-2 flex items-center justify-center">
                        <DocumentTextIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">{file.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <input
                  id="csvFile"
                  name="csvFile"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                  placeholder="Enter the message to send to all recipients..."
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This message will be sent to all recipients in your CSV file.
              </p>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Please ensure you have permission to send notifications to all recipients in your CSV file.
                      Bulk sending to unauthorized recipients may violate anti-spam policies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !file}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                    Send Bulk Notifications
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Upload Result */}
          {uploadResult && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Upload Successful
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      <strong>{uploadResult.totalRecipients}</strong> notifications have been queued for processing.
                    </p>
                    <p className="mt-1">
                      Bulk Upload ID: <code className="bg-green-100 px-1 rounded">{uploadResult.bulkUploadId}</code>
                    </p>
                    <p className="mt-1">
                      You can track the progress in the logs section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkSendPage;