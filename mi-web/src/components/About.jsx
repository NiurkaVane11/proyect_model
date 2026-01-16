import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Leaf, TrendingUp, Users, Lightbulb } from 'lucide-react'

function About() {
  const stats = [
    { icon: TrendingUp, value: "95%", label: "Retorno de Inversión" },
    { icon: Users, value: "500+", label: "Franquiciados Activos" },
    { icon: Leaf, value: "100%", label: "Materiales Ecológicos" },
    { icon: Lightbulb, value: "10K+", label: "Impactos Diarios" }
  ];

  return (
    <section id="que-es" className="py-24 bg-white relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado izquierdo - Contenido */}
          <div className="space-y-6">
            <Badge className="bg-green-600 text-white">¿Qué es INFOPAN?</Badge>
            
            <h2 className="text-4xl sm:text-5xl font-black leading-tight text-gray-900">
              Publicidad Ecológica
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                que Genera Ingresos
              </span>
            </h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-bold text-red-600">INFOPAN</span> es la primera franquicia de publicidad 
                ecológica en <span className="font-bold">bolsas de papel reciclado</span>. Transformamos el medio 
                ambiente tradicional en un canal publicitario efectivo y sostenible.
              </p>
              
              <p>
                Nuestro modelo de negocio permite a emprendedores generar ingresos recurrentes mientras promueven 
                la <span className="font-bold text-green-600">sustentabilidad ambiental</span>. Cada bolsa llega 
                directamente a las manos de consumidores potenciales.
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-600 p-6 rounded-lg">
                <p className="text-red-700 text-xl font-bold italic">
                  "No vendemos bolsas, vendemos impactos publicitarios que generan resultados medibles"
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold">
                Solicitar Información
              </Button>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                Ver Video Explicativo
              </Button>
            </div>
          </div>
          
          {/* Lado derecho - Imagen placeholder y estadísticas */}
          <div className="space-y-6">
            {/* Placeholder de imagen/video */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-100 via-orange-50 to-green-100 aspect-video flex items-center justify-center border-2 border-gray-200 group hover:border-red-600 transition-all duration-500 shadow-lg">
              <div className="text-center space-y-4 p-8">
                <div className="text-7xl">📢</div>
                <p className="text-gray-700 text-lg font-bold">Video Explicativo</p>
                <p className="text-gray-500 text-sm">Conoce cómo funciona INFOPAN</p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  ▶ Ver Video
                </Button>
              </div>
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-orange-600/0 group-hover:from-red-600/10 group-hover:to-orange-600/10 transition-all duration-500"></div>
            </div>
            
            {/* Grid de estadísticas */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-red-600 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-all">
                        <IconComponent className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-red-600 mb-1">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default About;