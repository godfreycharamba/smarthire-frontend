import CTA from "../../components/CTA"
import Footer from "../../components/Footer"
import Hero from "../../components/Hero"
import HowItWorks from "../../components/HowItWorks"
import Navbar from "../../components/NavBar"


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <CTA />
      <Footer />
      {/* 
      <Features />
      
      <Stats />
      <Testimonials />
      
       */}
    </div>
  )
}

export default LandingPage