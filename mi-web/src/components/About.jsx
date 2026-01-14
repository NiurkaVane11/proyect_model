import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Award, Users, Clock, TrendingUp } from 'lucide-react'

function About() {
  const stats = [
    { icon: Award, value: "10+", label: "Años de Experiencia" },
    { icon: Users, value: "50K+", label: "Clientes Satisfechos" },
    { icon: Clock, value: "24/7", label: "Atención al Cliente" },
    { icon: TrendingUp, value: "98%", label: "Tasa de Retorno" }
  ];

  return (
    <section id="sobre-nosotros" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado izquierdo - Contenido */}
          <div className="space-y-6">
            <Badge className="bg-yellow-500 text-black">Sobre Nosotros</Badge>
            
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              Más que una Barbería,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
                Una Tradición
              </span>
            </h2>
            
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
              <p>
                Somos una franquicia de barberías con más de <span className="text-yellow-500 font-bold">10 años de experiencia</span> en 
                el arte del cuidado masculino. Nuestro compromiso es ofrecer un servicio de calidad premium en cada visita.
              </p>
              
              <p>
                Contamos con barberos profesionales certificados y utilizamos productos de las mejores marcas internacionales 
                para garantizar resultados excepcionales que superan las expectativas.
              </p>
              
              <p className="text-yellow-500 text-xl font-bold italic border-l-4 border-yellow-500 pl-4">
                "Tu estilo, nuestra pasión. Tu confianza, nuestro compromiso."
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold">
                Conoce Nuestro Equipo
              </Button>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Nuestra Historia
              </Button>
            </div>
          </div>
          
          {/* Lado derecho - Estadísticas y placeholder imagen */}
          <div className="space-y-6">
            {/* Placeholder de imagen */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 aspect-square flex items-center justify-center border-2 border-slate-700 group hover:border-yellow-500 transition-all duration-500">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">💈</div>
                <p className="text-slate-400 text-lg">Imagen de la barbería</p>
                <p className="text-slate-500 text-sm">Ambiente profesional y acogedor</p>
              </div>
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-amber-500/0 group-hover:from-yellow-500/10 group-hover:to-amber-500/10 transition-all duration-500"></div>
            </div>
            
            {/* Grid de estadísticas */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-all">
                        <IconComponent className="w-5 h-5 text-yellow-500" />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-yellow-500 mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
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