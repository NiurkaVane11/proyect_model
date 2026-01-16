import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Package, Rocket, Crown, ArrowRight, Check } from 'lucide-react'

function Services() {
  const plans = [
    { 
      name: "Plan Básico", 
      price: "$9,500", 
      desc: "Perfecto para emprendedores que inician", 
      icon: Package,
      popular: false,
      features: [
        "500 bolsas mensuales",
        "1 ruta comercial asignada",
        "Capacitación inicial completa",
        "Soporte técnico básico",
        "Material promocional"
      ]
    },
    { 
      name: "Plan Profesional", 
      price: "$15,000", 
      desc: "Para quienes buscan mayor alcance publicitario", 
      icon: Rocket,
      popular: true,
      features: [
        "1,500 bolsas mensuales",
        "3 rutas comerciales",
        "Capacitación avanzada",
        "Soporte técnico prioritario",
        "CRM para gestión de clientes",
        "Diseño gráfico incluido"
      ]
    },
    { 
      name: "Plan Premium", 
      price: "$25,000", 
      desc: "Máximo impacto y rentabilidad garantizada", 
      icon: Crown,
      popular: false,
      features: [
        "3,000+ bolsas mensuales",
        "5+ rutas comerciales",
        "Equipo de diseño dedicado",
        "Soporte 24/7 VIP",
        "Software de gestión completo",
        "Marketing digital incluido",
        "Oficina virtual"
      ]
    }
  ];

  return (
    <section id="planes" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header de sección */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-red-600 text-white">Planes de Franquicia</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Elige Tu Plan Ideal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inversión accesible con retorno garantizado. Comienza tu negocio rentable hoy.
          </p>
        </div>
        
        {/* Grid de planes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group ${
                  plan.popular 
                    ? 'border-red-600 border-2 shadow-xl scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {/* Badge de "Más Popular" */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center py-2 text-sm font-bold">
                    ⭐ MÁS POPULAR
                  </div>
                )}
                
                {/* Barra superior con gradiente */}
                <div className={`absolute ${plan.popular ? 'top-10' : 'top-0'} left-0 right-0 h-1 bg-gradient-to-r ${
                  plan.popular 
                    ? 'from-red-500 to-orange-500' 
                    : 'from-gray-300 to-gray-400'
                }`}></div>
                
                <CardHeader className={plan.popular ? 'pt-16' : 'pt-8'}>
                  {/* Icono */}
                  <div className="mb-4 flex justify-center">
                    <div className={`p-4 bg-gradient-to-br ${
                      plan.popular 
                        ? 'from-red-500 to-orange-500' 
                        : 'from-gray-400 to-gray-500'
                    } rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-center text-2xl">
                    {plan.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center space-y-6">
                  {/* Precio */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className={`text-5xl font-black ${
                        plan.popular 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600' 
                          : 'text-gray-900'
                      }`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">Inversión única</p>
                  </div>
                  
                  {/* Descripción */}
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {plan.desc}
                  </CardDescription>
                  
                  {/* Características */}
                  <div className="text-left space-y-3 pt-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-red-600' : 'text-green-600'
                        }`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-center pb-6">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
                    } transition-all duration-300`}
                  >
                    Comenzar Ahora
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
                
                {/* Efecto de brillo al hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
              </Card>
            );
          })}
        </div>
        
        {/* CTA adicional */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-gray-600">¿Tienes dudas sobre cuál plan elegir?</p>
          <Button size="lg" variant="outline" className="border-2">
            Hablar con un Asesor
          </Button>
        </div>
        
      </div>
    </section>
  );
}

export default Services;