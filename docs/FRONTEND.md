# Documentação Frontend - Peridental

## Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Scripts Disponíveis](#scripts-disponíveis)
6. [Arquitetura e Padrões](#arquitetura-e-padrões)
7. [Guia de Contribuição](#guia-de-contribuição)

## Visão Geral

O frontend do OdontoLegal é uma aplicação web moderna desenvolvida em React, utilizando as melhores práticas e tecnologias atuais do mercado. A aplicação foi construída com foco em performance, escalabilidade e experiência do usuário.

## Tecnologias Utilizadas

- **React 18**: Framework principal para construção da interface
- **Vite**: Build tool e bundler
- **TailwindCSS**: Framework CSS para estilização
- **React Query**: Gerenciamento de estado e cache para dados do servidor
- **Zustand**: Gerenciamento de estado global
- **React Router DOM**: Roteamento da aplicação
- **Formik + Yup**: Gerenciamento e validação de formulários
- **Axios**: Cliente HTTP para comunicação com a API
- **React Hot Toast**: Notificações
- **React PDF**: Manipulação de documentos PDF
- **Testing Library**: Framework de testes

## Estrutura do Projeto

```
src/
├── assets/         # Recursos estáticos (imagens, ícones, etc)
├── components/     # Componentes reutilizáveis
├── contexts/      # Contextos do React
├── pages/         # Componentes de página
├── routes/        # Configuração de rotas
├── services/      # Serviços e integrações com API
├── utils/         # Funções utilitárias
├── App.jsx        # Componente principal
└── main.jsx       # Ponto de entrada da aplicação
```

## Configuração do Ambiente

### Pré-requisitos

- Node.js (versão LTS recomendada)
- npm ou yarn

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/dvdmarveira/frontend-odonto-react.git
cd frontend-odontolegal-react
```

2. Instale as dependências

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente

- Crie um arquivo `.env` na raiz do projeto
- Copie o conteúdo de `.env.example` e ajuste conforme necessário

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes

## Arquitetura e Padrões

### Gerenciamento de Estado

- **Zustand**: Utilizado para estado global da aplicação
- **React Query**: Gerenciamento de estado do servidor e cache

### Componentes

- Utilizamos uma arquitetura baseada em componentes
- Componentes são organizados por funcionalidade
- Seguimos o princípio de componentes pequenos e reutilizáveis

### Estilização

- TailwindCSS para estilização
- Classes utilitárias para maior flexibilidade
- Componentes estilizados de forma consistente

### Boas Práticas

- Código limpo e bem documentado
- Componentes funcionais e hooks
- Testes unitários para componentes críticos
- ESLint para padronização de código

### Commits

Seguimos o padrão Conventional Commits:

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alteração em documentação
- `style`: Alterações que não afetam o código
- `refactor`: Refatoração de código
- `test`: Adição ou modificação de testes
- `chore`: Alterações em arquivos de configuração
