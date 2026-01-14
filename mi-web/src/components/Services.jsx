import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Scissors, Sparkles, Star, Droplets, ArrowRight } from 'lucide-react'

function Services() {
  const services = [
    { 
      name: "Corte de Cabello", 
      price: "$15", 
      desc: "Corte clásico o moderno personalizado según tu estilo", 
      icon: Scissors,
      popular: false
    },
    { 
      name: "Arreglo de Barba", 
      price: "$10", 
      desc: "Perfilado y recorte profesional con navaja caliente", 
      icon: Sparkles,
      popular: false
    },
    { 
      name: "Combo Completo", 
      price: "$20", 
      desc: "Corte + Barba + Tratamiento capilar premium", 
      icon: Star,
      popular: true
    },
    { 
      name: "Tratamiento Capilar", 
      price: "$12", 
      desc: "Hidratación profunda y cuidado del cuero cabelludo", 
      icon: Droplets,
      popular: false
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header de sección */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-yellow-500 text-black mb-4">Nuestros Servicios</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
            Servicios Premium
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experiencia profesional con productos de primera calidad
          </p>
        </div>
        
        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-slate-200 overflow-hidden group"
              >
                {/* Badge de "Más Popular" */}
                {service.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-black">Más Popular</Badge>
                  </div>
                )}
                
                {/* Barra superior con gradiente */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
                
                <CardHeader>
                  {/* Icono */}
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-black" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-center text-2xl group-hover:text-yellow-600 transition-colors">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-4">
                  {/* Precio */}
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600">
                      {service.price}
                    </span>
                    <span className="text-slate-500 text-sm">/ sesión</span>
                  </div>
                  
                  {/* Descripción */}
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {service.desc}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="flex justify-center pb-6">
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all duration-300"
                  >
                    Reservar
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
                
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </Card>
            );
          })}
        </div>
        
        {/* CTA adicional */}
        <div className="text-center mt-16">
          <p className="text-slate-600 mb-4">¿No encuentras lo que buscas?</p>
          <Button size="lg" variant="outline" className="border-2">
            Ver Todos los Servicios
          </Button>
        </div>
      </div>
    </section>
  );
}

export default Services;