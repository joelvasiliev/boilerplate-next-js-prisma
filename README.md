# **Projeto**

## **Tecnologias**
- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn**
- **Docker**

## **Sistema**
- **Sistema Operacional**: Ubuntu 24.04
- **Configuração**:
  - 8GB RAM
  - 100GB de armazenamento
  - 2 CPUs
  - KV2M (Hostinger)

## **Data de Início do Projeto**
*Adicionar data aqui*

---

## **Permissões**

O sistema conta com um esquema de permissionamento, com os seguintes níveis:

- **OWNER**:
  - Acesso a todas as funções e recursos da aplicação.
  - Visualiza todas as vendas, mas **não pode realizar vendas**.
  - Pode convidar usuários de todos os níveis de permissão.

- **ADMINISTRATOR**:
  - Acesso a quase todas as funções e recursos, exceto:
    - Editar/remover preços de produtos.
    - Habilitar/desabilitar produtos.
    - Remover usuários.
  - Pode convidar afiliados e membros.

- **AFFILIATE**:
  - Visualiza **somente suas vendas**.
  - Não pode editar preços de produtos ou habilitar/desabilitar produtos.
  - Pode convidar membros.

- **MEMBER**:
  - Possui as mesmas permissões de um afiliado.
  - **Não pode convidar outros usuários**.

---

## **Rotas**
*Adicionar rotas da API aqui*

---

## **Possíveis funcionalidades futuras**

- [ ] Implementar **SSO Google** (botão de login com Google).
- [ ] **Changelog** para registrar atividades no site:
  - Exemplo: "O usuário `<nome>` cancelou a venda `<id>`".
  - Registro de todas as ações realizadas para consulta futura.
- [ ] **API integrada com WhatsApp**:
  - [ ] Enviar mensagem quando acumular X pedidos para aprovação.
  - [ ] Página de webhooks para enviar atualizações em tempo real aos clientes.
  - [ ] Enviar código de recuperação de senha via WhatsApp.
  - [ ] Permitir que usuários consultem vendas diretamente no WhatsApp.
- [ ] **Integração com Email (SMTP)**:
  - [ ] Envio de email para recuperação de senha.
  - [ ] Mensagens de boas-vindas para novos usuários.
  - [ ] Notificações por email ao acumular pedidos para aprovação.
  - [ ] Atualizações de status de entrega em tempo real.
- [ ] Indicar visualmente, na tabela de pedidos, quando faltar configurar preços.
- [ ] Permitir que **admins** redefinam senhas de usuários.
- [ ] Exibir quantidade de estoque na página de produtos.
- [ ] Permitir edição e reenvio de solicitações rejeitadas.
- [ ] Possibilitar edição de informações de pedidos realizados.

---

## **GitHub Repository**
*Adicionar URL aqui*

---

## **VPS**
- **IP**: [46.202.150.78](http://46.202.150.78/)

---

## **Features em progresso ou finalizadas**

### **Em progresso**
- [ ] Apenas o OWNER pode excluir usuários.
- [ ] Afiliados só podem visualizar seus próprios membros.
- [ ] Cada afiliado pode editar sua própria URL.
- [ ] Refatorar o filtro para expandir um popover com opções.
- [ ] Implementar checkout de pagamento (**Digital Manager Guru**).
- [ ] Indicar, na tabela de aprovação, quando um pedido tiver nome ou CPF parecido com outro.

### **Finalizadas**

- [x] Filtro para tags de pagamento na página de vendas
- [x] Tags para pagamento.
- [x] Tela para aprovação de vendas.
- [x] Webhook para atualização em tempo real.
- [x] Rota para vincular vendas a um afiliado.
- [x] Implementação de autenticação com NextAuth (credentials) e configuração do banco de dados.
- [x] Tela de login.
- [x] Seção para criar contas de novos afiliados e administradores.
- [x] Definição do fluxo de pedidos e APIs.
- [x] Criação do schema inicial do banco de dados.
- [x] Seed do banco de dados com estrutura inicial.
- [x] Tabela para listar produtos com informações do banco.
- [x] Atualização periódica da tabela de produtos no client side.
- [x] Modal para criação de novas vendas.
- [x] Tabela no banco para clientes.
- [x] Lista de clientes.
- [x] Filtro por data na dashboard.
- [x] Adicionar cliente manualmente.
- [x] Serviço para atualizar status de entrega de pedidos periodicamente (via API da Boxlink).
- [x] Lógica para buscar informações da API e salvar no banco.
- [x] Dialog para detalhar status de envio de pedidos.
- [x] Estilização do dialog de status de envio.
- [x] Serviço para rodar seed periodicamente.
- [x] Lógica para atualizar status de envio de pedidos ainda não finalizados.
- [x] Adicionar produto manualmente.
- [x] Edição de produto.
- [x] Captura de dados de endereço de envio.
- [x] Renderização de gráficos baseados no status de pedidos.
- [x] Primeiro login redireciona para completar cadastro (nome, CPF, etc.).
- [x] Atualização automática de produtos no banco periodicamente.
- [x] Suporte a múltiplos preços por pedido (quanto mais, menor o preço).
- [x] Estilização das configurações gerais da conta.
- [x] Implementação de venda manual.
- [x] Seed para vincular vendas da API a produtos com preços e checkout URL.
- [x] Correção de bugs em exibição de preços na edição de produtos.
- [x] Gráficos com dados do banco de dados (mapa do Brasil e status de pedidos).
- [x] Restringir exibição de vendas para usuários autenticados (exceto admins).

---