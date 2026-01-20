import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Simpsonville',
      project: 'Kitchen Remodel',
      rating: 5,
      text: 'Excellent work! Scott and his team transformed our outdated kitchen into a modern masterpiece. They were professional, on time, and the quality exceeded our expectations. Highly recommend!',
    },
    {
      name: 'John D.',
      location: 'Fountain Inn',
      project: 'Deck Construction',
      rating: 5,
      text: 'Highly recommend! Our new deck is absolutely beautiful. The attention to detail was impressive, and they completed the project ahead of schedule. Great communication throughout.',
    },
    {
      name: 'Maria L.',
      location: 'Simpsonville',
      project: 'Bathroom Repairs',
      rating: 5,
      text: 'Professional service! Quick response time and fair pricing. They fixed our bathroom issues efficiently and left everything clean. Will definitely use again.',
    },
    {
      name: 'Robert T.',
      location: 'Greenville',
      project: 'Home Addition',
      rating: 5,
      text: 'We added a sunroom to our home and couldn\'t be happier. The team was knowledgeable, respectful of our property, and delivered exactly what we envisioned. A+ experience!',
    },
    {
      name: 'Jennifer K.',
      location: 'Mauldin',
      project: 'Basement Finishing',
      rating: 5,
      text: 'Transformed our unfinished basement into a beautiful family room. The craftsmanship is outstanding, and they handled all the permits and inspections. Stress-free process!',
    },
    {
      name: 'Michael B.',
      location: 'Gray Court',
      project: 'Handyman Services',
      rating: 5,
      text: 'I\'ve used Burch Contracting for multiple small projects around the house. Always reliable, always quality work. They\'re my go-to for any home repair needs.',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Customers Say
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Don't just take our word for it - hear from homeowners we've helped transform their spaces.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <a
            href="https://www.bbb.org/us/sc/gray-court/profile/home-additions/burch-contracting-llc-0673-90007875"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:border-blue-200 transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A+</span>
            </div>
            <div>
              <p className="font-bold text-slate-900">BBB Accredited</p>
              <p className="text-slate-500 text-sm">A+ Rating Since 2014</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </a>

          <a
            href="https://www.google.com/maps/place/Burch+Contracting"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:border-yellow-200 transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Star className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <p className="font-bold text-slate-900">5.0 Rating</p>
              <p className="text-slate-500 text-sm">Google Reviews</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-yellow-500 transition-colors" />
          </a>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 opacity-10">
              <Quote className="w-24 h-24 text-orange-500" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              ))}
            </div>

            {/* Quote Text */}
            <blockquote className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 relative z-10">
              "{testimonials[currentIndex].text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-slate-500">
                  {testimonials[currentIndex].location} • {testimonials[currentIndex].project}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-orange-500'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* All Reviews Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 line-clamp-3">"{testimonial.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.location}</p>
                </div>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                  {testimonial.project}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/maps/place/Burch+Contracting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
          >
            See All Google Reviews
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
