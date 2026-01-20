import React from 'react';
import { Shield, MessageSquare, Award, Clock, CheckCircle, Users, Wrench, ThumbsUp } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'Licensed & Insured',
      description: 'Fully licensed contractor with comprehensive insurance coverage for your complete peace of mind.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: MessageSquare,
      title: 'Clear Communication',
      description: 'We keep you informed every step of the way with regular updates and transparent pricing.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      title: 'Quality Workmanship',
      description: 'Meticulous attention to detail and superior craftsmanship on every project we undertake.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: Clock,
      title: 'On-Time & On-Budget',
      description: 'Reliable scheduling and accurate estimates you can count on. No surprises, no hidden fees.',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '30+', label: 'Years Experience' },
    { value: '100%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Burch Contracting
            </span>
            ?
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We're committed to delivering exceptional service and quality workmanship on every project. 
            Here's what sets us apart from the competition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300 border border-slate-100 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>

              {/* Decorative corner */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full`} />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">What We Promise</h3>
            <ul className="space-y-4">
              {[
                'Free, no-obligation estimates',
                'Written contracts and warranties',
                'Clean job sites - we respect your home',
                'Direct communication with the owner',
                'Local references available upon request',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Commitment</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              At Burch Contracting, we understand that your home is your biggest investment. 
              That's why we treat every project with the care and attention it deserves, 
              whether it's a simple repair or a complete renovation.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Owner Scott Burch personally oversees every project, ensuring the highest 
              standards of quality and customer satisfaction. We're not happy until you're happy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
