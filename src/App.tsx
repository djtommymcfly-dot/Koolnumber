import { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { StatsRow } from './components/dashboard/StatsRow';
import { UploadZone } from './components/dashboard/UploadZone';
import { ServicesTable } from './components/dashboard/ServicesTable';
import { MapCard } from './components/dashboard/MapCard';
import { AlertsGrid } from './components/dashboard/AlertsGrid';
import { ActivityLog } from './components/dashboard/ActivityLog';
import { CredentialsModal } from './components/modals/CredentialsModal';
import { DelayModal } from './components/modals/DelayModal';
import { AccessModal } from './components/modals/AccessModal';
import { Login } from './components/auth/Login';
import { SubscriptionGate } from './components/auth/SubscriptionGate';
import { LogEntry, Service } from './types';
import { VF } from './lib/vodafone';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type AuthState = 'logged_out' | 'active' | 'unpaid';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('logged_out');
  const [services, setServices] = useState<Service[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const [isCredsOpen, setIsCredsOpen] = useState(false);
  const [isDelayOpen, setIsDelayOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  const [isApiLive, setIsApiLive] = useState(VF.live);

  useEffect(() => {
    const checkApi = async () => {
      if (VF.live) {
        const ok = await VF.auth();
        setIsApiLive(ok);
      }
    };
    checkApi();
  }, []);

  const mkData = (): Service[] => {
    const now = new Date();
    const h = (hours: number) => new Date(now.getTime() + hours * 3600000);
    const fmt = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return [
      { id: 's1', time: fmt(h(-3.5)), type: 'PARTIDA', clients: ['PRIMAVERA'], vehicle: 'AT-58-LP', distance: 60, tracker: 'S5', destino: 'Lisboa → Setúbal', delayMin: 0, delayReason: '' },
      { id: 's2', time: fmt(h(-2.2)), type: 'CHEGADA', clients: ['KOOL'], vehicle: 'MX-12-AB', distance: null, tracker: 'S7', destino: 'Hotel vila galé tavira', delayMin: 0, delayReason: '' },
      { id: 's3', time: fmt(h(-0.35)), type: 'PARTIDA', clients: ['BEST 4U', 'PRIMAVERA'], vehicle: 'ZZ-99-ZZ', distance: 120, tracker: 'S5', destino: 'Lisboa → Porto', delayMin: 0, delayReason: '' },
      { id: 's4', time: fmt(h(0.18)), type: 'CHEGADA', clients: ['OMEGA'], vehicle: 'LX-77-YY', distance: null, tracker: 'S7', destino: 'Sede OMEGA', delayMin: 0, delayReason: '' },
      { id: 's5', time: fmt(h(1.8)), type: 'PARTIDA', clients: ['KOOL', 'BEST 4U'], vehicle: 'AT-58-LP', distance: 85, tracker: 'S5', destino: 'Faro → Portimão', delayMin: 0, delayReason: '' },
      { id: 's6', time: fmt(h(3.5)), type: 'CHEGADA', clients: ['PRIMAVERA'], vehicle: 'MX-12-AB', distance: null, tracker: 'S7', destino: 'Armazém Central', delayMin: 0, delayReason: '' },
    ];
  };

  const getSt = (svc: Service) => {
    const n = Date.now();
    const t = new Date();
    const [h, m] = svc.time.split(':').map(Number);
    t.setHours(h, m, 0, 0);
    const start = new Date(t.getTime() - 30 * 60000);
    const post = (svc.type === 'CHEGADA' ? 120 : 60 + Math.max(0, (svc.distance || 0) - 60)) + (svc.delayMin || 0);
    const end = new Date(t.getTime() + post * 60000);
    return n < start.getTime() ? 'AGENDADO' : n > end.getTime() ? 'EXPIRADO' : 'ATIVO';
  };

  const addLog = (s: Service, action: string) => {
    setLogs((prev) => {
      const newLog: LogEntry = {
        time: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
        client: s.clients[0],
        vehicle: s.vehicle,
        action,
        status: getSt(s),
      };
      return [newLog, ...prev].slice(0, 8);
    });
  };

  const handleUpload = (uploadedServices: Service[]) => {
    setServices(uploadedServices);
    toast.success(`${uploadedServices.length} serviços importados`);
  };

  const handleDemo = () => {
    const data = mkData();
    setServices(data);
    toast.success('Dados demo carregados');
  };

  const handleAction = (action: 'access' | 'delay' | 'track', serviceId: string) => {
    setActiveServiceId(serviceId);
    if (action === 'access') setIsAccessOpen(true);
    if (action === 'delay') setIsDelayOpen(true);
    if (action === 'track') {
      setSelectedVehicleId(serviceId);
      const s = services.find((x) => x.id === serviceId);
      if (s) toast.success(`A seguir ${s.vehicle} (${s.tracker})`);
    }
  };

  const handleApplyDelay = (id: string, min: number, why: string) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, delayMin: s.delayMin + min, delayReason: why };
          addLog(updated, `ATRASO +${min}min`);
          toast.warning(`+${min}min — "${why.slice(0, 40)}"`);
          return updated;
        }
        return s;
      })
    );
  };

  const handleGenerateAll = () => {
    if (!services.length) return;
    services.forEach((s) => addLog(s, 'ACESSO GERADO'));
    toast.success(`${services.length} acessos gerados`);
  };

  const activeService = services.find((s) => s.id === activeServiceId) || null;
  const selectedVehicle = services.find((s) => s.id === selectedVehicleId) || services[0] || null;

  if (authState === 'logged_out') {
    return <Login onLogin={setAuthState} />;
  }

  if (authState === 'unpaid') {
    return (
      <SubscriptionGate 
        onLogout={() => setAuthState('logged_out')} 
        onSimulatePayment={() => {
          setAuthState('active');
          toast.success('Pagamento processado com sucesso! Acesso restaurado.');
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <Header onOpenSettings={() => setIsCredsOpen(true)} isApiLive={isApiLive} />
      
      <main className="container mx-auto p-4 md:p-6 lg:p-8 max-w-[1600px]">
        <StatsRow services={services} />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <UploadZone onUpload={handleUpload} onDemo={handleDemo} />
            <ServicesTable
              services={services}
              onRefresh={() => setServices([...services])}
              onGenerateAll={handleGenerateAll}
              onAction={handleAction}
            />
          </div>
          
          <div className="xl:col-span-4 flex flex-col gap-6">
            <MapCard selectedVehicle={selectedVehicle} />
            <AlertsGrid vehicle={selectedVehicle} />
            <ActivityLog logs={logs} />
          </div>
        </div>
      </main>

      <CredentialsModal
        open={isCredsOpen}
        onOpenChange={setIsCredsOpen}
        onSave={() => setIsApiLive(VF.live)}
      />
      <DelayModal
        open={isDelayOpen}
        onOpenChange={setIsDelayOpen}
        service={activeService}
        onApply={handleApplyDelay}
      />
      <AccessModal
        open={isAccessOpen}
        onOpenChange={setIsAccessOpen}
        service={activeService}
      />
      
      <Toaster theme="light" position="bottom-right" className="font-mono" />
    </div>
  );
}
