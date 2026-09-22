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

## 5. Arquitetura do MVP e Identidade Visual (Concluído)
- **Tecnologias:** HTML5, CSS3 puro (com variáveis, grid reativo, efeitos de brilho e dark mode) e JavaScript Vanilla. Sem dependências pesadas de backend no momento.
- **Identidade:** Paleta Gama CF (Neon Green `#49e200`, Roxo `#6711a4` e fundo escuro `#0f1115`).
- **Zonas de Treino:** Padrão HYROX (Repouso, Z1 Aquecimento a Z5 Esforço Máximo).
- **Screensaver / Empty State:** Tela em repouso dinâmica aguardando o início do treino.

## 6. Requisitos para o Próximo Passo (Hardware Real e Operação)

### A. Negocial & Operacional (Alinhamento com a Cliente)
- **Lote Piloto:** Definir aquisição de 1 a 2 unidades para teste de bancada ou lote inicial de 5 a 10 pulseiras para uma turma piloto.
- **Modelo de Uso & Negócio:** Empréstimo geral, plano premium com pulseira inclusa (*Plano HYROX Performance*) ou permissão para pulseiras próprias dos alunos.
- **Higienização:** Protocolo de limpeza das tiras elásticas de braço com álcool 70% ou rodízio de tiras extras entre aulas.
- **Estação de Carga:** Hub/régua USB de 5 a 10 portas na recepção para recarga diária dos sensores.

### B. Hardware & Infraestrutura
- **Pulseiras:** Modelo óptico de braço (recomendado: **Coospo HW807** com BLE 5.0 e ANT+). Etiquetas físicas impermeáveis (`P01`, `P02`, etc.) para identificação rápida.
- **Notebook da Recepção / Box:** Navegador Google Chrome ou Edge atualizado com Bluetooth 5.0 ativo. Posicionamento a no máximo 8–12m do salão de treino para evitar atenuação do sinal pelo corpo dos atletas.
- **Conexão com a TV:** Cabo HDMI longo (Fase 1) ou navegador na TV via nuvem (Fase 2).
- **Rede Wi-Fi:** Opcional na Fase 1 (funciona 100% offline via Bluetooth local); obrigatória com boa cobertura na Fase 2 (Nuvem).

### C. Requisitos Técnicos de Software
- **Contexto HTTPS Obrigatório:** A Web Bluetooth API só opera em conexões criptografadas (`https://`) ou em `localhost`. Para homologação no box, deploy automático via GitHub Pages ou Vercel.
- **Módulo Web Bluetooth (`0x180D`):** Implementar leitura da característica `0x2A37` com parser de BPM de 8/16 bits e rotina transparente de reconexão automática (`gattserverdisconnected`).
- **Vagas Dinâmicas:** Ajustar a interface para permitir adicionar ou remover alunos conforme o número de pulseiras pareadas.

## 7. Status das Fases
- [x] **Fase 1 (MVP Simulador):** Concluído e apresentado à cliente.
- [ ] **Fase 1.5 (Validação com Hardware Real BLE):** Aguardando feedback da cliente e chegada das pulseiras piloto.
- [ ] **Fase 2 (Nuvem / TV Desacoplada):** Backlog pós-validação física.
