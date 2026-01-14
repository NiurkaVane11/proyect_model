import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Gallery from './components/Gallery'
import Locations from './components/Locations'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      
      {/* Espaciador decorativo */}
      <div className="h-20 bg-gradient-to-b from-black to-gray-100"></div>
      
      <Services />
      
      {/* Espaciador decorativo */}
      <div className="h-20 bg-gradient-to-b from-gray-100 to-black"></div>
      
      <About />
      
      {/* Espaciador decorativo */}
      <div className="h-20 bg-gradient-to-b from-black to-gray-100"></div>
      
      <Gallery />
      
      {/* Espaciador decorativo */}
      <div className="h-20 bg-gradient-to-b from-gray-100 to-white"></div>
      
      <Locations />
      
      {/* Espaciador decorativo */}
      <div className="h-20 bg-gradient-to-b from-white to-gray-900"></div>
      
      <Testimonials />
      
      <Footer />
    </div>
  )
}

export default App