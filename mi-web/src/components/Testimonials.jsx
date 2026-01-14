function Testimonials() {
  const testimonials = [
    { name: "Carlos M.", text: "Excelente servicio, los barberos son muy profesionales y el ambiente es increíble.", rating: 5 },
    { name: "Miguel R.", text: "Llevo 2 años viniendo y siempre salgo satisfecho. Totalmente recomendado.", rating: 5 },
    { name: "Javier L.", text: "La mejor barbería de la ciudad, sin duda. Atención de primera.", rating: 5 }
  ];

  return (
    <section id="testimonios" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Lo Que Dicen Nuestros Clientes</h2>
        <p className="text-center text-gray-400 mb-12">Testimonios reales de clientes satisfechos</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer shadow-lg hover:shadow-2xl relative overflow-hidden"
            >
              {/* Borde decorativo animado */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              {/* Comillas decorativas */}
              <div className="text-6xl text-yellow-500 opacity-20 absolute top-2 right-4 group-hover:opacity-40 transition-opacity duration-500">
                "
              </div>
              
              <div className="text-yellow-500 text-2xl mb-4 transform group-hover:scale-110 transition-transform duration-500">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span 
                    key={i} 
                    className="inline-block animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-4 italic group-hover:text-white transition-colors duration-300 relative z-10">
                "{testimonial.text}"
              </p>
              
              <p className="font-bold text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">
                {testimonial.name}
              </p>
              
              {/* Efecto de brillo */}
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-10 transform scale-0 group-hover:scale-150 transition-all duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;