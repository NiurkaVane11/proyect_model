function Locations() {
  const locations = [
    { name: "Sucursal Centro", address: "Calle Principal #123", phone: "(555) 123-4567" },
    { name: "Sucursal Norte", address: "Av. Norte #456", phone: "(555) 234-5678" },
    { name: "Sucursal Sur", address: "Blvd. Sur #789", phone: "(555) 345-6789" }
  ];

  return (
    <section id="ubicaciones" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Nuestras Ubicaciones</h2>
        <p className="text-center text-gray-600 mb-12">Encuéntranos en múltiples puntos de la ciudad</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((location, index) => (
            <div 
              key={index} 
              className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group cursor-pointer relative overflow-hidden"
            >
              {/* Efecto de brillo que pasa */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-30 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              
              <h3 className="text-2xl font-bold mb-4 text-yellow-500 group-hover:text-yellow-600 transition-colors duration-300">
                {location.name}
              </h3>
              <p className="text-gray-700 mb-2 flex items-center group-hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl mr-2">📍</span> {location.address}
              </p>
              <p className="text-gray-700 mb-4 flex items-center group-hover:translate-x-2 transition-transform duration-300 delay-75">
                <span className="text-2xl mr-2">📞</span> {location.phone}
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition-all duration-300 w-full transform group-hover:scale-105 font-bold shadow-md hover:shadow-xl">
                Ver en Mapa
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Locations;