import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  LayoutDashboard,
  UserPlus,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayout() {
  const { memberProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to sign out');
    }
  }

  const navItems = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      end: true,
    },
    {
      to: '/dashboard/create-member',
      icon: UserPlus,
      label: 'Create Member',
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <img 
                src="/src/assets/Dana-App-Logo.png" 
                alt="Dana Logo" 
                className="logo-img"
                width={22}
                height={22}
              />
            </div>
            <div>
              <h2 className="sidebar-title">Dana Admin</h2>
              <p className="sidebar-subtitle">Committee Panel</p>
            </div>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              <ChevronRight size={16} className="sidebar-link-arrow" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="sidebar-avatar">
              {memberProfile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="sidebar-profile-info">
              <p className="sidebar-profile-name">
                {memberProfile?.full_name || 'Admin'}
              </p>
              <p className="sidebar-profile-role">
                {memberProfile?.role || 'admin'}
              </p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleSignOut}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-area">
        {/* Top bar */}
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="topbar-right">
            <span className="topbar-greeting">
              Welcome, <strong>{memberProfile?.full_name || 'Admin'}</strong>
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
