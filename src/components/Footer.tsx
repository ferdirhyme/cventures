import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              CV
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Combatiac Ventures
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Combatiac Ventures. All rights reserved.
            </div>
            <Link 
              to="/admin" 
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest hover:text-emerald-500 transition-colors"
            >
              <Settings size={14} />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
