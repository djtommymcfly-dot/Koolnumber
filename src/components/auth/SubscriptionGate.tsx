import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, CreditCard, LogOut } from 'lucide-react';

interface SubscriptionGateProps {
  onLogout: () => void;
  onSimulatePayment: () => void;
}

export function SubscriptionGate({ onLogout, onSimulatePayment }: SubscriptionGateProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg border-destructive/20 bg-card/95 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Subscrição Inativa</CardTitle>
          <CardDescription className="font-mono text-sm text-muted-foreground">
            O acesso ao Vector Fleet foi suspenso devido a falha no pagamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-center">
            <p className="text-muted-foreground mb-2">
              Não conseguimos processar o último pagamento da sua subscrição <strong>Plano Frota Pro</strong>.
            </p>
            <p className="font-bold text-foreground">
              Por favor, atualize o seu método de pagamento para restaurar o acesso imediato ao sistema e aos links de tracking dos seus clientes.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={onSimulatePayment} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold tracking-widest uppercase text-xs h-12">
              <CreditCard className="mr-2 h-4 w-4" />
              Atualizar Pagamento (Simular)
            </Button>
            <Button variant="outline" onClick={onLogout} className="w-full border-border bg-background hover:bg-muted font-bold tracking-widest uppercase text-xs">
              <LogOut className="mr-2 h-4 w-4" />
              Terminar Sessão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
