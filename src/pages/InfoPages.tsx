import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, CheckCircle2, Ruler, Truck, RotateCcw } from 'lucide-react';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-sans">
    <div className="border-b border-[#111111]/15 pb-4">
      <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">Brand Heritage</span>
      <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">About Form &amp; Fit</h1>
    </div>
    <div className="bg-white border border-[#111111]/15 p-8 space-y-4 text-xs sm:text-sm text-[#111111]/80 leading-relaxed">
      <p className="text-base font-space font-bold text-[#111111]">
        Form &amp; Fit was founded on a simple principle: clothing should adapt to your body and lifestyle, not the other way around.
      </p>
      <p>
        As an independent, owner-managed Indian fashion brand, we bridge the gap between premium structured tailoring, heavyweight streetwear cottons, and interactive custom apparel.
      </p>
      <p>
        Every fabric composition—from 240 GSM combed cottons to pre-shrunk fleece blends—is selected and quality-checked by our store owner before reaching your doorstep.
      </p>
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const { sendContactMessage, storeSettings } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      sendContactMessage({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-sans">
      <div className="border-b border-[#111111]/15 pb-4">
        <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">Customer Support</span>
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">Contact Form &amp; Fit</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#111111]/15 p-6 space-y-4 text-xs">
          <h3 className="font-space font-bold text-sm uppercase border-b border-[#111111]/10 pb-2">Store Assistance</h3>
          <p className="text-[#111111]/70">Have questions about an existing order, sizing, or custom print specs? Reach out to our store team directly.</p>
          <div className="space-y-2 pt-2">
            <p className="flex items-center gap-2 font-bold"><Mail size={14} /> {storeSettings.contact_email}</p>
            <p className="flex items-center gap-2 font-bold"><Phone size={14} /> {storeSettings.contact_phone}</p>
            <p className="flex items-center gap-2 text-[#111111]/70"><MapPin size={14} /> Mumbai, India</p>
          </div>
        </div>

        <div className="bg-white border border-[#111111]/15 p-6">
          {submitted ? (
            <div className="p-6 bg-[#C7F464]/30 border border-[#111111] text-center space-y-2">
              <CheckCircle2 size={32} className="mx-auto text-[#111111]" />
              <h4 className="font-space font-bold uppercase text-sm">Message Sent Successfully</h4>
              <p className="text-xs text-[#111111]/70">Our store team will respond to your query within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="text-xs font-space font-bold underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <input
                type="text"
                required
                placeholder="Your Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Your Email Address *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Order Number / Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
              />
              <textarea
                required
                rows={4}
                placeholder="How can we assist you today? *"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#111111] text-[#C7F464] font-space font-bold uppercase text-xs hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
              >
                Send Support Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const SizeGuidePage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-sans">
    <div className="border-b border-[#111111]/15 pb-4">
      <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">Sizing Reference</span>
      <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">Size &amp; Fit Measurement Guide</h1>
    </div>

    <div className="bg-white border border-[#111111]/15 p-6 overflow-x-auto space-y-4">
      <h3 className="font-space font-bold text-sm uppercase">T-Shirts &amp; Sweatshirts Measurement Table (Inches)</h3>
      <table className="w-full text-xs text-left border-collapse border border-[#111111]/20">
        <thead>
          <tr className="bg-[#111111] text-[#F7F6F2] font-space uppercase">
            <th className="p-2 border">Size</th>
            <th className="p-2 border">Chest (Inches)</th>
            <th className="p-2 border">Length (Inches)</th>
            <th className="p-2 border">Shoulder Width</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="p-2 border font-bold">Small (S)</td><td className="p-2 border">38"</td><td className="p-2 border">27"</td><td className="p-2 border">17.5"</td></tr>
          <tr><td className="p-2 border font-bold">Medium (M)</td><td className="p-2 border">40"</td><td className="p-2 border">28"</td><td className="p-2 border">18.5"</td></tr>
          <tr><td className="p-2 border font-bold">Large (L)</td><td className="p-2 border">42"</td><td className="p-2 border">29"</td><td className="p-2 border">19.5"</td></tr>
          <tr><td className="p-2 border font-bold">X-Large (XL)</td><td className="p-2 border">44"</td><td className="p-2 border">30"</td><td className="p-2 border">20.5"</td></tr>
          <tr><td className="p-2 border font-bold">XX-Large (XXL)</td><td className="p-2 border">46"</td><td className="p-2 border">31"</td><td className="p-2 border">21.5"</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

export const PolicyPage: React.FC<{ title: string; subtitle: string; content: string }> = ({
  title,
  subtitle,
  content,
}) => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 font-sans">
    <div className="border-b border-[#111111]/15 pb-4">
      <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">{subtitle}</span>
      <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">{title}</h1>
    </div>
    <div className="bg-white border border-[#111111]/15 p-8 text-xs sm:text-sm text-[#111111]/80 leading-relaxed space-y-4">
      <p>{content}</p>
    </div>
  </div>
);
