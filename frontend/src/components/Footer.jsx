import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Compass, FileCheck2, Send, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#173B32] text-slate-300 border-t border-[#1F4D42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 inline-block">
              <div className="w-10 h-10 rounded-xl bg-[#246B55] border border-[#37856D] flex items-center justify-center text-[#D9A441] font-bold shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-white text-xl tracking-tight block">
                  Policy<span className="text-[#D9A441]">Pulse</span>
                </span>
                <span className="text-[11px] text-[#A3BFB7] font-medium tracking-wide uppercase block">
                  Understand. Discover. Access.
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#A3BFB7] max-w-sm leading-relaxed">
              Making government schemes easier to discover and understand with deterministic eligibility verification and transparent statutory guidance.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#102B24] border border-[#235346] text-xs text-[#D9A441]">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
              Deterministic Rule Engine Active
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/dashboard" className="text-[#A3BFB7] hover:text-white transition-colors flex items-center gap-1.5">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-[#A3BFB7] hover:text-white transition-colors flex items-center gap-1.5">
                  Scheme Discovery
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="text-[#A3BFB7] hover:text-white transition-colors flex items-center gap-1.5">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link to="/applications" className="text-[#A3BFB7] hover:text-white transition-colors flex items-center gap-1.5">
                  Track Applications
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#how-it-works" className="text-[#A3BFB7] hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#A3BFB7] hover:text-white transition-colors">
                  About PolicyPulse
                </a>
              </li>
              <li>
                <a
                  href={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')}/docs`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A3BFB7] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  API Documentation
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="#rules-engine" className="text-[#A3BFB7] hover:text-white transition-colors">
                  Rule Engine Specs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Notices */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Transparency</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-[#A3BFB7] hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-[#A3BFB7] hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-[#A3BFB7] hover:text-white cursor-pointer transition-colors">
                  Public Disclaimer
                </span>
              </li>
            </ul>
            <p className="text-[11px] text-[#7E9F96] leading-normal pt-1">
              Independent civic-tech discovery tool. Not an official government portal.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#1F4D42] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3BFB7]">
          <p>© 2026 PolicyPulse. Built for accessible public-service discovery.</p>
          <div className="flex items-center gap-4">
            <span className="text-[#D9A441] font-medium">Hackathon Edition</span>
            <span>&bull;</span>
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
