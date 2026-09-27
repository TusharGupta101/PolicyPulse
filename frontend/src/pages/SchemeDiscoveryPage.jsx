import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { schemeService } from '../services/schemeService';
import { eligibilityService } from '../services/eligibilityService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Compass,
  ArrowRight,
  Tag,
  Globe,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Users,
  Building2
} from 'lucide-react';

export default function SchemeDiscoveryPage() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [checkingId, setCheckingId] = useState(null);

  const categories = [
    'All',
    'Agriculture',
    'Healthcare',
    'Housing',
    'Education',
    'Business',
    'Social Security'
  ];

  const states = [
    'All',
    'All India',
    'Uttar Pradesh',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Delhi',
    'Bihar',
    'Rajasthan'
  ];

  useEffect(() => {
    async function fetchSchemes() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedState !== 'All') params.state = selectedState;
        if (searchTerm && searchTerm.trim()) params.search = searchTerm.trim();

        const data = await schemeService.getSchemes(params);
        setSchemes(data || []);
      } catch (err) {
        console.error('Failed to load schemes:', err);
        setSchemes([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSchemes();
  }, [selectedCategory, selectedState, searchTerm]);

  const handleCheckSingleScheme = async (schemeId) => {
    setCheckingId(schemeId);
    try {
      await eligibilityService.checkEligibility(schemeId);
      navigate('/results');
    } catch (err) {
      console.error('Failed checking eligibility for scheme:', err);
      navigate('/results');
    } finally {
      setCheckingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
              National Policy Directory
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#173B32]">Discover Government Schemes</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-2xl">
            Explore verified central and state welfare initiatives with transparent criteria and deterministic qualification rules.
          </p>
        </div>
        <Link
          to="/eligibility"
          className="px-4 py-2.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
          Check All Schemes Eligibility
        </Link>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E0D8] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search schemes by name, keyword, or beneficiary group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white placeholder:text-[#9CA3AF]"
            />
          </div>

          {/* State Select */}
          <div className="w-full md:w-56">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Jurisdictions' : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-[#E5E0D8]/60">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider pl-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#246B55]" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#246B55] text-white shadow-sm'
                  : 'bg-[#FAF9F5] text-[#4B5563] hover:bg-[#E8F3EE] hover:text-[#173B32] border border-[#E5E0D8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingSpinner text="Retrieving verified welfare policies..." />
      ) : schemes.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E5E0D8] text-center space-y-3">
          <Compass className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#173B32]">No matching schemes found</h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto">
            Try modifying your search keywords or resetting the category filter to explore other available welfare programs.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedState('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-[#FAF9F5] hover:bg-[#E8F3EE] text-[#173B32] border border-[#D1C7B7] text-xs font-semibold rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-[#E5E0D8] p-5 shadow-sm hover:shadow-md hover:border-[#246B55]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
                    {scheme.category}
                  </span>
                  <span className="text-[10px] text-[#6B7280] font-mono">{scheme.code}</span>
                </div>

                <h3 className="text-base font-bold text-[#173B32] leading-snug">
                  {scheme.name}
                </h3>
                
                <p className="mt-2 text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Meta details */}
                <div className="mt-4 pt-3 border-t border-[#E5E0D8] space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-[#4B5563]">
                    <Coins className="w-3.5 h-3.5 text-[#D9A441] flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#173B32]">Benefit:</strong> {scheme.benefit_description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#4B5563]">
                    <Globe className="w-3.5 h-3.5 text-[#246B55] flex-shrink-0" />
                    <span>
                      <strong className="text-[#173B32]">State:</strong> {scheme.state_applicability}
                    </span>
                  </div>
                  {scheme.target_users && (
                    <div className="flex items-center gap-2 text-[#4B5563]">
                      <Users className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                      <span className="truncate">
                        <strong className="text-[#173B32]">Target:</strong> {scheme.target_users}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#E5E0D8] flex items-center justify-between gap-2">
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="text-xs font-bold text-[#246B55] hover:text-[#173B32] flex items-center gap-1 transition-colors"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleCheckSingleScheme(scheme.id)}
                  disabled={checkingId === scheme.id}
                  className="px-3 py-1.5 bg-[#173B32] hover:bg-[#246B55] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-60"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
                  {checkingId === scheme.id ? 'Checking...' : 'Check Eligibility'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
