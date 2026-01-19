import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Leaf, TrendingUp, Store, DollarSign, ArrowDown } from 'lucide-react'

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-red-50 overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Efectos de luz */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-8">
          {/* Badge superior con icono */}
          <div className="flex justify-center animate-fade-in">
            <Badge className="bg-green-600 text-white hover:bg-green-700 text-sm px-4 py-2 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Publicidad 100% Ecológica en Bolsas de Papel
            </Badge>
          </div>
          
          {/* Título principal */}
          <div className="space-y-4 animate-slide-down">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
              Únete a la Franquicia
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
                INFOPAN
              </span>
            </h1>
          </div>
          
          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto animate-slide-up">
            Transforma tu futuro con un negocio rentable y sustentable. 
            Publicidad que llega a miles de personas cada día.
          </p>
          
          {/* Inversión destacada */}
          <div className="inline-block bg-white border-2 border-red-600 rounded-2xl p-6 shadow-xl animate-slide-up" style={{animationDelay: '0.1s'}}>
            <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Inversión Inicial desde</p>
            <p className="text-5xl font-black text-red-600">$9,500</p>
          </div>
          
          {/* Botones con iconos */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-red-600/50 transition-all duration-300 hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Quiero Ser Franquiciado
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-300 text-gray-800 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Conocer Más
            </Button>
          </div>
          
          {/* Estadísticas con iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-center p-6 rounded-xl bg-white backdrop-blur border border-gray-200 hover:border-red-600 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-all">
                  <Store className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="text-4xl font-black text-red-600 mb-2">10K+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Impactos Diarios</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white backdrop-blur border border-gray-200 hover:border-green-600 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-all">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="text-4xl font-black text-green-600 mb-2">100%</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Ecológico</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white backdrop-blur border border-gray-200 hover:border-orange-600 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-all">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <div className="text-4xl font-black text-orange-600 mb-2">$9.5K</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Inversión Inicial</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll con icono */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Descubre más</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}

export default Hero;