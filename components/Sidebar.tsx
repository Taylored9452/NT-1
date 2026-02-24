
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  role: UserRole;
  user: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab, role, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie', roles: [UserRole.ADMIN, UserRole.USER] },
    { id: 'search', label: 'Customer Search', icon: 'fa-search', roles: [UserRole.ADMIN, UserRole.USER] },
    { id: 'system_api', label: 'External API Hub', icon: 'fa-plug', roles: [UserRole.ADMIN] },
    { id: 'ai_assistant', label: 'AI Diagnostic', icon: 'fa-brain', roles: [UserRole.ADMIN, UserRole.USER] },
    { id: 'admin', label: 'Management', icon: 'fa-users-cog', roles: [UserRole.ADMIN] },
    { id: 'csv_upload', label: 'CSV Data Import', icon: 'fa-file-csv', roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-slate-300 transition-all duration-300 shrink-0 border-r border-slate-800">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <i className="fas fa-bolt text-xl"></i>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-tight leading-none">ISP CORE</span>
          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1">Enterprise v2.1</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.filter(item => item.roles.includes(role)).map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              currentTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-x-1' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-sm`}></i>
            <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-950 mt-auto m-4 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700 text-white">
            {user.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-white font-bold text-xs truncate uppercase tracking-widest">{user}</span>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
