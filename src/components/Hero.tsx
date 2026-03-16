import { motion } from 'motion/react';
import { ArrowRight, Package, Clock, CreditCard } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Dealers In General Merchant
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] mb-6">
              Your One-Stop Shop for <span className="text-emerald-600">Office Needs.</span>
            </h1>
            <p className="text-lg text-stone-600 mb-8 max-w-lg leading-relaxed">
              Delivering the best office supplies that satisfy our customers to the maximum. From papers and pens to printers and cabinets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#products"
                className="inline-flex justify-center items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                Explore Products
                <ArrowRight size={20} />
              </a>
              <a
                href="#contact"
                className="inline-flex justify-center items-center gap-2 bg-white text-stone-800 border border-stone-200 px-8 py-4 rounded-full font-semibold hover:bg-stone-50 transition-colors"
              >
                Contact Us
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-stone-200">
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-semibold mb-1">
                  <Clock className="text-emerald-600" size={20} />
                  <span>24h Delivery</span>
                </div>
                <p className="text-sm text-stone-500">Free on approved orders</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-semibold mb-1">
                  <CreditCard className="text-emerald-600" size={20} />
                  <span>Credit Facility</span>
                </div>
                <p className="text-sm text-stone-500">Up to two weeks</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-semibold mb-1">
                  <Package className="text-emerald-600" size={20} />
                  <span>Smart Reorder</span>
                </div>
                <p className="text-sm text-stone-500">We keep your records</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-stone-100 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop"
              alt="Modern Office Workspace"
              className="rounded-3xl shadow-2xl object-cover h-[600px] w-full"
              referrerPolicy="no-referrer"
            />
            
            {/* Floating badge 1 */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                  20+
                </div>
                <div>
                  <p className="font-bold text-stone-900">Product Categories</p>
                  <p className="text-sm text-stone-500">Everything you need</p>
                </div>
              </div>
            </div>

            {/* Floating badge 2 */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">Quality Guaranteed</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest">Premium Supplies</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
