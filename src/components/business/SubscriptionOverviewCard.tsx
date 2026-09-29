import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { planService } from '@/services/planService';
import { authService } from '@/services/authService';
import { BusinessSubscriptionDetails } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Sliders,
  Mail,
  ShieldAlert,
  ArrowUpRight,
} from 'lucide-react';

export const SubscriptionOverviewCard: React.FC = () => {
  const { business } = useAuth();
  const [subDetails, setSubDetails] = useState<BusinessSubscriptionDetails | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    async function loadSub() {
      if (!business) return;
      try {
        setIsLoading(true);
        const [data, email] = await Promise.all([
          planService.getSubscriptionByBusinessId(business.id),
          authService.getAdminEmail(),
        ]);
        setSubDetails(data);
        if (email) setAdminEmail(email);
      } catch (err) {
        console.error('Failed to load subscription details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSub();
  }, [business]);

  if (!business) return null;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <LoadingSpinner label="Loading subscription details..." />
        </CardContent>
      </Card>
    );
  }

  const maxLinks = subDetails?.max_links ?? 3;
  const activeCount = subDetails?.active_links_count ?? 0;
  const percentage = Math.min(100, Math.round((activeCount / maxLinks) * 100));

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Current Plan & Subscription</CardTitle>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    subDetails?.is_free
                      ? 'bg-[#241810] text-[#D49B5B] border border-[#3D2B1F]'
                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                  }`}
                >
                  {subDetails?.plan_name || 'Free'}
                </span>
              </div>
              <CardDescription>
                {subDetails?.plan_description || 'Assigned and managed directly by the Platform Admin.'}
              </CardDescription>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowUpgradeModal(true)}
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Contact Admin to Upgrade
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div className="p-3 bg-[#1B120B] rounded-xl border border-[#3D2B1F]">
              <span className="text-[11px] font-bold text-[#9E8E81] uppercase tracking-wider block">
                Subscription Status
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span className="text-sm font-bold text-[#FBF9F5] capitalize">
                  {subDetails?.status || 'Active'}
                </span>
              </div>
            </div>

            {/* Price / Interval */}
            <div className="p-3 bg-[#1B120B] rounded-xl border border-[#3D2B1F]">
              <span className="text-[11px] font-bold text-[#9E8E81] uppercase tracking-wider block">
                Plan Price
              </span>
              <div className="mt-1 text-sm font-bold text-[#FBF9F5]">
                {subDetails?.is_free ? (
                  <span>Free (₹0)</span>
                ) : (
                  <span>
                    ₹{subDetails?.price} / {subDetails?.billing_interval}
                  </span>
                )}
              </div>
            </div>

            {/* Expiry Date */}
            <div className="p-3 bg-[#1B120B] rounded-xl border border-[#3D2B1F]">
              <span className="text-[11px] font-bold text-[#9E8E81] uppercase tracking-wider block">
                Expiration
              </span>
              <div className="mt-1 text-sm font-bold text-[#FBF9F5]">
                {subDetails?.expires_at ? (
                  new Date(subDetails.expires_at).toLocaleDateString()
                ) : (
                  <span className="text-[#D49B5B]">Never (Continuous)</span>
                )}
              </div>
            </div>
          </div>

          {/* Active Links Usage Meter */}
          <div className="p-4 bg-[#241810] rounded-xl border border-[#3D2B1F] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#FBF9F5]">Active Links Usage</span>
              <span className="font-bold text-[#D49B5B]">
                {activeCount} / {maxLinks} links used
              </span>
            </div>

            <div className="w-full bg-[#1B120B] h-2.5 rounded-full overflow-hidden border border-[#3D2B1F]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentage >= 100
                    ? 'bg-amber-500'
                    : percentage >= 80
                    ? 'bg-[#D49B5B]'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#9E8E81]">
              <span>Plan Limit: {maxLinks} active links</span>
              {activeCount >= maxLinks && (
                <span className="text-amber-400 font-semibold">Limit reached. Contact Admin to add more links.</span>
              )}
            </div>
          </div>

          {/* Features list */}
          {subDetails?.features && subDetails.features.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#9E8E81] uppercase tracking-wider block mb-2">
                Available Features on this Plan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subDetails.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-[#DDD3CA]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                    <span className="capitalize">{feat.replace(/_/g, ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Your Subscription Plan"
        description="Subscription plans and feature limits are managed directly by the Platform Admin."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-[#241810] rounded-xl border border-[#3D2B1F] space-y-2 text-xs text-[#DDD3CA]">
            <p className="leading-relaxed">
              To upgrade from <strong className="text-[#FBF9F5]">{subDetails?.plan_name}</strong> to a higher tier
              with more active links, advanced analytics, or partner placement:
            </p>

            <div className="p-3 bg-[#1B120B] rounded-lg border border-[#3D2B1F] space-y-1 font-mono text-xs">
              <div className="text-[#D49B5B] font-bold">Contact Platform Admin:</div>
              <div className="text-[#FBF9F5]">Email: {adminEmail}</div>
              <div className="text-[#9E8E81]">Reference Business Slug: /b/{business.slug}</div>
            </div>

            <p className="text-[11px] text-[#9E8E81] pt-1">
              Your Platform Admin will instantly upgrade your plan from the Admin Panel. Changes apply immediately to your account without needing code modifications.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <a
              href={`mailto:${adminEmail}?subject=${encodeURIComponent(
                'Request to Increase Link Limit / Upgrade Plan'
              )}&body=${encodeURIComponent(
                `Hi Admin,\n\nI would like to request a plan upgrade / link limit increase for "${business.name}" (Slug: /b/${business.slug}, Current Plan: ${subDetails?.plan_name || 'Free'}).\n\nThank you,\n${business.name}`
              )}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#140D08] bg-[#D49B5B] hover:bg-[#E2B176] rounded-xl transition-all shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Compose Email to Admin</span>
            </a>

            <Button variant="outline" size="sm" onClick={() => setShowUpgradeModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
