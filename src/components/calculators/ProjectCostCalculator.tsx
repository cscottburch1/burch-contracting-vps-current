'use client';

import { useMemo, useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon, { type IconName } from '@/components/ui/Icon';
import { siteConfig } from '@/lib/seo/site';

export interface CalculatorOption {
  label: string;
  unit: string;
  defaultQuantity: number;
  lowRate: number;
  highRate: number;
  leadTime: string;
  scope: string;
}

interface ProjectCostCalculatorProps {
  title: string;
  intro: string;
  icon: IconName;
  marketLabel: string;
  options: CalculatorOption[];
}

type FinishLevel = 'value' | 'standard' | 'premium';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ProjectCostCalculator({
  title,
  intro,
  icon,
  marketLabel,
  options,
}: ProjectCostCalculatorProps) {
  const [selectedOption, setSelectedOption] = useState<CalculatorOption>(options[0]);
  const [quantity, setQuantity] = useState<number>(options[0]?.defaultQuantity ?? 1);
  const [finishLevel, setFinishLevel] = useState<FinishLevel>('standard');

  const estimate = useMemo(() => {
    const value = selectedOption.lowRate * quantity;
    const premium = selectedOption.highRate * quantity;
    const standard = Math.round((value + premium) / 2);

    const total = finishLevel === 'value' ? value : finishLevel === 'premium' ? premium : standard;
    const labor = Math.round(total * 0.46);
    const materials = total - labor;
    const allowance = Math.round(total * 0.12);

    return {
      value,
      standard,
      premium,
      total,
      labor,
      materials,
      allowance,
    };
  }, [finishLevel, quantity, selectedOption]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_top,_white_0,_transparent_42%)]"></div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Icon name={icon} size={34} className="text-cyan-200" />
            </div>
            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
            <p className="max-w-2xl text-lg text-blue-100 md:text-xl">{intro}</p>
            <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-blue-50">
              Built around {marketLabel} installed pricing, overhead, and contractor markup.
            </div>
          </div>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="mx-auto max-w-6xl">
          <Card className="mb-8 border-2 border-amber-200 bg-amber-50">
            <div className="flex gap-3">
              <Icon name="AlertCircle" size={22} className="mt-1 text-amber-600" />
              <div>
                <h2 className="mb-2 text-lg font-bold text-amber-950">Budget Planning Disclaimer</h2>
                <p className="text-sm leading-relaxed text-amber-900">
                  This calculator is for planning only. Final pricing varies based on existing conditions, structural work,
                  framing changes, plumbing or electrical upgrades, finish selections, permit requirements, and actual scope.
                  We recommend using this as a starting range, then scheduling a site visit for a written estimate.
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.85fr]">
            <Card>
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Choose Your Project</h2>
              <div className="space-y-3">
                {options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      setSelectedOption(option);
                      setQuantity(option.defaultQuantity);
                    }}
                    className={`w-full rounded-2xl border-2 p-5 text-left transition ${
                      selectedOption.label === option.label
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
                        <p className="mt-1 text-sm text-gray-600">{option.scope}</p>
                        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-blue-700">
                          Typical lead time: {option.leadTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Installed range</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(option.lowRate)} to {formatCurrency(option.highRate)}
                        </div>
                        <div className="text-xs text-gray-500">per {option.unit}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="h-fit lg:sticky lg:top-6">
              <h2 className="mb-5 text-2xl font-bold text-gray-900">Estimate Snapshot</h2>
              <div className="mb-6 rounded-2xl bg-blue-50 p-4">
                <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">Selected project</div>
                <div className="mt-1 text-lg font-bold text-gray-900">{selectedOption.label}</div>
                <div className="mt-2 text-sm text-gray-600">{selectedOption.scope}</div>
              </div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">Quantity ({selectedOption.unit})</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none"
              />

              <div className="mb-6">
                <div className="mb-2 text-sm font-semibold text-gray-700">Finish level</div>
                <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {([
                    ['value', 'Value'],
                    ['standard', 'Standard'],
                    ['premium', 'Premium'],
                  ] as Array<[FinishLevel, string]>).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFinishLevel(value)}
                      className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition ${
                        finishLevel === value
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-6 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Labor estimate</span>
                  <strong>{formatCurrency(estimate.labor)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Materials allowance</span>
                  <strong>{formatCurrency(estimate.materials)}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recommended contingency</span>
                  <strong>{formatCurrency(estimate.allowance)}</strong>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base text-gray-900">
                  <span className="font-semibold">Projected investment</span>
                  <strong>{formatCurrency(estimate.total)}</strong>
                </div>
                <p className="rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
                  Planning range: {formatCurrency(estimate.value)} to {formatCurrency(estimate.premium)}.
                  Final pricing will depend on site conditions, selected products, and scope confirmation.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button variant="primary" href="/contact" fullWidth>
                  <Icon name="ClipboardEdit" size={18} />
                  Get a Written Estimate
                </Button>
                <Button variant="outline" href={siteConfig.phoneHref} fullWidth>
                  <Icon name="Phone" size={18} />
                  {siteConfig.phoneDisplay}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
