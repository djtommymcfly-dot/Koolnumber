import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Service } from '../../types';
import { toast } from 'sonner';

interface DelayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onApply: (id: string, min: number, why: string) => void;
}

export function DelayModal({ open, onOpenChange, service, onApply }: DelayModalProps) {
  const [min, setMin] = useState(30);
  const [why, setWhy] = useState('');

  useEffect(() => {
    if (open) {
      setMin(30);
      setWhy('');
    }
  }, [open]);

  const handleApply = () => {
    if (!why.trim()) {
      toast.warning('Justificação obrigatória');
      return;
    }
    if (!min || min < 1) {
      toast.warning('Minutos inválidos');
      return;
    }
    if (service) {
      onApply(service.id, min, why.trim());
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-border bg-card/95 backdrop-blur-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
            ⏱ Registar Atraso
          </DialogTitle>
          <DialogDescription className="sr-only">Registar atraso para o serviço</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Serviço
            </Label>
            <Input
              readOnly
              value={service ? `${service.time} · ${service.type} · ${service.clients.join(', ')} · ${service.vehicle}` : ''}
              className="border-border bg-background font-mono text-xs text-muted-foreground opacity-60"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="d-min" className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Minutos de Atraso
            </Label>
            <Input
              id="d-min"
              type="number"
              min="5"
              max="480"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="border-border bg-background font-mono text-xs focus-visible:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="d-why" className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Justificação (obrigatória)
            </Label>
            <Textarea
              id="d-why"
              placeholder="ex: Trânsito na A1, incidente..."
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="min-h-[80px] border-border bg-background font-mono text-xs focus-visible:ring-primary resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-muted">
            Cancelar
          </Button>
          <Button onClick={handleApply} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,230,118,0.2)] font-mono text-[10px] font-bold uppercase tracking-widest">
            Aplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
