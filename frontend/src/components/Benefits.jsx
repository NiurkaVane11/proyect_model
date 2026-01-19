import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { DollarSign, Clock, TrendingUp, Shield, Users, Leaf, Headphones, Award } from 'lucide-react'

function Benefits() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Inversión Accesible",
      description: "Desde $9,500 pesos. Una de las franquicias más económicas del mercado con alto retorno.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "Ingresos Recurrentes",
      description: "Modelo de suscripción con clientes que renuevan mensualmente sus campañas publicitarias.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Clock,
      title: "Tiempo Flexible",
      description: "Maneja tu propio horario. Ideal como negocio principal o complementario a tu empleo actual.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Shield,
      title: "Zona Protegida",
      description: "Territorios exclusivos asignados. No competirás con otros franquiciados en tu área.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Users,
      title: "Red de Apoyo",
      description: "Comunidad de 500+ franquiciados compartiendo estrategias y mejores prácticas.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Leaf,
      title: "Impacto Ambiental",
      description: "Promueves el uso de materiales 100% reciclables y biodegradables en cada campaña.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: Headphones,
      title: "Soporte Continuo",
      description: "Equipo dedicado de soporte técnico, ventas y marketing disponible cuando lo necesites.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: Award,
      title: "Marca Reconocida",
      description: "INFOPAN es líder en publicidad ecológica con presencia en todo el país.",
      color: "from-red-500 to-pink-600"
    }
  ];

  return (
    <section id="beneficios" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Efectos decorativos */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-green-600 text-white">¿Por qué INFOPAN?</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Beneficios de Ser
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              Franquiciado
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Únete a un modelo de negocio probado con ventajas únicas en el mercado
          </p>
        </div>

        {/* Grid de beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card 
                key={index}
                className="relative border-2 border-gray-200 hover:border-red-600 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden"
              >
                {/* Gradiente de fondo que aparece al hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <CardHeader>
                  {/* Icono con gradiente */}
                  <div className="mb-4 flex justify-center">
                    <div className={`p-4 bg-gradient-to-br ${benefit.color} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <CardTitle className="text-center text-xl group-hover:text-red-600 transition-colors duration-300">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                </CardContent>

                {/* Barra inferior decorativa */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </Card>
            );
          })}
        </div>

        {/* Sección de testimonial destacado */}
        <div className="mt-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-white relative overflow-hidden">
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-3xl sm:text-4xl font-black">
              ¿Listo para Cambiar tu Futuro?
            </h3>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Más de 500 emprendedores ya están generando ingresos con INFOPAN. 
              Es tu turno de formar parte de esta red exitosa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="bg-white text-red-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                Agendar Llamada Informativa
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105">
                Descargar Información
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Benefits;