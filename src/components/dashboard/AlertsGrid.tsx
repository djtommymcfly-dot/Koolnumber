import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Alert, Service } from '../../types';
import { VF } from '../../lib/vodafone';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion } from 'motion/react';

interface AlertsGridProps {
  vehicle: Service | null;
}

export function AlertsGrid({ vehicle }: AlertsGridProps) {
  const [alerts, setAlerts] = useState<Alert | null>(null);

  const fetchAlerts = async () => {
    const plate = vehicle?.vehicle || 'AT-58-LP';
    const dId = `VF-${plate.replace(/-/g, '')}-001`;
    const data = await VF.getAlerts(dId);
    setAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [vehicle]);

  const chips = alerts
    ? [
        { icon: '🚨', lbl: 'Roubo Activo', on: alerts.stolenVehicleAlert, type: 'danger' },
        { icon: '🔧', lbl: 'Reboque / Tow', on: alerts.towAway, type: 'danger' },
        { icon: '🛡', lbl: 'Adulteração', on: alerts.tamper, type: 'danger' },
        { icon: '📡', lbl: 'GSM Jamming', on: alerts.gsmJamming, type: 'danger' },
        { icon: '🔋', lbl: 'Bateria Baixa', on: alerts.lowBattery, type: 'warning' },
        { icon: '💳', lbl: 'ADR / Driver ID', on: alerts.adrStatus !== 'PRESENT', type: 'warning' },
        { icon: '⚙', lbl: 'Saúde Sistema', on: alerts.systemHealth !== 'OK', type: 'warning' },
        { icon: '🔑', lbl: 'Ignição', on: alerts.ignition === 'ON', type: 'info' },
      ]
    : [];

  return (
    <Card className="border-border bg-card/80 backdrop-blur-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          Alertas do Sistema
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={fetchAlerts} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {chips.map((c, i) => (
            <motion.div
              key={c.lbl}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-2 rounded-lg border p-2.5 font-mono text-[9px] font-bold uppercase tracking-widest transition-all ${
                c.on
                  ? c.type === 'danger'
                    ? 'border-destructive/30 bg-destructive/10 text-destructive shadow-[0_0_15px_rgba(255,23,68,0.15)] animate-pulse'
                    : c.type === 'warning'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                  : 'border-primary/20 bg-primary/5 text-primary'
              }`}
            >
              <span className="text-sm shrink-0">{c.icon}</span>
              <span className="truncate">{c.lbl}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
