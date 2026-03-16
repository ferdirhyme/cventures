import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  FileText, PenTool, Printer, Archive, Scissors, 
  Paperclip, Box, Droplet, X, ChevronLeft, 
  ChevronRight, ShoppingCart, Loader2, CheckCircle2,
  Package
} from 'lucide-react';

type Product = {
  id?: string;
  name: string;
  icon?: React.ReactNode;
  icon_name?: string;
  desc: string;
  description?: string;
  details: string;
  images: string[];
  price?: number;
};

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText />,
  PenTool: <PenTool />,
  Printer: <Printer />,
  Archive: <Archive />,
  Scissors: <Scissors />,
  Paperclip: <Paperclip />,
  Box: <Box />,
  Droplet: <Droplet />
};

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [orderData, setOrderData] = useState({ name: '', email: '', quantity: '1' });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackProducts: Product[] = [
    { 
      name: "Papers", 
      icon_name: "FileText",
      desc: "A4, A3, letterheads, and specialty papers.",
      details: "High-quality 80gsm and 75gsm papers suitable for all office printing and photocopying needs. Available in reams and boxes.",
      images: [
        "https://images.unsplash.com/photo-1589187151003-0dd37bba8949?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583522684174-ad1148b173d7?q=80&w=2077&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?q=80&w=1974&auto=format&fit=crop"
      ]
    },
    { 
      name: "Pens & Pencils", 
      icon_name: "PenTool",
      desc: "Ballpoint, gel, markers, and premium pens.",
      details: "A wide variety of writing instruments from leading brands. Ergonomic designs for comfortable long-term use.",
      images: [
        "https://images.unsplash.com/photo-1585336261022-69c66d117f6c?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516962080544-eac695c93791?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=1976&auto=format&fit=crop"
      ]
    },
    { 
      name: "Printers", 
      icon_name: "Printer",
      desc: "Laser, inkjet, and multifunction printers.",
      details: "Reliable printing solutions for small to large offices. High-speed performance and excellent print quality.",
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589187151003-0dd37bba8949?q=80&w=2070&auto=format&fit=crop"
      ]
    },
    { 
      name: "Box Files", 
      icon_name: "Archive",
      desc: "Archival storage and daily filing solutions.",
      details: "Durable box files and folders to keep your documents organized and protected. Available in various colors and sizes.",
      images: [
        "https://images.unsplash.com/photo-1586769852044-692d6e3703f0?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=2127&auto=format&fit=crop"
      ]
    },
    { 
      name: "Shredders", 
      icon_name: "Scissors",
      desc: "Secure document destruction equipment.",
      details: "Protect sensitive information with our high-security cross-cut shredders. Quiet operation and jam-proof technology.",
      images: [
        "https://images.unsplash.com/photo-1590013330462-076296362547?q=80&w=2070&auto=format&fit=crop"
      ]
    },
    { 
      name: "Paperclips & Staples", 
      icon_name: "Paperclip",
      desc: "Essential binding and clipping supplies.",
      details: "All the small essentials that keep your documents together. High-quality metal and plastic-coated options.",
      images: [
        "https://images.unsplash.com/photo-1516962080544-eac695c93791?q=80&w=1974&auto=format&fit=crop"
      ]
    },
    { 
      name: "Stationery Cabinets", 
      icon_name: "Box",
      desc: "Secure storage for your office supplies.",
      details: "Heavy-duty steel cabinets with adjustable shelves and secure locking mechanisms. Perfect for organizing bulk stationery.",
      images: [
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1974&auto=format&fit=crop"
      ]
    },
    { 
      name: "Ink & Cartridges", 
      icon_name: "Droplet",
      desc: "Original toners and ink for all printer brands.",
      details: "Genuine ink and toner cartridges for HP, Canon, Epson, and Brother printers. Ensures longevity and consistent print quality.",
      images: [
        "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=2070&auto=format&fit=crop"
      ]
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data.map(p => ({
          ...p,
          desc: p.description // Map Supabase field to local field
        })));
      } else {
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    setOrderStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orderData.name,
          email: orderData.email,
          message: `PRODUCT ORDER: ${selectedProduct.name}\nQuantity: ${orderData.quantity}\n\nPlease provide a proforma invoice for this order.`
        }),
      });

      if (!response.ok) throw new Error('Failed to send order');
      
      setOrderStatus('success');
      setTimeout(() => {
        setOrderStatus('idle');
        setSelectedProduct(null);
        setOrderData({ name: '', email: '', quantity: '1' });
      }, 3000);
    } catch (error) {
      console.error(error);
      setOrderStatus('error');
    }
  };

  const nextImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProduct) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  return (
    <section id="products" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mb-3">Our Products</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">Everything Your Office Needs</h3>
          <p className="text-lg text-stone-600">
            We are general merchants dealing in all sorts of office products. Click on a category to view details and place an order.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentImageIndex(0);
                }}
                className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-emerald-200 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors mb-4">
                  {product.icon || (product.icon_name ? ICON_MAP[product.icon_name] : <Package />)}
                </div>
                <h4 className="text-lg font-bold text-stone-900 mb-2">{product.name}</h4>
                <p className="text-stone-500 text-sm">{product.desc}</p>
                <div className="mt-4 flex items-center text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Gallery & Order <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-stone-900 hover:bg-white transition-colors shadow-lg"
              >
                <X size={20} />
              </button>

              {/* Gallery Section */}
              <div className="lg:w-3/5 relative bg-stone-100 min-h-[300px] lg:min-h-0">
                <img 
                  src={selectedProduct.images[currentImageIndex]} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {selectedProduct.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-stone-900 hover:bg-white transition-colors shadow-lg"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-stone-900 hover:bg-white transition-colors shadow-lg"
                    >
                      <ChevronRight size={20} />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProduct.images.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-emerald-600 w-4' : 'bg-white/60'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Info & Order Section */}
              <div className="lg:w-2/5 p-8 overflow-y-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
                    {selectedProduct.icon || (selectedProduct.icon_name ? ICON_MAP[selectedProduct.icon_name] : <Package />)}
                    <span>Product Category</span>
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 mb-4">{selectedProduct.name}</h3>
                  <p className="text-stone-600 leading-relaxed mb-6">
                    {selectedProduct.details}
                  </p>
                  {selectedProduct.price && (
                    <p className="text-2xl font-bold text-emerald-600 mb-6">GHS {selectedProduct.price}</p>
                  )}
                </div>

                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                  <h4 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-emerald-600" />
                    Place an Order
                  </h4>
                  
                  {orderStatus === 'success' ? (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="font-bold text-stone-900">Order Request Sent!</p>
                      <p className="text-sm text-stone-500 mt-1">We'll contact you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleOrderSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Your Name</label>
                        <input 
                          type="text" 
                          required
                          value={orderData.name}
                          onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={orderData.email}
                          onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                          placeholder="john@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Quantity Needed</label>
                        <input 
                          type="number" 
                          min="1"
                          required
                          value={orderData.quantity}
                          onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
                          className="w-full px-4 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={orderStatus === 'loading'}
                        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {orderStatus === 'loading' ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          'Request Proforma Invoice'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
