import { Activity } from 'lucide-react';
import { LogEntry } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityLogProps {
  logs: LogEntry[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
  const cc = {
    ATIVO: 'bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]',
    AGENDADO: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    EXPIRADO: 'bg-destructive shadow-[0_0_8px_rgba(255,23,68,0.8)]',
  };

  return (
    <Card className="border-border bg-card/80 backdrop-blur-md overflow-hidden flex-1">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          Log de Acessos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-muted/50 p-4">
              <Activity className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              Sem acessos ainda
            </div>
          </div>
        ) : (
          <div className="flex flex-col p-4">
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div
                  key={`${log.time}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                >
                  <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${cc[log.status] || 'bg-muted-foreground'}`} />
                  <span className="font-mono text-[10px] font-bold text-foreground w-12">{log.time}</span>
                  <span className="font-mono text-[10px] text-muted-foreground flex-1 truncate">
                    {log.client} · {log.vehicle}
                  </span>
                  <span className="font-mono text-[9px] font-bold text-primary tracking-widest uppercase">
                    {log.action}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
