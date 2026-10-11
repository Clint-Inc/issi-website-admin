import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { PropertiesPage } from './pages/PropertiesPage';
import { ClientsPage } from './pages/ClientsPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { SettingsPage } from './pages/SettingsPage';
import { PropertyFormModal } from './components/properties/PropertyFormModal';
import { ClientFormModal } from './components/clients/ClientFormModal';

import { Property, PropertyInput } from './types/property';
import { Client, ClientInput } from './types/client';
import { Inquiry } from './types/inquiry';

import * as propertiesService from './services/propertiesService';
import * as clientsService from './services/clientsService';
import * as inquiriesService from './services/inquiriesService';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [properties, setProperties] = useState<Property[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [isQuickPropertyOpen, setIsQuickPropertyOpen] = useState(false);
  const [isQuickClientOpen, setIsQuickClientOpen] = useState(false);

  // Load Initial Data
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      try {
        const [propsData, clientsData, inqsData] = await Promise.all([
          propertiesService.fetchProperties(),
          clientsService.fetchClients(),
          inquiriesService.fetchInquiries(),
        ]);
        setProperties(propsData);
        setClients(clientsData);
        setInquiries(inqsData);
      } catch (err: any) {
        showToast('Error loading dataset from API', 'error');
      }
    };

    loadData();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 to-gold-400 animate-spin flex items-center justify-center font-bold text-slate-950 text-xl">
          H
        </div>
        <p className="text-xs text-gold-400 font-semibold uppercase tracking-widest animate-pulse">
          Loading Hermanita Admin...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // PROPERTY HANDLERS
  const handleCreateProperty = async (input: PropertyInput) => {
    const created = await propertiesService.createProperty(input);
    setProperties((prev) => [created, ...prev]);
    showToast(`Published property "${created.title}"`, 'success');
  };

  const handleUpdateProperty = async (id: string, input: Partial<PropertyInput>) => {
    const updated = await propertiesService.updateProperty(id, input);
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast(`Updated listing details`, 'success');
  };

  const handleDeleteProperty = async (id: string) => {
    await propertiesService.deleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showToast(`Property deleted from catalog`, 'info');
  };

  // CLIENT HANDLERS
  const handleCreateClient = async (input: ClientInput) => {
    const created = await clientsService.createClient(input);
    setClients((prev) => [created, ...prev]);
    showToast(`Added client lead "${created.full_name}"`, 'success');
  };

  const handleUpdateClient = async (id: string, input: Partial<ClientInput>) => {
    const updated = await clientsService.updateClient(id, input);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    showToast(`Updated client record`, 'success');
  };

  const handleDeleteClient = async (id: string) => {
    await clientsService.deleteClient(id);
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast(`Client record removed`, 'info');
  };

  // INQUIRY HANDLERS
  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    const updated = await inquiriesService.updateInquiryStatus(id, status);
    setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
    showToast(`Inquiry status updated to "${status}"`, 'success');
  };

  const handleDeleteInquiry = async (id: string) => {
    await inquiriesService.deleteInquiry(id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    showToast(`Inquiry message deleted`, 'info');
  };

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans antialiased text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        unreadInquiriesCount={unreadInquiriesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header
          activeTabTitle={currentTab}
          onQuickAddProperty={() => setIsQuickPropertyOpen(true)}
          onQuickAddClient={() => setIsQuickClientOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
        />

        <main className="p-8 flex-1">
          {currentTab === 'dashboard' && (
            <Dashboard
              properties={properties}
              clients={clients}
              inquiries={inquiries}
              onSelectTab={(tab) => setCurrentTab(tab)}
              onOpenInquiry={() => setCurrentTab('inquiries')}
            />
          )}

          {currentTab === 'properties' && (
            <PropertiesPage
              properties={properties}
              searchQuery={searchQuery}
              onCreateProperty={handleCreateProperty}
              onUpdateProperty={handleUpdateProperty}
              onDeleteProperty={handleDeleteProperty}
            />
          )}

          {currentTab === 'clients' && (
            <ClientsPage
              clients={clients}
              searchQuery={searchQuery}
              onCreateClient={handleCreateClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
            />
          )}

          {currentTab === 'inquiries' && (
            <InquiriesPage
              inquiries={inquiries}
              properties={properties}
              searchQuery={searchQuery}
              onUpdateStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
            />
          )}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Quick Modals */}
      <PropertyFormModal
        isOpen={isQuickPropertyOpen}
        onClose={() => setIsQuickPropertyOpen(false)}
        onSubmit={handleCreateProperty}
      />

      <ClientFormModal
        isOpen={isQuickClientOpen}
        onClose={() => setIsQuickClientOpen(false)}
        onSubmit={handleCreateClient}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainAppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

