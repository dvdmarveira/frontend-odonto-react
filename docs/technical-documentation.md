# Documentação Técnica - OdontoLegal Frontend

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias](#tecnologias)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Fluxos Principais](#fluxos-principais)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [Componentes](#componentes)
8. [Serviços](#serviços)
9. [Configurações](#configurações)
10. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

## Visão Geral

O OdontoLegal é uma aplicação web para gerenciamento de casos odontológicos forenses. O frontend foi desenvolvido em React com uma arquitetura moderna e modular, focando em performance, segurança e experiência do usuário.

### Objetivos do Sistema

- Gerenciamento de casos odontológicos forenses
- Controle de evidências
- Geração e gestão de laudos
- Administração de usuários e permissões
- Rastreamento de atividades

## Arquitetura

O projeto segue uma arquitetura baseada em componentes com separação clara de responsabilidades:

```
frontend-odontolegal-react/
├── src/
│   ├── assets/      # Recursos estáticos
│   ├── components/  # Componentes reutilizáveis
│   ├── contexts/    # Contextos React (estado global)
│   ├── pages/       # Componentes de página
│   ├── routes/      # Configuração de rotas
│   ├── services/    # Serviços e integrações
│   └── utils/       # Utilitários e helpers
```

## Tecnologias

### Core

- React 18
- Vite (bundler)
- React Router DOM (roteamento)
- Axios (requisições HTTP)

### Estilização

- Tailwind CSS 3.4.3
- PostCSS 8.4.14

### UI/UX

- Phosphor Icons (ícones)
- Design System próprio

## Estrutura do Projeto

### Páginas Principais

- `/login` - Autenticação de usuários
- `/dashboard` - Visão geral e estatísticas
- `/cases` - Gerenciamento de casos
- `/evidences` - Gestão de evidências
- `/reports` - Laudos e relatórios
- `/admin/users` - Gerenciamento de usuários (admin)

### Componentes Core

- `Layout.jsx` - Template base para páginas autenticadas
- `ProtectedRoute` - Componente HOC para proteção de rotas

## Fluxos Principais

### Fluxo de Autenticação

1. Usuário acessa a página de login
2. Insere credenciais (email/senha)
3. Sistema valida credenciais via API
4. Em caso de sucesso:
   - Armazena tokens (JWT + refresh)
   - Redireciona para dashboard
5. Em caso de erro:
   - Exibe feedback visual
   - Mantém usuário no login

### Fluxo de Casos

1. Listagem de casos
2. Criação/Edição de caso
3. Anexação de evidências
4. Geração de laudos
5. Rastreamento de alterações

## Autenticação e Autorização

### Gestão de Tokens

- JWT armazenado no localStorage
- Refresh token para renovação automática
- Interceptors Axios para gestão de headers

### Níveis de Acesso

- Admin: Acesso total
- Perito: Gestão de casos e laudos
- Assistente: Visualização limitada

### Proteção de Rotas

Implementada via `ProtectedRoute` com:

- Verificação de autenticação
- Validação de permissões
- Redirecionamento automático

## Componentes

### Layout

- Header com navegação
- Sidebar responsiva
- Container principal
- Footer informativo

### Formulários

- Validação client-side
- Feedback visual de erros
- Componentes de input customizados
- Máscaras e formatação

## Serviços

### API

- Base URL configurável via env
- Interceptors para tokens
- Tratamento centralizado de erros
- Retry automático em falhas

### Integração Backend

- REST API
- Endpoints versionados
- Tratamento de tipos
- Documentação Swagger

## Configurações

### Ambiente

```env
VITE_API_URL=http://localhost:5000
VITE_APP_ENV=development
```

### Build

- Desenvolvimento: `npm run dev`
- Produção: `npm run build`
- Preview: `npm run preview`

## Guia de Desenvolvimento

### Setup Inicial

1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure variáveis de ambiente
4. Execute em dev: `npm run dev`

### Padrões de Código

- ESLint configurado
- Prettier para formatação
- Convenções de commits
- TypeScript para tipos (planejado)

### Boas Práticas

1. Componentização
2. Hooks customizados
3. Memoização quando necessário
4. Tratamento de erros
5. Logging apropriado

### Performance

- Code splitting automático
- Lazy loading de rotas
- Otimização de imagens
- Caching apropriado

### Segurança

- Sanitização de inputs
- Proteção contra XSS
- Validação de tokens
- Renovação segura de sessão

## Próximos Passos e Melhorias

### Curto Prazo

1. Implementar loading states
2. Melhorar feedback de erros
3. Adicionar testes unitários
4. Refinar proteção de rotas

### Médio Prazo

1. Migrar para TypeScript
2. Implementar PWA
3. Adicionar testes E2E
4. Melhorar performance

### Longo Prazo

1. Internacionalização
2. Tema escuro
3. Modo offline
4. Analytics
