import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { businessService } from '@/services/businessService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { getPublicBusinessUrl, getInternalBusinessPath } from '@/lib/utils';
import { Building2, Lock, Save, ExternalLink, Image, Phone, Mail, MapPin } from 'lucide-react';

export const BusinessProfile: React.FC = () => {
  const { user, business, refreshBusiness } = useAuth();

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [slug, setSlug] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setLogoUrl(business.logo_url || '');
      setCoverUrl(business.cover_url || '');
      setDescription(business.description || '');
      setPhone(business.phone || '');
      setEmail(business.email || '');
      setAddress(business.address || '');
      setCategory(business.category || '');
      setCity(business.city || '');
      setSlug(business.slug || '');
    }
  }, [business]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Business name is required.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (business) {
        // Update existing business profile — slug remains permanent!
        await businessService.updateBusiness(business.id, {
          name: trimmedName,
          logo_url: logoUrl.trim() || undefined,
          cover_url: coverUrl.trim() || undefined,
          description: description.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          category: category.trim() || undefined,
          city: city.trim() || undefined,
        });
        setSuccessMessage('Business profile updated successfully! Your permanent public URL remains unchanged.');
      } else if (user) {
        // First-time business profile creation
        const newBiz = await businessService.createBusiness({
          user_id: user.id,
          name: trimmedName,
          logo_url: logoUrl.trim() || undefined,
          cover_url: coverUrl.trim() || undefined,
          description: description.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          category: category.trim() || undefined,
          city: city.trim() || undefined,
        });
        setSlug(newBiz.slug);
        setSuccessMessage('Business profile created! Your unique permanent public URL is now generated.');
      }

      await refreshBusiness();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save business profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const publicUrl = slug ? getPublicBusinessUrl(slug) : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
          {business ? 'Business Profile Settings' : 'Create Business Profile'}
        </h1>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Manage your official business info. Updating your details will never break your permanent public URL.
        </p>
      </div>

      {successMessage && (
        <Alert type="success" title="Success" message={successMessage} />
      )}
      {errorMessage && (
        <Alert type="error" title="Error" message={errorMessage} />
      )}

      {/* Permanent Slug Notice */}
      {slug && (
        <div className="p-4.5 bg-[#0B1728] rounded-2xl border border-[#20344D] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#14243A] text-[#38BDF8] border border-[#20344D] rounded-xl shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F8FAFC] tracking-tight">
                  Locked Permanent Public URL
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#14243A] text-[#38BDF8] border border-[#20344D] px-2 py-0.5 rounded-full">
                  Immutable
                </span>
              </div>
              <p className="text-xs text-[#38BDF8] font-mono mt-0.5 select-all font-semibold">
                {publicUrl}
              </p>
            </div>
          </div>
          <a
            href={getInternalBusinessPath(slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#CBD5E1] hover:text-[#38BDF8] bg-[#14243A] border border-[#20344D] rounded-xl hover:bg-[#101D30] shadow-sm transition-all shrink-0"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Core Information</CardTitle>
              <CardDescription>
                Primary details displayed on your mobile-first customer page
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Business Name */}
            <Input
              label="Business Name"
              placeholder="e.g. Acme Cafe, City Care Dental"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftAddon={<Building2 className="w-4 h-4" />}
            />

            {/* Category & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business Category"
                placeholder="e.g. Restaurant, Dental, Retail, Fitness, Legal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <Input
                label="City / Location"
                placeholder="e.g. San Francisco, CA or London, UK"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                leftAddon={<MapPin className="w-4 h-4" />}
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
                Short Description / Tagline
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-[#20344D] hover:border-[#38BDF8]/40 bg-[#14243A] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 focus:border-[#38BDF8] transition-all shadow-inner"
                placeholder="Briefly describe what your business offers (shown on your customer profile page)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
              <p className="mt-1 text-[11px] text-[#94A3B8]">
                Maximum 300 characters. {300 - description.length} remaining.
              </p>
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#20344D]">
              <Input
                label="Logo Image URL"
                placeholder="https://images.yourdomain.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                leftAddon={<Image className="w-4 h-4" />}
                helperText="Square image recommended (e.g. 400x400)."
              />
              <Input
                label="Cover Banner Image URL (Optional)"
                placeholder="https://images.yourdomain.com/cover.jpg"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                leftAddon={<Image className="w-4 h-4" />}
                helperText="Header banner (e.g. 1200x500)."
              />
            </div>

            {/* Contact Information */}
            <div className="pt-3 border-t border-[#20344D]">
              <h4 className="text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-3">
                Customer Direct Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Direct Phone Number"
                  placeholder="+1 234 567 8900"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  leftAddon={<Phone className="w-4 h-4" />}
                  helperText="Enables 1-tap phone calling button for visitors."
                />
                <Input
                  label="Business Email"
                  placeholder="contact@yourbusiness.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftAddon={<Mail className="w-4 h-4" />}
                  helperText="Enables 1-tap email button."
                />
              </div>

              <div className="mt-4">
                <Input
                  label="Physical Address / Street"
                  placeholder="Street address, Suite / Floor"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  leftAddon={<MapPin className="w-4 h-4" />}
                  helperText="Enables 1-tap Google Maps directions button."
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-3">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              icon={<Save className="w-4 h-4" />}
            >
              {business ? 'Save Profile Changes' : 'Create Business Profile'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

