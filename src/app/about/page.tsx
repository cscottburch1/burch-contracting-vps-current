import type { Metadata } from 'next';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { absoluteUrl, siteConfig } from '@/lib/seo/site';
import { buildBreadcrumbSchema, buildPersonSchema } from '@/lib/seo/schema';
import { primaryAuthor } from '@/lib/seo/author';

export const metadata: Metadata = {
  title: 'About Scott Burch | Upstate SC Contractor Since 1995',
  description:
    'Meet Scott Burch — licensed SC general contractor (CLG118679) with 35+ years building garages, additions, decks, and screened porches across Upstate SC.',
  alternates: {
    canonical: absoluteUrl('/about'),
  },
  openGraph: {
    url: absoluteUrl('/about'),
    title: 'About Scott Burch | Licensed SC Contractor | Burch Contracting',
    description: 'Meet Scott Burch — licensed SC general contractor (CLG118679) with 35+ years building garages, additions, decks, and screened porches across Upstate SC.',
    type: 'website',
    images: [{ url: absoluteUrl(siteConfig.defaultOgImage), width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'About Scott Burch', url: absoluteUrl('/about') },
  ]);
  const personSchema = buildPersonSchema({
    name: primaryAuthor.name,
    jobTitle: `${primaryAuthor.role}, SC License ${primaryAuthor.licenseNumber}`,
    description: primaryAuthor.bio,
    email: primaryAuthor.email,
    image: primaryAuthor.image,
    sameAs: primaryAuthor.sameAs,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <section className="bg-linear-to-br from-slate-900 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">About Scott Burch</h1>
            <p className="text-lg text-blue-100 md:text-xl mb-6">
              I've been building garages, additions, decks, and screened porches in Upstate South Carolina since 1995. I'm not a franchise. I'm not a call center. When you call, you're talking to me.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-900/40 px-4 py-2">
                <Icon name="Award" size={18} />
                <span className="font-semibold">SC License #CLG118679</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-900/40 px-4 py-2">
                <Icon name="Clock" size={18} />
                <span className="font-semibold">35+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-blue-300/30 bg-blue-900/40 px-4 py-2">
                <Icon name="MapPin" size={18} />
                <span className="font-semibold">Based in Gray Court, SC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section background="white" padding="lg">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.5fr]">
          {/* Scott Burch profile card */}
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl shadow-xl bg-linear-to-br from-blue-900 via-blue-800 to-slate-900 flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-32 h-32 rounded-full bg-white/15 border-4 border-white/30 flex items-center justify-center text-white font-bold text-5xl select-none">
              SB
            </div>
            <div className="text-center text-white">
              <p className="font-bold text-2xl mb-1">C. Scott Burch</p>
              <p className="text-blue-200 text-sm mb-4">Owner &amp; Lead Contractor</p>
              <div className="flex flex-col gap-2 text-sm text-blue-100">
                <div className="flex items-center gap-2 justify-center">
                  <Icon name="Award" size={16} />
                  <span>SC License #CLG118679</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Icon name="Clock" size={16} />
                  <span>35+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Icon name="MapPin" size={16} />
                  <span>Gray Court, SC</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">Why I Started Burch Contracting</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                I started as a construction worker in 1987, learned the trade from the ground up, and got my residential builders license in 1995. Then later in 2014, my general contractor's license because I was tired of seeing homeowners get burned by contractors who overpromise and underdeliver.
              </p>
              <p>
                I don't run a big operation with dozens of crews. It's me, a small team of trusted subs I've worked with for years, and a commitment to doing the work right the first time. No shortcuts. No surprises.
              </p>
              <p>
                When you hire Burch Contracting, you're not getting a salesperson who disappears after you sign. You're getting me on your job site, making sure every detail is done to code and built to last.
              </p>
              <p className="font-semibold text-gray-900">
                That's the difference between a local contractor and a franchise operation. I live here. My reputation is on every garage, addition, and deck I build.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="border-blue-200 bg-blue-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="BadgeCheck" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Licensed & Insured</h3>
                    <p className="text-sm text-gray-700">Burch Contracting holds South Carolina General Contractor license #CLG118679, issued by the SC Contractor Licensing Board. We carry general liability and workers&apos; compensation insurance on every job. You can verify our license at llr.sc.gov/clb. We&apos;ve held BBB A+ accreditation since 2014 with zero unresolved complaints.</p>
                  </div>
                </div>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="Users" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Local Team</h3>
                    <p className="text-sm text-gray-700">Same trusted subcontractors for years, not random day labor</p>
                  </div>
                </div>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="Phone" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Direct Access</h3>
                    <p className="text-sm text-gray-700">Call me directly, no call centers or sales reps</p>
                  </div>
                </div>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="ShieldCheck" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Quality Work</h3>
                    <p className="text-sm text-gray-700">Built to code, built to last, no shortcuts ever</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      <Section background="gray" padding="lg">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-3xl font-bold text-gray-900 text-center md:text-4xl">What You Can Expect</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Icon name="Check" size={18} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Honest Estimates</h3>
                  <p className="text-gray-600">No hidden fees, no surprise change orders. What I quote is what you pay unless you change the scope.</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Icon name="Check" size={18} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Communication</h3>
                  <p className="text-gray-600">I answer my phone. I return calls. You'll know what's happening every step of the way.</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Icon name="Check" size={18} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">On-Site Oversight</h3>
                  <p className="text-gray-600">I'm on your job regularly, checking quality and making sure we're on schedule.</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Icon name="Check" size={18} className="text-blue-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Clean Work Sites</h3>
                  <p className="text-gray-600">We clean up daily. Your property is respected, not treated like a construction zone dump.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section background="blue" padding="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 md:text-4xl">Ready to Talk About Your Project?</h2>
          <p className="text-white text-lg mb-8">
            Call me directly at (864) 724-4600 or request a free estimate online. I'll visit your property, listen to what you want, and give you an honest assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="ctaLight" size="lg" href="/contact">
              Request Free Estimate
            </Button>
            <Button variant="outline" size="lg" href={siteConfig.phoneHref} className="border-white text-white hover:bg-white hover:text-blue-900">
              <Icon name="Phone" size={18} />
              Call {siteConfig.phoneDisplay}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
