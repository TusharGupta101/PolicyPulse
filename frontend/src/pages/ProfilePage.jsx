import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UserCircle2,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  HeartHandshake,
  CreditCard,
  Building,
  GraduationCap,
  ShieldCheck,
  Percent
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    marital_status: 'Married',
    annual_income: '',
    occupation: 'Farmer',
    land_ownership_acres: '0',
    state: 'Uttar Pradesh',
    caste_category: 'General',
    disability_status: false,
    has_ration_card: false,
    has_bpl_card: false,
    is_student: false,
    is_senior_citizen: false,
    is_minority: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await profileService.getProfile();
        if (data) {
          setFormData({
            age: data.age !== null && data.age !== undefined ? data.age : '',
            gender: data.gender || 'Male',
            marital_status: data.marital_status || 'Married',
            annual_income: data.annual_income !== null && data.annual_income !== undefined ? data.annual_income : '',
            occupation: data.occupation || 'Farmer',
            land_ownership_acres: data.land_ownership_acres !== null && data.land_ownership_acres !== undefined ? data.land_ownership_acres : '0',
            state: data.state || 'Uttar Pradesh',
            caste_category: data.caste_category || 'General',
            disability_status: !!data.disability_status,
            has_ration_card: !!data.has_ration_card,
            has_bpl_card: !!data.has_bpl_card,
            is_student: !!data.is_student,
            is_senior_citizen: !!data.is_senior_citizen,
            is_minority: !!data.is_minority,
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculateCompletion = () => {
    const essentialFields = [
      formData.age !== '',
      formData.gender !== '',
      formData.marital_status !== '',
      formData.annual_income !== '',
      formData.occupation !== '',
      formData.state !== '',
      formData.caste_category !== '',
      formData.land_ownership_acres !== ''
    ];
    const completedCount = essentialFields.filter(Boolean).length;
    return Math.round((completedCount / essentialFields.length) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const payload = {
      ...formData,
      age: formData.age === '' ? null : parseInt(formData.age, 10),
      annual_income: formData.annual_income === '' ? null : parseFloat(formData.annual_income),
      land_ownership_acres: parseFloat(formData.land_ownership_acres) || 0.0,
    };

    try {
      await profileService.updateProfile(payload);
      setMessage({
        type: 'success',
        text: 'Citizen profile saved successfully! Deterministic eligibility rules will now use your latest parameters.'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update profile. Please verify your inputs.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving citizen profile..." />;
  }

  const completionPct = calculateCompletion();

  const indianStates = [
    'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  const occupations = [
    'Farmer',
    'Agricultural Laborer',
    'Daily Wage Worker / Laborer',
    'Self-Employed / Small Business',
    'Salaried Employee (Private / Public)',
    'Student',
    'Homemaker',
    'Unemployed',
    'Retired / Senior Citizen',
    'Artisan / Weaver',
    'Gig Worker / Driver'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
              Verified Citizen Profile
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#173B32]">Citizen Demographic & Criteria Profile</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-xl">
            Keep your profile parameters accurate. The deterministic rule engine evaluates these exact fields to compute your welfare eligibility.
          </p>
        </div>

        {/* Completion Indicator */}
        <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E5E0D8] min-w-[200px] text-center">
          <div className="flex items-center justify-between text-xs font-semibold text-[#173B32] mb-1.5">
            <span>Profile Completion</span>
            <span className="text-[#246B55] font-bold">{completionPct}%</span>
          </div>
          <div className="w-full bg-[#E5E0D8] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#246B55] h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <p className="text-[10px] text-[#6B7280] mt-1.5">
            {completionPct === 100 ? 'All primary criteria recorded' : 'Complete missing fields for optimal matching'}
          </p>
        </div>
      </div>

      {/* Notifications */}
      {message.text && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="leading-snug">{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Personal Information */}
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D8]">
            <UserCircle2 className="w-5 h-5 text-[#246B55]" />
            <h2 className="text-base font-bold text-[#173B32]">1. Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Citizen Full Name
              </label>
              <input
                type="text"
                disabled
                value={user?.full_name || 'Citizen'}
                className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#E5E0D8] rounded-lg text-sm text-[#6B7280] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#6B7280] mt-0.5 block">Managed via account settings</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                min="0"
                max="120"
                placeholder="e.g. 34"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender / Other">Transgender / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Marital Status
              </label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              >
                <option value="Single">Single / Unmarried</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Financial Information */}
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D8]">
            <CreditCard className="w-5 h-5 text-[#246B55]" />
            <h2 className="text-base font-bold text-[#173B32]">2. Financial & Occupation Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Annual Household Income (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="annual_income"
                min="0"
                step="1000"
                placeholder="e.g. 180000"
                value={formData.annual_income}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              />
              <span className="text-[10px] text-[#6B7280] mt-0.5 block">Total family income per annum</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Primary Occupation <span className="text-rose-500">*</span>
              </label>
              <select
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              >
                {occupations.map((occ) => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Agricultural Land Ownership (Acres)
              </label>
              <input
                type="number"
                name="land_ownership_acres"
                min="0"
                step="0.1"
                placeholder="e.g. 2.5"
                value={formData.land_ownership_acres}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              />
              <span className="text-[10px] text-[#6B7280] mt-0.5 block">0 if non-landholding or urban</span>
            </div>
          </div>
        </div>

        {/* 3. Location Information */}
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D8]">
            <MapPin className="w-5 h-5 text-[#246B55]" />
            <h2 className="text-base font-bold text-[#173B32]">3. Domicile & Location</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                State / Union Territory of Residence <span className="text-rose-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <span className="text-[10px] text-[#6B7280] mt-0.5 block">Determines state-specific scheme eligibility</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] mb-1">
                Social / Caste Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="caste_category"
                value={formData.caste_category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
              >
                <option value="General">General (Unreserved)</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Social & Welfare Status Checkboxes */}
        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D8]">
            <HeartHandshake className="w-5 h-5 text-[#246B55]" />
            <h2 className="text-base font-bold text-[#173B32]">4. Social & Special Eligibility Status</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-[#F2EFE8] cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="disability_status"
                checked={formData.disability_status}
                onChange={handleChange}
                className="mt-1 rounded text-[#246B55] focus:ring-[#246B55]"
              />
              <span className="text-xs font-medium text-[#173B32]">
                Person with Benchmark Disability (PwD &ge; 40%)
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-[#F2EFE8] cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="has_ration_card"
                checked={formData.has_ration_card}
                onChange={handleChange}
                className="mt-1 rounded text-[#246B55] focus:ring-[#246B55]"
              />
              <span className="text-xs font-medium text-[#173B32]">
                Has Valid NFSA / State Food Ration Card
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-[#F2EFE8] cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="has_bpl_card"
                checked={formData.has_bpl_card}
                onChange={handleChange}
                className="mt-1 rounded text-[#246B55] focus:ring-[#246B55]"
              />
              <span className="text-xs font-medium text-[#173B32]">
                Certified Below Poverty Line (BPL) Family
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-[#F2EFE8] cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="is_student"
                checked={formData.is_student}
                onChange={handleChange}
                className="mt-1 rounded text-[#246B55] focus:ring-[#246B55]"
              />
              <span className="text-xs font-medium text-[#173B32]">
                Currently Enrolled Student
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-[#F2EFE8] cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="is_senior_citizen"
                checked={formData.is_senior_citizen}
                onChange={handleChange}
                className="mt-1 rounded text-[#246B55] focus:ring-[#246B55]"
              />
              <span className="text-xs font-medium text-[#173B32]">
                Senior Citizen (Age &ge; 60)
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-[#F2EFE8] cursor-pointer transition-colors">
              <input
                type="checkbox"
                name="is_minority"
                checked={formData.is_minority}
                onChange={handleChange}
                className="mt-1 rounded text-[#246B55] focus:ring-[#246B55]"
              />
              <span className="text-xs font-medium text-[#173B32]">
                Recognized Minority Community
              </span>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#246B55] hover:bg-[#1B5241] text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4 text-[#D9A441]" />
            {saving ? 'Saving Profile...' : 'Save & Update Profile'}
          </button>
        </div>

      </form>
    </div>
  );
}
