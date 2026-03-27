import { RefreshCw, Key, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Service } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesTableProps {
  services: Service[];
  onRefresh: () => void;
  onGenerateAll: () => void;
  onAction: (action: 'access' | 'delay' | 'track', serviceId: string) => void;
}

export function ServicesTable({ services, onRefresh, onGenerateAll, onAction }: ServicesTableProps) {
  const getSt = (svc: Service) => {
    const n = Date.now();
    const t = new Date();
    const [h, m] = svc.time.split(':').map(Number);
    t.setHours(h, m, 0, 0);
    const start = new Date(t.getTime() - 30 * 60000);
    const post = (svc.type === 'CHEGADA' ? 120 : 60 + Math.max(0, (svc.distance || 0) - 60)) + (svc.delayMin || 0);
    const end = new Date(t.getTime() + post * 60000);
    return {
      status: n < start.getTime() ? 'AGENDADO' : n > end.getTime() ? 'EXPIRADO' : 'ATIVO',
      start,
      end,
    };
  };

  const fmtT = (d: Date) => d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  return (
    <Card className="border-white/10 bg-card/40 backdrop-blur-md overflow-hidden flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
        <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]" />
          Serviços do Dia
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onRefresh} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-auto">
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 rounded-full bg-white/5 p-6">
              <MapPin className="h-12 w-12 text-muted-foreground/30" />
            </div>
            <div className="font-mono text-sm tracking-widest text-muted-foreground uppercase">
              Sem serviços carregados
            </div>
          </div>
        ) : (
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Hora</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Tipo</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Cliente(s)</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Veículo</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Tracker</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Janela</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Estado</TableHead>
                  <TableHead className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {services.map((s, i) => {
                    const { status, start, end } = getSt(s);
                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <TableCell className="font-mono text-sm font-bold text-primary tracking-wider whitespace-nowrap">
                          {s.time}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-mono text-[9px] tracking-wider uppercase whitespace-nowrap ${s.type === 'PARTIDA' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-primary/30 bg-primary/10 text-primary'}`}>
                            {s.type === 'PARTIDA' ? '↑ PARTIDA' : '↓ CHEGADA'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium text-foreground whitespace-nowrap">
                          {s.clients.join(', ')}
                        </TableCell>
                        <TableCell className="font-bold tracking-wider text-foreground whitespace-nowrap">
                          {s.vehicle}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-mono text-[9px] tracking-wider uppercase ${s.tracker === 'S5' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-primary/30 bg-primary/10 text-primary'}`}>
                            {s.tracker}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                          <div>{fmtT(start)}</div>
                          <div>{fmtT(end)}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`font-mono text-[9px] tracking-wider uppercase flex items-center gap-1.5 ${
                              status === 'ATIVO' ? 'border-primary/30 bg-primary/10 text-primary shadow-[0_0_10px_rgba(0,230,118,0.1)]' :
                              status === 'AGENDADO' ? 'border-amber-500/30 bg-amber-500/10 text-amber-500' :
                              'border-destructive/30 bg-destructive/10 text-destructive opacity-70'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full bg-current ${status === 'ATIVO' ? 'animate-pulse' : ''}`} />
                              {status}
                            </Badge>
                            {s.delayMin > 0 && (
                              <Badge variant="outline" className="font-mono text-[9px] tracking-wider uppercase border-amber-500/30 bg-amber-500/10 text-amber-500">
                                +{s.delayMin}m
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary" onClick={() => onAction('access', s.id)}>
                              <Key className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 bg-white/5 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-500" onClick={() => onAction('delay', s.id)}>
                              <Clock className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary" onClick={() => onAction('track', s.id)}>
                              <MapPin className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {services.length > 0 && (
        <div className="border-t border-white/5 p-4 flex items-center justify-between bg-black/20">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {services.length} serviços carregados
          </div>
          <Button onClick={onGenerateAll} size="sm" className="font-bold tracking-widest uppercase text-[10px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,230,118,0.2)]">
            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
            Gerar Todos os Acessos
          </Button>
        </div>
      )}
    </Card>
  );
}
