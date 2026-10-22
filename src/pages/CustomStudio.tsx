import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant, CustomDesignData } from '../types';
import { Palette, Upload, Type, Move, RotateCw, Plus, Trash2, ShoppingBag, Check } from 'lucide-react';

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  content: string; // text string or data URL
  fontFamily?: string;
  color?: string;
  fontSize?: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export const CustomStudio: React.FC = () => {
  const { addToCart } = useStore();
  const navigate = useNavigate();

  // Customizer state
  const [shirtColor, setShirtColor] = useState<string>('Ivory');
  const [shirtColorHex, setShirtColorHex] = useState<string>('#F7F6F2');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  // Design elements
  const [frontElements, setFrontElements] = useState<DesignElement[]>([]);
  const [backElements, setBackElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // New text input form
  const [newText, setNewText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Space Grotesk');
  const [textColor, setTextColor] = useState('#111111');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeElements = viewSide === 'front' ? frontElements : backElements;
  const setActiveElements = viewSide === 'front' ? setFrontElements : setBackElements;

  // Available shirt colors
  const colorOptions = [
    { name: 'Ivory', hex: '#F7F6F2', textDark: true },
    { name: 'Onyx Black', hex: '#111111', textDark: false },
    { name: 'Optic White', hex: '#FFFFFF', textDark: true },
    { name: 'Muted Lavender', hex: '#C8B9FF', textDark: true },
    { name: 'Electric Lime', hex: '#C7F464', textDark: true },
    { name: 'Olive Green', hex: '#3B4132', textDark: false },
  ];

  const fonts = ['Space Grotesk', 'Inter', 'Serif', 'Impact'];

  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newElem: DesignElement = {
      id: `elem_${Date.now()}`,
      type: 'text',
      content: newText.trim(),
      fontFamily: selectedFont,
      color: textColor,
      fontSize: 24,
      x: 50,
      y: 40,
      scale: 1,
      rotation: 0,
    };

    setActiveElements((prev) => [...prev, newElem]);
    setSelectedElementId(newElem.id);
    setNewText('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newElem: DesignElement = {
        id: `elem_${Date.now()}`,
        type: 'image',
        content: dataUrl,
        x: 50,
        y: 45,
        scale: 1,
        rotation: 0,
      };
      setActiveElements((prev) => [...prev, newElem]);
      setSelectedElementId(newElem.id);
    };
    reader.readAsDataURL(file);
  };

  const updateSelectedElement = (updates: Partial<DesignElement>) => {
    if (!selectedElementId) return;
    setActiveElements((prev) =>
      prev.map((el) => (el.id === selectedElementId ? { ...el, ...updates } : el))
    );
  };

  const removeSelectedElement = () => {
    if (!selectedElementId) return;
    setActiveElements((prev) => prev.filter((el) => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  // Pricing
  const basePrice = 799;
  const printFee = (frontElements.length > 0 ? 200 : 0) + (backElements.length > 0 ? 200 : 0);
  const totalPrice = basePrice + printFee;

  const handleAddToCart = () => {
    const customDesign: CustomDesignData = {
      tshirt_color: shirtColor,
      tshirt_size: selectedSize,
      front_elements: frontElements,
      back_elements: backElements,
      total_price: totalPrice,
    };

    const dummyProduct: Product = {
      id: `custom_tee_${Date.now()}`,
      name: `Custom Designed T-Shirt (${shirtColor})`,
      slug: `custom-tshirt-${Date.now()}`,
      gender_collection: 'Custom Apparel',
      regular_price: totalPrice,
      status: 'published',
      featured: false,
      fabric_material: '100% Combed Heavyweight Cotton (240 GSM)',
      fit: 'Relaxed Oversized Fit',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const dummyVariant: ProductVariant = {
      id: `custom_var_${Date.now()}`,
      product_id: dummyProduct.id,
      sku: `CUST-${shirtColor.substring(0, 3).toUpperCase()}-${selectedSize}`,
      size: selectedSize,
      color: shirtColor,
      color_hex: shirtColorHex,
      price_override: totalPrice,
      stock_quantity: 99,
      is_active: true,
    };

    addToCart(dummyProduct, dummyVariant, 1, customDesign);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#111111]/15 pb-6">
        <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
          Form &amp; Fit Studio
        </span>
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
          Interactive Custom T-Shirt Studio
        </h1>
        <p className="text-xs text-[#111111]/70 font-sans mt-1">
          Customize your heavyweight cotton t-shirt with real-time print preview, custom typography, and logo uploads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Toolbar */}
        <div className="lg:col-span-4 bg-white border border-[#111111]/15 p-6 space-y-6">
          <h3 className="font-space font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#111111]/10 pb-3">
            <Palette size={16} /> Customize Apparel Specs
          </h3>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-space font-bold uppercase">
              1. Base Garment Color: <span className="font-normal">{shirtColor}</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setShirtColor(c.name);
                    setShirtColorHex(c.hex);
                  }}
                  className={`p-2 text-[11px] font-space uppercase border flex items-center gap-2 cursor-pointer ${
                    shirtColor === c.name ? 'border-[#111111] border-2 font-bold' : 'border-[#111111]/20'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="truncate">{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2 pt-3 border-t border-[#111111]/10">
            <label className="block text-xs font-space font-bold uppercase">
              2. Select Size: <span className="font-normal">{selectedSize}</span>
            </label>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`flex-1 py-2 text-xs font-mono font-bold border cursor-pointer ${
                    selectedSize === sz ? 'bg-[#111111] text-[#C7F464] border-[#111111]' : 'border-[#111111]/20 hover:bg-[#F7F6F2]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Add Text */}
          <div className="space-y-3 pt-3 border-t border-[#111111]/10">
            <label className="block text-xs font-space font-bold uppercase">
              3. Add Custom Text
            </label>
            <form onSubmit={handleAddText} className="space-y-2">
              <input
                type="text"
                placeholder="Type artwork text..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
              />
              <div className="flex gap-2">
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="flex-1 bg-white border border-[#111111] p-1.5 text-xs font-space"
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-9 h-8 border border-[#111111] cursor-pointer"
                  title="Pick text color"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase font-bold hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Type size={14} /> Add Text to {viewSide.toUpperCase()}
              </button>
            </form>
          </div>

          {/* Upload Custom Graphic */}
          <div className="space-y-2 pt-3 border-t border-[#111111]/10">
            <label className="block text-xs font-space font-bold uppercase">
              4. Upload Graphic / Logo
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-[#E8E8E8] text-[#111111] border border-[#111111] font-space text-xs uppercase font-bold hover:bg-[#111111] hover:text-[#F7F6F2] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={14} /> Upload PNG / JPG Image
            </button>
          </div>

          {/* Controls for Selected Element */}
          {selectedElementId && (
            <div className="p-3 bg-[#F7F6F2] border border-[#111111] space-y-2 text-xs">
              <div className="flex justify-between items-center font-space font-bold">
                <span>Selected Element Controls</span>
                <button onClick={removeSelectedElement} className="text-red-600 hover:underline cursor-pointer">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono">Scale Size:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={activeElements.find((e) => e.id === selectedElementId)?.scale || 1}
                  onChange={(e) => updateSelectedElement({ scale: Number(e.target.value) })}
                  className="w-full accent-[#111111]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono">Rotation:</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="15"
                  value={activeElements.find((e) => e.id === selectedElementId)?.rotation || 0}
                  onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                  className="w-full accent-[#111111]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Center Canvas Preview Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 border border-[#111111]/15">
            <div className="flex items-center gap-2">
              <span className="text-xs font-space font-bold uppercase text-[#111111]">Side View:</span>
              <button
                onClick={() => setViewSide('front')}
                className={`px-3 py-1 text-xs font-space font-bold uppercase border cursor-pointer ${
                  viewSide === 'front' ? 'bg-[#111111] text-[#C7F464]' : 'bg-white text-[#111111]'
                }`}
              >
                Front View
              </button>
              <button
                onClick={() => setViewSide('back')}
                className={`px-3 py-1 text-xs font-space font-bold uppercase border cursor-pointer ${
                  viewSide === 'back' ? 'bg-[#111111] text-[#C7F464]' : 'bg-white text-[#111111]'
                }`}
              >
                Back View
              </button>
            </div>

            <span className="text-xs font-mono font-bold text-[#111111]/60">
              {activeElements.length} Item(s) on {viewSide.toUpperCase()}
            </span>
          </div>

          {/* Interactive Mockup Preview Canvas */}
          <div className="relative aspect-[4/5] bg-white border border-[#111111] flex items-center justify-center p-8 overflow-hidden select-none shadow-xl">
            {/* T-Shirt SVG Representation */}
            <div
              className="w-full h-full max-w-md relative flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: 'transparent' }}
            >
              {/* T-Shirt Base Silhouette SVG */}
              <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-md">
                <path
                  d="M130,40 C160,70 240,70 270,40 L350,90 L310,170 L280,150 L280,440 L120,440 L120,150 L90,170 L50,90 Z"
                  fill={shirtColorHex}
                  stroke="#111111"
                  strokeWidth="3"
                />
                {/* Collar seam */}
                <path
                  d="M130,40 C170,80 230,80 270,40"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="2"
                  opacity="0.3"
                />
                {/* Print Boundary Box */}
                <rect
                  x="125"
                  y="110"
                  width="150"
                  height="260"
                  fill="none"
                  stroke="#111111"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.3"
                />
                <text x="200" y="385" textAnchor="middle" fontSize="9" fill="#111111" opacity="0.4" fontFamily="Space Grotesk">
                  PRINT AREA ({viewSide.toUpperCase()})
                </text>
              </svg>

              {/* Render Design Elements inside Printable Area */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[150px] h-[260px] relative pointer-events-auto">
                  {activeElements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`absolute cursor-move transition-transform ${
                          isSelected ? 'outline-2 outline-dashed outline-[#111111]' : ''
                        }`}
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          transform: `translate(-50%, -50%) scale(${el.scale}) rotate(${el.rotation}deg)`,
                        }}
                      >
                        {el.type === 'text' ? (
                          <span
                            style={{
                              fontFamily: el.fontFamily,
                              color: el.color,
                              fontSize: `${el.fontSize}px`,
                              fontWeight: 'bold',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {el.content}
                          </span>
                        ) : (
                          <img
                            src={el.content}
                            alt="Custom Artwork"
                            className="max-w-[120px] max-h-[120px] object-contain pointer-events-none"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart Summary */}
          <div className="bg-[#111111] text-[#F7F6F2] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-space font-bold text-2xl text-[#C7F464]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-white/60">
                  (Base ₹{basePrice} + Print ₹{printFee})
                </span>
              </div>
              <p className="text-[11px] text-white/70 font-sans mt-0.5">
                Heavyweight 240 GSM Combed Cotton • Printed &amp; Dispatched in 48 Hours
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="px-8 py-3.5 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag size={16} /> Add Custom Tee To Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
