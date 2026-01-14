import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Star, Calendar, Users, MapPin, ArrowDown } from 'lucide-react'

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Efectos de luz */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-8">
          {/* Badge superior con icono */}
          <div className="flex justify-center animate-fade-in">
            <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 text-sm px-4 py-2 flex items-center gap-2">
              <Star className="w-4 h-4 fill-black" />
              Calificación 5.0 - Más de 50,000 clientes satisfechos
            </Badge>
          </div>
          
          {/* Título principal */}
          <div className="space-y-4 animate-slide-down">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
              Tu Barbería
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500">
                de Confianza
              </span>
            </h1>
          </div>
          
          {/* Subtítulo */}
          <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto animate-slide-up">
            Expertos en estilo masculino con más de 10 años de experiencia. 
            Donde la tradición se encuentra con la innovación.
          </p>
          
          {/* Botones con iconos */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button 
              size="lg" 
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Cita Ahora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-slate-600 text-white hover:bg-slate-800 font-bold text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Ver Nuestros Servicios
            </Button>
          </div>
          
          {/* Estadísticas con iconos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="text-center p-6 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-yellow-500 transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-yellow-500/10 rounded-full group-hover:bg-yellow-500/20 transition-all">
                  <Calendar className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="text-4xl font-black text-yellow-500 mb-2">10+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Años de Experiencia</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-yellow-500 transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-yellow-500/10 rounded-full group-hover:bg-yellow-500/20 transition-all">
                  <Users className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="text-4xl font-black text-yellow-500 mb-2">50K+</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Clientes Felices</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-yellow-500 transition-all duration-300 group">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-yellow-500/10 rounded-full group-hover:bg-yellow-500/20 transition-all">
                  <MapPin className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="text-4xl font-black text-yellow-500 mb-2">3</div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">Ubicaciones</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Indicador de scroll con icono */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs uppercase tracking-widest">Descubre más</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
}

export default Hero;