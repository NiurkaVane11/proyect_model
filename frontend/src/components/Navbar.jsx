function Navbar() {
  return (
    <nav className="bg-white text-gray-800 fixed w-full top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95 border-b-2 border-red-500">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-red-600 hover:scale-110 transition-transform duration-300 cursor-pointer">
            <span className="bg-red-600 text-white px-2 py-1 rounded">info</span>
            <span className="text-red-600">pan</span>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">Publicidad Ecológica</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#inicio" className="hover:text-red-600 transition-all duration-300 relative group font-medium">
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#que-es" className="hover:text-red-600 transition-all duration-300 relative group font-medium">
            ¿Qué es?
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#como-funciona" className="hover:text-red-600 transition-all duration-300 relative group font-medium">
            Cómo Funciona
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#beneficios" className="hover:text-red-600 transition-all duration-300 relative group font-medium">
            Beneficios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#galeria" className="hover:text-red-600 transition-all duration-300 relative group font-medium">
            Galería
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#contacto" className="hover:text-red-600 transition-all duration-300 relative group font-medium">
            Contacto
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 hover:scale-105 hover:shadow-xl transition-all duration-300">
          Ser Franquiciado
        </button>
      </div>
    </nav>
  );
}

export default Navbar;