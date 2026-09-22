# Contexto do Projeto para a IA (Sincronização entre Máquinas)

**Objetivo:** Este arquivo serve como "memória" para a IA do Antigravity. Como o usuário alternará entre o computador do trabalho e o pessoal, ler este arquivo permitirá que a IA entenda exatamente em que pé o projeto está, sem precisar do histórico de chat original.

## Resumo do Projeto
- **Projeto:** MVP de Painel de Frequência Cardíaca para CrossFit.
- **Hardware Alvo:** Coospo HW807 (ou similares via Bluetooth/ANT+).
- **Tecnologia do MVP:** Vanilla HTML, CSS, JS (foco na Web Bluetooth API futuramente, uso de simulador no presente).
- **Design:** Premium, vibrante, "Dark Mode" de academia.
- **Autor:** MadsonMagno.

## Status Atual
- **MVP Apresentado à Cliente:** O dashboard com visual Gama CF (neon/roxo dark mode), zonas HYROX (Z1 a Z5), protetor de tela/screensaver e simulador orgânico de batimentos foi concluído e apresentado.
- **Momento do Projeto:** Aguardando o retorno/feedback da cliente (dona/gestor do box).
- **Próxima Etapa Mapeada:** Transição do simulador para hardware real (pulseiras Coospo HW807 via Web Bluetooth API), configuração de deploy HTTPS e definição de regras operacionais no box.

## Resumo dos Requisitos do Próximo Passo
1. **Negocial:** Feedback da cliente, definição de quantidade do lote piloto (1 a 2 unidades para teste de bancada ou lote inicial de 5 a 10) e modelo de uso/higienização.
2. **Hardware:** Pulseiras ópticas de braço (BLE 5.0 + ANT+, foco Coospo HW807), notebook da recepção com Google Chrome/Edge e Bluetooth 5.0, hub USB para recarga diária e cabo HDMI (na Fase 1).
3. **Software/Técnico:** Módulo Web Bluetooth (`navigator.bluetooth` lendo serviço GATT `0x180D`), deploy com HTTPS (GitHub Pages ou similar, exigência do Chrome) e rotina de reconexão.
4. **Fase 2 (Futuro):** Migração para Nuvem (Supabase/Firebase) para a TV operar independente sem cabo HDMI.

## Instruções para a IA (Quando lido em nova máquina)
Se você (IA) estiver lendo este arquivo em uma nova sessão no outro computador:
1. Leia este arquivo, o `implementation_plan.md` e o `task.md` para situar o contexto.
2. O MVP já está pronto e foi apresentado. Verifique se o usuário já tem o feedback da cliente ou se ele deseja iniciar a implementação do módulo de Bluetooth / deploy HTTPS / dinamizar vagas de alunos.
3. Não sobrescreva a lógica do `app.js` sem necessidade; mantenha a compatibilidade com o modo simulador enquanto o hardware real não estiver em mãos.
