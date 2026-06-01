import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const BILLING_PERIODS = [
  { value: 'monthly', label: 'Monthly', discount: 0 },
  { value: 'semi-annual', label: '6 Months', discount: 0.25 },
  { value: 'annual', label: 'Yearly', discount: 0.50 },
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started',
    basePrice: 5,
    features: [
      'Up to 50 feedbacks/month',
      'Basic AI analysis',
      'Task management',
      'CSV export',
      'Category auto-tagging',
    ],
    badge: null,
    cta: 'Get Started'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams',
    basePrice: 8,
    features: [
      'Up to 200 feedbacks/month',
      'Advanced AI analysis',
      'Full task management',
      'CSV & JSON export',
      'Category auto-tagging',
      'Priority support',
      'Custom Gemini key',
      'Kanban & List views',
      'Due dates & reminders',
      'Advanced analytics',
      'API access (Beta)',
    ],
    badge: 'Most Popular',
    cta: 'Upgrade Now'
  },
  {
    id: 'pro-max',
    name: 'Pro Max',
    description: 'Enterprise-grade power',
    basePrice: 15,
    features: [
      'Unlimited feedbacks/month',
      'Premium AI analysis',
      'Advanced task workflows',
      'All export formats',
      'Category auto-tagging',
      'Priority support (24/7)',
      'Custom Gemini key',
      'Kanban & List views',
      'Due dates & reminders',
      'Advanced analytics',
      'Full API access',
      'Webhook integrations',
      'Custom branding',
      'Client-ready reports',
    ],
    badge: 'Best Value',
    cta: 'Go Pro Max'
  }
];

export default function PricingModal({ open, onClose, onSelectPlan }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const currentPeriod = BILLING_PERIODS.find(p => p.value === billingPeriod);
  const discount = currentPeriod?.discount || 0;

  const calculatePrice = (basePrice) => {
    const monthlyPrice = basePrice;
    let period = 1;
    let totalDiscount = 0;

    if (billingPeriod === 'semi-annual') {
      period = 6;
      totalDiscount = monthlyPrice * period * discount;
    } else if (billingPeriod === 'annual') {
      period = 12;
      totalDiscount = monthlyPrice * period * discount;
    }

    const total = monthlyPrice * period - totalDiscount;
    const effectiveMonthly = total / period;

    return {
      total: total.toFixed(2),
      effectiveMonthly: effectiveMonthly.toFixed(2),
      saved: totalDiscount.toFixed(2),
      period
    };
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl max-h-[95vh] flex flex-col card" style={{ background: 'var(--surface)' }}>
        {/* Sticky Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-2xl font-800" style={{ color: 'var(--text)' }}>Simple, Transparent Pricing</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>Choose the plan that works best for you</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[var(--surface-2)] rounded-lg flex-shrink-0">
            <X size={20} style={{ color: 'var(--text-2)' }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-6">
            {/* Billing Period Selector */}
            <div className="flex justify-center">
              <div className="inline-flex gap-2 p-1.5 rounded-2xl" style={{ background: 'var(--surface-2)' }}>
                {BILLING_PERIODS.map(period => (
                  <button
                    key={period.value}
                    onClick={() => setBillingPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg font-600 text-xs transition-all relative ${
                      billingPeriod === period.value
                        ? 'text-white'
                        : 'text-[var(--text-2)] hover:text-[var(--text)]'
                    }`}
                    style={{
                      background: billingPeriod === period.value ? 'var(--brand)' : 'transparent'
                    }}
                  >
                    {period.label}
                    {period.discount > 0 && (
                      <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded text-xs font-700" style={{ background: '#fbbf24', color: '#78350f' }}>
                        -{Math.round(period.discount * 100)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan, idx) => {
                const pricing = calculatePrice(plan.basePrice);
                const isPopular = plan.badge === 'Most Popular';

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border-2 p-5 flex flex-col transition-all ${
                      isPopular ? 'md:scale-105 md:shadow-lg' : ''
                    }`}
                    style={{
                      borderColor: isPopular ? 'var(--brand)' : 'var(--border)',
                      background: isPopular ? 'var(--brand-light)' : 'var(--surface-2)'
                    }}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div className="absolute -top-2.5 left-5 px-3 py-0.5 rounded-full font-700 text-xs" style={{ background: 'var(--brand)', color: 'white' }}>
                        {plan.badge}
                      </div>
                    )}

                    {/* Plan Name & Description */}
                    <div className="mb-4">
                      <h3 className="text-lg font-800" style={{ color: 'var(--text)' }}>{plan.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{plan.description}</p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-800" style={{ color: 'var(--text)' }}>
                          ${pricing.effectiveMonthly}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                          {billingPeriod === 'monthly' ? '/mo' : `/mo`}
                        </span>
                      </div>
                      {billingPeriod !== 'monthly' && (
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-xs font-600" style={{ color: 'var(--success)' }}>
                            Save ${pricing.saved}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: '#dcfce7', color: '#166534' }}>
                            ${pricing.total} total
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => onSelectPlan(plan.id, billingPeriod)}
                      className={`w-full py-2.5 rounded-lg font-700 text-xs mb-4 transition-all ${
                        isPopular ? 'btn btn-primary' : 'btn btn-secondary'
                      }`}
                    >
                      {plan.cta}
                    </button>

                    {/* Features - Limited to 8 visible */}
                    <div className="space-y-2 flex-1">
                      {plan.features.slice(0, 8).map((feature, fdx) => (
                        <div key={fdx} className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'var(--brand)', color: 'white' }}>
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <span className="text-xs" style={{ color: 'var(--text-2)' }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                      {plan.features.length > 8 && (
                        <p className="text-xs font-600 mt-2 pt-2 border-t" style={{ color: 'var(--brand)', borderColor: 'var(--border)' }}>
                          +{plan.features.length - 8} more features
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FAQ Section - Compact */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-sm font-800 mb-4" style={{ color: 'var(--text)' }}>❓ Quick FAQs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    q: 'Can I change plans?',
                    a: 'Yes! Upgrade or downgrade anytime. Changes take effect on your next billing cycle.'
                  },
                  {
                    q: 'Free trial?',
                    a: 'Yes, 2 free feedbacks/month on the free plan. No credit card required!'
                  },
                  {
                    q: 'Payment methods?',
                    a: 'Credit cards, PayPal, and Apple Pay via secure payment processor.'
                  },
                  {
                    q: 'Annual discount?',
                    a: 'Save 50% with yearly billing vs monthly!'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
                    <p className="font-600 text-xs mb-1" style={{ color: 'var(--text)' }}>{item.q}</p>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-3 rounded-lg text-center" style={{ background: 'var(--brand-light)' }}>
              <p className="text-xs" style={{ color: 'var(--text-2)' }}>
                🔒 All plans secured with 256-bit encryption. Your data is always safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
