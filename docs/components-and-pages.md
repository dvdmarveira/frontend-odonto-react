# Componentes e Páginas - OdontoLegal

## Estrutura de Páginas

### Páginas Públicas

#### Login (`/src/pages/Login.jsx`)

- Formulário de autenticação
- Validação de campos
- Feedback visual de erros
- Redirecionamento pós-login
- Links para registro e recuperação de senha

#### Registro (`/src/pages/Register.jsx`)

- Formulário de cadastro
- Validação de dados
- Seleção de tipo de usuário
- Feedback de sucesso/erro
- Redirecionamento pós-registro

### Páginas Protegidas

#### Dashboard (`/src/pages/Dashboard.jsx`)

- Visão geral do sistema
- Estatísticas e métricas
- Ações rápidas
- Notificações

#### Casos (`/src/pages/cases/`)

- **Cases.jsx**: Listagem de casos
- **CaseDetail.jsx**: Detalhes do caso
- **AddCase.jsx**: Criação/edição de caso
- Filtros e pesquisa
- Paginação
- Ações em lote

#### Evidências (`/src/pages/evidences/`)

- **Evidences.jsx**: Listagem de evidências
- **EvidenceDetail.jsx**: Visualização detalhada
- **EvidenceForm.jsx**: Formulário de evidência
- Upload de arquivos
- Anotações e marcações
- Histórico de alterações

#### Laudos (`/src/pages/reports/`)

- **Reports.jsx**: Lista de laudos
- **ReportDetail.jsx**: Visualização do laudo
- **ReportForm.jsx**: Criação/edição
- Geração de PDF
- Assinatura digital
- Versionamento

#### Administração (`/src/pages/admin/`)

- **Users.jsx**: Gestão de usuários
- **Settings.jsx**: Configurações
- **Logs.jsx**: Registros do sistema
- Controles administrativos
- Auditoria

## Componentes Reutilizáveis

### Layout (`/src/components/Layout/`)

#### Layout.jsx

```jsx
- Header com navegação
- Sidebar responsiva
- Container principal
- Footer
- Notificações
```

#### Sidebar.jsx

```jsx
- Menu de navegação
- Links contextuais
- Estado de collapse
- Indicador de rota ativa
```

#### Header.jsx

```jsx
- Logo
- Busca global
- Perfil do usuário
- Notificações
- Menu de ações
```

### Formulários (`/src/components/Form/`)

#### Input.jsx

```jsx
- Campo de texto base
- Validação inline
- Feedback de erro
- Estados: focus, error, disabled
```

#### Select.jsx

```jsx
- Seleção única/múltipla
- Busca e filtro
- Opções customizadas
- Loading state
```

#### FileUpload.jsx

```jsx
- Upload de arquivos
- Preview
- Progresso
- Validação de tipo/tamanho
```

### UI (`/src/components/UI/`)

#### Button.jsx

```jsx
- Variantes: primary, secondary, danger
- Estados: loading, disabled
- Tamanhos: sm, md, lg
- Ícones
```

#### Card.jsx

```jsx
- Container base
- Header/Footer opcionais
- Variantes de estilo
- Loading state
```

#### Modal.jsx

```jsx
- Dialog modal
- Animações
- Backdrop
- Fechamento por ESC/click-out
```

#### Table.jsx

```jsx
- Tabela de dados
- Ordenação
- Seleção de linhas
- Paginação
```

## Estilos e Temas

### Design System

#### Cores

```css
--blue-primary: #1E40AF
--blue-secondary: #60A5FA
--red-primary: #DC2626
--red-secondary: #F87171
--gray-primary: #4B5563
```

#### Tipografia

```css
--font-primary: 'Inter', sans-serif
--font-size-base: 16px
--line-height-base: 1.5
```

#### Espaçamento

```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
```

### Responsividade

#### Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Padrões de Implementação

### Componentes

1. **Estrutura Base**

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const Component = ({ prop1, prop2 }) => {
  // Lógica
  return (
    // JSX
  );
};

Component.propTypes = {
  prop1: PropTypes.string.required,
  prop2: PropTypes.number
};

export default Component;
```

2. **Hooks Customizados**

```jsx
const useCustomHook = (params) => {
  // Lógica do hook
  return {
    // Valores e funções
  };
};
```

### Formulários

1. **Validação**

```jsx
const validate = (values) => {
  const errors = {};
  // Lógica de validação
  return errors;
};
```

2. **Submissão**

```jsx
const handleSubmit = async (values) => {
  try {
    // Lógica de submissão
  } catch (error) {
    // Tratamento de erro
  }
};
```

## Boas Práticas

### Performance

1. **Memoização**

```jsx
const MemoizedComponent = React.memo(Component);
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

2. **Code Splitting**

```jsx
const LazyComponent = React.lazy(() => import("./Component"));
```

### Acessibilidade

1. **ARIA Labels**

```jsx
<button aria-label="Fechar modal">X</button>
```

2. **Keyboard Navigation**

```jsx
<div role="button" tabIndex={0} onKeyPress={handleKeyPress}>
```

## Testes

### Componentes

```jsx
describe("Component", () => {
  it("should render correctly", () => {
    // Test implementation
  });
});
```

### Páginas

```jsx
describe("Page", () => {
  it("should handle user interactions", () => {
    // Test implementation
  });
});
```

## Melhorias Futuras

### Componentes

1. **Curto Prazo**

- Refatorar componentes grandes
- Adicionar mais testes
- Melhorar documentação

2. **Médio Prazo**

- Criar biblioteca de componentes
- Implementar Storybook
- Adicionar animações

3. **Longo Prazo**

- Migrar para TypeScript
- Implementar temas
- Criar design system completo
