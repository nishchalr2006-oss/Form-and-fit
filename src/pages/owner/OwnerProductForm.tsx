import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { Product, ProductImage, ProductVariant, GenderCollection, ProductStatus } from '../../types';
import { uploadProductImage } from '../../lib/supabase';
import {
  generateUUID,
  FASHION_PRESETS,
  getFashionFallbackImage,
} from '../../lib/imageOptimization';
import {
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
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
      { id: generateUUID(), product_id: '', sku: 'SKU-S', size: 'S', color: 'Black', stock_quantity: 10, is_active: true },
      { id: generateUUID(), product_id: '', sku: 'SKU-M', size: 'M', color: 'Black', stock_quantity: 15, is_active: true },
      { id: generateUUID(), product_id: '', sku: 'SKU-L', size: 'L', color: 'Black', stock_quantity: 20, is_active: true },
    ]
  );

  // Image Upload & URL states
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if existingProduct loads asynchronously
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name || '');
      setSlug(existingProduct.slug || '');
      setSku(existingProduct.sku || '');
      setShortDesc(existingProduct.short_desc || '');
      setDescription(existingProduct.description || '');
      setCategoryId(existingProduct.category_id || categories[0]?.id || '');
      setGenderCollection(existingProduct.gender_collection || 'Unisex');
      setRegularPrice(existingProduct.regular_price || 999);
      setSalePrice(existingProduct.sale_price);
      setCostPrice(existingProduct.cost_price);
      setFabricMaterial(existingProduct.fabric_material || '');
      setFit(existingProduct.fit || '');
      setCareInstructions(existingProduct.care_instructions || '');
      setStatus(existingProduct.status || 'published');
      setFeatured(existingProduct.featured || false);
      setSeoTitle(existingProduct.seo_title || '');
      setSeoDescription(existingProduct.seo_description || '');
      if (existingProduct.images && existingProduct.images.length > 0) {
        setImages(existingProduct.images);
      }
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        setVariants(existingProduct.variants);
      }
    }
  }, [existingProduct]);

  // Auto slug generation from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!existingProduct) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Image File Upload with optimization & fallback
  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadFeedback({ type: 'info', text: 'Optimizing and uploading photography...' });

    const newImagesList: ProductImage[] = [];
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const res = await uploadProductImage(file);
        if (res && res.url) {
          const newImg: ProductImage = {
            id: generateUUID(),
            product_id: existingProduct?.id || '',
            url: res.url,
            storage_path: res.path,
            is_main: images.length === 0 && newImagesList.length === 0,
            display_order: images.length + newImagesList.length,
          };
          newImagesList.push(newImg);
          successCount++;
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }

    if (newImagesList.length > 0) {
      setImages((prev) => {
        const updated = [...prev, ...newImagesList];
        // Ensure at least one image has is_main
        if (!updated.some((img) => img.is_main)) {
          updated[0].is_main = true;
        }
        return updated;
      });

      // Also sync first variant image if empty
      setVariants((prev) =>
        prev.map((v, idx) =>
          idx === 0 && !v.variant_image_url ? { ...v, variant_image_url: newImagesList[0].url } : v
        )
      );

      setUploadFeedback({
        type: 'success',
        text: `Successfully added ${successCount} high-res product photo(s)!`,
      });
    } else {
      setUploadFeedback({
        type: 'error',
        text: 'Could not process selected image file(s). Please try another format or URL.',
      });
    }

    setIsUploading(false);
    setTimeout(() => setUploadFeedback(null), 5000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Add Image via Direct Web URL
  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image')) {
      setUploadFeedback({ type: 'error', text: 'Please enter a valid HTTP/HTTPS image URL.' });
      return;
    }

    const newImg: ProductImage = {
      id: generateUUID(),
      product_id: existingProduct?.id || '',
      url: trimmed,
      is_main: images.length === 0,
      display_order: images.length,
    };

    setImages((prev) => [...prev, newImg]);
    setImageUrlInput('');
    setUploadFeedback({ type: 'success', text: 'Image URL added to gallery!' });
    setTimeout(() => setUploadFeedback(null), 4000);
  };

  // Add Curated Preset Image
  const handleSelectPreset = (presetUrl: string) => {
    const newImg: ProductImage = {
      id: generateUUID(),
      product_id: existingProduct?.id || '',
      url: presetUrl,
      is_main: images.length === 0,
      display_order: images.length,
    };
    setImages((prev) => [...prev, newImg]);
    setShowPresets(false);
    setUploadFeedback({ type: 'success', text: 'Curated studio fashion photo added!' });
    setTimeout(() => setUploadFeedback(null), 4000);
  };

  const setMainImage = (imgId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_main: img.id === imgId,
      }))
    );
    // Sync with default variant
    const targetImg = images.find((i) => i.id === imgId);
    if (targetImg) {
      setVariants((prev) =>
        prev.map((v, idx) => (idx === 0 ? { ...v, variant_image_url: targetImg.url } : v))
      );
    }
  };

  const removeImage = (imgId: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== imgId);
      if (filtered.length > 0 && !filtered.some((i) => i.is_main)) {
        filtered[0].is_main = true;
      }
      return filtered;
    });
  };

  // Variant operations
  const addVariantRow = () => {
    const newV: ProductVariant = {
      id: generateUUID(),
      product_id: existingProduct?.id || '',
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      size: 'M',
      color: 'Black',
      stock_quantity: 10,
      is_active: true,
      variant_image_url: images.find((i) => i.is_main)?.url || images[0]?.url,
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

    // If no images were uploaded, auto-assign a smart fashion fallback photo so the product never renders with "NO IMAGE"
    let finalImages = [...images];
    if (finalImages.length === 0) {
      const fallbackUrl = getFashionFallbackImage(name, categories.find((c) => c.id === categoryId)?.name);
      finalImages = [
        {
          id: generateUUID(),
          product_id: existingProduct?.id || '',
          url: fallbackUrl,
          is_main: true,
          display_order: 0,
        },
      ];
    }

    // Ensure main image is synced to the first variant
    const mainImageUrl = finalImages.find((i) => i.is_main)?.url || finalImages[0]?.url;
    const syncedVariants = variants.map((v, idx) => ({
      ...v,
      variant_image_url: v.variant_image_url || (idx === 0 ? mainImageUrl : undefined),
    }));

    const productPayload: Partial<Product> = {
      id: existingProduct?.id,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: sku.trim() || `FF-${Math.floor(100000 + Math.random() * 900000)}`,
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
      images: finalImages,
      variants: syncedVariants,
    };

    await saveProduct(productPayload);
    setIsSaving(false);
    navigate('/owner/products');
  };

  return (
    <OwnerLayout>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#111111]/15 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/owner/products"
              className="p-2 border border-[#111111] hover:bg-[#111111] hover:text-[#C7F464] transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
                {existingProduct ? 'Edit Apparel Item' : 'New Apparel Upload'}
              </span>
              <h1 className="font-space font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
                {name || 'New Fashion Piece'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
              className="px-6 py-2.5 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {uploadFeedback && (
          <div
            className={`p-3 text-xs font-space flex items-center gap-2 border transition-all ${
              uploadFeedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                : uploadFeedback.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-blue-50 border-blue-500 text-blue-900'
            }`}
          >
            {uploadFeedback.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            ) : uploadFeedback.type === 'error' ? (
              <AlertCircle size={16} className="text-red-600 shrink-0" />
            ) : (
              <Sparkles size={16} className="text-blue-600 shrink-0" />
            )}
            <span>{uploadFeedback.text}</span>
          </div>
        )}

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
                    placeholder="e.g. Heavyweight Boxy Fit Tee / Oxford Shirt"
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

            {/* Product Photography Uploader & Media Hub */}
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#111111]/10 pb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#111111]" />
                  <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                    Product Photography ({images.length})
                  </h3>
                  {images.length > 0 && (
                    <span className="text-[10px] bg-[#C7F464] text-[#111111] font-space font-bold px-2 py-0.5 uppercase">
                      Ready for Live Store
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPresets(!showPresets)}
                    className="px-2.5 py-1 text-[11px] font-space font-bold uppercase border border-[#111111] bg-white hover:bg-[#111111] hover:text-[#C7F464] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles size={12} /> {showPresets ? 'Hide Studio Presets' : 'Studio Preset Library'}
                  </button>
                </div>
              </div>

              {/* Curated Studio Presets Drawer */}
              {showPresets && (
                <div className="p-4 bg-[#0A0A0C] border border-[#C7F464]/30 rounded-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-space font-bold uppercase text-[#C7F464]">
                      Select Professional Studio Fashion Photo:
                    </p>
                    <span className="text-[10px] text-white/50 font-mono">Instant 1-Click Addition</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {FASHION_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className="group relative aspect-[3/4] bg-[#181820] border border-white/20 hover:border-[#C7F464] overflow-hidden text-left cursor-pointer transition-all"
                      >
                        <img
                          src={preset.thumb}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                          <p className="text-[10px] text-white font-space font-bold truncate">{preset.name}</p>
                          <p className="text-[9px] text-[#C7F464] font-mono">{preset.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-6 text-center space-y-3 transition-colors ${
                  isDragOver ? 'border-[#C7F464] bg-[#C7F464]/10' : 'border-[#111111]/30 bg-[#F7F6F2]'
                }`}
              >
                <Upload size={32} className={`mx-auto ${isDragOver ? 'text-[#111111]' : 'text-[#111111]/40'}`} />
                <div className="space-y-1">
                  <p className="text-xs font-space font-bold uppercase text-[#111111]">
                    {isUploading ? 'Optimizing & Uploading Photos...' : 'Drag & Drop Device Photos or Browse'}
                  </p>
                  <p className="text-[10px] text-[#111111]/60 font-sans">
                    Auto-compressed to ultra-sharp 1200x1600 WebP (fits instantly in store &amp; cloud)
                  </p>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="image-upload-input"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload-input"
                  className="inline-block px-5 py-2.5 bg-[#111111] text-[#C7F464] font-space text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#C7F464] hover:text-[#111111] transition-colors shadow-sm"
                >
                  {isUploading ? 'Processing...' : 'Browse Device Photos'}
                </label>
              </div>

              {/* Add via Direct Web URL */}
              <div className="bg-[#F7F6F2] border border-[#111111]/15 p-3 flex flex-col sm:flex-row gap-2 items-center">
                <div className="relative flex-1 w-full">
                  <input
                    type="url"
                    placeholder="Or paste direct image URL (https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                    className="w-full bg-white border border-[#111111] px-3 py-2 text-xs font-mono pl-8 focus:outline-none"
                  />
                  <LinkIcon size={14} className="absolute left-2.5 top-2.5 text-[#111111]/40" />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-[#111111] text-white font-space text-xs font-bold uppercase tracking-wider hover:bg-[#C7F464] hover:text-[#111111] transition-colors shrink-0 w-full sm:w-auto cursor-pointer"
                >
                  Add Image URL
                </button>
              </div>

              {/* Uploaded Images Gallery Grid */}
              {images.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-space font-bold uppercase text-[#111111]/70">
                    Product Gallery ({images.length} photo{images.length > 1 ? 's' : ''})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className={`relative aspect-[3/4] bg-[#E8E8E8] border group overflow-hidden shadow-sm ${
                          img.is_main ? 'border-2 border-[#111111] ring-2 ring-[#C7F464]' : 'border-[#111111]/20'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt="Product thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If URL fails, replace with smart fallback
                            (e.currentTarget as HTMLImageElement).src = getFashionFallbackImage(name);
                          }}
                        />

                        {img.is_main && (
                          <div className="absolute top-1 left-1 bg-[#111111] text-[#C7F464] text-[9px] font-space font-extrabold uppercase px-1.5 py-0.5 shadow-md flex items-center gap-1">
                            <Star size={10} className="fill-[#C7F464]" /> MAIN PHOTO
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            className="self-end p-1.5 bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-md"
                            title="Remove image"
                          >
                            <Trash2 size={13} />
                          </button>

                          {!img.is_main && (
                            <button
                              type="button"
                              onClick={() => setMainImage(img.id)}
                              className="w-full py-1.5 bg-[#C7F464] hover:bg-white text-[#111111] font-space text-[10px] font-bold uppercase cursor-pointer shadow-md"
                            >
                              Set as Main
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-sans flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0" />
                  <span>
                    No photos added yet. Upload files, paste a link, or pick from our Studio Presets above.
                  </span>
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
                  <div
                    key={v.id || idx}
                    className="grid grid-cols-12 gap-2 items-center bg-[#F7F6F2] p-2 border border-[#111111]/10 text-xs"
                  >
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
                        title="Remove Variant"
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
