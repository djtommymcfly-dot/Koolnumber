import { Service } from '../../types';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';

interface StatsRowProps {
  services: Service[];
}

export function StatsRow({ services }: StatsRowProps) {
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

  const total = services.length;
  const active = services.filter((s) => getSt(s) === 'ATIVO').length;
  const wait = services.filter((s) => getSt(s) === 'AGENDADO').length;
  const exp = services.filter((s) => getSt(s) === 'EXPIRADO').length;

  const stats = [
    {
      label: 'Total Serviços',
      value: total,
      sub: 'Folha do dia',
      color: 'text-primary',
      borderColor: 'border-b-primary',
      bg: 'bg-primary/5',
    },
    {
      label: 'Acessos Ativos',
      value: active,
      sub: 'Neste momento',
      color: 'text-primary',
      borderColor: 'border-b-primary',
      bg: 'bg-primary/5',
    },
    {
      label: 'Agendados',
      value: wait,
      sub: 'Próximas horas',
      color: 'text-amber-500',
      borderColor: 'border-b-amber-500',
      bg: 'bg-amber-500/5',
    },
    {
      label: 'Expirados',
      value: exp,
      sub: 'Hoje',
      color: 'text-destructive',
      borderColor: 'border-b-destructive',
      bg: 'bg-destructive/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
        >
          <Card className={`relative overflow-hidden border-white/10 bg-card/40 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/20 border-b-2 ${stat.borderColor}`}>
            <CardContent className="p-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                {stat.label}
              </div>
              <div className={`font-mono text-4xl font-bold tracking-tighter ${stat.color}`}>
                {stat.value}
              </div>
              <div className="font-mono text-[10px] tracking-wider text-muted-foreground/60 mt-1">
                {stat.sub}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
