function Navbar() {
  return (
    <nav className="bg-black text-white fixed w-full top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-yellow-500 hover:scale-110 transition-transform duration-300 cursor-pointer">
          BARBER SHOP
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#inicio" className="hover:text-yellow-500 transition-all duration-300 relative group">
            Inicio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#servicios" className="hover:text-yellow-500 transition-all duration-300 relative group">
            Servicios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        


           <a href="#sobre-nosotros" className="hover:text-yellow-500 transition-all duration-300 relative group">
            Sobre Nosotros
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </a>





          <a href="#galeria" className="hover:text-yellow-500 transition-all duration-300 relative group">
            Galería
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#ubicaciones" className="hover:text-yellow-500 transition-all duration-300 relative group">
            Ubicaciones
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#contacto" className="hover:text-yellow-500 transition-all duration-300 relative group">
            Contacto
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        <button className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 hover:scale-105 hover:shadow-2xl transition-all duration-300">
          Agendar Cita
        </button>
      </div>
    </nav>
  );
}

export default Navbar;