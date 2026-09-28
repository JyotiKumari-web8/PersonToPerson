import React, { useState, useEffect } from 'react';
import { planService } from '@/services/planService';
import { businessService } from '@/services/businessService';
import { Plan, Subscription, Business, SubscriptionStatus, BillingInterval } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Alert } from '@/components/common/Alert';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Building2,
  Calendar,
  Search,
  RefreshCw,
  Sliders,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export const PlansManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans'>('subscriptions');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Plan Modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    is_free: false,
    price: 0,
    currency: 'INR',
    billing_interval: 'monthly' as BillingInterval,
    duration_days: '' as string,
    max_links: 3,
    analytics_tier: 'basic' as 'basic' | 'standard' | 'advanced',
    featuresText: '',
    is_active: true,
  });
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);

  // Assign Subscription Modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [currentSubForBiz, setCurrentSubForBiz] = useState<Subscription | null>(null);
  const [assignForm, setAssignForm] = useState({
    plan_id: '',
    status: 'active' as SubscriptionStatus,
    start_date: '',
    expires_at: '',
    notes: '',
  });
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allPlans, allSubs, allBiz] = await Promise.all([
        planService.getAllPlans(true),
        planService.getAllSubscriptions(),
        businessService.getAllBusinesses(),
      ]);
      setPlans(allPlans);
      setSubscriptions(allSubs);
      setBusinesses(allBiz);
    } catch (err) {
      console.error('Failed to load plans & subscriptions:', err);
      setFeedback({ type: 'error', message: 'Failed to load plans and subscriptions data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // ----------------------------------------------------------------------------
  // PLAN CRUD HANDLERS
  // ----------------------------------------------------------------------------
  const handleOpenCreatePlan = () => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      description: '',
      is_free: false,
      price: 499,
      currency: 'INR',
      billing_interval: 'monthly',
      duration_days: '30',
      max_links: 5,
      analytics_tier: 'standard',
      featuresText: 'Single Permanent URL\nVector QR Code\nStandard Analytics\nAuthentic SVG Icons',
      is_active: true,
    });
    setIsPlanModalOpen(true);
  };

  const handleOpenEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      description: plan.description || '',
      is_free: plan.is_free,
      price: plan.price,
      currency: plan.currency || 'INR',
      billing_interval: plan.billing_interval,
      duration_days: plan.duration_days !== null && plan.duration_days !== undefined ? String(plan.duration_days) : '',
      max_links: Number(plan.limits?.max_links) || 3,
      analytics_tier: (plan.limits?.analytics_tier as 'basic' | 'standard' | 'advanced') || 'basic',
      featuresText: (plan.features || []).join('\n'),
      is_active: plan.is_active,
    });
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      showFeedback('error', 'Please provide a plan name.');
      return;
    }

    try {
      setIsSubmittingPlan(true);
      const parsedFeatures = planForm.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const durationVal = planForm.duration_days.trim() ? parseInt(planForm.duration_days, 10) : null;

      const payload = {
        name: planForm.name.trim(),
        description: planForm.description.trim() || undefined,
        is_free: planForm.is_free,
        price: planForm.is_free ? 0 : Number(planForm.price) || 0,
        currency: planForm.currency,
        billing_interval: planForm.billing_interval,
        duration_days: durationVal,
        features: parsedFeatures,
        limits: {
          max_links: Number(planForm.max_links) || 3,
          analytics_tier: planForm.analytics_tier,
        },
        is_active: planForm.is_active,
      };

      if (editingPlan) {
        await planService.updatePlan(editingPlan.id, payload);
        showFeedback('success', `Plan "${payload.name}" updated successfully.`);
      } else {
        await planService.createPlan(payload);
        showFeedback('success', `Plan "${payload.name}" created successfully.`);
      }

      setIsPlanModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      console.error('Failed to save plan:', err);
      showFeedback('error', err instanceof Error ? err.message : 'Failed to save plan.');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleTogglePlanActive = async (plan: Plan) => {
    try {
      const updated = await planService.updatePlan(plan.id, { is_active: !plan.is_active });
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
      showFeedback('success', `Plan "${plan.name}" is now ${updated.is_active ? 'active' : 'inactive'}.`);
    } catch {
      showFeedback('error', 'Failed to update plan status.');
    }
  };

  const handleDeletePlan = async (plan: Plan) => {
    if (plan.is_free) {
      showFeedback('error', 'The Free plan is required by the platform and cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
      return;
    }

    try {
      await planService.deletePlan(plan.id);
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
      showFeedback('success', `Plan "${plan.name}" removed.`);
    } catch {
      showFeedback('error', 'Could not delete plan. It might be assigned to active subscriptions.');
    }
  };

  // ----------------------------------------------------------------------------
  // SUBSCRIPTION ASSIGNMENT HANDLERS
  // ----------------------------------------------------------------------------
  const handleOpenAssignModal = (business: Business) => {
    setSelectedBusiness(business);
    const existingSub = subscriptions.find((s) => s.business_id === business.id);
    setCurrentSubForBiz(existingSub || null);

    const defaultPlan = plans.find((p) => p.is_free) || plans[0];
    const targetPlanId = existingSub?.plan_id || defaultPlan?.id || '';

    setAssignForm({
      plan_id: targetPlanId,
      status: existingSub?.status || 'active',
      start_date: existingSub?.start_date ? existingSub.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      expires_at: existingSub?.expires_at ? existingSub.expires_at.split('T')[0] : '',
      notes: existingSub?.notes || '',
    });

    setIsAssignModalOpen(true);
  };

  const handleSaveAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness || !assignForm.plan_id) return;

    try {
      setIsSubmittingAssign(true);
      const chosenPlan = plans.find((p) => p.id === assignForm.plan_id);

      let finalExpiresAt: string | null = null;
      if (assignForm.expires_at) {
        finalExpiresAt = new Date(assignForm.expires_at + 'T23:59:59').toISOString();
      } else if (chosenPlan?.duration_days && !chosenPlan.is_free) {
        const d = new Date(assignForm.start_date || new Date().toISOString());
        d.setDate(d.getDate() + chosenPlan.duration_days);
        finalExpiresAt = d.toISOString();
      }

      await planService.assignPlanToBusiness(selectedBusiness.id, assignForm.plan_id, {
        startDate: assignForm.start_date ? new Date(assignForm.start_date).toISOString() : new Date().toISOString(),
        expiresAt: finalExpiresAt,
        status: assignForm.status,
        notes: assignForm.notes.trim() || undefined,
      });

      showFeedback('success', `Plan updated for "${selectedBusiness.name}".`);
      setIsAssignModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      console.error('Failed to assign plan:', err);
      showFeedback('error', err instanceof Error ? err.message : 'Failed to update subscription.');
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  const handleQuickExtend = async (sub: Subscription) => {
    try {
      const plan = plans.find((p) => p.id === sub.plan_id);
      const addDays = plan?.duration_days || 30;

      const baseDate = sub.expires_at && new Date(sub.expires_at) > new Date() ? new Date(sub.expires_at) : new Date();
      baseDate.setDate(baseDate.getDate() + addDays);

      await planService.updateSubscriptionStatus(sub.id, 'active', baseDate.toISOString());
      showFeedback('success', `Subscription extended by ${addDays} days.`);
      await loadData();
    } catch {
      showFeedback('error', 'Failed to extend subscription.');
    }
  };

  const handleQuickStatusToggle = async (sub: Subscription) => {
    const nextStatus: SubscriptionStatus = sub.status === 'active' ? 'cancelled' : 'active';
    try {
      await planService.updateSubscriptionStatus(sub.id, nextStatus);
      showFeedback('success', `Subscription marked as ${nextStatus}.`);
      await loadData();
    } catch {
      showFeedback('error', 'Failed to update subscription status.');
    }
  };

  // Filter businesses by search query
  const filteredBusinesses = businesses.filter((b) => {
    const q = searchQuery.toLowerCase();
    const sub = subscriptions.find((s) => s.business_id === b.id);
    const planName = sub?.plan?.name || plans.find((p) => p.id === sub?.plan_id)?.name || 'Free';
    return (
      b.name.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      (b.owner_email && b.owner_email.toLowerCase().includes(q)) ||
      planName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#3D2B1F]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#FBF9F5] tracking-tight">
              Plans & Subscriptions Control
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] shadow-xs">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-[#9E8E81] mt-1">
            Create and edit plans, customize feature limits (e.g. max links), and assign tiers directly to businesses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'plans' && (
            <Button variant="primary" size="sm" onClick={handleOpenCreatePlan} icon={<Plus className="w-4 h-4" />}>
              Create New Plan
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={loadData} icon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
        </div>
      </div>

      {feedback && <Alert type={feedback.type} message={feedback.message} />}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#3D2B1F] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'subscriptions'
              ? 'bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] shadow-xs'
              : 'text-[#9E8E81] hover:text-[#FBF9F5]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Business Subscriptions ({businesses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'plans'
              ? 'bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F] shadow-xs'
              : 'text-[#9E8E81] hover:text-[#FBF9F5]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Plan Catalog & Limits ({plans.length})</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading plans and subscriptions..." />
      ) : activeTab === 'subscriptions' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-80">
              <Input
                placeholder="Search business, slug, or plan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftAddon={<Search className="w-4 h-4 text-[#9E8E81]" />}
              />
            </div>

            <div className="text-xs text-[#9E8E81]">
              Showing <strong className="text-[#FBF9F5]">{filteredBusinesses.length}</strong> businesses
            </div>
          </div>

          <Card>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#3D2B1F] bg-[#1B120B]/60 text-[#9E8E81]">
                    <th className="py-3 px-4 font-bold">Business</th>
                    <th className="py-3 px-4 font-bold">Owner</th>
                    <th className="py-3 px-4 font-bold">Assigned Plan</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold">Expires</th>
                    <th className="py-3 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3D2B1F]/60">
                  {filteredBusinesses.map((biz) => {
                    const sub = subscriptions.find((s) => s.business_id === biz.id);
                    const plan = plans.find((p) => p.id === sub?.plan_id) || plans.find((p) => p.is_free) || plans[0];
                    const isExpired = sub?.expires_at && new Date(sub.expires_at) < new Date();
                    const status = isExpired ? 'expired' : sub?.status || 'active';

                    return (
                      <tr key={biz.id} className="hover:bg-[#1B120B]/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#FBF9F5] truncate max-w-[180px]">{biz.name}</div>
                          <div className="font-mono text-[10.5px] text-[#D49B5B] truncate">/b/{biz.slug}</div>
                        </td>

                        <td className="py-3 px-4 text-[#DDD3CA]">
                          <div className="truncate max-w-[160px]">{biz.owner_email || biz.email || '—'}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                plan?.is_free
                                  ? 'bg-[#241810] text-[#D49B5B] border border-[#3D2B1F]'
                                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                              }`}
                            >
                              {plan?.name || 'Free'}
                            </span>
                            <span className="text-[10px] text-[#9E8E81]">
                              ({plan?.limits?.max_links ?? 3} links)
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'active'
                                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/50'
                                : status === 'expired'
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                                : 'bg-rose-950/40 text-rose-400 border border-rose-800/50'
                            }`}
                          >
                            {status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                            {status === 'expired' && <Clock className="w-3 h-3" />}
                            {status === 'cancelled' && <XCircle className="w-3 h-3" />}
                            <span>{status}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[#9E8E81] text-[11px]">
                          {sub?.expires_at ? (
                            <span className={isExpired ? 'text-amber-400 font-bold' : ''}>
                              {new Date(sub.expires_at).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-[#9E8E81]">Never (Lifetime)</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAssignModal(biz)}
                              className="text-[11px] py-1 px-2.5 h-auto"
                            >
                              Change Plan
                            </Button>

                            {sub && sub.expires_at && (
                              <button
                                type="button"
                                onClick={() => handleQuickExtend(sub)}
                                title="Renew/Extend Duration"
                                className="p-1.5 rounded-lg bg-[#241810] text-[#D49B5B] hover:bg-[#2E1F15] border border-[#3D2B1F] cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {sub && (
                              <button
                                type="button"
                                onClick={() => handleQuickStatusToggle(sub)}
                                title={sub.status === 'active' ? 'Cancel Subscription' : 'Activate Subscription'}
                                className="p-1.5 rounded-lg bg-[#241810] text-[#9E8E81] hover:text-[#FBF9F5] hover:bg-[#2E1F15] border border-[#3D2B1F] cursor-pointer"
                              >
                                {sub.status === 'active' ? (
                                  <X className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative flex flex-col justify-between overflow-hidden">
              {!plan.is_active && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-950/60 text-amber-400 border border-amber-800/60">
                  Inactive
                </div>
              )}

              <div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    {plan.is_free && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#241810] text-[#D49B5B] border border-[#3D2B1F]">
                        Free Tier
                      </span>
                    )}
                  </div>
                  {plan.description && (
                    <p className="text-xs text-[#9E8E81] mt-1 leading-relaxed">{plan.description}</p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4 pt-1">
                  {/* Price Banner */}
                  <div className="p-3 bg-[#1B120B] rounded-xl border border-[#3D2B1F] flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#FBF9F5]">
                        {plan.is_free ? '₹0' : `₹${plan.price}`}
                      </span>
                      <span className="text-xs text-[#9E8E81] ml-1">/ {plan.billing_interval}</span>
                    </div>

                    <span className="text-[11px] text-[#D49B5B] font-medium">
                      {plan.duration_days ? `${plan.duration_days} days` : 'Lifetime'}
                    </span>
                  </div>

                  {/* Configurable Limits Summary */}
                  <div className="space-y-2 p-3 bg-[#241810]/70 rounded-xl border border-[#3D2B1F]">
                    <div className="text-[11px] font-bold text-[#D49B5B] uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-[#D49B5B]" />
                      <span>Configured Limits</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#DDD3CA]">
                      <span>Max Active Links:</span>
                      <strong className="text-[#FBF9F5] font-bold">
                        {plan.limits?.max_links ?? 3} links
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#DDD3CA]">
                      <span>Analytics Tier:</span>
                      <strong className="text-[#FBF9F5] capitalize">
                        {(plan.limits?.analytics_tier as string) || 'Basic'}
                      </strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <div>
                    <span className="text-[11px] font-bold text-[#9E8E81] uppercase tracking-wider block mb-2">
                      Included Features:
                    </span>
                    <ul className="space-y-1.5">
                      {(plan.features || []).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#DDD3CA]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                          <span>{feat.replace(/_/g, ' ')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-3 border-t border-[#3D2B1F] flex items-center justify-between gap-2 mt-4 bg-[#1B120B]/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePlanActive(plan)}
                  className="text-xs"
                >
                  {plan.is_active ? 'Deactivate' : 'Activate'}
                </Button>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditPlan(plan)}
                    icon={<Pencil className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>

                  {!plan.is_free && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeletePlan(plan)}
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      className="px-2"
                      title="Delete plan"
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title={editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Plan'}
        description="Configure pricing, billing interval, active link limits, and available features."
        maxWidth="lg"
      >
        <form onSubmit={handleSavePlan} className="space-y-4">
          <Input
            label="Plan Name"
            placeholder="e.g. Free, Starter, Pro Enterprise"
            value={planForm.name}
            onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
            required
          />

          <Input
            label="Description"
            placeholder="Brief summary of who this plan is suitable for"
            value={planForm.description}
            onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
          />

          {/* Free vs Paid Toggle */}
          <div className="p-3 bg-[#1B120B] rounded-xl border border-[#3D2B1F] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#FBF9F5] block">Is this a Free Plan?</span>
              <span className="text-[11px] text-[#9E8E81]">
                Free plans have zero cost and typically do not expire.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={planForm.is_free}
              onClick={() => setPlanForm({ ...planForm, is_free: !planForm.is_free, price: 0 })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                planForm.is_free ? 'bg-[#D49B5B]' : 'bg-[#2E1F15] border border-[#3D2B1F]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition ${
                  planForm.is_free ? 'translate-x-5 bg-[#140D08]' : 'translate-x-0 bg-[#9E8E81]'
                }`}
              />
            </button>
          </div>

          {/* Pricing & Interval */}
          {!planForm.is_free && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Price (INR)"
                type="number"
                min="0"
                step="1"
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                required
              />

              <div>
                <label className="block text-xs font-bold text-[#DDD3CA] mb-1.5 uppercase tracking-wider">
                  Billing Interval
                </label>
                <select
                  value={planForm.billing_interval}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, billing_interval: e.target.value as BillingInterval })
                  }
                  className="w-full bg-[#1B120B] border border-[#3D2B1F] rounded-xl px-3 py-2 text-xs text-[#FBF9F5] focus:outline-none focus:border-[#D49B5B]"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="lifetime">Lifetime</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <Input
                label="Duration (Days)"
                type="number"
                placeholder="Leave blank for lifetime"
                value={planForm.duration_days}
                onChange={(e) => setPlanForm({ ...planForm, duration_days: e.target.value })}
                helperText="e.g. 30, 365"
              />
            </div>
          )}

          {/* Feature Limits (No hardcoding) */}
          <div className="p-3.5 bg-[#241810] rounded-xl border border-[#3D2B1F] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D49B5B] uppercase tracking-wide">
              <Sliders className="w-3.5 h-3.5" />
              <span>Configurable Feature Limits</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Max Active Links Allowed"
                type="number"
                min="1"
                max="50"
                value={planForm.max_links}
                onChange={(e) => setPlanForm({ ...planForm, max_links: parseInt(e.target.value, 10) || 1 })}
                required
                helperText="Database dynamically enforces this limit."
              />

              <div>
                <label className="block text-xs font-bold text-[#DDD3CA] mb-1.5 uppercase tracking-wider">
                  Analytics Tier
                </label>
                <select
                  value={planForm.analytics_tier}
                  onChange={(e) =>
                    setPlanForm({
                      ...planForm,
                      analytics_tier: e.target.value as 'basic' | 'standard' | 'advanced',
                    })
                  }
                  className="w-full bg-[#1B120B] border border-[#3D2B1F] rounded-xl px-3 py-2 text-xs text-[#FBF9F5] focus:outline-none focus:border-[#D49B5B]"
                >
                  <option value="basic">Basic (Total Visits & Clicks)</option>
                  <option value="standard">Standard (Visits, Clicks, Timeline)</option>
                  <option value="advanced">Advanced (CTR, Device Breakdown, Link Distribution)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] mb-1.5 uppercase tracking-wider">
              Included Features (One per line)
            </label>
            <textarea
              rows={4}
              value={planForm.featuresText}
              onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
              placeholder="Single Permanent URL&#10;Vector QR Code&#10;Custom Links"
              className="w-full bg-[#1B120B] border border-[#3D2B1F] rounded-xl p-3 text-xs text-[#FBF9F5] focus:outline-none focus:border-[#D49B5B] font-mono leading-relaxed"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-[#FBF9F5] block">Plan Active Status</span>
              <span className="text-[11px] text-[#9E8E81]">
                Active plans can be assigned to businesses.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={planForm.is_active}
              onClick={() => setPlanForm({ ...planForm, is_active: !planForm.is_active })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                planForm.is_active ? 'bg-[#D49B5B]' : 'bg-[#2E1F15] border border-[#3D2B1F]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition ${
                  planForm.is_active ? 'translate-x-5 bg-[#140D08]' : 'translate-x-0 bg-[#9E8E81]'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#3D2B1F]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingPlan}>
              {editingPlan ? 'Save Plan Changes' : 'Create Plan'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={selectedBusiness ? `Assign Plan: ${selectedBusiness.name}` : 'Assign Plan'}
        description="Change plan tier, set custom start/expiry dates, or adjust subscription status."
        maxWidth="md"
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] mb-1.5 uppercase tracking-wider">
              Select Plan Tier
            </label>
            <select
              value={assignForm.plan_id}
              onChange={(e) => setAssignForm({ ...assignForm, plan_id: e.target.value })}
              className="w-full bg-[#1B120B] border border-[#3D2B1F] rounded-xl px-3 py-2.5 text-xs text-[#FBF9F5] focus:outline-none focus:border-[#D49B5B]"
              required
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.is_free ? 'Free' : `₹${p.price}/${p.billing_interval}`} ({p.limits?.max_links ?? 3} links)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#DDD3CA] mb-1.5 uppercase tracking-wider">
              Subscription Status
            </label>
            <select
              value={assignForm.status}
              onChange={(e) =>
                setAssignForm({ ...assignForm, status: e.target.value as SubscriptionStatus })
              }
              className="w-full bg-[#1B120B] border border-[#3D2B1F] rounded-xl px-3 py-2 text-xs text-[#FBF9F5] focus:outline-none focus:border-[#D49B5B]"
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="past_due">Past Due</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={assignForm.start_date}
              onChange={(e) => setAssignForm({ ...assignForm, start_date: e.target.value })}
              required
            />

            <Input
              label="Expiry Date"
              type="date"
              value={assignForm.expires_at}
              onChange={(e) => setAssignForm({ ...assignForm, expires_at: e.target.value })}
              helperText="Leave empty for lifetime or free plans"
            />
          </div>

          <Input
            label="Admin Notes"
            placeholder="e.g. Paid offline via UPI, annual contract"
            value={assignForm.notes}
            onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
          />

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#3D2B1F]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmittingAssign}>
              Save Subscription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
