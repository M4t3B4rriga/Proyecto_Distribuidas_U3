const MainLayout = ({ children }) => {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <header className="bg-blue-600 text-white py-4 text-center text-xl font-semibold">
          Sistema de Gestión de Inventario
        </header>
        <main className="flex-grow container mx-auto p-6">{children}</main>
        <footer className="bg-gray-800 text-white text-center py-3 mt-6">
          &copy; 2025 Todos los derechos reservados.
        </footer>
      </div>
    );
  };
  
  export default MainLayout;
  