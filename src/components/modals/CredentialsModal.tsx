import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { VF } from '../../lib/vodafone';
import { toast } from 'sonner';

interface CredentialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function CredentialsModal({ open, onOpenChange, onSave }: CredentialsModalProps) {
  const [user, setUser] = useState(VF.cfg.user);
  const [pass, setPass] = useState(VF.cfg.pass);
  const [url, setUrl] = useState(VF.cfg.baseUrl || 'https://api.automotive.vodafone.com/v1');
  const [devices, setDevices] = useState(VF.cfg.devices.join(', '));

  const handleSave = async () => {
    const u = user.trim();
    const p = pass.trim();
    const uUrl = url.trim();
    const devs = devices.split(',').map((d) => d.trim()).filter(Boolean);

    localStorage.setItem('vf_user', u);
    localStorage.setItem('vf_pass', p);
    localStorage.setItem('vf_url', uUrl);
    localStorage.setItem('vf_devices', JSON.stringify(devs));

    VF.cfg.user = u;
    VF.cfg.pass = p;
    VF.cfg.baseUrl = uUrl;
    VF.cfg.devices = devs;

    onSave();
    onOpenChange(false);
    toast.success('Credenciais guardadas');

    if (u && p && uUrl) {
      const ok = await VF.auth();
      if (ok) {
        toast.success('Vodafone API ligada!');
      } else {
        toast.error('Autenticação falhou');
      }
    }
  };

  const handleTest = () => {
    if (!user) {
      toast.warning('Preenche as credenciais');
      return;
    }
    toast.info('Testando ligação Vodafone...');
    setTimeout(() => toast.warning('Sem resposta — credenciais não configuradas ainda'), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] border-white/10 bg-card/90 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm font-bold uppercase tracking-widest text-foreground">
            ⚙ Configuração — Vodafone API
          </DialogTitle>
          <DialogDescription className="sr-only">Configurar credenciais da API Vodafone</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-amber-500/90 font-mono text-[10px] leading-relaxed tracking-wide">
          <strong className="block mb-2 text-amber-500 text-xs tracking-widest uppercase">
            ⚠ Vodafone Protect & Connect — API Empresarial
          </strong>
          A Vodafone Automotive não disponibiliza API pública. Integração real requer contrato B2B.<br />
          Contacto PT: <span className="text-primary">jsmsupport.automotive@vodafone.com</span><br />
          Preenche quando tiveres as credenciais — activa automaticamente.
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="vf-user" className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Username / Email Vodafone Automotive
            </Label>
            <Input
              id="vf-user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="utilizador@empresa.pt"
              className="border-white/10 bg-black/40 font-mono text-xs focus-visible:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vf-pass" className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Password
            </Label>
            <Input
              id="vf-pass"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="border-white/10 bg-black/40 font-mono text-xs focus-visible:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vf-url" className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Base URL da API (fornecida pela Vodafone)
            </Label>
            <Input
              id="vf-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.automotive.vodafone.com/v1"
              className="border-white/10 bg-black/40 font-mono text-xs focus-visible:ring-primary"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vf-devices" className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Device IDs dos veículos (separados por vírgula)
            </Label>
            <Input
              id="vf-devices"
              value={devices}
              onChange={(e) => setDevices(e.target.value)}
              placeholder="VF-AT58LP-001, VF-MX12AB-002"
              className="border-white/10 bg-black/40 font-mono text-xs focus-visible:ring-primary"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-white/5">
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleTest} className="border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400 font-mono text-[10px] font-bold uppercase tracking-widest">
            🔌 Testar
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,230,118,0.2)] font-mono text-[10px] font-bold uppercase tracking-widest">
            💾 Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
