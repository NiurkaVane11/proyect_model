import { Button } from './ui/button'

function Navbar() {
  return (
    <nav className="bg-white text-gray-800 fixed w-full top-0 z-50 shadow-md backdrop-blur-sm bg-opacity-95 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold hover:scale-110 transition-transform duration-300 cursor-pointer">
            <span className="text-green-600">INFO</span>
            <span className="text-gray-800">PAN</span>
          </div>
          <span className="text-xs text-gray-600 hidden sm:block">Ecuador</span>
        </div>
        
        {/* Menú de navegación */}
        <div className="hidden md:flex space-x-8">
          <a href="#inicio" className="hover:text-green-600 transition-all duration-300 relative group font-medium">
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#que-es" className="hover:text-green-600 transition-all duration-300 relative group font-medium">
            ¿Qué es?
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#como-funciona" className="hover:text-green-600 transition-all duration-300 relative group font-medium">
            Cómo Funciona
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          
          <a href="#contacto" className="hover:text-green-600 transition-all duration-300 relative group font-medium">
            Contacto
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3">
          
          <Button className="bg-green-600 text-white hover:bg-green-700 hover:scale-105 hover:shadow-xl transition-all duration-300">
            Login 
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;