import Icon from '@/components/ui/Icon';
import { businessConfig } from '@/config/business';

const trustItems = [
  {
    icon: 'Award' as const,
    label: `BBB ${businessConfig.credentials.bbbRating} Rated`,
    detail: `A+ Rating since ${businessConfig.credentials.bbbSince}`,
  },
  {
    icon: 'Clock' as const,
    label: `${businessConfig.credentials.yearsInBusiness}+ Years Experience`,
    detail: `Est. ${businessConfig.credentials.established}`,
  },
  {
    icon: 'ShieldCheck' as const,
    label: 'Licensed & Insured',
    detail: 'South Carolina',
  },
  {
    icon: 'Star' as const,
    label: `${businessConfig.credentials.googleRating} Google Rating`,
    detail: 'Verified reviews',
  },
];

export default function TrustBar() {
  return (
    <div className="border-b border-gray-100 bg-white py-4 shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 sm:px-6">
        {trustItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <Icon name={item.icon} size={18} className="shrink-0 text-blue-600" />
            <div className="leading-tight">
              <span className="font-semibold text-gray-900">{item.label}</span>
              <span className="mx-1.5 text-gray-300">·</span>
              <span className="text-gray-500">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
