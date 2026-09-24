# Contexto do Projeto para a IA (Sincronização entre Máquinas)

**Objetivo:** Este arquivo serve como "memória" para a IA do Antigravity. Como o usuário alternará entre o computador do trabalho e o pessoal, ler este arquivo permitirá que a IA entenda exatamente em que pé o projeto está, sem precisar do histórico de chat original.

## Resumo do Projeto
- **Projeto:** MVP de Painel de Frequência Cardíaca para CrossFit.
- **Hardware Alvo:** Coospo HW807 (ou similares via Bluetooth/ANT+).
- **Tecnologia do MVP:** Vanilla HTML, CSS, JS (foco na Web Bluetooth API futuramente, uso de simulador no presente).
- **Design:** Premium, vibrante, "Dark Mode" de academia.
- **Autor:** MadsonMagno.

## Status Atual
- **Feedback da Cliente (Tamara - Gama CF):** Validou e elogiou o MVP ("Achei top"). Comprometeu-se a fornecer 1 pulseira modelo para início imediato dos testes reais.
- **Novas Features Implementadas com Sucesso:**
  1. **Relatório Final pós-treino (Debrief HYROX):** Tela de fechamento ao encerrar o treino exibindo Kcal gastas, BPM médio/máximo, zona predominante, barra de distribuição de tempo nas zonas (Z1 a Z5 no estilo Apple Watch) e dicas do coach para debrief em frente à TV.
  2. **Cronômetro de WOD:** Mostrador de tempo decorrido no topo da tela durante o treino.
  3. **Vagas Dinâmicas de Alunos:** Formulário de início de aula agora permite adicionar/remover atletas conforme a turma (ex: Tamara, Pedro Lagarto, Madson).
- **Decisão Estratégica de Hardware (Adequação da Cliente):**
  - **Problema resolvido:** O PC da recepção é muito movimentado e causaria conflitos/quedas se espelhado na TV.
  - **Solução aprovada:** Usar o **smartphone Samsung Galaxy ocioso** do próprio box para gerenciar a aula e espelhar na TV via **Chromecast** (Smart View). O Google Chrome no Android tem suporte nativo total à Web Bluetooth API!

## Resumo dos Requisitos do Próximo Passo
1. **Pulseira Real de Teste:** Receber a pulseira modelo que a Tamara providenciará para testar a conexão física.
2. **Deploy HTTPS (GitHub Pages/Vercel):** Necessário para que o Chrome do celular Galaxy permita usar a Web Bluetooth API em conexões seguras.
3. **Módulo Web Bluetooth API:** Conexão com o serviço GATT Heart Rate (`0x180D`) das pulseiras reais.
4. **Espelhamento Chromecast:** Validar o fluxo de espelhamento do Galaxy em modo paisagem (landscape) para a TV.

## Instruções para a IA (Quando lido em nova máquina)
Se você (IA) estiver lendo este arquivo em uma nova sessão no outro computador:
1. Leia este arquivo, o `implementation_plan.md` e o `task.md`.
2. O dashboard atual possui: simulador realista, cronômetro, gestão dinâmica de atletas e **Relatório Debrief Pós-WOD** completo.
3. As próximas tarefas de código prioritárias são: criar a camada de Web Bluetooth (chaveando entre modo real e simulador) e configurar o deploy HTTPS no GitHub Pages para rodar no Galaxy.
