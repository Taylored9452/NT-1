
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CustomerSearch from './components/CustomerSearch';
import AdminPanel from './components/AdminPanel';
import CSVImporter from './components/CSVImporter';
import ExternalSystems from './components/ExternalSystems';
import SystemAPI from './components/SystemAPI';
import { UserRole, User, CustomerConfig } from './types';
import { MOCK_USERS, MOCK_CUSTOMERS } from './services/mockData';
import { db } from './services/db';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDbReady, setIsDbReady] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [customers, setCustomers] = useState<CustomerConfig[]>([]);

  // 1. Initialize Database on Mount
  useEffect(() => {
    const initApp = async () => {
      try {
        await db.init();
        const session = await db.getSession();
        if (session) {
          setCurrentUser({ id: session.role === UserRole.ADMIN ? '1' : '2', ...session });
        }
        const storedCustomers = await db.getCustomers();
        if (storedCustomers && storedCustomers.length > 0) {
          setCustomers(storedCustomers);
        } else {
          setCustomers(MOCK_CUSTOMERS);
        }
      } catch (err) {
        console.error("Failed to init DB", err);
        setCustomers(MOCK_CUSTOMERS);
      } finally {
        setIsDbReady(true);
      }
    };
    initApp();
  }, []);

  // 2. Persistence
  useEffect(() => { if (isDbReady && customers.length > 0) db.setCustomers(customers); }, [customers, isDbReady]);
  useEffect(() => { if (isDbReady) db.setSession(currentUser.role, currentUser.username); }, [currentUser, isDbReady]);

  const toggleRole = () => {
    const nextUser = currentUser.role === UserRole.ADMIN ? MOCK_USERS[1] : MOCK_USERS[0];
    setCurrentUser(nextUser);
    setActiveTab('dashboard');
  };

  if (!isDbReady) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center text-white font-mono">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold tracking-[0.3em] uppercase text-[10px]">Booting ISP Core OS...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard customers={customers} />;
      case 'search': return <CustomerSearch customers={customers} />;
      case 'admin':
        return currentUser.role === UserRole.ADMIN 
          ? <AdminPanel customers={customers} onAdd={(c) => setCustomers(p => [c, ...p])} onDelete={(id) => setCustomers(p => p.filter(x => x.customerId !== id))} />
          : <div className="p-10 text-rose-500 font-bold">Access Denied</div>;
      case 'csv_upload':
        return currentUser.role === UserRole.ADMIN ? <CSVImporter setCustomers={setCustomers} /> : <div className="p-10 text-rose-500 font-bold">Access Denied</div>;
      case 'ai_assistant':
        return <ExternalSystems customers={customers} />;
      case 'system_api':
        return <SystemAPI customers={customers} />;
      default: return <Dashboard customers={customers} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentTab={activeTab} setTab={setActiveTab} role={currentUser.role} user={currentUser.username} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-50">
          <div className="flex items-center space-x-2 text-slate-400 text-sm font-medium">
             <i className="fas fa-microchip text-blue-500 text-xs"></i>
             <span className="hidden md:inline">Network Integration Unit</span>
             <i className="fas fa-chevron-right text-[10px]"></i>
             <span className="text-slate-900 font-bold capitalize">{activeTab.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{currentUser.role}</span>
              <button onClick={toggleRole} className="text-[9px] bg-white px-2 py-0.5 rounded shadow-sm hover:bg-slate-50 transition-colors font-bold text-blue-600">SWITCH</button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
