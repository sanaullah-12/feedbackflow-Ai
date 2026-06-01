import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import { useTheme } from './hooks/useTheme';
import AppLayout from './components/dashboard/AppLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import FeedbackPage from './pages/FeedbackPage';
import TasksPage from './pages/TasksPage';
import SprintPlannerPage from './pages/SprintPlannerPage';
import SettingsPage from './pages/SettingsPage';
import LoadingScreen from './components/ui/LoadingScreen';

/** 
 * ✅ PrivateRoute - Protects routes that require authentication
 * Only renders children if user is authenticated
 * Shows LoadingScreen while initializing
 */
function PrivateRoute({ children }) {
  const { user, initialized, loading } = useAuthStore();
  
  if (!initialized || loading) {
    return <LoadingScreen />;
  }
  
  // If user exists, render the protected route
  if (user) {
    return children;
  }
  
  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
}

/** 
 * ✅ PublicRoute - Routes accessible only when NOT authenticated
 * Shows login/signup pages, but redirects authenticated users to dashboard
 * Shows LoadingScreen while initializing
 */
function PublicRoute({ children }) {
  const { user, initialized, loading } = useAuthStore();
  
  if (!initialized || loading) {
    return <LoadingScreen />;
  }
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Show login/signup page
  return children;
}

export default function App() {
  const { initialize, loading } = useAuthStore();
  useTheme();

  // Initialize auth on app mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Sora, sans-serif',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Public Routes - Only accessible when NOT authenticated */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        
        {/* Protected Routes - Only accessible when authenticated */}
        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="kanban" element={<TasksPage />} />
          <Route path="sprint-planner" element={<SprintPlannerPage />} />
          <Route path="team" element={<Navigate to="/dashboard" replace />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Catch-all - Redirect unknown routes to dashboard (or login if not authenticated) */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
