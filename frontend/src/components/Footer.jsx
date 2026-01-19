import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Send } from 'lucide-react'

function Footer() {
  return (
    <footer id="contacto" className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sección de contacto */}
        <div className="mb-16">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black">
              ¿Listo para Empezar?
            </h2>
            <p className="text-xl text-gray-400">
              Contáctanos y te asesoramos sin compromiso
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Formulario de contacto */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Envíanos un Mensaje</h3>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nombre completo"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Correo electrónico"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      placeholder="Teléfono"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
                    />
                  </div>
                  <div>
                    <select className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-all">
                      <option value="">Selecciona un plan</option>
                      <option value="basico">Plan Básico - $9,500</option>
                      <option value="profesional">Plan Profesional - $15,000</option>
                      <option value="premium">Plan Premium - $25,000</option>
                    </select>
                  </div>
                  <div>
                    <textarea 
                      rows="4" 
                      placeholder="Cuéntanos más sobre ti y tu interés en la franquicia..."
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Solicitud
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all">
                    <div className="p-3 bg-red-600 rounded-lg">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Teléfono</p>
                      <p className="text-gray-400">+52 (555) 123-4567</p>
                      <p className="text-gray-400">WhatsApp: +52 (555) 987-6543</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all">
                    <div className="p-3 bg-red-600 rounded-lg">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Email</p>
                      <p className="text-gray-400">contacto@infopan.com</p>
                      <p className="text-gray-400">franquicias@infopan.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-all">
                    <div className="p-3 bg-red-600 rounded-lg">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Oficina Principal</p>
                      <p className="text-gray-400">Av. Reforma 123, Col. Centro</p>
                      <p className="text-gray-400">Ciudad de México, CP 06000</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-3">Horario de Atención</h4>
                <p className="text-red-100">Lunes a Viernes: 9:00 AM - 7:00 PM</p>
                <p className="text-red-100">Sábados: 10:00 AM - 2:00 PM</p>
                <p className="text-red-50 text-sm mt-2">📱 WhatsApp disponible 24/7</p>
              </div>
            </div>

          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-800 mb-12"></div>

        {/* Footer inferior */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-xl">info</span>
              <span className="text-red-600 font-bold text-xl">pan</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Líder en publicidad ecológica. Transformamos el marketing tradicional en una experiencia sustentable y rentable.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <a href="#inicio" className="block text-gray-400 hover:text-red-500 transition-colors">Inicio</a>
              <a href="#que-es" className="block text-gray-400 hover:text-red-500 transition-colors">¿Qué es?</a>
              <a href="#como-funciona" className="block text-gray-400 hover:text-red-500 transition-colors">Cómo Funciona</a>
              <a href="#beneficios" className="block text-gray-400 hover:text-red-500 transition-colors">Beneficios</a>
              <a href="#galeria" className="block text-gray-400 hover:text-red-500 transition-colors">Galería</a>
            </div>
          </div>
          
          {/* Redes sociales */}
          <div>
            <h4 className="font-bold text-lg mb-4">Síguenos</h4>
            <div className="flex gap-3">
              <a href="#" className="p-3 bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-gray-800 rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              @infopan_oficial
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2026 INFOPAN. Todos los derechos reservados. | 
            <a href="#" className="text-red-500 hover:text-red-400 ml-1">Aviso de Privacidad</a> | 
            <a href="#" className="text-red-500 hover:text-red-400 ml-1">Términos y Condiciones</a>
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;