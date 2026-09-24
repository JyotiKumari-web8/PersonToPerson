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
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          {business ? 'Business Profile Settings' : 'Create Business Profile'}
        </h1>
        <p className="text-xs text-slate-500">
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
        <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-lg shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-sky-900">
                  Locked Permanent Public URL
                </span>
                <span className="text-[10px] font-semibold bg-sky-200 text-sky-800 px-2 py-0.5 rounded-full">
                  Permanent
                </span>
              </div>
              <p className="text-xs text-sky-700 font-mono mt-0.5">
                {publicUrl}
              </p>
            </div>
          </div>
          <a
            href={getInternalBusinessPath(slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:text-sky-800 bg-white border border-sky-300 rounded-lg hover:bg-sky-50 transition-colors shrink-0"
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

          <CardContent className="space-y-4">
            {/* Business Name */}
            <Input
              label="Business Name"
              placeholder="e.g. Lumina Artisan Bistro, City Dental Care"
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
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Short Description / Tagline
              </label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                placeholder="Briefly describe what your business offers (shown on your customer profile page)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Maximum 300 characters. {300 - description.length} remaining.
              </p>
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <Input
                label="Logo Image URL"
                placeholder="https://example.com/logo.png"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                leftAddon={<Image className="w-4 h-4" />}
                helperText="Square image recommended (e.g. 400x400)."
              />
              <Input
                label="Cover Banner Image URL (Optional)"
                placeholder="https://example.com/cover.jpg"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                leftAddon={<Image className="w-4 h-4" />}
                helperText="Header banner (e.g. 1200x500)."
              />
            </div>

            {/* Contact Information */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Customer Direct Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Direct Phone Number"
                  placeholder="+1 (555) 000-0000"
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
                  placeholder="123 Main Street, Suite 400"
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
