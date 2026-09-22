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

## 4. Fluxo de Trabalho (Git)
Como você trabalhará neste PC e no seu PC pessoal:
1. O repositório Git já foi inicializado na pasta `C:\Users\John.araujo\Downloads\crossfit-hr-dashboard`.
2. Para sincronizar as máquinas, usaremos um fluxo simples via GitHub (detalhado no chat).

## 5. Proposta de Arquitetura do MVP
- **Tecnologias:** HTML, CSS (Vanilla, design dark mode premium voltado para academia) e JavaScript. Sem backend complexo no momento.

## Próximos Passos (Requer Aprovação)
1. Construir o visual (Dashboard premium na tela cheia).
2. Implementar lógica de simulação para gerar batimentos.
3. Implementar a tela de configuração de vinculação (Aluno x Pulseira).
4. Integrar o Web Bluetooth API real (deixando pronto para o teste físico).
