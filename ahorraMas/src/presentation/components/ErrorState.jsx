import React from 'react';

const ErrorState = ({ 
  title = "Error de conexión", 
  description = "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
  onRetry = null,
  error = null
}) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto h-12 w-12 text-red-400 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>
      {error && (
        <p className="text-xs text-red-600 mb-4 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

export default ErrorState;
