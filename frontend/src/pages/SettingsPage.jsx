import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, Shield, Database, Cpu, ExternalLink, Key, ShieldCheck, Scale } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
            System & Privacy Controls
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#173B32]">System Preferences & Security</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Review your account session parameters, compliance settings, and API integrations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-6">
        {/* User Account Info */}
        <div>
          <h2 className="text-base font-bold text-[#173B32] flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-[#246B55]" />
            Citizen Account Credentials
          </h2>
          <div className="bg-[#FAF9F5] rounded-xl p-4 border border-[#E5E0D8] space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Account Name:</span>
              <span className="font-semibold text-[#173B32]">{user?.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Registered Email:</span>
              <span className="font-mono text-[#173B32]">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Role & Access Tier:</span>
              <span className="font-semibold text-[#246B55] capitalize">{user?.role || 'Citizen'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Account Status:</span>
              <span className="text-emerald-700 font-semibold">Active & Verified</span>
            </div>
          </div>
        </div>

        {/* Security Architecture */}
        <div className="pt-2 border-t border-[#E5E0D8]">
          <h2 className="text-base font-bold text-[#173B32] flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#246B55]" />
            Security & Compliance Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5]">
              <h4 className="font-bold text-[#173B32]">Bcrypt Password Hashing</h4>
              <p className="mt-1 text-[#6B7280]">
                Salted SHA-256 / Bcrypt cryptographic digest prevents plain-text storage or offline rainbow attacks.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5]">
              <h4 className="font-bold text-[#173B32]">Stateless JWT Authentication</h4>
              <p className="mt-1 text-[#6B7280]">
                HMAC-SHA256 signed access tokens with 24-hour expiration stored safely in secure client state.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5]">
              <h4 className="font-bold text-[#173B32]">SQL Injection Immunity</h4>
              <p className="mt-1 text-[#6B7280]">
                Parameterized queries via SQLAlchemy ORM prevent SQL injection vulnerabilities across all routes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5]">
              <h4 className="font-bold text-[#173B32]">Document Privacy Isolation</h4>
              <p className="mt-1 text-[#6B7280]">
                Uploaded PDFs and images are isolated per citizen user ID with file-extension whitelisting.
              </p>
            </div>
          </div>
        </div>

        {/* Engine Configuration */}
        <div className="pt-2 border-t border-[#E5E0D8]">
          <h2 className="text-base font-bold text-[#173B32] flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-[#246B55]" />
            Deterministic Engine Configuration
          </h2>
          <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Active Rule Engine:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Deterministic Mathematical Engine (Active)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Knowledge Base Source:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#173B32] font-semibold">
                Official Gazette Excerpts & Statutory Clauses
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6B7280]">Database Engine:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F3EE] text-[#173B32] font-semibold">
                SQLAlchemy ORM (MySQL 8.0 / SQLite)
              </span>
            </div>
          </div>
        </div>

        {/* API Documentation Link */}
        <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#173B32]">Interactive API Documentation</h4>
            <p className="text-[11px] text-[#6B7280]">FastAPI OpenAPI / Swagger interface for endpoint testing</p>
          </div>
          <a
            href={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')}/docs`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#173B32] hover:bg-[#246B55] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Open Swagger Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
