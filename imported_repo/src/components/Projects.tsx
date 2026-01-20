import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight, X } from 'lucide-react';

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'handyman', label: 'Handyman Services' },
    { id: 'remodeling', label: 'Remodeling' },
    { id: 'additions', label: 'Additions' },
  ];

  const projects = [
    {
      id: 1,
      title: 'Kitchen Fixture Repair',
      category: 'handyman',
      categoryLabel: 'Handyman Services',
      description: 'Quick kitchen fixture repairs and updates including faucet replacement and cabinet hardware installation.',
      location: 'Greenville, SC',
      date: 'Jan 2024',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
    },
    {
      id: 2,
      title: 'Deck Installation & Staining',
      category: 'handyman',
      categoryLabel: 'Handyman Services',
      description: 'New deck construction with professional staining and sealing for long-lasting protection.',
      location: 'Spartanburg, SC',
      date: 'Jan 2024',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    },
    {
      id: 3,
      title: 'Bathroom Remodel',
      category: 'remodeling',
      categoryLabel: 'Remodeling',
      description: 'Full bathroom renovation with modern finishes, new vanity, and custom tile work.',
      location: 'Greenville, SC',
      date: 'Jan 2024',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    },
    {
      id: 4,
      title: 'Kitchen Remodel',
      category: 'remodeling',
      categoryLabel: 'Remodeling',
      description: 'Modern kitchen with custom cabinets, granite countertops, and stainless steel appliances.',
      location: 'Simpsonville, SC',
      date: 'Feb 2024',
      image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&q=80',
    },
    {
      id: 5,
      title: 'Home Office Addition',
      category: 'additions',
      categoryLabel: 'Additions',
      description: '200 sq ft home office with natural light, built-in shelving, and dedicated electrical.',
      location: 'Greer, SC',
      date: 'Feb 2024',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    },
    {
      id: 6,
      title: 'Sunroom Addition',
      category: 'additions',
      categoryLabel: 'Additions',
      description: '300 sq ft sunroom with panoramic windows and climate control for year-round enjoyment.',
      location: 'Mauldin, SC',
      date: 'Mar 2024',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Our Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Recent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Projects
            </span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Take a look at some of our recently completed projects across the Upstate. 
            Each project showcases our commitment to quality and attention to detail.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 border border-slate-100 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-medium rounded-full">
                    {project.categoryLabel}
                  </span>
                </div>

                {/* View Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-4 py-2 bg-white text-slate-900 font-semibold rounded-lg shadow-lg">
                    View Details
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {project.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-72">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-slate-700" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-medium rounded-full">
                  {selectedProject.categoryLabel}
                </span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedProject.title}</h3>
              <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedProject.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedProject.date}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">{selectedProject.description}</p>
              <button
                onClick={() => {
                  setSelectedProject(null);
                  scrollToContact();
                }}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Get a Similar Project Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
