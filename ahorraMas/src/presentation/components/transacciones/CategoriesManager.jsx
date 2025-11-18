
export default function CategoriesManager({ 
  categories, 
  showCategoryForm,
  setShowCategoryForm,
  categoryForm,
  setCategoryForm,
  editingItem,
  setEditingItem,
  onSubmit,
  onEdit,
  onDelete 
}) {
  return (
    <>
      <div className="mb-6">
        {!showCategoryForm ? (
          <button
            onClick={() => setShowCategoryForm(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            + Agregar Categoría
          </button>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem ? 'Editar Categoría' : 'Nueva Categoría'}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
                >
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingItem(null);
                    setCategoryForm({ name: '', description: '', type: 'income' });
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div key={category.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-gray-600 mb-2">{category.description}</p>
              <div className="flex justify-between items-center">
                
                <div>
                  <button
                    onClick={() => onEdit(category)}
                    className="text-blue-600 hover:text-blue-800 mr-3 inline-flex items-center"
                    title="Editar categoría"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center"
                    title="Eliminar categoría"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">No hay categorías</div>
          )}
        </div>
      </div>
    </>
  );
}
