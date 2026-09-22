# Tarefas do Painel de Frequência Cardíaca (Gama CF)

## Fase 1: MVP do Simulador (Concluído & Apresentado)
- [x] Criar repositório local e controle de versão Git
- [x] Elaborar e aprovar plano de implementação
- [x] Criar arquivo de sincronização de contexto para a IA (`ai_context.md`)
- [x] Criar estrutura base (HTML, CSS, JS puros sem dependências)
- [x] Desenvolver UI/UX Premium (Dark Mode, paleta Gama CF neon/roxo)
- [x] Implementar Lógica de Simulação de Batimentos com oscilação orgânica
- [x] Mapear Zonas de Esforço padrão HYROX (Z1 a Z5 + Repouso)
- [x] Implementar Gestão de Sessão (Modal para atribuir Aluno <-> Pulseira)
- [x] Adicionar Screensaver / Empty State dinâmico na tela da TV
- [x] Apresentar o MVP para a cliente

## Próximos Passos (Aguardando Feedback & Transição para Hardware Real)
- [ ] Coletar feedback da cliente sobre a experiência do MVP
- [ ] Definir quantidade do lote piloto de pulseiras (Coospo HW807) e modelo de uso no box
- [ ] Implementar módulo da Web Bluetooth API (leitura real do serviço GATT `0x180D` e reconexão)
- [ ] Publicar em ambiente HTTPS (ex: GitHub Pages) para habilitar o Web Bluetooth no Chrome
- [ ] Dinamizar o formulário de cadastro de alunos (adicionar/remover vagas conforme o número de pulseiras)
- [ ] Teste de bancada com 1 ou 2 pulseiras físicas reais
- [ ] Fase 2: Arquitetura em nuvem (Supabase/Firebase) para TV independente sem cabo HDMI
