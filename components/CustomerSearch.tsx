
import React, { useState } from 'react';
import { CustomerConfig } from '../types';
import OLTMap from './OLTMap';

interface CustomerSearchProps {
  customers: CustomerConfig[];
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันล้างข้อมูล (ลบเครื่องหมาย | และช่องว่างออกทั้งหมด) เพื่อให้พิมพ์แค่เลข ID ก็เจอ
  const sanitize = (val: string) => {
    if (!val) return '';
    return val.replace(/[|\s-]/g, '').toLowerCase();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  // ฟังก์ชันค้นหาแบบ real-time (แก้ไข: เพิ่มการค้นหาขณะพิมพ์)
  const performSearch = () => {
    const query = searchTerm.trim();
    if (!query) {
      setSelectedCustomer(null);
      return;
    }

    setIsLoading(true);
    
    // ลดเวลา delay เป็น 300ms เพื่อให้ตอบสนองเร็วขึ้น (แก้ไขจาก 500ms)
    setTimeout(() => {
      const cleanQuery = sanitize(query);
      
      const found = customers.find(c => {
        // ค้นหาเฉพาะลูกค้าที่ online (แก้ไข: กรองเฉพาะ online)
        if (c.status !== 'online') return false;
        
        const alias = c.customerId;
        const cleanAlias = sanitize(alias);
        
        // ค้นหาโดยดูว่าเลขที่พิมพ์มา อยู่ใน Alias หรือไม่
        if (cleanAlias.includes(cleanQuery)) return true;

        const parts = alias.split('|').map(p => p.trim().toLowerCase());
        if (parts.includes(query.toLowerCase())) return true;

        return false;
      });
      
      setSelectedCustomer(found || null);
      setIsLoading(false);
    }, 300);
  };

  // ฟังก์ชันจัดการการพิมพ์แบบ real-time (เพิ่มใหม่)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // ทริกเกอร์การค้นหาทันทีถ้ามีข้อมูล (แก้ไข: เพิ่ม real-time search)
    if (value.trim()) {
      performSearch();
    } else {
      // ล้างผลลัพธ์ถ้าลบข้อมูลทั้งหมด (แก้ไข: เพิ่มการล้างผลลัพธ์)
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Technical Provisioning</h1>
          <p className="text-slate-500 mt-1">Search by Customer ID to view configuration and OLT physical details.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 max-w-lg relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            <i className="fas fa-search"></i>
          </div>
          <input
            type="text"
            className="w-full pl-11 pr-24 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
            placeholder="Ex: 5030277134"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
          >
            {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Search'}
          </button>
        </form>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Querying database records...</p>
        </div>
      ) : selectedCustomer ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            {/* Customer & Connection Details */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${selectedCustomer.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                  <h2 className="text-xl font-bold text-slate-800">Subscriber Technical Data</h2>
                </div>
                <div className="px-4 py-1.5 bg-blue-50 rounded-full text-xs font-bold text-blue-600 border border-blue-100 uppercase tracking-widest">
                  {selectedCustomer.customerId}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                <ConfigField label="Device Name" value={selectedCustomer.deviceName} icon="fa-server" />
                <ConfigField label="Frame" value={selectedCustomer.frame} icon="fa-layer-group" />
                <ConfigField label="Slot" value={selectedCustomer.slot} icon="fa-columns" />
                <ConfigField label="Port" value={selectedCustomer.port} icon="fa-plug" />
                <ConfigField label="ONU ID" value={selectedCustomer.onuId} icon="fa-fingerprint" />
                <ConfigField label="Serial Number (SN)" value={selectedCustomer.sn} icon="fa-barcode" highlight />
                <ConfigField label="Terminal Type" value={selectedCustomer.terminalType} icon="fa-microchip" />
                <ConfigField 
                  label="Signal Strength" 
                  value={`${selectedCustomer.signalStrength} dBm`} 
                  icon="fa-wifi" 
                  color={selectedCustomer.signalStrength < -25 ? 'text-rose-500' : 'text-emerald-500'} 
                />
                <ConfigField label="Customer Name" value={selectedCustomer.customerName} icon="fa-user-circle" />
              </div>
            </div>

            {/* OLT Geographic Location & Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center">
                  <i className="fas fa-map-marked-alt text-blue-500 mr-2"></i>
                  OLT Geographic Location
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node ID: {selectedCustomer.olt.id}</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-slate-100">
                 <div className="p-6 border-r border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">1. Location ของ OLT</p>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                        {selectedCustomer.olt.latitude}, {selectedCustomer.olt.longitude}
                    </p>
                 </div>
                 <div className="p-6 border-r border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">2. OLT IP</p>
                    <p className="text-sm font-mono font-bold text-blue-600">{selectedCustomer.olt.ip}</p>
                 </div>
                 <div className="p-6 border-r border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">3. OLT Type</p>
                    <p className="text-sm font-bold text-slate-800">{selectedCustomer.olt.type}</p>
                 </div>
                 <div className="p-6 hover:bg-slate-50/50 transition-colors">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">4. GPON Port Usage</p>
                    <p className="text-sm font-bold text-emerald-600">{selectedCustomer.olt.portUsage}</p>
                 </div>
              </div>

              <div className="flex-1 min-h-[400px]">
                <OLTMap olt={selectedCustomer.olt} />
              </div>
            </div>
          </div>

          {/* Additional Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
               <h3 className="text-lg font-bold mb-6 flex items-center">
                  <i className="fas fa-info-circle text-blue-400 mr-2"></i>
                  Network Intelligence
               </h3>
               <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-slate-400 text-xs">Assigned OLT</span>
                    <span className="font-bold text-sm">{selectedCustomer.olt.name}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-slate-400 text-xs">Port Usage Status</span>
                    <span className="text-emerald-400 font-bold text-sm">Optimal</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-slate-400 text-xs">Latency Target</span>
                    <span className="font-bold text-sm">&lt; 15ms</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <span className="text-slate-400 text-xs">Port ID</span>
                    <span className="font-mono text-blue-400 text-sm">{selectedCustomer.port}</span>
                  </div>
               </div>
               <div className="mt-8 pt-6 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Registered SN</p>
                  <p className="font-mono text-sm text-blue-300">{selectedCustomer.sn}</p>
               </div>
            </div>
          </div>
        </div>
      ) : searchTerm && !isLoading ? (
        <div className="bg-white py-20 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <i className="fas fa-search-minus text-3xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">No Record Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Could not find matching configuration for ID "<span className="font-bold text-rose-500">{searchTerm}</span>".
            </p>
          </div>
          <button onClick={() => setSearchTerm('')} className="text-blue-600 font-bold hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="bg-white py-32 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-6">
           <div className="grid grid-cols-2 gap-4">
             <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
               <i className="fas fa-network-wired text-2xl"></i>
             </div>
             <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
               <i className="fas fa-search-location text-2xl"></i>
             </div>
           </div>
           <div>
             <h3 className="text-2xl font-bold text-slate-800">Infrastructure Lookup</h3>
             <p className="text-slate-500 max-w-sm mx-auto mt-2 px-4">
               Search by Customer ID to reveal OLT details, IP, and location.
               <br/>
               <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full mt-4 inline-block font-bold border border-blue-100">
                 Example: 5030277134
               </span>
             </p>
           </div>
        </div>
      )}
    </div>
  );
};

const ConfigField = ({ label, value, icon, highlight, color = "text-slate-700" }: any) => (
  <div className="group">
    <div className="flex items-center space-x-2 mb-2">
      <i className={`fas ${icon} text-slate-400 text-[10px]`}></i>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
    </div>
    <div className={`text-sm font-bold ${color} ${highlight ? 'bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-100 inline-block' : ''} transition-all`}>
      {value}
    </div>
  </div>
);

export default CustomerSearch;
