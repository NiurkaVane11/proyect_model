
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send } from 'lucide-react'

function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de envío del formulario
  };

  return (
    <footer id="contacto" className="bg-white py-16 relative overflow-hidden">
      {/* Efectos de fondo */}
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Sección de contacto */}
        <div className="mb-16">
          <div className="text-center mb-12 space-y-4">
            <Badge className="bg-green-600 text-white">Contacto</Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
              ¿Listo para Empezar?
            </h2>
            <p className="text-xl text-gray-700">
              Contáctanos y te asesoramos sin compromiso
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Formulario de contacto */}
            <Card className="bg-white border-2 border-gray-200 shadow-lg hover:border-green-600 transition-all duration-300">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Envíanos un Mensaje</h3>
                <div className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Correo electrónico"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      placeholder="Teléfono"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all"
                    />
                  </div>
                 
                  <div>
                    <textarea 
                      rows="4" 
                      placeholder="Cuéntanos más sobre ti y tu interés en la franquicia..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all resize-none"
                    ></textarea>
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Solicitud
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-600 hover:shadow-lg transition-all duration-300 group">
                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-all">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">Teléfono</p>
                      <p className="text-gray-600">+52 (555) 123-4567</p>
                      <p className="text-gray-600">WhatsApp: +52 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-600 hover:shadow-lg transition-all duration-300 group">
                    <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-all">
                      <Mail className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-900">Email</p>
                      <p className="text-gray-600">contacto@infopan.com</p>
                      <p className="text-gray-600">franquicias@infopan.com</p>
                    </div>
                  </div>

              
                </div>
              </div>

             
            </div>

          </div>
        </div>

        {/* Separador */}
        <div className="border-t-2 border-gray-200 mb-12"></div>

        {/* Footer inferior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded font-bold text-xl">info</span>
              <span className="text-green-600 font-bold text-xl">pan</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Líder en publicidad ecológica. Transformamos el marketing tradicional en una experiencia sustentable y rentable.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="#inicio" className="block text-gray-600 hover:text-green-600 transition-colors">Inicio</a>
              <a href="#que-es" className="block text-gray-600 hover:text-green-600 transition-colors">¿Qué es?</a>
              <a href="#como-funciona" className="block text-gray-600 hover:text-green-600 transition-colors">Cómo Funciona</a>
              <a href="#contacto" className="block text-gray-600 hover:text-green-600 transition-colors">Contacto</a>
            </div>
          </div>
          
          {/* Redes sociales */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-gray-900">Síguenos</h4>
            <div className="flex gap-3">
              <a href="#" className="p-3 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-110 group">
                <Facebook className="w-5 h-5 text-green-600 group-hover:text-white" />
              </a>
              <a href="#" className="p-3 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-110 group">
                <Instagram className="w-5 h-5 text-green-600 group-hover:text-white" />
              </a>
              <a href="#" className="p-3 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-110 group">
                <Linkedin className="w-5 h-5 text-green-600 group-hover:text-white" />
              </a>
            </div>
            <p className="text-gray-600 text-sm mt-4">
              @infopan_oficial
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t-2 border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 INFOPAN. Todos los derechos reservados. | 
            <a href="#" className="text-green-600 hover:text-green-700 ml-1">Aviso de Privacidad</a> | 
            <a href="#" className="text-green-600 hover:text-green-700 ml-1">Términos y Condiciones</a>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;