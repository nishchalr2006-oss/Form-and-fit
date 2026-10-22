import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  WishlistItem,
  Order,
  Coupon,
  Review,
  StoreSettings,
  ContactMessage,
  ProductVariant,
  ShippingAddress,
  CustomDesignData,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from '../types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_STORE_SETTINGS,
  DEFAULT_COUPONS,
  INITIAL_PRODUCTS,
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface InventoryLog {
  id: string;
  productName: string;
  variantSku: string;
  quantityChange: number;
  reason: string;
  createdAt: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  coupons: Coupon[];
  reviews: Review[];
  storeSettings: StoreSettings;
  contactMessages: ContactMessage[];
  inventoryLogs: InventoryLog[];
  appliedCoupon: Coupon | null;
  loading: boolean;

  // Product operations
  saveProduct: (productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  
  // Category operations
  saveCategory: (categoryData: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Inventory operations
  adjustVariantStock: (variantId: string, quantityChange: number, reason: string) => Promise<void>;

  // Cart operations
  addToCart: (product: Product, variant: ProductVariant, quantity?: number, customDesign?: CustomDesignData) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Coupon operations
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist operations
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Order operations
  createOrder: (orderData: {
    customerEmail: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Promise<{ success: boolean; orderId?: string; orderNumber?: string; message?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => Promise<void>;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => Promise<void>;

  // Review & Settings
  addReview: (productId: string, rating: number, comment: string, reviewerName: string) => Promise<void>;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  sendContactMessage: (msg: { name: string; email: string; subject?: string; message: string }) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load local persistent states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('form_fit_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('form_fit_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('form_fit_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('form_fit_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('form_fit_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('form_fit_coupons');
    return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('form_fit_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('form_fit_store_settings');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('form_fit_contact_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>(() => {
    const saved = localStorage.getItem('form_fit_inventory_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('form_fit_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('form_fit_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('form_fit_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('form_fit_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('form_fit_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('form_fit_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('form_fit_inventory_logs', JSON.stringify(inventoryLogs));
  }, [inventoryLogs]);

  // Load from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchProductsFromSupabase();
      fetchCategoriesFromSupabase();
      fetchOrdersFromSupabase();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProductsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          variants:product_variants(*)
        `);

      if (!error && data && data.length > 0) {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error('Failed to fetch products from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        setCategories(data as Category[]);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchOrdersFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`*, items:order_items(*)`)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        setOrders(data as Order[]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  // Product Operations
  const saveProduct = async (productData: Partial<Product>): Promise<Product> => {
    const isEditing = Boolean(productData.id);
    const productId = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const fullProduct: Product = {
      id: productId,
      name: productData.name || 'New Fashion Piece',
      slug: productData.slug || (productData.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: productData.sku || `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
      short_desc: productData.short_desc || '',
      description: productData.description || '',
      category_id: productData.category_id,
      gender_collection: productData.gender_collection || 'Unisex',
      regular_price: Number(productData.regular_price) || 0,
      sale_price: productData.sale_price ? Number(productData.sale_price) : undefined,
      cost_price: productData.cost_price ? Number(productData.cost_price) : undefined,
      fabric_material: productData.fabric_material || '',
      fit: productData.fit || '',
      care_instructions: productData.care_instructions || '',
      status: productData.status || 'published',
      featured: Boolean(productData.featured),
      seo_title: productData.seo_title || productData.name,
      seo_description: productData.seo_description || productData.short_desc,
      created_at: productData.created_at || now,
      updated_at: now,
      images: productData.images || [],
      variants: productData.variants || [],
      category: categories.find((c) => c.id === productData.category_id),
    };

    if (isEditing) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? fullProduct : p)));
    } else {
      setProducts((prev) => [fullProduct, ...prev]);
    }

    if (isSupabaseConfigured()) {
      try {
        const payload = {
          id: fullProduct.id,
          name: fullProduct.name,
          slug: fullProduct.slug,
          sku: fullProduct.sku,
          short_desc: fullProduct.short_desc,
          description: fullProduct.description,
          category_id: fullProduct.category_id,
          gender_collection: fullProduct.gender_collection,
          regular_price: fullProduct.regular_price,
          sale_price: fullProduct.sale_price,
          cost_price: fullProduct.cost_price,
          fabric_material: fullProduct.fabric_material,
          fit: fullProduct.fit,
          care_instructions: fullProduct.care_instructions,
          status: fullProduct.status,
          featured: fullProduct.featured,
          seo_title: fullProduct.seo_title,
          seo_description: fullProduct.seo_description,
          updated_at: now,
        };

        await supabase.from('products').upsert(payload);

        // Upsert images
        if (fullProduct.images && fullProduct.images.length > 0) {
          for (const img of fullProduct.images) {
            await supabase.from('product_images').upsert({
              id: img.id,
              product_id: productId,
              url: img.url,
              storage_path: img.storage_path,
              is_main: img.is_main,
              display_order: img.display_order,
            });
          }
        }

        // Upsert variants
        if (fullProduct.variants && fullProduct.variants.length > 0) {
          for (const v of fullProduct.variants) {
            await supabase.from('product_variants').upsert({
              id: v.id,
              product_id: productId,
              sku: v.sku,
              size: v.size,
              color: v.color,
              color_hex: v.color_hex,
              price_override: v.price_override,
              stock_quantity: v.stock_quantity,
              is_active: v.is_active,
            });
          }
        }
      } catch (err) {
        console.error('Supabase product save error:', err);
      }
    }

    return fullProduct;
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured()) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const toggleProductStatus = async (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'published' ? 'draft' : 'published';
          if (isSupabaseConfigured()) {
            supabase.from('products').update({ status: nextStatus }).eq('id', id);
          }
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  // Category Operations
  const saveCategory = async (categoryData: Partial<Category>) => {
    const id = categoryData.id || `cat_${Date.now()}`;
    const newCat: Category = {
      id,
      name: categoryData.name || 'New Category',
      slug: categoryData.slug || (categoryData.name || 'category').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: categoryData.description || '',
      image_url: categoryData.image_url,
      display_order: categoryData.display_order || categories.length + 1,
    };

    setCategories((prev) => {
      const exists = prev.some((c) => c.id === id);
      return exists ? prev.map((c) => (c.id === id ? newCat : c)) : [...prev, newCat];
    });

    if (isSupabaseConfigured()) {
      await supabase.from('categories').upsert(newCat);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (isSupabaseConfigured()) {
      await supabase.from('categories').delete().eq('id', id);
    }
  };

  // Inventory adjustment
  const adjustVariantStock = async (variantId: string, quantityChange: number, reason: string) => {
    let targetProductName = 'Product';
    let targetVariantSku = 'SKU';

    setProducts((prev) =>
      prev.map((p) => {
        const updatedVariants = p.variants?.map((v) => {
          if (v.id === variantId) {
            targetProductName = p.name;
            targetVariantSku = v.sku;
            const newQty = Math.max(0, v.stock_quantity + quantityChange);
            return { ...v, stock_quantity: newQty };
          }
          return v;
        });
        return { ...p, variants: updatedVariants };
      })
    );

    const newLog: InventoryLog = {
      id: `inv_${Date.now()}`,
      productName: targetProductName,
      variantSku: targetVariantSku,
      quantityChange,
      reason,
      createdAt: new Date().toISOString(),
    };

    setInventoryLogs((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase.from('product_variants').select('stock_quantity').eq('id', variantId).single();
        if (data) {
          const updatedQty = Math.max(0, data.stock_quantity + quantityChange);
          await supabase.from('product_variants').update({ stock_quantity: updatedQty }).eq('id', variantId);
        }
      } catch (err) {
        console.error('Inventory adjust exception:', err);
      }
    }
  };

  // Cart Operations
  const addToCart = (product: Product, variant: ProductVariant, quantity = 1, customDesign?: CustomDesignData) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.variant.id === variant.id && JSON.stringify(item.custom_design_data) === JSON.stringify(customDesign)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, variant.stock_quantity || 99),
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        product,
        variant,
        quantity: Math.min(quantity, variant.stock_quantity || 99),
        custom_design_data: customDesign,
      };

      return [...prev, newItem];
    });
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const maxStock = item.variant.stock_quantity || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupon operations
  const applyCoupon = (code: string) => {
    const formatted = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === formatted && c.is_active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.product_id === product.id);
      if (exists) {
        return prev.filter((w) => w.product_id !== product.id);
      } else {
        const newItem: WishlistItem = {
          id: `wish_${Date.now()}`,
          product_id: product.id,
          product,
          created_at: new Date().toISOString(),
        };
        return [...prev, newItem];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((w) => w.product_id === productId);
  };

  // Order Operations
  const createOrder = async (orderData: {
    customerEmail: string;
    customerPhone: string;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Promise<{ success: boolean; orderId?: string; orderNumber?: string; message?: string }> => {
    if (cart.length === 0) {
      return { success: false, message: 'Your shopping cart is empty.' };
    }

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderNumber = `FF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Revalidate cart items and calculate totals
    let subtotal = 0;
    const orderItemsList = cart.map((item) => {
      const price = item.custom_design_data?.total_price
        ? item.custom_design_data.total_price
        : item.variant.price_override || item.product.sale_price || item.product.regular_price;
      const totalItemPrice = price * item.quantity;
      subtotal += totalItemPrice;

      return {
        id: `oi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        order_id: orderId,
        variant_id: item.variant.id,
        product_name: item.product.name,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        unit_price: price,
        quantity: item.quantity,
        total_price: totalItemPrice,
        image_url: item.variant.variant_image_url || item.product.images?.find((i) => i.is_main)?.url || item.product.images?.[0]?.url,
        custom_design_data: item.custom_design_data,
      };
    });

    // Discount
    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discount_type === 'percentage') {
        discountAmount = (subtotal * appliedCoupon.discount_value) / 100;
      } else {
        discountAmount = appliedCoupon.discount_value;
      }
    }

    const shippingFee = subtotal >= storeSettings.free_shipping_threshold ? 0 : storeSettings.shipping_fee_flat;
    const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
      shipping_address: orderData.shippingAddress,
      status: 'pending',
      payment_status: orderData.paymentMethod === 'cod' ? 'unpaid' : 'paid',
      payment_method: orderData.paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      total_amount: finalTotal,
      notes: orderData.notes,
      created_at: now,
      updated_at: now,
      items: orderItemsList,
    };

    // Deduct stock quantity for each purchased variant
    for (const item of cart) {
      if (item.variant.id) {
        adjustVariantStock(item.variant.id, -item.quantity, `Customer Purchase Order #${orderNumber}`);
      }
    }

    setOrders((prev) => [newOrder, ...prev]);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          order_number: newOrder.order_number,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone,
          shipping_address: newOrder.shipping_address,
          status: newOrder.status,
          payment_status: newOrder.payment_status,
          payment_method: newOrder.payment_method,
          subtotal: newOrder.subtotal,
          shipping_fee: newOrder.shipping_fee,
          discount_amount: newOrder.discount_amount,
          total_amount: newOrder.total_amount,
          notes: newOrder.notes,
        });

        for (const item of orderItemsList) {
          await supabase.from('order_items').insert({
            order_id: newOrder.id,
            variant_id: item.variant_id,
            product_name: item.product_name,
            sku: item.sku,
            size: item.size,
            color: item.color,
            unit_price: item.unit_price,
            quantity: item.quantity,
            total_price: item.total_price,
            custom_design_data: item.custom_design_data,
          });
        }
      } catch (err) {
        console.error('Supabase order creation exception:', err);
      }
    }

    clearCart();
    return { success: true, orderId, orderNumber };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status,
            tracking_number: trackingNumber || o.tracking_number,
            updated_at: new Date().toISOString(),
          };
          if (isSupabaseConfigured()) {
            supabase.from('orders').update({ status, tracking_number: trackingNumber }).eq('id', orderId);
          }
          return updated;
        }
        return o;
      })
    );
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, payment_status: paymentStatus, updated_at: new Date().toISOString() };
          if (isSupabaseConfigured()) {
            supabase.from('orders').update({ payment_status: paymentStatus }).eq('id', orderId);
          }
          return updated;
        }
        return o;
      })
    );
  };

  // Review
  const addReview = async (productId: string, rating: number, comment: string, reviewerName: string) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      product_id: productId,
      reviewer_name: reviewerName,
      rating,
      comment,
      is_verified: true,
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    if (isSupabaseConfigured()) {
      await supabase.from('reviews').insert(newReview);
    }
  };

  // Settings
  const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...settings }));
    if (isSupabaseConfigured()) {
      await supabase.from('store_settings').upsert({ key: 'general', value: settings });
    }
  };

  // Contact
  const sendContactMessage = async (msg: { name: string; email: string; subject?: string; message: string }) => {
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    setContactMessages((prev) => [newMsg, ...prev]);

    if (isSupabaseConfigured()) {
      await supabase.from('contact_messages').insert(newMsg);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        coupons,
        reviews,
        storeSettings,
        contactMessages,
        inventoryLogs,
        appliedCoupon,
        loading,
        saveProduct,
        deleteProduct,
        toggleProductStatus,
        saveCategory,
        deleteCategory,
        adjustVariantStock,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        addReview,
        updateStoreSettings,
        sendContactMessage,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
