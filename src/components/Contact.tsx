import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send request');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-emerald-600 font-semibold tracking-wide uppercase text-sm mb-3">Contact Us</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">Get in Touch</h3>
            <p className="text-lg text-stone-600 mb-8">
              Ready to place an order or need a proforma invoice? Contact us today and experience our selfless operation.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-lg">Office Location</h4>
                  <p className="text-stone-600">Rhema street, Lebanon zone 4 Ashaiman.</p>
                  <p className="text-stone-600">Hse No z4/B149. GPS Address GB.050-3461.</p>
                  <p className="text-stone-600">Greater Accra, Ghana</p>
                  <p className="text-stone-500 mt-1 text-sm">Postal: P.o.box As 564 Ashaiman</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-lg">Phone</h4>
                  <p className="text-stone-600">0246037971</p>
                  <p className="text-stone-600">0273580479</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-lg">Email</h4>
                  <p className="text-stone-600">issahawal3@gmail.com</p>
                  <p className="text-stone-600">combatiacventures@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-stone-900 text-lg">Manager</h4>
                  <p className="text-stone-600">Issah Awal</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200">
            <h4 className="text-2xl font-bold text-stone-900 mb-6">Request a Quote</h4>
            
            {status === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h5 className="text-xl font-bold text-stone-900 mb-2">Request Sent!</h5>
                <p className="text-stone-600">
                  Thank you for reaching out. We have received your request and will get back to you with a proforma invoice shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-emerald-600 font-medium hover:text-emerald-700"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {status === 'error' && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50" 
                    placeholder="john@company.com" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Items Needed</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={status === 'loading'}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:opacity-50" 
                    placeholder="List the items you need..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full bg-emerald-600 text-white font-semibold py-4 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
