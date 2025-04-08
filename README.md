# OdontoLegal - Frontend React

Este é o frontend do sistema OdontoLegal, uma aplicação para gerenciamento de casos odontológicos forenses. Este projeto foi migrado de HTML estático para React com Vite.

## Tecnologias Utilizadas

- React 18 com Vite
- Tailwind CSS 3.4.3
- PostCSS 8.4.14
- React Router DOM
- Phosphor Icons

## Estrutura do Projeto

```
frontend-odontolegal-react/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── imgs/
│   │   └── styles/
│   │       └── index.css
│   ├── components/
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Cases.jsx
│   │   ├── Evidences.jsx
│   │   ├── Reports.jsx
│   │   ├── AdminUsers.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── postcss.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

## Login

Para testar o sistema, use as seguintes credenciais:

- Email: admin@odontolegal.com
- Senha: admin

## Funcionalidades

- Sistema de autenticação
- Dashboard com estatísticas
- Gerenciamento de casos
- Gerenciamento de evidências
- Relatórios
- Gerenciamento de usuários
