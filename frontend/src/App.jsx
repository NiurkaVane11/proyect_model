import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Benefits from './components/Benefits'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Hero />
      
      {/* Espaciador decorativo */}
      <div className="h-16 bg-gradient-to-b from-green-50 to-white"></div>
      
      <About />
      
      {/* Espaciador decorativo */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50"></div>
      
      <Services />
      
      {/* Espaciador decorativo */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50"></div>
      
      <HowItWorks />
      
      {/* Espaciador decorativo */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50"></div>
      

{/* Espaciador decorativo */}
<div className="h-16 bg-gradient-to-b from-white to-gray-50"></div>

<Benefits />







      <Gallery />
      
      {/* Espaciador decorativo */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50"></div>
      
      <Testimonials />
      
      <Footer />
    </div>
  )
}

export default App