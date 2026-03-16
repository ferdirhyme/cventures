import { motion } from 'motion/react';
import { Truck, CreditCard, FileText, BadgePercent } from 'lucide-react';

export default function Features() {
  const conditions = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free & Fast Delivery",
      description: "Free delivery within 24 hours of approved orders. Immediate delivery available in case of emergency."
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Flexible Credit Facilities",
      description: "We give credit facilities up to two weeks for payment, or a different limit period as we will agree."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Easy Ordering Process",
      description: "Place orders by email or phone. We issue a proforma invoice, and upon approval and LPO, we deliver within 24 hours."
    },
    {
      icon: <BadgePercent className="w-6 h-6" />,
      title: "Competitive Pricing",
      description: "Our prices are very competitive while maintaining good item qualities across all our product ranges."
    }
  ];

  return (
    <section id="services" className="py-20 bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-emerald-400 font-semibold tracking-wide uppercase text-sm mb-3">Sales Conditions</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Combatiac Ventures?</h3>
            <p className="text-stone-400 text-lg mb-8">
              We offer unmatched convenience and flexibility to ensure your office never runs out of essential supplies.
            </p>
            
            <div className="space-y-8">
              {conditions.map((condition, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-emerald-400">
                    {condition.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{condition.title}</h4>
                    <p className="text-stone-400 leading-relaxed">{condition.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-[100px] opacity-20 rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop" 
              alt="Office Workspace" 
              className="rounded-2xl shadow-2xl relative z-10"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
