import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { businessService } from '@/services/businessService';
import { storageService } from '@/services/storageService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';
import { getPublicBusinessUrl } from '@/lib/utils';
import { Building2, Lock, Save, Phone, Mail, MapPin, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

export const BusinessProfile: React.FC = () => {
  const { user, business, refreshBusiness } = useAuth();

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [slug, setSlug] = useState('');

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setLogoUrl(business.logo_url || '');
      setDescription(business.description || '');
      setPhone(business.phone || '');
      setEmail(business.email || '');
      setAddress(business.address || '');
      setSlug(business.slug || '');
    }
  }, [business]);

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      setErrorMessage(null);

      const uploadedUrl = await storageService.uploadBusinessLogo(file);
      setLogoUrl(uploadedUrl);
      setSuccessMessage('Business logo uploaded successfully. Remember to save profile changes.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to upload logo image.');
    } finally {
      setIsUploadingLogo(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          description: description.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
        });
        setSuccessMessage('Business profile updated successfully! Your permanent public URL remains unchanged.');
      } else if (user) {
        // First-time business profile creation
        const newBiz = await businessService.createBusiness({
          user_id: user.id,
          name: trimmedName,
          logo_url: logoUrl.trim() || undefined,
          description: description.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
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
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#FBF9F5] tracking-tight">
          {business ? 'Business Profile Settings' : 'Create Business Profile'}
        </h1>
        <p className="text-xs text-[#9E8E81] mt-0.5">
          Manage your official business info. Updating your details will never break your permanent public URL.
        </p>
      </div>

      {successMessage && (
        <Alert type="success" title="Success" message={successMessage} />
      )}
      {errorMessage && (
        <Alert type="error" title="Error" message={errorMessage} />
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

          <CardContent className="space-y-6">
            {/* Business Name */}
            <Input
              label="Business Name"
              placeholder="e.g. Acme Cafe, City Care Dental"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              leftAddon={<Building2 className="w-4 h-4" />}
            />

            {/* Logo File Upload Interface */}
            <div>
              <label className="block text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider mb-2">
                Business Logo
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={handleLogoFileChange}
                className="hidden"
                id="business-logo-file-input"
              />

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-[#1B120B] border border-[#3D2B1F]">
                {/* Logo Preview Square */}
                <div className="w-20 h-20 rounded-2xl bg-[#241810] border border-[#3D2B1F] flex items-center justify-center shrink-0 overflow-hidden relative group">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Business logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#9E8E81]">
                      <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                      <span className="text-[9px] mt-1 font-medium">No Logo</span>
                    </div>
                  )}

                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-[#140D08]/80 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-[#D49B5B] animate-spin" />
                    </div>
                  )}
                </div>

                {/* Upload Action & Notes */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingLogo}
                      icon={isUploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    >
                      {isUploadingLogo ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>

                    {logoUrl && !isUploadingLogo && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="text-[#EF4444] hover:text-[#EF4444] hover:bg-rose-950/20"
                        icon={<X className="w-3.5 h-3.5" />}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9E8E81] leading-relaxed">
                    Upload your square logo image (PNG, JPG, WebP, or SVG, up to 5 MB). This appears at the top of your mobile profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider mb-1.5">
                Short Description / Tagline (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-[#3D2B1F] hover:border-[#D49B5B]/40 bg-[#2E1F15] px-3.5 py-2.5 text-sm text-[#FBF9F5] placeholder:text-[#9E8E81]/60 focus:outline-none focus:ring-2 focus:ring-[#D49B5B]/25 focus:border-[#D49B5B] transition-all shadow-inner"
                placeholder="Briefly describe what your business offers (shown on your customer profile page)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
              <p className="mt-1 text-[11px] text-[#9E8E81]">
                Maximum 300 characters. {300 - description.length} remaining.
              </p>
            </div>

            {/* Contact Information */}
            <div className="pt-4 border-t border-[#3D2B1F]">
              <h4 className="text-[11px] font-bold text-[#DDD3CA] uppercase tracking-wider mb-3">
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
                  placeholder="e.g. 123 Main Street, Suite 400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  leftAddon={<MapPin className="w-4 h-4" />}
                  helperText="Enables 1-tap Google Maps directions button for customers."
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
