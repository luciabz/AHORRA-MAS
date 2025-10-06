# Integración de API - Documentación

## Descripción

Se ha implementado una integración completa de la API con los componentes de la aplicación AhorraMas siguiendo los principios de Clean Architecture y utilizando hooks personalizados de React.

## Estructura de la Integración

### 1. Hooks Personalizados (`src/presentation/hooks/`)

#### `useAuth.js`
- Maneja la autenticación de usuarios (login, register, logout)
- Gestiona el token JWT y datos del usuario en localStorage
- Proporciona verificación de autenticación

#### `useTransactions.js`
- CRUD completo de transacciones
- Filtrado por tipo, categoría y mes
- Cálculo de totales automático
- Gestión de estados de carga y errores

#### `useCategories.js`
- CRUD completo de categorías
- Filtrado por tipo (income/expense)
- Búsqueda por nombre

#### `useGoals.js`
- CRUD completo de metas de ahorro
- Cálculo automático de progreso
- Gestión de metas activas, completadas y vencidas
- Funcionalidad para agregar dinero a las metas

#### `useScheduledTransactions.js`
- CRUD completo de transacciones programadas
- Filtrado por frecuencia
- Obtención de próximas transacciones

### 2. Contexto de Autenticación (`src/presentation/contexts/`)

#### `AuthContext.jsx`
- Contexto global para el estado de autenticación
- Inicialización automática al cargar la aplicación
- Disponible en toda la aplicación

### 3. Configuración de API (`src/infrastructure/api/`)

#### `axiosInstance.js`
- Instancia configurada de Axios
- Interceptor automático para agregar tokens de autorización
- Configuración base para todas las peticiones

### 4. Repositorios (`src/data/`)
- Implementación de las llamadas a la API
- Separación clara entre lógica de negocio y acceso a datos
- Manejo consistente de respuestas y errores

## Uso en Componentes

### Ejemplo básico con autenticación:
```jsx
import { useAuthContext } from '../contexts';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuthContext();
  
  if (!isAuthenticated()) {
    return <div>No autenticado</div>;
  }
  
  return <div>Bienvenido {user?.name}</div>;
}
```

### Ejemplo con transacciones:
```jsx
import { useTransactions } from '../hooks';

function TransactionList() {
  const { 
    transactions, 
    loading, 
    error, 
    addTransaction, 
    removeTransaction 
  } = useTransactions();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>
          {transaction.description}: {transaction.amount}
          <button onClick={() => removeTransaction(transaction.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Características Implementadas

### ✅ Autenticación
- Login y registro de usuarios
- Manejo automático de tokens JWT
- Contexto global de autenticación
- Rutas protegidas con PrivateRoute

### ✅ Transacciones
- Crear, leer, actualizar y eliminar transacciones
- Filtrado por mes, tipo y categoría
- Cálculos automáticos de totales
- Integración completa en Dashboard y TransactionManager

### ✅ Categorías
- Gestión completa de categorías
- Filtrado por tipo (ingresos/gastos)
- Integración en formularios de transacciones

### ✅ Metas de Ahorro
- CRUD completo de metas
- Cálculo automático de progreso
- Gestión de fechas límite
- Funcionalidad para agregar progreso

### ✅ Transacciones Programadas
- Gestión de transacciones recurrentes
- Filtrado por frecuencia
- Próximas transacciones

### ✅ Manejo de Errores
- Interceptor global para errores 401
- Logout automático en caso de token inválido
- Manejo consistente de errores en todos los hooks

### ✅ Estado de Carga
- Indicadores de carga en todos los hooks
- Estados de loading centralizados
- UX mejorada con feedback visual

## Configuración de Ambiente

Asegúrate de tener configuradas las siguientes variables de entorno:

```
VITE_URL_API=http://localhost:9001
```

## Componentes Actualizados

Los siguientes componentes han sido actualizados para usar la integración de API:

1. **Dashboard.jsx** - Integración completa con hooks de transacciones, categorías y metas
2. **TransactionManager.jsx** - CRUD completo usando hooks
3. **GoalsManager.jsx** - Gestión de metas con API
4. **LoginForm.jsx** - Autenticación usando contexto
5. **PrivateRoute.jsx** - Protección de rutas con contexto de auth

## Configuración de la API

Para que la aplicación funcione correctamente, necesitas:

1. **API Backend ejecutándose** en `http://localhost:9001` (o la URL configurada en `VITE_URL_API`)
2. **Token JWT válido** para autenticación
3. **Datos en la base de datos** para mostrar contenido

### Variables de Entorno
```
VITE_URL_API=http://localhost:9001
```

### Estado sin API
Si la API no está disponible:
- Los hooks mostrarán estados de error apropiados
- Los componentes mostrarán mensajes de "no hay datos"
- La autenticación fallará y redirigirá al login

## Próximos Pasos

Para continuar mejorando la integración:

1. Implementar paginación en listas grandes
2. Agregar cache local para mejorar performance
3. Implementar sincronización offline
4. Agregar más validaciones del lado del cliente
5. Implementar notificaciones push para transacciones programadas
6. Agregar manejo de reconexión automática

## Estructura de Archivos

```
src/
├── presentation/
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTransactions.js
│   │   ├── useCategories.js
│   │   ├── useGoals.js
│   │   ├── useScheduledTransactions.js
│   │   ├── useApiErrorHandler.js
│   │   └── index.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── index.js
│   ├── components/
│   │   ├── ApiConfig.jsx
│   │   └── ...
│   └── pages/
│       └── ...
├── data/
│   ├── authRepository.js
│   ├── transactionRepository.js
│   ├── categoryRepository.js
│   ├── goalsRepository.js
│   └── scheduleRepository.js
├── infrastructure/
│   └── api/
│       └── axiosInstance.js
└── routes/
    ├── AppRoutes.jsx
    └── PrivateRoute.jsx
```

La integración está completa y lista para ser utilizada. Todos los componentes principales han sido actualizados para usar los hooks personalizados y el contexto de autenticación.
