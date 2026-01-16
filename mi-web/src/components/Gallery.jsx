import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ZoomIn, Image as ImageIcon, Briefcase, Coffee, Pizza, ShoppingBag } from 'lucide-react'

function Gallery() {
  const campaigns = [
    { id: 1, category: "Restaurantes", icon: Pizza },
    { id: 2, category: "Cafeterías", icon: Coffee },
    { id: 3, category: "Retail", icon: ShoppingBag },
    { id: 4, category: "Servicios", icon: Briefcase },
    { id: 5, category: "Restaurantes", icon: Pizza },
    { id: 6, category: "Cafeterías", icon: Coffee },
    { id: 7, category: "Retail", icon: ShoppingBag },
    { id: 8, category: "Servicios", icon: Briefcase }
  ];
  
  const categories = ["Todos", "Restaurantes", "Cafeterías", "Retail", "Servicios"];
  
  return (
    <section id="galeria" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge className="bg-red-600 text-white">Casos de Éxito</Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            Campañas Publicitarias
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mira cómo nuestros clientes han alcanzado miles de impactos con publicidad ecológica
          </p>
        </div>
        
        {/* Filtros de categorías */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <Button 
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-red-600 hover:bg-red-700 text-white" : "border-gray-300 hover:border-red-600"}
            >
              {category}
            </Button>
          ))}
        </div>
        
        {/* Grid de galería */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {campaigns.map((campaign) => {
            const IconComponent = campaign.icon;
            return (
              <div 
                key={campaign.id} 
                className="relative aspect-square bg-gradient-to-br from-red-50 via-white to-orange-50 rounded-xl overflow-hidden group cursor-pointer border-2 border-gray-200 hover:border-red-600 transition-all duration-500 hover:shadow-xl"
              >
                {/* Contenido placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="p-4 bg-white rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500">
                    <IconComponent className="w-10 h-10 text-red-600" />
                  </div>
                  <Badge className="bg-red-100 text-red-700 mb-2">{campaign.category}</Badge>
                  <p className="text-gray-600 font-medium text-center">Campaña {campaign.id}</p>
                  <p className="text-gray-500 text-sm text-center mt-2">10K+ impactos</p>
                </div>
                
                {/* Overlay oscuro al hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-orange-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-white rounded-full inline-flex transform scale-0 group-hover:scale-100 transition-transform duration-500">
                      <ZoomIn className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-white font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Ver Caso de Éxito
                    </p>
                  </div>
                </div>
                
                {/* Badge de categoría en esquina */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Badge className="bg-white text-red-600 shadow-lg">
                    {campaign.category}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Sección de impacto */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-black mb-4">
            ¿Listo para ver tu marca en miles de manos?
          </h3>
          <p className="text-xl mb-8 text-red-100">
            Nuestras bolsas ecológicas llevan tu mensaje a la audiencia correcta
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 font-bold">
              Solicitar Cotización
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
              Ver Más Ejemplos
            </Button>
          </div>
        </div>
        
      </div>
    </section>
  );
}

export default Gallery;