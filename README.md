# Fortuna 💰

Um app de finanças pessoais focado em **mudança de comportamento financeiro** — não apenas em registrar gastos, mas em ajudar você a perceber para onde seu dinheiro está indo e evitar compras por impulso.

> "Seu dinheiro deveria trabalhar por você — não desaparecer sem você perceber."

## ✨ Funcionalidades do MVP

- Dashboard com saldo, disponível no mês, valor guardado e meta mensal
- Registro de receitas, despesas e transferências
- Verificação de compra por impulso: antes de confirmar uma despesa relevante, o app pergunta "você realmente precisa disso?" e mostra a % do orçamento que ela representa
- Categorias e contas
- Orçamento mensal
- Metas com progresso e projeção de tempo para atingir
- Gráfico de distribuição por categoria (rosca) e comparação mês a mês
- Seção de Análise (RAIO-X) com simulador "o que acontece se eu guardar esse dinheiro?"
- Sistema de XP e níveis financeiros (Iniciante → Patrimônio) + streak de dias no controle
- Exportação e importação de dados em JSON
- Modo claro/escuro
- 100% local-first — dados salvos no IndexedDB do navegador, sem servidor

## 🛠️ Stack

- React + TypeScript + Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- Zustand
- Recharts
- React Hook Form + Zod
- date-fns
- lucide-react

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173

Para gerar a build de produção:

```bash
npm run build
npm run preview
```

## 📁 Estrutura do projeto

```
src/
├── components/     # UI genérica, gráficos, layout, feedback (modais)
├── pages/          # Dashboard, Transactions, Goals, Analytics, Settings
├── features/       # Regras de negócio: XP, frases inteligentes
├── database/       # Schema e seed do Dexie (IndexedDB)
├── store/          # Estado global (Zustand)
├── utils/          # Formatação de moeda, datas etc.
└── types/          # Tipos TypeScript do domínio
```

## 🗺️ Roadmap

**V2**
- Cartões de crédito com faturas futuras
- Parcelamentos
- Contas recorrentes com lembretes automáticos
- Projeções mais avançadas

**V3**
- Investimentos
- Sincronização opcional em nuvem
- Notificações
- Inteligência financeira mais avançada (análise automática de padrões)

## 🔐 Privacidade

O Fortuna não depende de servidor para funcionar. Todos os dados ficam no dispositivo do usuário (IndexedDB), com opção de exportar/importar backups em JSON.
