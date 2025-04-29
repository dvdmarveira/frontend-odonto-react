# Documentação do Sistema OdontoLegal

## Visão Geral do Sistema

O sistema OdontoLegal é uma plataforma para gerenciamento de casos odontológicos, composta por um frontend React (`frontend-odontolegal-react`) e um backend Node.js (`PlataformaOdontoLegal-main`).

## Estrutura do Projeto

### Frontend (`frontend-odontolegal-react`)

```
frontend-odontolegal-react/
├── src/
│   ├── components/
│   │   └── AuthContext.jsx       # Gerenciamento de autenticação
│   ├── pages/
│   │   └── cases/
│   │       ├── Cases.jsx         # Listagem de casos
│   │       └── AddCase.jsx       # Criação de casos
│   ├── services/
│   │   ├── api/
│   │   │   └── axios.config.js   # Configuração do Axios
│   │   ├── cases/
│   │   │   └── caseService.js    # Serviço de casos
│   │   ├── evidences/
│   │   │   └── evidenceService.js # Serviço de evidências
│   │   └── reports/
│   │       └── reportService.js   # Serviço de relatórios
│   └── routes/
│       └── index.jsx             # Configuração de rotas
```

### Backend (`PlataformaOdontoLegal-main`)

```
PlataformaOdontoLegal-main/
├── controllers/
├── models/
├── routes/
├── middleware/
└── config/
```

## Fluxos Implementados

### 1. Autenticação

#### Frontend

- **AuthContext**: Gerencia o estado de autenticação global
- **Funcionalidades**:
  - Login/Logout
  - Renovação automática de token
  - Proteção de rotas
  - Gerenciamento de permissões

#### Backend

- **JWT**: Utilizado para autenticação
- **Middleware de Autenticação**: Valida tokens em rotas protegidas

### 2. Gerenciamento de Casos

#### Frontend

- **Cases.jsx**:

  - Listagem de casos com paginação
  - Filtros por status e tipo
  - Busca por texto
  - Estatísticas em tempo real
  - Tratamento robusto de erros e estados indefinidos

- **AddCase.jsx**:
  - Formulário de criação de casos
  - Upload de evidências
  - Criação de relatórios
  - Validações de campos

#### Backend

- **Rotas**:
  - GET `/api/cases`: Lista casos
  - POST `/api/cases`: Cria novo caso
  - GET `/api/cases/:id`: Obtém detalhes do caso
  - PUT `/api/cases/:id`: Atualiza caso
  - DELETE `/api/cases/:id`: Remove caso

### 3. Gerenciamento de Evidências

#### Frontend

- **EvidenceService**:
  - Upload de múltiplos arquivos
  - Gerenciamento por categoria
  - Validação de tipos de arquivo
  - Tratamento de progresso de upload

#### Backend

- **Rotas**:
  - POST `/api/cases/:id/evidence`: Upload de evidências
  - GET `/api/cases/:id/evidence`: Lista evidências
  - GET `/api/cases/:id/evidence/category`: Filtra por categoria

### 4. Gerenciamento de Relatórios

#### Frontend

- **ReportService**:
  - Criação de relatórios
  - Download de relatórios
  - Unificação de rotas de laudos e relatórios

#### Backend

- **Rotas Unificadas**:
  - POST `/api/reports`: Cria relatório
  - GET `/api/reports/:id`: Obtém relatório
  - GET `/api/reports/download/:id`: Download do relatório

## Estados e Validações

### Cases.jsx

```javascript
const DEFAULT_STATS = {
  emAndamento: 0,
  arquivados: 0,
  finalizados: 0,
};

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  total: 0,
  pages: 1,
};
```

### Tratamento de Erros

- Validação de dados undefined
- Estados de carregamento
- Feedback visual para usuário
- Tratamento de erros de API

## Integrações

### API

- Axios para requisições HTTP
- Interceptors para token
- Tratamento global de erros
- Timeout configurável

### Upload de Arquivos

- Suporte a múltiplos arquivos
- Progress tracking
- Validação de tipos
- Limite de tamanho

## Melhorias Pendentes

1. **Performance**:

   - Implementar React Query para cache
   - Otimizar carregamento de imagens
   - Implementar lazy loading

2. **UX/UI**:

   - Adicionar preview de documentos
   - Melhorar feedback de upload
   - Implementar dark mode

3. **Segurança**:

   - Implementar rate limiting
   - Melhorar validação de arquivos
   - Adicionar logs de auditoria

4. **Código**:
   - Adicionar testes unitários
   - Implementar Storybook
   - Melhorar documentação de componentes

## Notas de Desenvolvimento

1. **Padrões**:

   - Utilização de services para lógica de negócio
   - Componentes funcionais com hooks
   - Context API para estado global

2. **Boas Práticas**:

   - Error boundaries para tratamento de erros
   - Loading states para feedback
   - Validação robusta de dados

3. **Convenções**:
   - Nomes de arquivos em PascalCase para componentes
   - Nomes de arquivos em camelCase para services
   - Constantes em SNAKE_CASE

## Próximos Passos

1. Implementar testes automatizados
2. Melhorar documentação de API
3. Implementar sistema de cache
4. Adicionar monitoramento de erros
5. Implementar CI/CD

---
