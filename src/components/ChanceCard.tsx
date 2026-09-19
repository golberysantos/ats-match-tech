import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HiringChance } from "@/lib/atsAnalyzer";

interface Props {
  chance: HiringChance;
}

export function ChanceCard({ chance }: Props) {
  const variantMap = {
    baixa: 'destructive' as const,
    media: 'secondary' as const,
    alta: 'default' as const,
    excelente: 'default' as const,
  };

  return (
    <Card className="shadow-sm border-l-4 border-l-primary">
      <CardHeader>
        <CardTitle>Estimativa de Compatibilidade</CardTitle>
        <CardDescription>
          Quanto seu currículo está alinhado com esta vaga. Não é garantia de contratação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold tracking-tight">{chance.score}%</span>
            <Badge variant={variantMap[chance.level]}>{chance.label}</Badge>
          </div>
        </div>
        
        <Progress value={chance.score} className="h-2" />
        
        <Separator />
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Por que este resultado?</p>
          <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
            {chance.fatores.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          * Cálculo baseado em palavras-chave e estrutura. A decisão final é sempre do recrutador.
        </p>
      </CardContent>
    </Card>
  );
}