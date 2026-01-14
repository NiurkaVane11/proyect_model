import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ZoomIn, Image as ImageIcon } from 'lucide-react'

function Gallery() {
  const categories = ["Todos", "Cortes", "Barbas", "Tratamientos"];
  
  return (
    <section id="galeria" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-yellow-500 text-black">Galería</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
            Nuestro Trabajo
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Cada corte es una obra de arte. Mira algunos de nuestros mejores trabajos.
          </p>
        </div>
        
        {/* Filtros de categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <Button 
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-yellow-500 hover:bg-yellow-400 text-black" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Grid de galería */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div 
              key={item} 
              className="relative aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl overflow-hidden group cursor-pointer border-2 border-slate-200 hover:border-yellow-500 transition-all duration-500"
            >
              {/* Contenido placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                <p className="text-slate-500 font-medium">Foto {item}</p>
              </div>
              
              {/* Overlay oscuro al hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="p-3 bg-yellow-500 rounded-full inline-flex transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ZoomIn className="w-6 h-6 text-black" />
                  </div>
                  <p className="text-white font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Ver detalles
                  </p>
                </div>
              </div>
              
              {/* Borde animado */}
              <div className="absolute inset-0 border-4 border-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* CTA para ver más */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-2">
            Ver Toda la Galería
          </Button>
        </div>
        
      </div>
    </section>
  );
}

export default Gallery;