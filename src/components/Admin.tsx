import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  Plus, Trash2, Edit2, Save, X, 
  Image as ImageIcon, Loader2, LogOut, 
  LayoutDashboard, Package, Settings,
  ChevronRight, AlertCircle
} from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  images: string[];
  icon_name: string;
};

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    details: '',
    price: 0,
    images: [],
    icon_name: 'FileText'
  });
  const [uploading, setUploading] = useState(false);

  // Simple admin password check (In a real app, use Supabase Auth)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Placeholder password
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('Incorrect password');
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (currentProduct.id) {
      // Update
      const { error } = await supabase
        .from('products')
        .update(currentProduct)
        .eq('id', currentProduct.id);
      if (error) alert(error.message);
    } else {
      // Create
      const { error } = await supabase
        .from('products')
        .insert([currentProduct]);
      if (error) alert(error.message);
    }

    setIsEditing(false);
    setCurrentProduct({
      name: '',
      description: '',
      details: '',
      price: 0,
      images: [],
      icon_name: 'FileText'
    });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) alert(error.message);
    fetchProducts();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      if (uploadError.message.includes('Bucket not found')) {
        alert('Error: Storage bucket "products" not found. Please create a public bucket named "products" in your Supabase dashboard.');
      } else {
        alert(uploadError.message);
      }
    } else {
      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      setCurrentProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), data.publicUrl]
      }));
    }
    setUploading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings size={32} />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Admin Portal</h1>
            <p className="text-stone-500">Enter your password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-stone-500 hover:text-emerald-600 font-medium transition-colors">
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Settings size={18} />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 rounded-xl text-white font-medium">
            <Package size={20} />
            Products
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:bg-stone-800 rounded-xl transition-colors">
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          <div className="pt-4 mt-4 border-t border-stone-800">
            <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all">
              <X size={20} />
              Exit Admin
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-stone-800">
          <button 
            onClick={() => {
              localStorage.removeItem('admin_auth');
              setIsAuthenticated(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-stone-900">Product Management</h1>
              <p className="text-stone-500">Add, edit, or remove products from your catalog</p>
            </div>
            <button 
              onClick={() => {
                setCurrentProduct({
                  name: '',
                  description: '',
                  details: '',
                  price: 0,
                  images: [],
                  icon_name: 'FileText'
                });
                setIsEditing(true);
              }}
              className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Product List */}
          <div className="grid gap-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-emerald-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">No products yet</h3>
                <p className="text-stone-500 mb-6">Start by adding your first product to the catalog.</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Add your first product
                </button>
              </div>
            ) : (
              products.map(product => (
                <div key={product.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex items-center gap-6 group hover:shadow-md transition-all">
                  <div className="w-24 h-24 bg-stone-100 rounded-2xl overflow-hidden shrink-0">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-stone-900 mb-1">{product.name}</h3>
                    <p className="text-stone-500 line-clamp-1">{product.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm font-medium text-stone-400">
                      <span>{product.images?.length || 0} Images</span>
                      <span>•</span>
                      <span className="text-emerald-600">GHS {product.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setCurrentProduct(product);
                        setIsEditing(true);
                      }}
                      className="p-3 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setIsEditing(false)}
            />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">
                  {currentProduct.id ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsEditing(false)} className="text-stone-400 hover:text-stone-900">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={currentProduct.name}
                      onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="e.g. A4 Papers"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Price (GHS)</label>
                    <input 
                      type="number" 
                      required
                      value={isNaN(currentProduct.price as number) ? '' : currentProduct.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrentProduct({...currentProduct, price: val === '' ? 0 : parseFloat(val)});
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Short Description</label>
                  <input 
                    type="text" 
                    required
                    value={currentProduct.description}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Brief summary for the card"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Full Details</label>
                  <textarea 
                    rows={4}
                    required
                    value={currentProduct.details}
                    onChange={(e) => setCurrentProduct({...currentProduct, details: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Detailed information for the modal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Product Images</label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {currentProduct.images?.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setCurrentProduct(prev => ({
                            ...prev,
                            images: prev.images?.filter((_, i) => i !== idx)
                          }))}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 hover:border-emerald-500 hover:text-emerald-500 cursor-pointer transition-all">
                      {uploading ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <>
                          <Plus size={24} />
                          <span className="text-[10px] font-bold mt-1 uppercase">Upload</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-stone-200 font-bold text-stone-600 hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
