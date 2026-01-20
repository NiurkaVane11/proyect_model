import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import HowItWorks from './components/HowItWorks'
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
      
      <HowItWorks />
      
      {/* Espaciador decorativo */}
      <div className="h-16 bg-gradient-to-b from-white to-gray-50"></div>
      
      <Footer />
    </div>
  )
}

export default App