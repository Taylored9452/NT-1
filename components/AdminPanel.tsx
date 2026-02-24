
import React, { useState } from 'react';
import { CustomerConfig, OLTInfo } from '../types';

interface AdminPanelProps {
  customers: CustomerConfig[];
  onAdd: (customer: CustomerConfig) => void;
  onDelete: (id: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ customers, onAdd, onDelete }) => {
  const [activeTab, setActiveTab] = useState('customers');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    deviceName: '',
    ip: '',
    lat: '7.58028',
    long: '99.96083'
  });

  const uniqueOlts: OLTInfo[] = Array.from(new Map<string, OLTInfo>(customers.map(c => [c.olt.ip, c.olt])).values());

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CustomerConfig = {
      customerId: formData.customerId,
      customerName: formData.customerName,
      deviceName: formData.deviceName,
      frame: '0',
      slot: '1',
      port: '1',
      onuId: '1',
      sn: 'SN' + Math.random().toString(36).substring(7).toUpperCase(),
      terminalType: 'ZTE-F670L',
      status: 'online',
      signalStrength: -19.5,
      olt: {
        id: 'OLT-' + Date.now(),
        name: formData.deviceName,
        ip: formData.ip,
        type: 'Huawei MA5603T',
        portUsage: '1/256',
        locationName: formData.deviceName,
        latitude: parseFloat(formData.lat),
        longitude: parseFloat(formData.long)
      }
    };
    onAdd(newRecord);
    setShowAddForm(false);
    setFormData({ customerId: '', customerName: '', deviceName: '', ip: '', lat: '7.58028', long: '99.96083' });
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Administrative Control</h1>
          <p className="text-slate-500 mt-1">Manage network infrastructure, customers, and system access.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center"
        >
          <i className="fas fa-plus mr-2"></i> Add New Record
        </button>
      </header>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Add Infrastructure Record</h2>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer ID (Alias)</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.customerId} onChange={e => setFormData({...formData, customerId: e.target.value})} placeholder="5030..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</label>
                  <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} placeholder="Name..." />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OLT Name (Device)</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.deviceName} onChange={e => setFormData({...formData, deviceName: e.target.value})} placeholder="ควนดินสอ_MA5603T" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OLT IP Address</label>
                <input required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.ip} onChange={e => setFormData({...formData, ip: e.target.value})} placeholder="10.50.12.1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latitude</label>
                  <input required type="number" step="any" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                    value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Longitude</label>
                  <input required type="number" step="any" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono" 
                    value={formData.long} onChange={e => setFormData({...formData, long: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <TabButton active={activeTab === 'customers'} onClick={() => setActiveTab('customers')}>
          Customer List ({customers.filter(c => c.status === 'online').length /* แสดงเฉพาะลูกค้าที่ online */ })
        </TabButton>
        <TabButton active={activeTab === 'olts'} onClick={() => setActiveTab('olts')}>
          OLT Infrastructure ({uniqueOlts.length})
        </TabButton>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
        {activeTab === 'customers' && (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Alias / ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location (Lat, Long)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.filter(customer => customer.status === 'online').map((customer) => ( // แสดงเฉพาะลูกค้าที่ online
                <tr key={`${customer.customerId}-${customer.sn}`} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-blue-600">{customer.customerId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700">{customer.customerName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{customer.olt.locationName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{customer.olt.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      customer.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { if(confirm('Delete this record?')) onDelete(customer.customerId) }}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                      title="Delete Record"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'olts' && (
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">OLT Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">IP Address</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Coordinates</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">GPON Usage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {uniqueOlts.map((olt) => (
                <tr key={olt.id || olt.ip} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                        <i className="fas fa-broadcast-tower text-xs"></i>
                      </div>
                      <span className="font-bold text-slate-800">{olt.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-blue-600 font-bold text-sm bg-blue-50/50 px-2 py-1 rounded-md">{olt.ip}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600">
                    {olt.locationName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-2/3"></div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{olt.portUsage}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, children }: any) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {children}
  </button>
);

export default AdminPanel;
