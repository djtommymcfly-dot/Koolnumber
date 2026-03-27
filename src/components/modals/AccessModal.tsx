import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Copy, Send } from 'lucide-react';
import { Service } from '../../types';
import { toast } from 'sonner';

interface AccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
}

export function AccessModal({ open, onOpenChange, service }: AccessModalProps) {
  const [link, setLink] = useState('');

  useEffect(() => {
    if (open && service) {
      const tk = 'vtk_' + service.id + '_' + Math.random().toString(36).slice(2, 10);
      setLink(`https://vector-fleet.pt/tracking/${tk}`);
    }
  }, [open, service]);

  const calcWin = (svc: Service) => {
    const t = new Date();
    const [h, m] = svc.time.split(':').map(Number);
    t.setHours(h, m, 0, 0);
    const start = new Date(t.getTime() - 30 * 60000);
    const post = (svc.type === 'CHEGADA' ? 120 : 60 + Math.max(0, (svc.distance || 0) - 60)) + (svc.delayMin || 0);
    const end = new Date(t.getTime() + post * 60000);
    return { start, end };
  };

  const fmtT = (d: Date) => d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  const handleCopy = () => {
    navigator.clipboard?.writeText(link).then(() => toast.success('Link copiado!'));
  };

  const handleSend = () => {
    if (service) {
      toast.success(`Link enviado a ${service.clients[0]}`);
      onOpenChange(false);
    }
  };

  const win = service ? calcWin(service) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card/95 backdrop-blur-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
            🔑 Acesso Gerado
          </DialogTitle>
          <DialogDescription className="sr-only">Acesso gerado para o cliente</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-4">
            {service ? `${service.clients.join(' · ')} · ${service.vehicle} · ${service.type} ${service.time}` : ''}
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2 mb-4">
            <div className="font-mono text-[10px] text-primary flex-1 truncate px-2">
              {link}
            </div>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 hover:bg-muted shrink-0">
              <Copy className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-[repeating-conic-gradient(var(--color-card)_0%_25%,var(--color-background)_0%_50%)] bg-[length:8px_8px] opacity-60 border border-border" />
            <div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                JANELA DE ACESSO
              </div>
              <div className="font-mono text-xs font-bold text-primary tracking-wider">
                {win ? `${fmtT(win.start)} → ${fmtT(win.end)}` : '—'}
              </div>
              <div className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase mt-1">
                Vodafone {service?.tracker} · {service?.vehicle}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-muted">
            Fechar
          </Button>
          <Button onClick={handleSend} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,230,118,0.2)] font-mono text-[10px] font-bold uppercase tracking-widest">
            <Send className="mr-2 h-3.5 w-3.5" />
            Enviar ao Cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
