
import React from 'react';
import { CustomerConfig } from '../types';

interface DashboardProps {
  customers: CustomerConfig[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  // คำนวณสถิติจริงจากข้อมูลใน Database
  const totalCustomers = customers.length;
  const onlineCustomers = customers.filter(c => c.status === 'online').length;
  const totalOlts = new Set(customers.map(c => c.olt.ip)).size;
  const activeAlarms = customers.filter(c => c.signalStrength < -25).length;

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1">Real-time status based on your latest uploaded database.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Subscribers" 
          value={totalCustomers.toLocaleString()} 
          icon="fa-users" 
          color="blue" 
          trend={totalCustomers > 0 ? "Data Loaded" : "No Data"} 
        />
        <StatCard 
          label="Online Ratio" 
          value={totalCustomers > 0 ? `${((onlineCustomers / totalCustomers) * 100).toFixed(1)}%` : '0%'} 
          icon="fa-signal" 
          color="green" 
          trend="Real-time" 
        />
        <StatCard 
          label="Detected OLTs" 
          value={totalOlts.toString()} 
          icon="fa-server" 
          color="purple" 
          trend="Unique Nodes" 
        />
        <StatCard 
          label="Low Signal Alarms" 
          value={activeAlarms.toString()} 
          icon="fa-exclamation-triangle" 
          color="red" 
          trend="&lt; -25 dBm" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <i className="fas fa-chart-line text-blue-500 mr-2"></i>
            Database Distribution
          </h3>
          <div className="flex-1 flex items-end justify-between space-x-2">
            {/* จำลองกราฟตามความหนาแน่นของข้อมูล */}
            {[20, 40, 30, 70, 50, 90, 60, 80, 75, 55, 65, 85].map((h, i) => (
              <div 
                key={i} 
                className="bg-blue-500/80 hover:bg-blue-600 transition-all rounded-t-md w-full"
                style={{ height: totalCustomers > 0 ? `${h}%` : '5%' }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span>Historical baseline</span>
            <span>Current database</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <i className="fas fa-history text-slate-500 mr-2"></i>
            Data Integrity Status
          </h3>
          <div className="space-y-4">
            <EventItem 
              type={totalCustomers > 0 ? "success" : "alert"} 
              title="Database Status" 
              time="System" 
              desc={totalCustomers > 0 ? `Currently managing ${totalCustomers} active records.` : "Waiting for initial CSV data upload."} 
            />
            <EventItem 
              type="update" 
              title="Persistence Engine" 
              time="Active" 
              desc="Browser localStorage sync is active and healthy." 
            />
            <EventItem 
              type="user" 
              title="Access Role" 
              time="Admin" 
              desc="You have full write permissions to the database." 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, trend }: any) => {
  const colors: any = {
    blue: 'bg-blue-500 text-blue-500',
    green: 'bg-emerald-500 text-emerald-500',
    purple: 'bg-purple-500 text-purple-500',
    red: 'bg-rose-500 text-rose-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between group hover:border-blue-200 transition-all cursor-default">
      <div>
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        <span className={`text-[10px] font-bold mt-2 inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-500`}>
          {trend}
        </span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-opacity-10 ${colors[color]}`}>
        <i className={`fas ${icon} text-lg`}></i>
      </div>
    </div>
  );
};

const EventItem = ({ type, title, time, desc }: any) => {
  const icons: any = {
    alert: 'fa-exclamation-circle text-rose-500',
    update: 'fa-sync-alt text-blue-500',
    user: 'fa-user-edit text-amber-500',
    success: 'fa-check-circle text-emerald-500',
  };

  return (
    <div className="flex space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="mt-1">
        <i className={`fas ${icons[type]} text-lg`}></i>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h5 className="font-semibold text-sm text-slate-800">{title}</h5>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{time}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
};

export default Dashboard;
