// components/CTA.tsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Hiring Process?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of companies that use SmartHire to find and hire the best talent.
        </p>
        <button className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all text-lg font-medium mx-auto">
          <span>Start Free Trial</span>
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-sm text-gray-500 mt-4">No credit card required • Free 14-day trial</p>
      </div>
    </section>
  );
};

export default CTA;