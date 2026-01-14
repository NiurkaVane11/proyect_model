function Footer() {
  return (
    <footer id="contacto" className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-yellow-500 mb-4 hover:text-yellow-400 transition-colors duration-300">
              BARBER SHOP
            </h3>
            <p className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
              Tu estilo, nuestra pasión
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4 hover:text-yellow-500 transition-colors duration-300">
              Horarios
            </h4>
            <p className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 mb-1">
              Lunes a Viernes: 9:00 AM - 8:00 PM
            </p>
            <p className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 mb-1">
              Sábados: 9:00 AM - 6:00 PM
            </p>
            <p className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300">
              Domingos: 10:00 AM - 4:00 PM
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold mb-4 hover:text-yellow-500 transition-colors duration-300">
              Síguenos
            </h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-500 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
              >
                <span className="text-2xl">📘</span> Facebook
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-500 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
              >
                <span className="text-2xl">📷</span> Instagram
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-yellow-500 transition-all duration-300 transform hover:scale-125 hover:-translate-y-1"
              >
                <span className="text-2xl">🐦</span> Twitter
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 hover:text-yellow-500 transition-colors duration-300">
            &copy; 2026 Barber Shop Franchise. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;