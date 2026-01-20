import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Store, TrendingUp, Leaf, ArrowDown } from 'lucide-react'

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Efectos de luz */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-8">
          {/* Badge superior */}
          <div className="flex justify-center animate-fade-in">
            <Badge className="bg-green-600 text-white hover:bg-green-700 text-sm px-4 py-2 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Publicidad 100% Ecológica en Ecuador
            </Badge>
          </div>
          
          {/* Título principal */}
          <div className="space-y-4 animate-slide-down">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
              Tu Marca en
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500">
                Miles de Manos
              </span>
            </h1>
          </div>
          
          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto animate-slide-up">
            Publicidad efectiva en bolsas ecológicas de papel, distribuidas en 
            <span className="font-bold text-green-600"> más de 500 panaderías</span> de Ecuador
          </p>
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
           
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-300 text-gray-800 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              ¿Cómo Funciona?
            </Button>
          </div>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-center p-6 rounded-xl bg-white backdrop-blur border border-gray-200 hover:border-green-600 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-all">
                  <Store className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="text-4xl font-black text-green-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Panaderías Aliadas</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white backdrop-blur border border-gray-200 hover:border-amber-600 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-amber-100 rounded-full group-hover:bg-amber-200 transition-all">
                  <TrendingUp className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <div className="text-4xl font-black text-amber-600 mb-2">50K+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Impactos Mensuales</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white backdrop-blur border border-gray-200 hover:border-emerald-600 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-all">
                  <Leaf className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div className="text-4xl font-black text-emerald-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Ecológico</div>
            </div>
          </div>
        </div>
      </div>
      
     
    </section>
  );
}

export default Hero;