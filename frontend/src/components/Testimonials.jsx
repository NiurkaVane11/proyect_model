import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Star, Quote, TrendingUp } from 'lucide-react'

function Testimonials() {
  const testimonials = [
    { 
      name: "Carlos Mendoza", 
      location: "Ciudad de México",
      plan: "Plan Profesional",
      text: "En solo 3 meses recuperé mi inversión. Ahora genero ingresos recurrentes de más de $30,000 mensuales. INFOPAN cambió mi vida.", 
      rating: 5,
      income: "$30K/mes",
      avatar: "👨‍💼"
    },
    { 
      name: "Ana García", 
      location: "Guadalajara",
      plan: "Plan Premium",
      text: "Lo mejor es la flexibilidad de horarios. Manejo mi franquicia mientras cuido a mis hijos. El soporte del equipo es excepcional.", 
      rating: 5,
      income: "$45K/mes",
      avatar: "👩‍💼"
    },
    { 
      name: "Roberto Silva", 
      location: "Monterrey",
      plan: "Plan Básico",
      text: "Empecé con el plan básico como ingreso extra. Ahora es mi negocio principal. La inversión es muy accesible y el retorno rápido.", 
      rating: 5,
      income: "$18K/mes",
      avatar: "👨‍💻"
    },
    { 
      name: "María López", 
      location: "Puebla",
      plan: "Plan Profesional",
      text: "Como emprendedora buscaba algo rentable y sustentable. INFOPAN cumplió todas mis expectativas. Los clientes renuevan mes con mes.", 
      rating: 5,
      income: "$28K/mes",
      avatar: "👩‍🦰"
    }
  ];

  return (
    <section id="testimonios" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Efectos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-green-600 text-white">Historias de Éxito</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Lo Que Dicen Nuestros
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              Franquiciados
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Historias reales de emprendedores que transformaron su futuro con INFOPAN
          </p>
        </div>
        
        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="relative bg-white border-2 border-gray-200 hover:border-red-600 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
            >
              {/* Icono de comillas decorativo */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-red-600" />
              </div>
              
              <CardContent className="p-6 space-y-4">
                {/* Avatar y nombre */}
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-bold text-lg text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                
                {/* Badge del plan */}
                <Badge variant="outline" className="border-red-200 text-red-600">
                  {testimonial.plan}
                </Badge>
                
                {/* Estrellas */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                
                {/* Testimonio */}
                <p className="text-gray-700 leading-relaxed text-sm italic">
                  "{testimonial.text}"
                </p>
                
                {/* Ingresos destacados */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ingresos:</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-xl font-black text-green-600">{testimonial.income}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {/* Barra inferior con gradiente */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </Card>
          ))}
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-3xl sm:text-4xl font-black">
              Tú Puedes Ser el Siguiente
            </h3>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Únete a cientos de emprendedores exitosos que ya están generando ingresos recurrentes con INFOPAN
            </p>
            
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-4xl font-black mb-2">500+</div>
                <div className="text-red-100 text-sm">Franquiciados Activos</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-4xl font-black mb-2">95%</div>
                <div className="text-red-100 text-sm">Tasa de Satisfacción</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-4xl font-black mb-2">3-6</div>
                <div className="text-red-100 text-sm">Meses para ROI</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Solicitar Información Ahora
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105">
                Hablar con un Franquiciado
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Testimonials;