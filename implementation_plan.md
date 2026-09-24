# Plano de Implementação: MVP Painel de Frequência Cardíaca (CrossFit)

## 1. Análise de Viabilidade Técnica (Coospo HW807 e similares)
A pulseira **Coospo HW807** utiliza **Bluetooth 5.0** e **ANT+**. 
Para este MVP focado na web, a tecnologia mais viável e rápida é a **Web Bluetooth API**.
- **Como funciona:** O navegador (Google Chrome/Edge) consegue se conectar diretamente a dispositivos Bluetooth Low Energy (BLE) que transmitem o serviço padrão de Frequência Cardíaca (Heart Rate GATT Service `0x180D`).
- **Vantagem:** Não precisamos de servidor ou aplicativos nativos. Tudo roda direto no navegador e pode ser espelhado na TV da academia.
- **Limitação do MVP (Web Bluetooth):** Por segurança, navegadores exigem que o usuário clique para conectar *cada* pulseira. Se a turma tiver 20 alunos, o professor precisará parear as 20 pulseiras manualmente antes da aula.
- **Solução Futura (Pós-MVP):** Usar o protocolo **ANT+** com um receptor USB espetado num pequeno computador/Raspberry Pi. O ANT+ funciona por "transmissão contínua" (broadcast), permitindo ler dezenas de pulseiras simultaneamente de forma automática sem precisar parear uma a uma.

## 2. Estratégia de Simulação (Testes sem a pulseira real)
Para avançarmos imediatamente sem a pulseira física, criaremos um modo **Simulador (Mock)**:
- Criaremos um serviço no código capaz de gerar dados aleatórios de batimentos (ex: flutuando entre 80 e 180 bpm) simulando o esforço de um treino de CrossFit.
- Teremos um botão na interface: "Adicionar Pulseira Simulada". Quando a pulseira real chegar da China ou loja, basta mudar para a função de conectar a real.

## 3. Gestão de Turmas e Troca de Usuários
Para lidar com a mesma pulseira (ex: "Pulseira 01") sendo usada pelo José de manhã e pela Maria à tarde, implementaremos um conceito de **Sessão/Aula**:
1. **Início da Aula:** O painel permite cadastrar alunos e vinculá-los ao ID da pulseira física (Ex: `José -> Pulseira 01`, `Maria -> Pulseira 02`).
2. **Durante a Aula:** O painel mostra o nome do aluno atual (José) e sua zona de frequência cardíaca.
3. **Fim da Aula:** O professor clica em "Encerrar Aula". Isso limpa os vínculos (José não está mais na Pulseira 01), deixando o painel pronto para vincular a Maria à Pulseira 01 na turma seguinte, sem precisar desconectar o hardware.

## 4. Fase 2: Sincronização em Nuvem (O Fim do Cabo HDMI)
Como discutido, a necessidade de cabo HDMI será temporária (apenas para a Fase 1). Na próxima etapa, implementaremos uma arquitetura Cliente-Servidor em tempo real (ex: usando Firebase ou Supabase).
- **Como funcionará:** 
  1. A TV do ginásio abrirá uma URL (ex: `gamacf.com/tv`) que ficará lá para sempre. Ela apenas "escuta" a nuvem.
  2. O PC da recepção acessará `gamacf.com/painel` para gerenciar a aula.
  3. **Atenção ao Bluetooth:** O dispositivo que faz a leitura do Bluetooth precisa estar *fisicamente perto* dos alunos (alcance de ~10 metros). Se a recepção for longe do ginásio, usaremos um receptor (ex: tablet ou Raspberry Pi) que fica dentro do ginásio apenas lendo as pulseiras e mandando para a nuvem.

## 5. Fluxo de Trabalho (Git)
Como você trabalhará neste PC e no seu PC pessoal:
1. O repositório Git já foi inicializado na pasta `C:\Users\John.araujo\Downloads\crossfit-hr-dashboard`.
2. Para sincronizar as máquinas, usaremos um fluxo simples via GitHub (detalhado no chat).

## 5. Arquitetura do MVP, Identidade Visual e Debrief Pós-Treino (Concluído)
- **Tecnologias:** HTML5, CSS3 puro (com variáveis, grid reativo, efeitos de brilho e dark mode) e JavaScript Vanilla. Sem dependências pesadas de backend no momento.
- **Identidade:** Paleta Gama CF (Neon Green `#49e200`, Roxo `#6711a4` e fundo escuro `#0f1115`).
- **Zonas de Treino:** Padrão HYROX (Repouso, Z1 Aquecimento a Z5 Esforço Máximo).
- **Screensaver / Empty State:** Tela em repouso dinâmica aguardando o início do treino.
- **Cronômetro de WOD:** Display de tempo decorrido no topo durante o treino.
- **Relatório Final de Treino (Debrief da Sessão - Estilo Apple Watch):**
  - Estimativa de Calorias (Kcal) queimadas no treino.
  - BPM Médio e BPM Pico por atleta.
  - Zona Predominante de esforço com badge estilizado.
  - Barra de distribuição percentual de tempo nas zonas (Z1 a Z5 com cores representativas).
  - Feedback dinâmico do treinador (*"⚡ Alvo HYROX Atingido!"*, *"💪 Excelente Base Aeróbica"*, etc.).
  - Layout otimizado para foto de celular/Instagram na TV.
- **Formulário Dinâmico de Turma:** Permite ao professor adicionar ou remover vagas de alunos livremente conforme o tamanho da aula.

## 6. Arquitetura Operacional no Box: Smartphone Galaxy + Chromecast

Após alinhamento com a cliente (Tamara), foi identificado que o **computador da recepção é incompatível** com o projeto devido à sobrecarga de atendimento e risco de desconexão.

Em contrapartida, o box já possui um **Samsung Galaxy ocioso** e uma **TV com Chromecast**.

### Como funcionará:
1. **Controle na Mão do Treinador:** O smartphone Galaxy fica no balcão do coach ou com o professor.
2. **Web Bluetooth no Chrome Mobile:** O navegador Google Chrome para Android possui suporte nativo à **Web Bluetooth API**. O professor acessa a URL do dashboard (com HTTPS) e conecta a pulseira do aluno diretamente pelo diálogo nativo do Android.
3. **Espelhamento sem Fio (Chromecast / Smart View):**
   - O Galaxy espelha sua tela na TV via **Smart View / Google Home**.
   - Colocando o celular na horizontal (modo paisagem), a imagem preenche a TV em 16:9 perfeitamente, sem necessidade de cabo HDMI atravessando o box.
4. **Vantagens dessa Solução:**
   - **Custo Zero:** Utiliza equipamentos que o box já possui.
   - **Independência da Recepção:** O recepcionista continua trabalhando normalmente sem interferir na aula.
   - **Proximidade do Sinal:** O celular fica no tatame com o coach, garantindo que o sinal Bluetooth com as pulseiras seja forte e estável.

## 7. Requisitos Técnicos para os Próximos Passos
1. **Pulseira Real de Teste:** Testar a leitura física com a pulseira modelo fornecida pela Tamara.
2. **Deploy HTTPS (GitHub Pages):** Publicar o repositório no GitHub Pages para que o Chrome do Galaxy execute a Web Bluetooth API em contexto seguro.
3. **Driver Web Bluetooth (`0x180D`):** Implementar no `app.js` a função `navigator.bluetooth.requestDevice` com leitura da característica `0x2A37`.
4. **Fase 2 (Nuvem / Futuro):** Quando a academia quiser histórico de atletas, matrículas e ranking perpétuo, migrar para Supabase/Firebase.

## 8. Status das Fases
- [x] **Fase 1 (MVP Simulador, Gestão de Turma & Debrief):** Concluído e validado.
- [ ] **Fase 1.5 (Homologação Real no Galaxy + Chromecast + Pulseira):** Próxima etapa em andamento.
- [ ] **Fase 2 (Nuvem, Histórico e Multi-Telas):** Futuro.
