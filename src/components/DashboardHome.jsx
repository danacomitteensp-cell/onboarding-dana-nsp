import { useAuth } from '../hooks/useAuth';
import { Users, ShieldCheck, Activity, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DashboardHome() {
  const { memberProfile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    adminCount: 0,
    menCount: 0,
    womenCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { data: members, error } = await supabase
        .from('members')
        .select('id, is_active, role, admin_level, gender');

      if (error) throw error;

      setStats({
        totalMembers: members.length,
        activeMembers: members.filter((m) => m.is_active).length,
        adminCount: members.filter(
          (m) => m.role === 'admin' || (m.admin_level && m.admin_level > 0)
        ).length,
        menCount: members.filter((m) => m.gender === 'MEN').length,
        womenCount: members.filter((m) => m.gender === 'WOMEN').length,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'stat-primary',
    },
    {
      label: 'Active Members',
      value: stats.activeMembers,
      icon: Activity,
      color: 'stat-success',
    },
    {
      label: 'Admins',
      value: stats.adminCount,
      icon: ShieldCheck,
      color: 'stat-accent',
    },
  ];

  return (
    <div className="dashboard-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of Dana Committee members
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/dashboard/create-member')}
        >
          <UserPlus size={18} />
          <span>Create Member</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className={`stat-card ${card.color}`}>
            <div className="stat-card-icon">
              <card.icon size={24} />
            </div>
            <div className="stat-card-info">
              <p className="stat-card-value">
                {loading ? '—' : card.value}
              </p>
              <p className="stat-card-label">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gender Breakdown */}
      <div className="breakdown-card">
        <h3 className="breakdown-title">Gender Breakdown</h3>
        <div className="breakdown-bars">
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>Men</span>
              <span>{loading ? '—' : stats.menCount}</span>
            </div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill breakdown-bar-men"
                style={{
                  width: loading
                    ? '0%'
                    : `${
                        stats.totalMembers
                          ? (stats.menCount / stats.totalMembers) * 100
                          : 0
                      }%`,
                }}
              />
            </div>
          </div>
          <div className="breakdown-item">
            <div className="breakdown-label">
              <span>Women</span>
              <span>{loading ? '—' : stats.womenCount}</span>
            </div>
            <div className="breakdown-bar-bg">
              <div
                className="breakdown-bar-fill breakdown-bar-women"
                style={{
                  width: loading
                    ? '0%'
                    : `${
                        stats.totalMembers
                          ? (stats.womenCount / stats.totalMembers) * 100
                          : 0
                      }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="info-card">
        <h3 className="info-card-title">Your Profile</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">
              {memberProfile?.full_name || '—'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">
              {memberProfile?.email || '—'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Role</span>
            <span className="info-value role-badge">
              {memberProfile?.role || '—'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Admin Level</span>
            <span className="info-value">
              {memberProfile?.admin_level ?? '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
