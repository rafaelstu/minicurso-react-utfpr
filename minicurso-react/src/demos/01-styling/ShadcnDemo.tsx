// BOM — o componente é seu: abri o button.tsx e adicionei a variante "brand", sem !important.
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RenderCounter } from "../../components/RenderCounter";

export function ShadcnDemo() {
  const [email, setEmail] = useState("");
  const [signedWith, setSignedWith] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700">
            Mais popular
          </Badge>
          <RenderCounter label="renders" />
        </div>
        <CardTitle>Plano Pro</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="text-3xl font-extrabold tracking-tight text-foreground">
          R$ 79 <span className="text-sm font-medium text-muted-foreground">/mês</span>
        </div>

        <ul className="flex list-none flex-col gap-1.5 p-0 text-sm text-muted-foreground">
          {["10 projetos", "Deploy automático", "100 GB de banda", "Suporte prioritário"].map(
            (beneficio) => (
              <li key={beneficio} className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-indigo-500" />
                {beneficio}
              </li>
            ),
          )}
        </ul>

        <div className="flex flex-wrap gap-2">
          {/* variante "brand" criada no nosso button.tsx (src/components/ui) */}
          <Button variant="brand">Assinar o Pro</Button>
          <Button variant="outline">Falar com vendas</Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Assinar com e-mail</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar assinatura</DialogTitle>
                <DialogDescription>
                  Enviamos o link de ativação para este e-mail.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="shadcn-email">E-mail de cobrança</Label>
                <Input
                  id="shadcn-email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="brand"
                    onClick={() => setSignedWith(email || "voce@empresa.com")}
                  >
                    Confirmar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {signedWith && (
          <p className="text-sm text-green-700">Link enviado para {signedWith}.</p>
        )}
      </CardContent>
    </Card>
  );
}
