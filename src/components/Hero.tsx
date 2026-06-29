// components/Hero.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  textPosition: 'left' | 'center' | 'right';
  ctaText?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=800&fit=crop',
    title: 'AI-Powered Recruitment',
    subtitle: 'Smart Hiring with AI Intelligence',
    description: 'Revolutionize your recruitment process with AI-powered resume screening and intelligent candidate matching.',
    textPosition: 'left',
    ctaText: 'Get Started'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=800&fit=crop',
    title: 'Find the Perfect Candidates',
    subtitle: 'Intelligent Matching Technology',
    description: 'Our AI analyzes resumes and ranks candidates based on job requirements with 98% accuracy.',
    textPosition: 'center',
    ctaText: 'Learn More'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=800&fit=crop',
    title: 'Streamline Your Hiring',
    subtitle: 'Save Time & Reduce Costs',
    description: 'Reduce time-to-hire by up to 70% with automated screening and intelligent candidate filtering.',
    textPosition: 'right',
    ctaText: 'Start Free Trial'
  }
];

const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  // Determine text alignment based on position
  const getTextAlignment = (position: string) => {
    switch(position) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      default:
        return 'items-center text-center';
    }
  };

  const getContainerAlignment = (position: string) => {
    switch(position) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <section className="relative h-screen pt-16 overflow-hidden">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className="min-w-full h-full relative"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center px-4 sm:px-8 lg:px-16">
              <div className={`w-full max-w-4xl ${getContainerAlignment(slide.textPosition)}`}>
                <div className={`max-w-2xl ${getTextAlignment(slide.textPosition)}`}>
                  {/* Badge */}
                  <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full text-sm font-medium border border-blue-400/30 mb-4">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                    </span>
                    <span>{slide.title}</span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                    {slide.subtitle}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-6 max-w-xl">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className={`flex flex-col sm:flex-row gap-4 ${slide.textPosition === 'center' ? 'items-center justify-center' : ''} ${slide.textPosition === 'right' ? 'justify-end' : ''}`}>
                    <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl transition-all text-lg font-medium hover:scale-105">
                      <span>{slide.ctaText || 'Get Started'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-white/50 text-white rounded-lg hover:bg-white/10 transition-all text-lg font-medium backdrop-blur-sm">
                      <span>Learn More</span>
                    </button>
                  </div>

                  {/* Features */}
                  <div className={`flex items-center space-x-6 text-sm text-gray-300 mt-6 ${slide.textPosition === 'center' ? 'justify-center' : ''} ${slide.textPosition === 'right' ? 'justify-end' : ''}`}>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Free 14-day trial</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>No credit card</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators - Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? 'w-10 bg-white' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 text-white/60 text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
        {currentIndex + 1} / {slides.length}
      </div>
    </section>
  );
};

export default Hero;