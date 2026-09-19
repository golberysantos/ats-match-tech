# MEGA PROMPT - ATS Match Tech - Histórico de Evolução

Este arquivo documenta o prompt usado no Lovable e sua evolução. Exigência da banca.

---

### VERSÃO 1 - Base Inicial (Gerada e descartada)
Foco apenas em comparar vaga x currículo sem estimativa de chance. Usada para validar fluxo de Tabs.

### VERSÃO 2 - FINAL CONSOLIDADA (Usada na geração que foi publicada) - 18/09/2026

```markdown
# ATS MATCH TECH - Otimizador de Currículo para ATS - Nicho Tech Junior

## OBJETIVO
Crie uma aplicação web chamada ATS Match Tech. Ela compara currículo em PDF com descrição de vaga e gera versão ATS Friendly. Nicho: primeiro emprego e vagas junior em tecnologia.

## STACK OBRIGATÓRIA - RESTRIÇÃO MÁXIMA
- React + TypeScript + Tailwind CSS + shadcn/ui APENAS
- Use SOMENTE estes componentes shadcn: Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Textarea, Badge, Progress, Tabs, TabsList, TabsTrigger, TabsContent, Separator, Dialog
- PROIBIDO: criar div com className custom arbitrário, usar style prop, criar CSS custom. Use sempre componentes shadcn.
- Biblioteca: pdfjs-dist para ler PDF no cliente. Use CDN para worker: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
- Ícones: lucide-react
- Persistência: localStorage key `ats_vagas`

## FLUXO E ESTRUTURA - PÁGINA ÚNICA
Header: Título "ATS Match Tech" + subtítulo "Passe no ATS de vagas de tecnologia"
Layout: max-w-5xl mx-auto p-4 com Tabs shadcn

Tab 1 - "Criar Vaga":
- Card com Form: Input para Título da vaga, Input para Empresa, Textarea grande para Descrição completa colada do LinkedIn/Gupy
- Button Salvar Vaga -> salva em localStorage
- Abaixo, lista de vagas salvas em Cards com título, empresa, 2 linhas da descrição e Button "Usar esta vaga" que seta vagaSelecionada e muda para Tab 2

Tab 2 - "Analisar Currículo":
- Se vagaSelecionada == null: mostrar Card com aviso "Selecione uma vaga na Tab 1"
- Se tem vaga: mostrar Card da vaga selecionada + Input type file PDF + Button Analisar com loading state
- Lógica após upload:
  1. Ler PDF com pdfjs-dist no cliente e extrair texto
  2. Chamar analisarMatch(descricaoVaga, textoCV) e calcularChance(scoreATS, textoCV)
  3. Mostrar 4 Cards na ordem:
     Card A - Score ATS: número grande + Progress
     Card B - ChanceCard: Estimativa de Compatibilidade com % inteiro cap 95, Badge com level baixa/media/alta/excelente, Progress, lista de fatores, disclaimer pequeno "*Não é garantia de contratação"
     Card C - Keywords: duas colunas - Encontradas com Badge variant default e Faltantes com Badge variant destructive
     Card D - CV ATS Friendly: Textarea readOnly com texto gerado + Buttons Copiar e Download TXT

## LÓGICA DE NEGÓCIO
Crie arquivo lib/atsAnalyzer.ts com:
- extrairKeywordsDaVaga(descricao): lowerCase, remove acento, remove pontuação, filtra stopwords e palavras <4 letras, junta com lista base tech [javascript, typescript, react, node, nextjs, html, css, tailwind, git, api, rest, sql, docker, aws, scrum], retorna até 40 únicas
- analisarMatch(descricao, textoCV): compara com includes, calcula scoreATS = encontradas/total*100 arredondado, gera cvOtimizado com template limpo sem colunas
- calcularChance(scoreATS, textoCV): 60% scoreATS + 25% completude [tem experiencia, habilidades, formacao, contato @] + 15% tamanho [>800 chars]. raw = soma, score final = Math.min(95, Math.round(raw)). NUNCA 100%. Level: 0-39 baixa, 40-69 media, 70-89 alta, 90-95 excelente. Retorna {score, level, label, fatores}

## DESIGN SYSTEM
- Paleta: primary hsl(221 83% 53%), background white, foreground hsl(222 47% 11%), muted hsl(210 40% 96%), verde sucesso hsl(142 76% 36%), destructive hsl(0 84% 60%)
- Fonte Inter
- Cards com shadow-sm, border-l-4 border-l-primary para destaque

## SEO + GEO
- Title: ATS Match Tech - Otimize seu currículo para passar no ATS de vagas de tecnologia
- Meta description: Cole sua vaga tech e seu currículo em PDF. Veja score de compatibilidade, chance estimada, palavras-chave que faltam e gere versão 100% ATS friendly para primeiro emprego.
- H1: Otimizador de Currículo ATS para Vagas Tech Junior
- Footer com FAQ + JSON-LD FAQ Schema

## O QUE NÃO FAZER
- Não usar backend, Supabase ou API externa
- Não criar pastas desnecessárias
- Não usar cores fora da paleta
- Código simples e funcional
```

### O QUE MUDOU DA V1 PARA V2 E POR QUÊ

1.  **Adição da Estimativa de Chance com cap em 95%:** Pedido do usuário. Implementado como Compatibilidade explicável e não como promessa de contratação para evitar risco jurídico e anti-pattern de falsa precisão. Fórmula ponderada 60/25/15.
2.  **Restrição máxima de shadcn/ui:** Adicionado "PROIBIDO div custom" e lista fechada de componentes. Motivo: primeira versão do Lovable estava criando divs com style inline, consumindo créditos e quebrando Design System.
3.  **Definição do Worker CDN do pdfjs-dist:** Na V1 o worker falhava com `Failed to load worker`. Fix adicionado com CDN explícito.
4.  **Definição do nicho Tech Junior no prompt:** Melhora SEO e GEO, faz a IA do Lovable gerar FAQ e textos mais específicos, o que ajuda a ser encontrado por IAs.
5.  **Especificação dos 4 Cards de resultado:** Para garantir que a banca veja evidência visual de análise completa.

### AJUSTES PÓS-GERAÇÃO PEDIDOS NO LOVABLE

1.  Ajuste 1: `Corrija o Progress para h-2 e adicione loading no Button Analisar`
2.  Ajuste 2: `Adicione validação de min 100 chars na descrição da vaga`
3.  Ajuste 3: `No ChanceCard, use variant destructive para baixa e default para demais`

Todos os ajustes foram cirúrgicos para não regenerar a app inteira.
