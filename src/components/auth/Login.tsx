import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (status: 'active' | 'unpaid') => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação: Se o email contiver "falha", simulamos uma conta sem pagamento
    if (email.includes('falha')) {
      onLogin('unpaid');
    } else {
      onLogin('active');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
          <MapPin className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-2xl font-black tracking-tighter text-foreground">
            VECTOR<span className="text-primary">FLEET</span>
          </span>
          <span className="font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Access Management
          </span>
        </div>
      </div>

      <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-xl shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo de volta</CardTitle>
          <CardDescription className="font-mono text-xs">
            Insira as suas credenciais para aceder ao painel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@empresa.pt" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-border bg-background font-mono text-sm focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                <a href="#" className="font-mono text-[10px] font-bold text-primary hover:underline">Esqueceu-se?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border bg-background font-mono text-sm focus-visible:ring-primary"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest uppercase text-xs mt-2">
              <Lock className="mr-2 h-4 w-4" />
              Entrar no Sistema
            </Button>
          </form>
          
          <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
            <p className="font-mono text-[10px] text-amber-600">
              💡 <strong>Dica de Simulação:</strong><br/>
              Escreva "falha" no email para simular uma conta com pagamento em atraso. Qualquer outro email entra normalmente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
