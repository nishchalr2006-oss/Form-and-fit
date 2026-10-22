import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { Product, ProductImage, ProductVariant, GenderCollection, ProductStatus } from '../../types';
import { uploadProductImage } from '../../lib/supabase';
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  ArrowLeft,
  Image as ImageIcon,
  Save,
} from 'lucide-react';

export const OwnerProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { products, saveProduct, categories } = useStore();
  const navigate = useNavigate();

  const existingProduct = id ? products.find((p) => p.id === id) : null;

  // Form states
  const [name, setName] = useState(existingProduct?.name || '');
  const [slug, setSlug] = useState(existingProduct?.slug || '');
  const [sku, setSku] = useState(existingProduct?.sku || '');
  const [shortDesc, setShortDesc] = useState(existingProduct?.short_desc || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [categoryId, setCategoryId] = useState(existingProduct?.category_id || categories[0]?.id || '');
  const [genderCollection, setGenderCollection] = useState<GenderCollection>(
    existingProduct?.gender_collection || 'Unisex'
  );
  const [regularPrice, setRegularPrice] = useState<number>(existingProduct?.regular_price || 999);
  const [salePrice, setSalePrice] = useState<number | undefined>(existingProduct?.sale_price);
  const [costPrice, setCostPrice] = useState<number | undefined>(existingProduct?.cost_price);
  const [fabricMaterial, setFabricMaterial] = useState(existingProduct?.fabric_material || '');
  const [fit, setFit] = useState(existingProduct?.fit || '');
  const [careInstructions, setCareInstructions] = useState(existingProduct?.care_instructions || '');
  const [status, setStatus] = useState<ProductStatus>(existingProduct?.status || 'published');
  const [featured, setFeatured] = useState<boolean>(existingProduct?.featured || false);
  const [seoTitle, setSeoTitle] = useState(existingProduct?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(existingProduct?.seo_description || '');

  // Images & Variants
  const [images, setImages] = useState<ProductImage[]>(existingProduct?.images || []);
  const [variants, setVariants] = useState<ProductVariant[]>(
    existingProduct?.variants || [
      { id: `v_1`, product_id: '', sku: 'SKU-S', size: 'S', color: 'Black', stock_quantity: 10, is_active: true },
      { id: `v_2`, product_id: '', sku: 'SKU-M', size: 'M', color: 'Black', stock_quantity: 15, is_active: true },
      { id: `v_3`, product_id: '', sku: 'SKU-L', size: 'L', color: 'Black', stock_quantity: 20, is_active: true },
    ]
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Auto slug generation from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!existingProduct) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadProductImage(file);
      if (res) {
        const newImg: ProductImage = {
          id: `img_${Date.now()}_${i}`,
          product_id: existingProduct?.id || '',
          url: res.url,
          storage_path: res.path,
          is_main: images.length === 0 && i === 0,
          display_order: images.length + i,
        };
        setImages((prev) => [...prev, newImg]);
      }
    }
    setIsUploading(false);
  };

  const setMainImage = (imgId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_main: img.id === imgId,
      }))
    );
  };

  const removeImage = (imgId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  // Variant operations
  const addVariantRow = () => {
    const newV: ProductVariant = {
      id: `v_${Date.now()}`,
      product_id: existingProduct?.id || '',
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      size: 'M',
      color: 'Standard',
      stock_quantity: 10,
      is_active: true,
    };
    setVariants((prev) => [...prev, newV]);
  };

  const updateVariantRow = (index: number, updates: Partial<ProductVariant>) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  const removeVariantRow = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);

    const productPayload: Partial<Product> = {
      id: existingProduct?.id,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku.trim() || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      short_desc: shortDesc.trim(),
      description: description.trim(),
      category_id: categoryId,
      gender_collection: genderCollection,
      regular_price: Number(regularPrice) || 0,
      sale_price: salePrice ? Number(salePrice) : undefined,
      cost_price: costPrice ? Number(costPrice) : undefined,
      fabric_material: fabricMaterial.trim(),
      fit: fit.trim(),
      care_instructions: careInstructions.trim(),
      status,
      featured,
      seo_title: seoTitle.trim() || name.trim(),
      seo_description: seoDescription.trim() || shortDesc.trim(),
      images,
      variants,
    };

    await saveProduct(productPayload);
    setIsSaving(false);
    navigate('/owner/products');
  };

  return (
    <OwnerLayout>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between items-center border-b border-[#111111]/15 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/owner/products"
              className="p-2 border border-[#111111] hover:bg-[#111111] hover:text-[#C7F464] transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
                {existingProduct ? 'Edit Existing Product' : 'New Apparel Upload'}
              </span>
              <h1 className="font-space font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
                {name || 'New Fashion Piece'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="bg-white border border-[#111111] px-3 py-2 font-space text-xs font-bold uppercase cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
                General Product Details
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavyweight Boxy Fit Tee"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 text-xs focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      placeholder="heavyweight-boxy-fit-tee"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                      Parent SKU
                    </label>
                    <input
                      type="text"
                      placeholder="FF-TEE-001"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    Short Summary (Shown in card &amp; quick views)
                  </label>
                  <input
                    type="text"
                    placeholder="240 GSM combed cotton structured relaxed fit t-shirt."
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    Full Description &amp; Design Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Detailed explanation of tailoring, fabric density, drop shoulders, stitch reinforcement..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Photography Uploader */}
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
                <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                  Product Photography ({images.length})
                </h3>
                <span className="text-[10px] text-[#111111]/60 font-mono">
                  Supported: WebP, PNG, JPEG
                </span>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-[#111111]/30 p-6 text-center space-y-3 bg-[#F7F6F2]">
                <Upload size={32} className="mx-auto text-[#111111]/40" />
                <p className="text-xs font-space font-bold uppercase">
                  {isUploading ? 'Uploading Images to Supabase...' : 'Upload Owner Product Photos'}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="image-upload-input"
                />
                <label
                  htmlFor="image-upload-input"
                  className="inline-block px-4 py-2 bg-[#111111] text-[#C7F464] font-space text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
                >
                  Select Photos
                </label>
              </div>

              {/* Uploaded Images List */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className={`relative aspect-[3/4] bg-[#E8E8E8] border group overflow-hidden ${
                        img.is_main ? 'border-2 border-[#111111]' : 'border-[#111111]/20'
                      }`}
                    >
                      <img src={img.url} alt="Product" className="w-full h-full object-cover" />

                      {img.is_main && (
                        <span className="absolute top-1 left-1 bg-[#111111] text-[#C7F464] text-[9px] font-space font-bold uppercase px-1.5 py-0.5">
                          MAIN PHOTO
                        </span>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="self-end p-1 bg-red-600 text-white rounded-none cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 size={13} />
                        </button>

                        {!img.is_main && (
                          <button
                            type="button"
                            onClick={() => setMainImage(img.id)}
                            className="w-full py-1 bg-[#C7F464] text-[#111111] font-space text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Set Main
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Variants & Stock Matrix */}
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
                <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                  Size, Color &amp; Stock Variants
                </h3>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="px-3 py-1 bg-[#111111] text-[#C7F464] font-space text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={v.id || idx} className="grid grid-cols-12 gap-2 items-center bg-[#F7F6F2] p-2 border border-[#111111]/10 text-xs">
                    <div className="col-span-3">
                      <label className="text-[10px] uppercase font-mono block text-[#111111]/50">Variant SKU</label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => updateVariantRow(idx, { sku: e.target.value })}
                        className="w-full bg-white border border-[#111111] p-1 font-mono text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] uppercase font-mono block text-[#111111]/50">Size</label>
                      <input
                        type="text"
                        placeholder="S, M, L..."
                        value={v.size || ''}
                        onChange={(e) => updateVariantRow(idx, { size: e.target.value })}
                        className="w-full bg-white border border-[#111111] p-1 font-mono text-xs uppercase"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] uppercase font-mono block text-[#111111]/50">Color</label>
                      <input
                        type="text"
                        placeholder="Black, White..."
                        value={v.color || ''}
                        onChange={(e) => updateVariantRow(idx, { color: e.target.value })}
                        className="w-full bg-white border border-[#111111] p-1 text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] uppercase font-mono block text-[#111111]/50">Stock Qty</label>
                      <input
                        type="number"
                        min="0"
                        value={v.stock_quantity}
                        onChange={(e) => updateVariantRow(idx, { stock_quantity: Number(e.target.value) })}
                        className="w-full bg-white border border-[#111111] p-1 font-mono text-xs"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeVariantRow(idx)}
                        className="text-red-600 hover:text-red-800 cursor-pointer pt-3"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Details: Pricing, Category, Fabric */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
                Pricing &amp; Private Costs
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    Regular Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(Number(e.target.value))}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    Sale Discount Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional sale price..."
                    value={salePrice || ''}
                    onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1 pt-2 border-t border-[#111111]/10">
                  <label className="block text-xs font-space font-bold uppercase text-red-800">
                    Private Owner Cost Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Private manufacturing cost..."
                    value={costPrice || ''}
                    onChange={(e) => setCostPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-red-50 border border-red-300 p-2 text-xs font-mono"
                  />
                  <p className="text-[10px] text-[#111111]/50">Never visible to store customers.</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
                Category &amp; Fabric Profile
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block font-space font-bold uppercase">Store Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 font-space uppercase"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-space font-bold uppercase">Gender Collection</label>
                  <select
                    value={genderCollection}
                    onChange={(e) => setGenderCollection(e.target.value as GenderCollection)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 font-space uppercase"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Custom Apparel">Custom Apparel</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-space font-bold uppercase">Fabric &amp; Material</label>
                  <input
                    type="text"
                    placeholder="e.g. 100% Combed Cotton 240 GSM"
                    value={fabricMaterial}
                    onChange={(e) => setFabricMaterial(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-space font-bold uppercase">Fit Profile</label>
                  <input
                    type="text"
                    placeholder="e.g. Oversized Relaxed Fit"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="accent-[#111111]"
                    />
                    <span className="font-space font-bold uppercase text-xs">Feature on Homepage Grid</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </OwnerLayout>
  );
};
