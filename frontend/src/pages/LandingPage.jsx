import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { schemeService } from '../services/schemeService';
import {
  ShieldCheck,
  Compass,
  FileCheck2,
  FileText,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Coins,
  Building2,
  Scale,
  Cpu,
  Lock,
  UserCheck,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);

  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await schemeService.getSchemes();
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedSchemes(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured schemes:', err);
      } finally {
        setLoadingSchemes(false);
      }
    }
    loadSchemes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1F2933] flex flex-col font-sans">
      {/* Universal Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8F3EE] border border-[#246B55]/30 text-[#173B32] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#246B55]"></span>
                Deterministic Citizen Welfare Intelligence
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B32] tracking-tight leading-[1.15]">
                Government schemes shouldn't be difficult to understand.
              </h1>

              <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl leading-relaxed">
                PolicyPulse helps citizens discover relevant government schemes, understand eligibility requirements, and track applications — all in one place.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/schemes"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#246B55] hover:bg-[#1B5241] shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#D9A441]" />
                  Explore Schemes
                </Link>
                <Link
                  to="/eligibility"
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold text-[#173B32] bg-white hover:bg-[#FAF9F5] border border-[#D1C7B7] shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4 text-[#246B55]" />
                  Check Eligibility
                </Link>
              </div>

              {/* Key Trust Highlights */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#E5E0D8]/80 text-xs text-[#4B5563]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                  <span>Rule-Based Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                  <span>Zero Hallucination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                  <span>Document Checklists</span>
                </div>
              </div>
            </div>

            {/* Right Live Preview / Interactive Card Composition */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-[#DCD6CA] shadow-xl p-5 space-y-4">
                
                {/* Simulated Profile Card Header */}
                <div className="bg-[#173B32] rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#246B55] border border-[#D9A441] flex items-center justify-center text-[#D9A441] font-bold text-sm">
                        AS
                      </div>
                      <div>
                        <h3 className="text-sm font-bold leading-tight">Aarav Sharma</h3>
                        <p className="text-[11px] text-[#A3BFB7]">Farmer &bull; Uttar Pradesh &bull; ₹1.8L Income</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D9A441] text-[#173B32]">
                      VERIFIED
                    </span>
                  </div>
                </div>

                {/* Simulated Eligibility Match 1 */}
                <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E5E0D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
                        Agriculture
                      </span>
                      <span className="text-xs font-bold text-[#173B32]">PM-KISAN Samman</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ELIGIBLE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Direct income support of ₹6,000/year for landholding smallholder farmer families.
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-[#173B32] font-semibold border-t border-[#E5E0D8]">
                    <span>Entitled Benefit: ₹6,000 / yr</span>
                    <span className="text-[#246B55] flex items-center gap-0.5">3/3 Rules Met &rarr;</span>
                  </div>
                </div>

                {/* Simulated Eligibility Match 2 */}
                <div className="bg-[#FAF9F5] rounded-xl p-3.5 border border-[#E5E0D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
                        Healthcare
                      </span>
                      <span className="text-xs font-bold text-[#173B32]">Ayushman Bharat (PM-JAY)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      DOCS NEEDED
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">
                    Cashless health cover up to ₹5,00,000/family per year for secondary and tertiary care.
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-[#173B32] font-semibold border-t border-[#E5E0D8]">
                    <span>Cover: ₹5,00,000 / yr</span>
                    <span className="text-[#D97706]">Upload Ration Card &rarr;</span>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-[#246B55] hover:text-[#173B32] inline-flex items-center gap-1"
                  >
                    Try interactive demo evaluation &rarr;
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-16 bg-white border-b border-[#E5E0D8]" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#246B55]">Core Values</h2>
            <p className="text-2xl sm:text-3xl font-bold text-[#173B32] mt-1">
              Built for transparent, citizen-centric discovery
            </p>
            <p className="text-sm text-[#6B7280] mt-2">
              Every feature is engineered to remove guesswork and eliminate bureaucratic barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#FAF9F5] p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] border border-[#246B55]/20 flex items-center justify-center text-[#246B55]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B32]">Discover Schemes</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Filter across agriculture, health, housing, education, business, and social security tailored to your state and occupation.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] border border-[#246B55]/20 flex items-center justify-center text-[#246B55]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B32]">Understand Eligibility</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Evaluate statutory rules mathematically without opaque or hallucinated AI criteria.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] border border-[#246B55]/20 flex items-center justify-center text-[#246B55]">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B32]">Know Required Documents</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Get explicit evidence checklists (Aadhaar, income certificates, ration cards, land records) before applying.
              </p>
            </div>

            <div className="bg-[#FAF9F5] p-6 rounded-xl border border-[#E5E0D8] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F3EE] border border-[#246B55]/20 flex items-center justify-center text-[#246B55]">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#173B32]">Track Applications</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Generate unique reference tracking numbers and monitor submission milestones in one centralized portal.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 lg:py-20 bg-[#F7F5EF] border-b border-[#E5E0D8]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#246B55]">Step-by-Step Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#173B32] mt-1">
              How PolicyPulse Works
            </h2>
            <p className="text-sm text-[#6B7280] mt-2">
              From profile setup to submission tracking in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm relative">
              <div className="text-3xl font-black text-[#D9A441]/40 mb-3">01</div>
              <h3 className="text-base font-bold text-[#173B32] mb-1.5">Create Profile</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Enter your age, state, annual income, occupation, land holding, and social category.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm relative">
              <div className="text-3xl font-black text-[#D9A441]/40 mb-3">02</div>
              <h3 className="text-base font-bold text-[#173B32] mb-1.5">Discover Schemes</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Explore central and state schemes with clear benefit descriptions and statutory limits.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm relative">
              <div className="text-3xl font-black text-[#D9A441]/40 mb-3">03</div>
              <h3 className="text-base font-bold text-[#173B32] mb-1.5">Check Eligibility</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Our deterministic engine tests statutory criteria and identifies pending documents.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm relative">
              <div className="text-3xl font-black text-[#D9A441]/40 mb-3">04</div>
              <h3 className="text-base font-bold text-[#173B32] mb-1.5">Track Application</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Submit claims with auto-generated tracking codes and monitor review stages.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Real Schemes Section */}
      <section className="py-16 bg-white border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#246B55]">Catalog Highlights</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#173B32] mt-1">Featured Welfare Schemes</h2>
              <p className="text-sm text-[#6B7280] mt-1">Verified schemes active in the database.</p>
            </div>
            <Link
              to="/schemes"
              className="text-xs font-bold text-[#246B55] hover:text-[#173B32] flex items-center gap-1"
            >
              Browse All Schemes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featuredSchemes.length > 0 ? featuredSchemes : [
              {
                id: 1,
                name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
                category: 'Agriculture',
                code: 'PM-KISAN-2019',
                benefit_description: '₹6,000 per year direct income support in 3 equal installments',
                state_applicability: 'All India',
                target_users: 'Small & Marginal Farmer Families'
              },
              {
                id: 2,
                name: 'Ayushman Bharat PM-JAY',
                category: 'Healthcare',
                code: 'AB-PMJAY-2018',
                benefit_description: 'Health cover of ₹5,00,000 per family per year for hospitalization',
                state_applicability: 'All India',
                target_users: 'Low income & SECC listed families'
              },
              {
                id: 3,
                name: 'Pradhan Mantri Awas Yojana (Urban / Gramin)',
                category: 'Housing',
                code: 'PMAY-2015',
                benefit_description: 'Direct financial subsidy up to ₹2.67 Lakhs for pucca house',
                state_applicability: 'All India',
                target_users: 'EWS, LIG, and Homeless families'
              }
            ]).map((scheme) => (
              <div
                key={scheme.id}
                className="bg-[#FAF9F5] rounded-xl border border-[#E5E0D8] p-5 flex flex-col justify-between hover:border-[#246B55]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#6B7280]">{scheme.code}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#173B32] leading-snug">{scheme.name}</h3>
                  <p className="text-xs text-[#6B7280] mt-2 line-clamp-2">
                    {scheme.benefit_description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#E5E0D8] flex items-center justify-between">
                  <span className="text-[11px] text-[#4B5563]">
                    <strong>Applicability:</strong> {scheme.state_applicability}
                  </span>
                  <Link
                    to={`/schemes/${scheme.id}`}
                    className="text-xs font-bold text-[#246B55] hover:text-[#173B32]"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Explanation Section (Deterministic Differentiation) */}
      <section className="py-16 lg:py-20 bg-[#173B32] text-white" id="rules-engine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441]">Key Architectural Advantage</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              Eligibility decisions are based on explicit rules, not AI guesses.
            </h2>
            <p className="text-sm text-[#A3BFB7] mt-2">
              Government schemes have legal statutory limits. We evaluate profile criteria with mathematical precision.
            </p>
          </div>

          {/* Flowchart Composition */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            <div className="bg-[#102B24] p-5 rounded-xl border border-[#235346] text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#173B32] border border-[#246B55] text-[#D9A441] mx-auto flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Profile Data</h3>
              <p className="text-xs text-[#A3BFB7]">
                Age, Income, State, Occupation, Land Area, Caste Category.
              </p>
            </div>

            <div className="bg-[#102B24] p-5 rounded-xl border border-[#235346] text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#246B55] text-white mx-auto flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Deterministic Rule Engine</h3>
              <p className="text-xs text-[#A3BFB7]">
                Evaluates boolean & comparison operators directly (`&lt;=`, `&gt;=`, `IN`).
              </p>
            </div>

            <div className="bg-[#102B24] p-5 rounded-xl border border-[#235346] text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#173B32] border border-[#059669] text-[#059669] mx-auto flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Eligibility Result</h3>
              <p className="text-xs text-[#A3BFB7]">
                Exact status: `ELIGIBLE`, `POTENTIALLY_ELIGIBLE`, or `INELIGIBLE`.
              </p>
            </div>

            <div className="bg-[#102B24] p-5 rounded-xl border border-[#235346] text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#173B32] border border-[#D9A441] text-[#D9A441] mx-auto flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-sm font-bold text-white">Official Explanation</h3>
              <p className="text-xs text-[#A3BFB7]">
                Grounded gazette citations and required document checklist.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Strong Final CTA Section */}
      <section className="py-16 bg-[#F7F5EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#173B32] tracking-tight">
            Find the support you're eligible for.
          </h2>
          <p className="text-base text-[#4B5563] max-w-xl mx-auto">
            Explore verified government welfare programs, verify your criteria, and start your application today.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/schemes"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#246B55] hover:bg-[#1B5241] shadow-sm transition-all"
            >
              Explore Government Schemes
            </Link>
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl text-sm font-semibold text-[#173B32] bg-white hover:bg-[#FAF9F5] border border-[#D1C7B7] shadow-sm transition-all"
            >
              Create Free Citizen Account
            </Link>
          </div>
        </div>
      </section>

      {/* Universal Civic-Tech Footer */}
      <Footer />
    </div>
  );
}
