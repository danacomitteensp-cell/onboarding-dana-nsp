import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  Hash,
  Shield,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  full_name: '',
  email: '',
  password: '',
  phone: '',
  ITS: '',
  gender: 'MEN',
  role: 'member',
  admin_level: 0,
};

export default function CreateMemberForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  function validate() {
    const newErrors = {};

    if (!form.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!form.ITS) {
      newErrors.ITS = 'ITS number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const isFormValid =
    form.full_name.trim() &&
    form.email.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.password.trim() &&
    form.password.length >= 6 &&
    form.phone &&
    form.ITS;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-member', {
        body: {
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: parseInt(form.phone, 10),
          ITS: parseFloat(form.ITS),
          gender: form.gender,
          role: form.role,
          admin_level: parseInt(form.admin_level, 10) || 0,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Member "${form.full_name}" created successfully!`);
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      toast.error(err.message || 'Failed to create member');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-member-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Member</h1>
          <p className="page-subtitle">
            Add a new member to the Dana Committee
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="member-form" noValidate>
          {/* Row: Full Name + Email */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">
                <User size={15} />
                Full Name <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Enter full name"
                  value={form.full_name}
                  onChange={handleChange}
                  className={errors.full_name ? 'input-error' : ''}
                />
              </div>
              {errors.full_name && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.full_name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={15} />
                Email <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="member@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                />
              </div>
              {errors.email && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Row: Password + Phone */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={15} />
                Password <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={15} />
                Phone <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="phone"
                  name="phone"
                  type="number"
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                />
              </div>
              {errors.phone && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Row: ITS + Gender */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ITS">
                <Hash size={15} />
                ITS Number <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="ITS"
                  name="ITS"
                  type="number"
                  placeholder="e.g. 12345678"
                  value={form.ITS}
                  onChange={handleChange}
                  className={errors.ITS ? 'input-error' : ''}
                />
              </div>
              {errors.ITS && (
                <span className="field-error">
                  <AlertCircle size={13} />
                  {errors.ITS}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender">
                <Users size={15} />
                Gender
              </label>
              <div className="input-wrapper">
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row: Role + Admin Level */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">
                <Shield size={15} />
                Role
              </label>
              <div className="input-wrapper">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin_level">
                <Shield size={15} />
                Admin Level
              </label>
              <div className="input-wrapper">
                <input
                  id="admin_level"
                  name="admin_level"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="0"
                  value={form.admin_level}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary submit-btn"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Creating…
                </span>
              ) : (
                <span className="btn-content">
                  <UserPlus size={18} />
                  Create Member
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
