import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Sliders, Save, Database, Check, AlertCircle } from 'lucide-react';

export const OwnerSettings: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();

  const [announcementText, setAnnouncementText] = useState(storeSettings.announcement_text || '');
  const [announcementEnabled, setAnnouncementEnabled] = useState(storeSettings.announcement_enabled);
  const [heroHeadline, setHeroHeadline] = useState(storeSettings.hero_headline || '');
  const [heroSubtitle, setHeroSubtitle] = useState(storeSettings.hero_subtitle || '');
  const [heroImageUrl, setHeroImageUrl] = useState(storeSettings.hero_image_url || '');
  const [contactEmail, setContactEmail] = useState(storeSettings.contact_email || '');
  const [contactPhone, setContactPhone] = useState(storeSettings.contact_phone || '');
  const [shippingFeeFlat, setShippingFeeFlat] = useState(storeSettings.shipping_fee_flat);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(storeSettings.free_shipping_threshold);
  const [codEnabled, setCodEnabled] = useState(storeSettings.cod_enabled);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings({
      announcement_text: announcementText.trim(),
      announcement_enabled: announcementEnabled,
      hero_headline: heroHeadline.trim(),
      hero_subtitle: heroSubtitle.trim(),
      hero_image_url: heroImageUrl.trim(),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim(),
      shipping_fee_flat: Number(shippingFeeFlat),
      free_shipping_threshold: Number(freeShippingThreshold),
      cod_enabled: codEnabled,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const configured = isSupabaseConfigured();

  return (
    <OwnerLayout>
      <form onSubmit={handleSave} className="space-y-8">
        <div className="flex justify-between items-center border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
              Store Customization
            </span>
            <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
              Content &amp; Settings Editor
            </h1>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#111111] text-[#C7F464] font-space text-xs font-bold uppercase tracking-wider hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Save size={16} /> {savedSuccess ? 'Settings Saved!' : 'Save Store Changes'}
          </button>
        </div>

        {/* Database Status Alert */}
        <div className={`p-4 border text-xs font-space flex items-center justify-between ${
          configured ? 'bg-[#C7F464]/20 border-[#111111]' : 'bg-amber-100 border-amber-400 text-amber-900'
        }`}>
          <div className="flex items-center gap-2">
            <Database size={16} />
            <span className="font-bold uppercase">
              {configured ? 'Live Supabase Database Connected' : 'Running in Local Browser Database Mode'}
            </span>
          </div>
          <span className="text-[11px] font-mono">
            {configured ? 'Host: Cloud PostgreSQL' : 'Set VITE_SUPABASE_URL in .env to connect Cloud DB'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Homepage Hero & Banner Controls */}
          <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
              Store Header &amp; Hero Content
            </h3>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="flex items-center gap-2 cursor-pointer mb-1">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                    className="accent-[#111111]"
                  />
                  <span className="font-space font-bold uppercase">Enable Top Announcement Bar</span>
                </label>
                <input
                  type="text"
                  placeholder="⚡ Free Shipping on All Orders Over ₹1,999 across India"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-[#111111]/10">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Hero Section Headline
                </label>
                <input
                  type="text"
                  placeholder="FIND YOUR FIT. DEFINE YOUR FORM."
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none uppercase font-space font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Hero Subtitle Copy
                </label>
                <textarea
                  rows={2}
                  placeholder="Everyday essentials, statement pieces, and custom creations..."
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Custom Hero Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none font-mono"
                />
                <p className="text-[10px] text-[#111111]/50">If left blank, clean editorial typographic fallback renders.</p>
              </div>
            </div>
          </div>

          {/* Right: Shipping, Payment & Support */}
          <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
              Shipping Rules &amp; Payment Settings
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-space font-bold uppercase text-[#111111]">
                    Flat Shipping Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={shippingFeeFlat}
                    onChange={(e) => setShippingFeeFlat(Number(e.target.value))}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-space font-bold uppercase text-[#111111]">
                    Free Shipping Threshold (₹)
                  </label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#111111]/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={codEnabled}
                    onChange={(e) => setCodEnabled(e.target.checked)}
                    className="accent-[#111111]"
                  />
                  <span className="font-space font-bold uppercase">Enable Cash On Delivery (COD) Option</span>
                </label>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#111111]/10">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Official Support Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-space font-bold uppercase text-[#111111]">
                  Official Support Contact Phone
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </OwnerLayout>
  );
};
