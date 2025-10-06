import React from 'react';

const EmptyState = ({ 
  title = "No hay datos disponibles", 
  description = "Los datos se mostrarán aquí cuando estén disponibles.",
  icon = null,
  action = null 
}) => {
  return (
    <div className="text-center py-8">
      {icon && (
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
