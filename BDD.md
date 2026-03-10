# BDD - FlashBid (Sistema de Leilão Relâmpago)

Este documento descreve as funcionalidades do sistema FlashBid utilizando a metodologia BDD (Behavior-Driven Development).

---

## 1. Cadastro e Perfil de Usuário
**Como** um visitante do site  
**Eu quero** criar uma conta no FlashBid  
**Para que** eu possa cadastrar meus produtos para leilão ou dar lances em outros itens.

### Cenário: Cadastro com sucesso
- **Dado** que estou na página de cadastro
- **Quando** preencho o formulário com nome, e-mail válido e senha
- **E** clico em "Criar Conta"
- **Então** recebo um e-mail de confirmação
- **E** sou redirecionado para o meu painel (Dashboard).

---

## 2. Cadastro de Produtos para Leilão
**Como** um vendedor  
**Eu quero** cadastrar um produto e definir as regras do leilão  
**Para que** eu possa vendê-lo pelo melhor preço possível.

### Cenário: Criar um leilão válido
- **Dado** que estou autenticado no sistema
- **Quando** preencho as informações do produto (nome, descrição, imagem)
- **E** defino um valor inicial (ex: R$ 50,00)
- **E** defino uma data e hora para o início do leilão
- **E** defino a duração do leilão
- **Então** o leilão é criado com o status "Aguardando Início".

---

## 3. Dinâmica de Lances (Anti-Sniper)
**Como** um licitante (comprador)  
**Eu quero** dar um lance em um produto ativo  
**Para que** eu possa tentar arrematar o item, garantindo que o tempo seja justo para todos.

### Cenário: Dar um lance válido
- **Dado** que um leilão está com status "Ativo"
- **E** o lance atual é de R$ 100,00
- **Quando** eu dou um lance de R$ 110,00
- **Então** o sistema atualiza o "Lance mais alto" para R$ 110,00
- **E** o meu usuário passa a ser o detentor do lance vencedor atual.

### Cenário: Incremento de tempo nos segundos finais (Anti-Sniper)
- **Dado** que faltam apenas 10 segundos para o leilão terminar
- **Quando** um novo lance válido é registrado
- **Então** o sistema adiciona 30 segundos extras ao tempo restante do leilão
- **E** todos os participantes são notificados do novo tempo.

---

## 4. Finalização e Pagamento
**Como** o vencedor de um leilão  
**Eu quero** um prazo para confirmar meu pagamento  
**Para que** eu possa garantir a posse do produto que arrematei.

### Cenário: Vencer o leilão e aguardar pagamento
- **Dado** que o tempo do leilão expirou
- **Quando** eu sou o detentor do lance mais alto
- **Então** o status do leilão muda para "Aguardando Pagamento"
- **E** eu recebo uma notificação com o link para pagamento
- **E** um cronômetro de 24 horas inicia para que eu confirme a transação.

### Cenário: Falha na confirmação de pagamento
- **Dado** que venci um leilão há 24 horas
- **Quando** eu não confirmo o pagamento dentro do prazo
- **Então** o leilão é cancelado ou o sistema notifica o segundo maior lance (regra a definir).

---

## 5. Visualização do Leilão
**Como** qualquer usuário  
**Eu quero** ver o estado atual de um leilão em tempo real  
**Para que** eu possa decidir se quero dar um lance.

### Cenário: Acompanhamento em tempo real
- **Dado** que estou visualizando a página de um leilão ativo
- **Então** devo ver o valor atual do lance mais alto
- **E** o nome (ou apelido) do licitante atual
- **E** a contagem regressiva para o término do leilão.

---

## Sugestões de Melhorias (Backlog)
- [ ] **Notificações Push/E-mail:** Avisar quando o usuário for superado por um novo lance.
- [ ] **Taxa de Incremento Mínimo:** Definir que cada novo lance deve ser X% maior que o anterior.
- [ ] **Histórico de Lances:** Lista visível de todos os lances dados no item.
- [ ] **Sistema de Reputação:** Avaliar vendedores e compradores após a conclusão da venda.
