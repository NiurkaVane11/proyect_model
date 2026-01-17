import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { UserPlus, BookOpen, Rocket, TrendingUp, ArrowRight } from 'lucide-react'

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Registro y Capacitación",
      description: "Regístrate como franquiciado y recibe capacitación completa sobre el modelo de negocio, ventas y operación.",
      duration: "1-2 semanas"
    },
    {
      number: "02",
      icon: BookOpen,
      title: "Asignación de Zona",
      description: "Te asignamos rutas comerciales estratégicas con alto tráfico de negocios potenciales en tu ciudad.",
      duration: "Inmediato"
    },
    {
      number: "03",
      icon: Rocket,
      title: "Vende Espacios Publicitarios",
      description: "Ofrece espacios publicitarios en bolsas ecológicas a negocios locales. Nosotros nos encargamos de la producción.",
      duration: "Recurrente"
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Distribución y Ganancias",
      description: "Las bolsas se distribuyen en comercios aliados. Tú generas ingresos recurrentes por cada campaña activa.",
      duration: "Mensual"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Efectos decorativos */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-red-600 text-white">Proceso Simple</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            ¿Cómo Funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En 4 pasos simples comienzas a generar ingresos con tu franquicia INFOPAN
          </p>
        </div>

        {/* Timeline de pasos */}
        <div className="relative">
          {/* Línea conectora (oculta en móvil) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-orange-200 to-green-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card 
                  key={index}
                  className="relative bg-white border-2 border-gray-200 hover:border-red-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  {/* Número del paso */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-500">
                      {index + 1}
                    </div>
                  </div>

                  <CardContent className="pt-12 pb-8 px-6 text-center space-y-4">
                    {/* Icono */}
                    <div className="flex justify-center">
                      <div className="p-4 bg-red-50 rounded-2xl group-hover:bg-red-100 transition-all duration-500">
                        <IconComponent className="w-10 h-10 text-red-600" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Contenido */}
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-red-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>

                    {/* Duración */}
                    <div className="pt-2">
                      <Badge variant="outline" className="border-red-200 text-red-600">
                        ⏱️ {step.duration}
                      </Badge>
                    </div>
                  </CardContent>

                  {/* Flecha conectora (solo en desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-8 h-8 text-red-400" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-20 text-center bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-12 border-2 border-red-200">
          <h3 className="text-3xl font-black text-gray-900 mb-4">
            ¿Listo para Comenzar?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a cientos de emprendedores que ya están generando ingresos con INFOPAN
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Solicitar Información Ahora
            </button>
            <button className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-300">
              Descargar Brochure
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;