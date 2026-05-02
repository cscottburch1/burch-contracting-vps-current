import Image from 'next/image';
import Script from 'next/script';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Icon from '@/components/ui/Icon';
import QuickEstimateForm from '@/components/seo/QuickEstimateForm';
import type { SeoLandingPageData } from '@/lib/seo/localDominanceData';
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  buildPersonSchema,
} from '@/lib/seo/schema';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { primaryAuthor } from '@/lib/seo/author';
import MiniCalculatorEmbed from '@/components/calculators/MiniCalculatorEmbed';
import ProjectGallery from '@/components/projects/ProjectGallery';
import CitiesGrid from '@/components/locations/CitiesGrid';
import Testimonials from '@/components/testimonials/Testimonials';
import { generateSampleProjects, generateSampleTestimonials } from '@/lib/sampleData';

interface LocalSeoLandingProps {
  page: SeoLandingPageData;
}

export default function LocalSeoLanding({ page }: LocalSeoLandingProps) {
  const breadcrumbItems = [
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Services', url: absoluteUrl('/services') },
    ...(page.city
      ? [
          { name: page.city.displayName, url: absoluteUrl('/locations') },
          { name: page.service.navLabel, url: absoluteUrl(page.path) },
        ]
      : [{ name: page.service.navLabel, url: absoluteUrl(page.path) }]),
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const localBusinessSchema = buildLocalBusinessSchema({
    description: page.metaDescription,
  });
  const serviceSchema = buildServiceSchema({
    slug: page.slug,
    serviceName: page.service.serviceName,
    city: page.city?.displayName ?? 'Upstate South Carolina',
    h1: page.h1,
    shortDescription: page.shortDescription,
    path: page.path,
  });

  const personSchema = buildPersonSchema({
    name: primaryAuthor.name,
    jobTitle: `${primaryAuthor.role}, SC License #${primaryAuthor.licenseNumber}`,
    description: primaryAuthor.bio,
    email: primaryAuthor.email,
    image: primaryAuthor.image,
    sameAs: primaryAuthor.sameAs,
  });

  const areaLine = page.city
    ? `${page.city.displayName} · ${page.city.county}`
    : 'Serving Simpsonville, Fountain Inn, Mauldin, Gray Court, Laurens, Woodruff, Clinton, Ora, and Joanna';

  return (
    <>
      <Script id={`${page.id}-breadcrumb-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id={`${page.id}-local-business-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Script id={`${page.id}-service-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id={`${page.id}-person-schema`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_top_right,_white,_transparent_40%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_0.9fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">{areaLine}</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">{page.h1}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-blue-50">{page.leadParagraphs[0]}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" size="lg" href="#quick-estimate">
                Get Free Estimate
                <Icon name="ArrowRight" size={18} />
              </Button>
              <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
                <Icon name="Phone" size={18} />
                Call {siteConfig.phoneDisplay}
              </Button>
            </div>

            <div className="mt-8 grid gap-3 text-sm text-blue-50 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Licensed & insured local contractor</div>
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Free estimate and written scope guidance</div>
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Serving Upstate SC since 1995</div>
              <div className="rounded-xl bg-white/10 px-4 py-3">✅ Transparent pricing and timelines</div>
            </div>
          </div>

          <div id="quick-estimate">
            <QuickEstimateForm serviceName={page.service.navLabel} cityName={page.city?.name} />
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-5 text-gray-700">
            {page.leadParagraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8">
                {paragraph}
              </p>
            ))}
          </div>

          <Card className="h-fit border border-blue-100 bg-blue-50">
            <h2 className="text-2xl font-bold text-slate-900">Why homeowners choose Burch Contracting</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              {page.service.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-blue-700">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-gray-700">{page.service.ctaSummary}</p>
          </Card>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Why homeowners choose Burch Contracting for {page.primaryKeyword}
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            When you're ready to invest in your property, you want a contractor who understands local building requirements, communicates clearly, and delivers quality work on schedule.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {page.whyChoose.map((item) => (
            <Card key={item.title} className="h-full border border-gray-200">
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.planningSection.title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              {page.planningSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#quick-estimate">Get Free Estimate</Button>
              <Button variant="outline" href={siteConfig.phoneHref}>Click to Call</Button>
            </div>
          </div>

          <Card className="border border-blue-100 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-900">Key cost and planning factors</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              {page.planningSection.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-blue-700">•</span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* Mini Calculator Embed - Embeddable quick estimator */}
      <Section background="blue" padding="lg">
        <MiniCalculatorEmbed 
          serviceType={
            page.service.slug.includes('deck') ? 'decks' :
            page.service.slug.includes('garage') ? 'garages' :
            page.service.slug.includes('porch') ? 'screened-porches' :
            page.service.slug.includes('addition') ? 'room-additions' :
            page.service.slug.includes('kitchen') || page.service.slug.includes('bath') ? 'kitchen-remodeling' :
            page.service.slug.includes('basement') ? 'basement-finishing' :
            'decks'
          }
          title={`Quick ${page.service.navLabel} Cost Estimate`}
          description={`Get an instant ballpark estimate for your ${page.service.navLabel.toLowerCase()} project in ${page.city?.name ?? 'Upstate SC'}.`}
        />
      </Section>

      <Section background="blue" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">{page.localExperienceSection.title}</h2>
            <div className="mt-4 space-y-4 text-gray-700">
              {page.localExperienceSection.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <Card className="border border-cyan-100 bg-white">
            <h3 className="text-2xl font-bold text-slate-900">Trusted planning resources</h3>
            <div className="mt-4 space-y-3">
              {page.authorityLinks.map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  className="block rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <ProjectGallery 
          projects={generateSampleProjects(page.service.navLabel, 6)}
          title={`Recent ${page.service.navLabel} Projects Near ${page.city?.name ?? 'You'}`}
          subtitle={`See how we've helped homeowners throughout ${page.city?.displayName ?? 'the Upstate'} create beautiful, functional spaces that add real value to their properties.`}
        />
      </Section>

      {/* Enhanced Cities Grid with Service Links */}
      <Section background="blue" padding="lg">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <CitiesGrid 
              title="Service Areas Near You"
              subtitle="We provide professional construction services throughout Upstate South Carolina"
              serviceSlug={page.service.slug}
              columns={2}
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Our construction services
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Explore expert construction services for your home:
            </p>
            <div className="mt-6 space-y-3">
              <a href="/deck-builder" className="block rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:bg-blue-50 hover:border-blue-400 hover:shadow-md">
                <div className="font-bold text-slate-900">Professional Deck Building</div>
                <div className="text-sm text-gray-600">Custom wood and composite decks for outdoor living</div>
              </a>
              <a href="/screened-porches" className="block rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:bg-green-50 hover:border-green-400 hover:shadow-md">
                <div className="font-bold text-slate-900">Screened Porch Installation</div>
                <div className="text-sm text-gray-600">Year-round outdoor comfort and bug-free relaxation</div>
              </a>
              <a href="/garage-builder" className="block rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:bg-orange-50 hover:border-orange-400 hover:shadow-md">
                <div className="font-bold text-slate-900">Garage Construction</div>
                <div className="text-sm text-gray-600">Vehicle protection and valuable storage space</div>
              </a>
              <a href="/room-additions" className="block rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:bg-purple-50 hover:border-purple-400 hover:shadow-md">
                <div className="font-bold text-slate-900">Room Additions & Expansions</div>
                <div className="text-sm text-gray-600">Increase square footage and home value</div>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Customer Testimonials with Review Schema */}
      <Section background="gray" padding="lg">
        <Testimonials 
          testimonials={generateSampleTestimonials(6)}
          title="What Our Customers Say"
          subtitle={`Real feedback from homeowners throughout ${page.city?.displayName ?? 'Upstate SC'}`}
          showSchema={true}
        />
      </Section>

      <Section background="white" padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              What to expect from your free {page.service.navLabel.toLowerCase()} estimate in {page.city?.name ?? 'the Upstate'}
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              When you're looking for a {page.primaryKeyword}, you want clear answers on cost, contractor availability, permitting, and how quickly the work can move from estimate to completion. Our estimate process is built around those questions. We review your property, talk through your goals, flag any site or neighborhood constraints, and explain which decisions will affect price, schedule, and long-term value the most.
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              That means you get more than a generic number. You get practical guidance on scope options, materials, timeline milestones, and next steps so you can confidently compare contractors and move forward with a realistic plan. For homeowners in {page.city?.displayName ?? 'Upstate South Carolina'}, this level of local clarity is what keeps projects on budget and ensures the finished result fits your property perfectly.
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-700">
              During the estimate, we'll also answer common questions about permitting, material choices, and typical timelines for {page.service.navLabel.toLowerCase()} projects in your area. This planning stage helps you make informed decisions and move forward with confidence.
            </p>
          </div>

          <Card className="border border-blue-100 bg-slate-50">
            <h3 className="text-2xl font-bold text-slate-900">Estimate checklist</h3>
            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="mt-1 text-blue-700">•</span><span>Lot, access, drainage, and tie-in review before scope is finalized.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 text-blue-700">•</span><span>Material and finish comparisons that match your budget and maintenance goals.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 text-blue-700">•</span><span>Permit, inspection, and sequencing notes tied to the actual city and county context.</span></li>
              <li className="flex items-start gap-2"><span className="mt-1 text-blue-700">•</span><span>Written next steps so you can request a free estimate and move into scheduling with confidence.</span></li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {page.faqItems.map((faq) => (
                <Card key={faq.question} className="border border-gray-200">
                  <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-gray-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Explore related pages</h2>
            <div className="mt-6 space-y-4">
              {page.relatedLinks.map((link) => (
                <Card key={link.href} className="border border-blue-100 bg-white">
                  <a href={link.href} className="block">
                    <h3 className="text-lg font-bold text-slate-900">{link.label}</h3>
                    <p className="mt-2 text-gray-600">{link.description}</p>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-4 border-blue-600 bg-gray-50 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {primaryAuthor.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">Written by</p>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{primaryAuthor.name}</h3>
                <p className="text-gray-700 mb-2">{primaryAuthor.role}</p>
                <p className="text-sm text-gray-600 mb-3">
                  SC Licensed General Contractor #{primaryAuthor.licenseNumber} | {primaryAuthor.yearsExperience}+ years{page.city ? ` serving ${page.city.displayName}` : ' serving Upstate SC'}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {primaryAuthor.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section background="dark" padding="lg">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold">Ready to plan your project?</h2>
          <p className="mt-4 text-lg text-gray-300">
            Get a written estimate, speak with a local contractor, and move forward with a cleaner scope for {page.service.navLabel.toLowerCase()}.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" href="#quick-estimate">Get Free Estimate</Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-slate-900">
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
