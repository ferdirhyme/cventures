/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Admin from './components/Admin';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Products />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}
