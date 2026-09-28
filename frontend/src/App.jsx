import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// 12 Core Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SchemeDiscoveryPage from './pages/SchemeDiscoveryPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage';
import DocumentUploadPage from './pages/DocumentUploadPage';
import EligibilityResultsPage from './pages/EligibilityResultsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes Wrapped in Standard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute>
                <Layout>
                  <SchemeDiscoveryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes/:schemeId"
            element={
              <ProtectedRoute>
                <Layout>
                  <SchemeDetailsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/eligibility"
            element={
              <ProtectedRoute>
                <Layout>
                  <EligibilityCheckerPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Layout>
                  <DocumentUploadPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Layout>
                  <EligibilityResultsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Layout>
                  <ApplicationsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
