import { Settings, ShieldCheck, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface HeaderProps {
  onOpenSettings: () => void;
  isApiLive: boolean;
}

export function Header({ onOpenSettings, isApiLive }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-primary/5">
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_270deg,rgba(0,230,118,0.35)_360deg)]" />
              <ShieldCheck className="relative z-10 h-5 w-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold tracking-widest text-foreground">VECTOR FLEET</div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Vodafone Protect & Connect
              </div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
            <div className={`h-2 w-2 rounded-full ${isApiLive ? 'bg-primary shadow-[0_0_8px_rgba(0,230,118,0.8)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'} animate-pulse`} />
            <span className={`font-mono text-[10px] font-bold tracking-wider ${isApiLive ? 'text-primary' : 'text-amber-500'}`}>
              {isApiLive ? 'VODAFONE API LIVE' : 'SIMULAÇÃO ACTIVA'}
            </span>
            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 hover:bg-muted" onClick={onOpenSettings}>
              <Settings className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-mono text-sm font-medium tracking-wider text-foreground">
              {time.toLocaleTimeString('pt-PT')}
            </div>
            <div className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              {time.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
          </div>
          <Button variant="outline" size="sm" className="md:hidden border-border bg-muted/50" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
