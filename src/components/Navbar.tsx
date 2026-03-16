import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Settings } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Products', href: '#products' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                CV
              </div>
              <span className="font-bold text-xl tracking-tight text-stone-800">
                Combatiac Ventures
              </span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-stone-600 hover:text-emerald-600 font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Phone size={18} />
              <span>Order Now</span>
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-stone-600 hover:text-emerald-600 hover:bg-stone-50 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/admin"
              className="flex items-center gap-2 px-3 py-2 text-base font-medium text-stone-400 hover:text-emerald-600 hover:bg-stone-50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={18} />
              Staff Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
