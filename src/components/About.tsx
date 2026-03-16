import { motion } from 'motion/react';
import { Target, History, UserCheck } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mb-3">About Us</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">A Selfless Operation Dedicated to Your Office</h3>
          <p className="text-lg text-stone-600">
            Founded on July 6th, 2020, Combatiac Ventures is a personal-owned business establishing itself as a result-oriented leader in office supplies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <History className="w-8 h-8 text-emerald-600" />,
              title: "Our Foundation",
              description: "Since our inception in 2020, we have grown rapidly by focusing on customer satisfaction and reliable service."
            },
            {
              icon: <Target className="w-8 h-8 text-emerald-600" />,
              title: "Our Mission",
              description: "To deliver the best office supplies that satisfy our customers to the maximum, acting as a true one-stop shop."
            },
            {
              icon: <UserCheck className="w-8 h-8 text-emerald-600" />,
              title: "Customer First",
              description: "We keep records of the products you buy from us, so when you have to order again, we know exactly what you require."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-stone-50 p-8 rounded-2xl border border-stone-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">{item.title}</h4>
              <p className="text-stone-600 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
