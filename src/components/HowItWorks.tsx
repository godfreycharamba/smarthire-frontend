// components/HowItWorks.tsx
import React from 'react';
import { UserPlus, FileSearch, Users, ChevronRight } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up as an employer or job seeker and set up your profile.'
  },
  {
    icon: FileSearch,
    title: 'Post Jobs & Apply',
    description: 'Employers post job openings while candidates submit applications with resumes.'
  },
  {
    icon: Users,
    title: 'AI Matching',
    description: 'Our AI analyzes resumes and ranks candidates based on job requirements.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How SmartHire Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, intelligent, and efficient recruitment process powered by AI.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200">
                    <ChevronRight className="h-5 w-5 text-indigo-400 absolute right-0 top-1/2 transform -translate-y-1/2" />
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;