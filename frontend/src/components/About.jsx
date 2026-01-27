import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ShoppingBag, Store, TrendingUp, Sparkles } from 'lucide-react'

function About() {
  const stats = [
    { icon: ShoppingBag, value: "50K+", label: "Bolsas Mensuales" },
    { icon: Store, value: "500+", label: "Panaderías Aliadas" },
    { icon: TrendingUp, value: "100+", label: "Marcas Anunciantes" },
    { icon: Sparkles, value: "1M+", label: "Impactos Anuales" }
  ];

  return (
    <section id="que-es" className="py-24 bg-white relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado izquierdo - Contenido */}
          <div className="space-y-6">
            <Badge className="bg-green-600 text-white">¿Qué es INFOPAN?</Badge>
            
            <h2 className="text-4xl sm:text-5xl font-black leading-tight text-gray-900">
              Publicidad Ecológica
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                que Llega a Casa
              </span>
            </h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-bold text-green-600">INFOPAN</span> es un innovador sistema 
                de publicidad que utiliza <span className="font-bold">bolsas de papel ecológicas</span> como 
                medio de difusión.
              </p>
              
              <p>
                Distribuimos estas bolsas de forma <span className="font-bold text-green-600">gratuita</span> en 
                más de 500 panaderías aliadas en todo Ecuador. Cada bolsa lleva impresa la publicidad 
                de nuestros anunciantes, llegando directamente a las manos de miles de consumidores cada día.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600 p-6 rounded-lg">
                <p className="text-green-700 text-xl font-bold italic">
                  "Publicidad que cuida el planeta y llega a cada hogar ecuatoriano"
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
             
            </div>
          </div>
          
          {/* Lado derecho - Visual */}
          <div className="space-y-6">
            {/* Imagen principal */}
            <div className="relative rounded-2xl overflow-hidden aspect-square border-2 border-gray-200 hover:border-green-600 transition-all duration-500 shadow-lg group">
              <img 
                src="/fundapan.jpg" 
                alt="Bolsa Ecológica INFOPAN" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/10 group-hover:to-emerald-600/10 transition-all duration-500"></div>
            </div>
            
            {/* Grid de estadísticas */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-600 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-all">
                        <IconComponent className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-green-600 mb-1">{stat.value}</div>
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