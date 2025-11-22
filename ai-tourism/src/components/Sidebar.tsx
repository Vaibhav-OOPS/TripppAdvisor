'use client';
import { CheckBadgeIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

export default function Sidebar() {
  return (
    <aside className="min-h-screen w-64 bg-gray-800 flex flex-col gap-4 p-4 relative z-20">
      <h2 className="text-xl font-bold text-black-400 mb-2">AGENT CONTROL</h2>
      <div className="bg-black-400 rounded-lg p-3 mb-2" />
      <div className="bg-black-400 rounded-lg p-3">
        <span className="font-bold text-gray-800">Active Agents:</span>
      </div>
      <div className="bg-black-300 rounded-lg p-3 flex gap-2 items-center">
        <CheckBadgeIcon className="w-6 h-6 text-green-600" />
        <span className="text-white-700">Orchestrator (Parent)</span>
      </div>
      <div className="bg-black-300 rounded-lg p-3 flex gap-2 items-center">
        <CheckBadgeIcon className="w-6 h-6 text-green-600" />
        <span className="text-white-700">Weather Agent (Child 1)</span>
      </div>
      <div className="bg-black-300 rounded-lg p-3 flex gap-2 items-center">
        <CheckBadgeIcon className="w-6 h-6 text-green-600" />
        <span className="text-white-700">Places Agent (Child 2)</span>
      </div>
      <div className="bg-green-200 rounded-lg p-3 flex gap-2 items-center">
        <InformationCircleIcon className="w-6 h-6 text-blue-600" />
        <span className="text-blue-700">API Status: Online</span>
      </div>
    </aside>
  );
}
