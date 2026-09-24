# Tarefas do Painel de Frequência Cardíaca (Gama CF)

## Fase 1: MVP do Simulador & Debrief (Concluído)
- [x] Criar repositório local e controle de versão Git
- [x] Elaborar e aprovar plano de implementação
- [x] Criar arquivo de sincronização de contexto para a IA (`ai_context.md`)
- [x] Criar estrutura base (HTML, CSS, JS puros sem dependências)
- [x] Desenvolver UI/UX Premium (Dark Mode, paleta Gama CF neon/roxo)
- [x] Implementar Lógica de Simulação de Batimentos com oscilação orgânica
- [x] Mapear Zonas de Esforço padrão HYROX (Z1 a Z5 + Repouso)
- [x] Implementar Gestão de Sessão (Modal para atribuir Aluno <-> Pulseira)
- [x] Adicionar Screensaver / Empty State dinâmico na tela da TV
- [x] Apresentar o MVP para a cliente (Aprovado com elogios)
- [x] Implementar Cronômetro de treino ativo no cabeçalho
- [x] Implementar Dashboard de Relatório Final Pós-Treino (Debrief HYROX estilo Apple Watch)
- [x] Implementar formulário dinâmico de atletas (+ Adicionar / Remover alunos)

## Próximos Passos (Transição para Hardware Real & Teste no Box)
- [ ] Receber pulseira modelo providenciada pela cliente (Tamara)
- [ ] Implementar módulo da Web Bluetooth API (leitura real do serviço GATT `0x180D` e reconexão)
- [ ] Publicar em ambiente HTTPS (GitHub Pages) para liberar Web Bluetooth no Chrome Android
- [ ] Testar no smartphone Samsung Galaxy: pareamento Bluetooth com a pulseira + espelhamento Chromecast na TV
- [ ] Validar lote piloto de pulseiras para a turma do box
- [ ] Fase 2: Arquitetura em nuvem (Supabase/Firebase) para TV independente sem cabo ou espelhamento
