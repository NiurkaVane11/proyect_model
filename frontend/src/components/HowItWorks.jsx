import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Megaphone, Printer, Store, Users, ArrowRight } from 'lucide-react'

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Megaphone,
      title: "Anunciante Contrata",
      description: "Tu empresa contrata un espacio publicitario en nuestras bolsas ecológicas según tu presupuesto y alcance deseado.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      number: "02",
      icon: Printer,
      title: "Diseño e Impresión",
      description: "Diseñamos y producimos las bolsas de papel ecológico con tu publicidad impresa de forma profesional.",
      color: "from-purple-500 to-pink-600"
    },
    {
      number: "03",
      icon: Store,
      title: "Distribución en Panaderías",
      description: "Entregamos gratuitamente las bolsas a más de 500 panaderías aliadas en todo Ecuador.",
      color: "from-green-500 to-emerald-600"
    },
    {
      number: "04",
      icon: Users,
      title: "Impacto Garantizado",
      description: "Miles de consumidores reciben tu mensaje cada día al llevarse el pan a casa. ¡Publicidad que llega!",
      color: "from-orange-500 to-amber-600"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Efectos decorativos */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-green-600 text-white">Proceso Simple</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            ¿Cómo Funciona?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En 4 pasos simples tu publicidad llega a miles de hogares ecuatorianos
          </p>
        </div>

        {/* Timeline de pasos */}
        <div className="relative">
          {/* Línea conectora (oculta en móvil) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-green-200 to-amber-200 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <Card 
                  key={index}
                  className="relative bg-white border-2 border-gray-200 hover:border-green-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group"
                >
                  {/* Número del paso */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      {index + 1}
                    </div>
                  </div>

                  <CardContent className="pt-12 pb-8 px-6 text-center space-y-4">
                    {/* Icono */}
                    <div className="flex justify-center">
                      <div className={`p-4 bg-gradient-to-br ${step.color} bg-opacity-10 rounded-2xl group-hover:scale-110 transition-all duration-500`}>
                        <IconComponent className="w-10 h-10 text-green-600" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Contenido */}
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </CardContent>

                  {/* Flecha conectora */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <ArrowRight className="w-8 h-8 text-green-400" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
}

export default HowItWorks;