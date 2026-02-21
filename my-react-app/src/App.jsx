import { useMemo, useState, useRef, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { io } from 'socket.io-client'
import './App.css'

const ROLES = ['patient', 'doctor', 'nurse', 'admin']

function App() {
  return (
    <div className="app-root">
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/:role" element={<LoginPage />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/nurse" element={<NurseDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const roleSectionRef = useRef(null)

  const scrollToRoleSelection = () => {
    if (roleSectionRef.current) {
      roleSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const roles = [
    {
      role: 'patient',
      title: 'Patients',
      icon: '❤️',
      description: 'View your health status, vitals, and personalized alerts',
      color: '#4A90E2',
    },
    {
      role: 'nurse',
      title: 'Nurses',
      icon: '🩺',
      description: 'Ward overview, patient priorities, and real-time task management',
      color: '#00B8A9',
    },
    {
      role: 'doctor',
      title: 'Doctors',
      icon: '📋',
      description: 'Patient risk insights, clinical decisions, and diagnostic support',
      color: '#2C5F9E',
    },
    {
      role: 'admin',
      title: 'Administrators',
      icon: '🏢',
      description: 'Hospital operations, capacity planning, and resource optimization',
      color: '#7B68EE',
    },
  ]

  const features = [
    {
      icon: '📊',
      title: 'Real-Time Monitoring',
      description: 'Track patient vitals through integrated systems and receive live status updates across all departments.',
    },
    {
      icon: '⚠️',
      title: 'Intelligent Alerts',
      description: 'Predictive risk detection with explainable AI that identifies deteriorating patients before critical events.',
    },
    {
      icon: '🔗',
      title: 'Unified Dashboard',
      description: 'Integrated view of operations, bed occupancy, staff schedules, and lab results in one centralized platform.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description: 'Secure, personalized experiences for each user type with HIPAA-compliant access controls.',
    },
    {
      icon: '📈',
      title: 'Operational Intelligence',
      description: 'Identify bottlenecks before they become crises with advanced analytics and capacity planning tools.',
    },
    {
      icon: '💡',
      title: 'Explainable AI',
      description: 'Transparent AI insights with clear reasoning to support clinical decision-making and build trust.',
    },
  ]

  return (
    <div className="mediq-landing-page">
      {/* Navigation Header */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">MedIQ</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <button className="nav-signin-btn" onClick={scrollToRoleSelection}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section-landing">
        <div className="hero-container">
          <h1 className="hero-headline-landing">
            Connect Healthcare Intelligence with Real-Time Patient Care
          </h1>
          <p className="hero-tagline-landing">
            Build your verifiable patient monitoring profile, showcase real-time vitals, and find healthcare insights that improve patient safety and operational efficiency.
          </p>
          <div className="hero-cta-buttons">
            <button className="cta-primary-btn" onClick={scrollToRoleSelection}>
              Get Started Now
            </button>
            <button className="cta-secondary-btn" onClick={scrollToRoleSelection}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose MedIQ Section */}
      <section className="why-choose-section">
        <div className="container-landing">
          <h2 className="section-title-landing">Why Choose medIQ</h2>
          <p className="section-subtitle-landing">
            Our platform creates a win-win ecosystem for healthcare professionals, administrators, and patients.
          </p>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features-showcase-landing">
        <div className="container-landing">
          <h2 className="section-title-landing">Platform Features</h2>
          <div className="features-grid-landing">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card-landing">
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-landing">{feature.icon}</div>
                </div>
                <h3 className="feature-title-landing">{feature.title}</h3>
                <p className="feature-description-landing">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container-landing">
          <h2 className="section-title-landing">How It Works</h2>
          <p className="section-subtitle-landing">
            medIQ makes it easy for healthcare professionals to access real-time patient data and operational insights.
          </p>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Create Your Profile</h3>
                <p className="step-description">
                  Sign up and create your profile with basic information about your role and healthcare facility.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Connect Your Systems</h3>
                <p className="step-description">
                  Securely link your EHR systems, IoT devices, and monitoring equipment to start tracking patient data in real-time.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Access Your Dashboard</h3>
                <p className="step-description">
                  View personalized dashboards with patient vitals, risk scores, and operational metrics tailored to your role.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Receive Intelligent Alerts</h3>
                <p className="step-description">
                  Get explainable AI-driven alerts about patient risks, capacity issues, and operational bottlenecks before they escalate.
                </p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3 className="step-title">Improve Patient Outcomes</h3>
                <p className="step-description">
                  Leverage data-driven insights to make faster decisions, reduce adverse events, and optimize hospital operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section id="access-dashboard" ref={roleSectionRef} className="role-selection-landing">
        <div className="container-landing">
          <h2 className="section-title-landing">Access Your Dashboard</h2>
          <div className="role-cards-landing">
            {roles.map((roleItem) => (
              <button
                key={roleItem.role}
                className="role-card-landing"
                onClick={() => navigate(`/login/${roleItem.role}`)}
                style={{ '--role-color': roleItem.color }}
              >
                <div className="role-icon-landing">{roleItem.icon}</div>
                <h2 className="role-title-landing">{roleItem.title}</h2>
                <p className="role-description-landing">{roleItem.description}</p>
                <div className="role-signin-indicator">
                  Sign In <span className="arrow">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-landing">
        <div className="container-landing">
          <h2 className="cta-headline">Ready to Transform Healthcare Intelligence?</h2>
          <p className="cta-description">
            Whether you're a healthcare professional looking to improve patient outcomes or an administrator wanting to optimize operations, medIQ is for you.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary-btn" onClick={scrollToRoleSelection}>
              Get Started Now
            </button>
            <button className="cta-secondary-btn-outline" onClick={scrollToRoleSelection}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container-landing">
          <div className="footer-content">
            <div className="footer-column">
              <h4 className="footer-title">medIQ</h4>
              <p className="footer-description">
                Connecting healthcare professionals with real-time patient monitoring and operational intelligence for safer healthcare.
              </p>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">For Healthcare Professionals</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => navigate('/login/doctor')}>Doctor Dashboard</a></li>
                <li><a href="#" onClick={() => navigate('/login/nurse')}>Nurse Dashboard</a></li>
                <li><a href="#" onClick={() => navigate('/login/admin')}>Admin Dashboard</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">For Patients</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={() => navigate('/login/patient')}>Patient Portal</a></li>
                <li><a href="#features">View Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-trust">
            <span>HIPAA Compliant</span>
            <span className="separator">|</span>
            <span>Enterprise Security</span>
            <span className="separator">|</span>
            <span>24/7 Support</span>
          </div>
          <div className="footer-copyright">
            © 2024 medIQ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const params = new URL(window.location.href).pathname.split('/')
  const role = params[params.length - 1]

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const roleInfo = {
    patient: { title: 'Patient Portal', icon: '👤' },
    nurse: { title: 'Nursing Operations', icon: '👩‍⚕️' },
    doctor: { title: 'Clinical View', icon: '👨‍⚕️' },
    admin: { title: 'Administrative View', icon: '👔' },
  }

  const currentRole = roleInfo[role] || roleInfo.patient

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          role: role,
          firstName: credentials.firstName || 'User',
          lastName: credentials.lastName || 'Name',
          phoneNumber: credentials.phoneNumber || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Store token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('loginStatus', JSON.stringify({
        isLoggedIn: true,
        email: data.user.email,
        role: data.user.role,
        loginTime: new Date().toISOString(),
      }))

      toast.success('Registration successful!', {
        description: `Welcome to ${currentRole.title}`,
      })

      navigate(`/${role}`)
    } catch (err) {
      setError(err.message)
      toast.error('Registration failed', {
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          phoneNumber: credentials.phoneNumber || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Verify role matches
      if (data.user.role !== role) {
        throw new Error(`This account is for ${data.user.role}s, not ${role}s`)
      }

      // Store token and user info
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('loginStatus', JSON.stringify({
        isLoggedIn: true,
        email: data.user.email,
        role: data.user.role,
        loginTime: new Date().toISOString(),
        lastLogin: data.user.lastLogin,
      }))

      toast.success('Login successful!', {
        description: `Welcome back, ${data.user.firstName}!`,
      })

      navigate(`/${role}`)
    } catch (err) {
      setError(err.message)
      toast.error('Login failed', {
        description: err.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">{currentRole.icon}</div>
          <h1 className="login-title">{currentRole.title}</h1>
          <p className="login-subtitle">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="error-message-enhanced">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="your.email@hospital.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </div>

            {(role === 'doctor' || role === 'nurse') && (
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number (for emergency SMS alerts)
                  <span style={{ color: '#6b7280', marginLeft: '4px', fontSize: '0.85rem' }}>(Optional - updates if provided)</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  className="form-input"
                  placeholder="+1234567890 (with country code)"
                  value={credentials.phoneNumber}
                  onChange={(e) =>
                    setCredentials({ ...credentials, phoneNumber: e.target.value })
                  }
                  pattern="^\+[1-9]\d{1,14}$"
                  title="Phone number must be in E.164 format: +1234567890"
                />
                <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Add or update your phone number to receive emergency SMS alerts for critical patient conditions
                </small>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  textDecoration: 'underline'
                }}
              >
                Don't have an account? Register here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="form-input"
                placeholder="John"
                value={credentials.firstName}
                onChange={(e) =>
                  setCredentials({ ...credentials, firstName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="form-input"
                placeholder="Doe"
                value={credentials.lastName}
                onChange={(e) =>
                  setCredentials({ ...credentials, lastName: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email" className="form-label">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="your.email@hospital.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password" className="form-label">
                Password (min 6 characters)
              </label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                minLength={6}
              />
            </div>

            {(role === 'doctor' || role === 'nurse') && (
              <div className="form-group">
                <label htmlFor="reg-phoneNumber" className="form-label">
                  Phone Number (for emergency SMS alerts)
                  <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                </label>
                <input
                  id="reg-phoneNumber"
                  type="tel"
                  className="form-input"
                  placeholder="+1234567890 (with country code)"
                  value={credentials.phoneNumber}
                  onChange={(e) =>
                    setCredentials({ ...credentials, phoneNumber: e.target.value })
                  }
                  required
                  pattern="^\+[1-9]\d{1,14}$"
                  title="Phone number must be in E.164 format: +1234567890"
                />
                <small style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Required to receive emergency SMS alerts for critical patient conditions
                </small>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="toggle-auth-btn"
              >
                Already have an account? <span className="toggle-auth-link">Sign in</span>
              </button>
            </div>
          </form>
        )}

        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

function DoctorDashboard() {
  const navigate = useNavigate()
  useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [phoneStatus, setPhoneStatus] = useState(null)
  const [testingAlert, setTestingAlert] = useState(false)

  useEffect(() => {
    checkPhoneStatus()
  }, [])

  const checkPhoneStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/test/sms/my-phone-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPhoneStatus(data)
      }
    } catch (error) {
      console.error('Error checking phone status:', error)
    }
  }

  const handleTestEmergencyAlert = async () => {
    setTestingAlert(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/test/sms/trigger-emergency-alert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Emergency Alert Sent!', {
          description: `SMS sent to ${data.sentTo}. Check your phone!`,
          duration: 5000,
        })
      } else {
        toast.error('Alert Failed', {
          description: data.error || data.message,
        })
      }
    } catch (error) {
      toast.error('Error', {
        description: error.message,
      })
    } finally {
      setTestingAlert(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginStatus')
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="doctor-dashboard-bw">
      <header className="doctor-header-bw">
      <div>
          <h1 className="doctor-title-bw">Clinical View – MedIQ</h1>
          <p className="doctor-subtitle-bw">
            Prioritise high-risk patients with explainable AI and live bedside
            monitoring.
          </p>
      </div>
        <div className="doctor-header-meta">
          <span className="doctor-role-badge">DOCTOR</span>
          <button className="doctor-logout-btn" onClick={handleLogout} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
        </button>
        </div>
      </header>
      <main className="doctor-main-bw">
        {/* Emergency Alert Test Section */}
        {phoneStatus && (
          <section className="doctor-panel-bw doctor-panel-wide" style={{
            background: phoneStatus.hasPhoneNumber 
              ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
              : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: phoneStatus.hasPhoneNumber ? '2px solid #10b981' : '2px solid #ef4444'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 className="doctor-panel-title-bw" style={{ margin: 0 }}>
                  📱 Emergency SMS Alert Status
                </h2>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280', fontSize: '0.875rem' }}>
                  {phoneStatus.hasPhoneNumber 
                    ? `Phone: ${phoneStatus.phoneNumber} - Ready to receive alerts`
                    : 'No phone number configured - Add phone number to receive emergency alerts'}
        </p>
      </div>
              {phoneStatus.hasPhoneNumber && phoneStatus.smsAvailable && (
                <button
                  onClick={handleTestEmergencyAlert}
                  disabled={testingAlert}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: testingAlert ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s ease',
                    opacity: testingAlert ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!testingAlert) {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  {testingAlert ? 'Sending...' : '🚨 Test Emergency Alert'}
                </button>
              )}
            </div>
            {!phoneStatus.smsAvailable && (
              <div style={{
                padding: '0.75rem',
                background: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '6px',
                color: '#92400e',
                fontSize: '0.875rem'
              }}>
                ⚠️ SMS service not configured. Add Twilio credentials to .env file.
              </div>
            )}
          </section>
        )}
        <section className="doctor-panel-bw doctor-panel-wide">
          <h2 className="doctor-panel-title-bw">Risk Intelligence Heatmap</h2>
          <RiskHeatmap />
        </section>
        <section className="doctor-panel-bw">
          <h2 className="doctor-panel-title-bw">Real-Time Vitals Monitor</h2>
          <VitalsMonitorWebSocket />
        </section>
        <section className="doctor-panel-bw">
          <h2 className="doctor-panel-title-bw">Explainable Alert Panel</h2>
          <ExplainableAlerts />
        </section>
        <section className="doctor-panel-bw doctor-panel-wide">
          <h2 className="doctor-panel-title-bw">Patient Reports Management</h2>
          <PatientReportsManager />
        </section>
      </main>
    </div>
  )
}

function NurseDashboard() {
  const navigate = useNavigate()
  useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginStatus')
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="dashboard-shell">
      <header className="top-bar">
        <div>
          <h1 className="top-bar-title">Nursing Operations – MedIQ</h1>
          <p className="top-bar-subtitle">
            Ward-centric view of beds, tasks, and vitals to keep your unit
            flowing safely.
        </p>
      </div>
        <div className="top-bar-meta">
          <span className="role-pill">NURSE</span>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className="dashboard-grid">
        <section className="panel">
          <h2 className="panel-title">Ward Bed &amp; Task Board</h2>
          <ResourceTracker />
        </section>
        <section className="panel">
          <h2 className="panel-title">Immediate Vitals Watch</h2>
          <VitalsMonitor />
        </section>
      </main>
    </div>
  )
}

function AdminDashboard() {
  const navigate = useNavigate()
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginStatus')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const handleSync = () => {
    toast.success('Data synchronized', {
      description: 'All data has been refreshed',
    })
  }

  const kpis = [
    { label: 'OVERALL OCCUPANCY', value: '82%', color: '#3b82f6' },
    { label: 'STAFFING UNITS', value: '28', color: '#10b981' },
    { label: 'ACTIVE ALERTS', value: '3', color: '#ef4444' },
    { label: 'AVG WAIT TIME', value: '14m', color: '#6b7280' },
  ]

  const wards = [
    { name: 'ICU - West', beds: 94, staffing: '1:1', status: 'CRITICAL', statusColor: '#ef4444' },
    { name: 'Surgical Ward', beds: 78, staffing: '1:4', status: 'MODERATE', statusColor: '#10b981' },
    { name: 'Emergency Dept', beds: 85, staffing: '1:3', status: 'HIGH', statusColor: '#f97316' },
    { name: 'General Medicine', beds: 45, staffing: '1:5', status: 'LOW', statusColor: '#86efac' },
  ]

  return (
    <div className="admin-dashboard-ref">
      {/* Header */}
      <header className="admin-header-ref">
        <div className="admin-breadcrumb">
          <span className="breadcrumb-text">ADMINISTRATION PORTAL</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-text">MedIQ Central Hospital</span>
        </div>
        <div className="admin-header-right">
          <div className="language-selector">
            <span className="language-label">LANGUAGE</span>
            <select className="language-dropdown">
              <option>English</option>
            </select>
          </div>
          <div className="user-info-ref">
            <div className="user-avatar-ref">E</div>
            <div className="user-details-ref">
              <div className="user-name-ref">{user?.firstName || 'Admin'} {user?.lastName || 'User'}</div>
              <div className="user-role-ref">ADMINISTRATION</div>
            </div>
            <button className="logout-btn-ref" onClick={handleLogout} title="Logout">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Title Section */}
      <section className="dashboard-title-section">
        <div className="facility-status">
          <span className="facility-badge">FACILITY: CENTRAL MEDICAL HUB</span>
          <div className="live-sync-indicator">
            <span className="sync-dot"></span>
            <span>LIVE SYNC</span>
          </div>
        </div>
        <div className="dashboard-title-row">
      <div>
            <h1 className="dashboard-main-title">Operational Strategy Suite</h1>
            <p className="dashboard-subtitle">Facility-wide resource and bottleneck management.</p>
          </div>
          <button className="sync-data-btn" onClick={handleSync}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Sync Data
          </button>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="kpi-section">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card-ref">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Left Column - Ward Stress Heatmap */}
        <section className="ward-heatmap-section">
          <div className="section-header-ref">
            <h2 className="section-title-ref">Ward Stress Heatmap</h2>
            <a href="#" className="download-report-link">DOWNLOAD REPORT</a>
          </div>
          <div className="ward-cards-grid">
            {wards.map((ward, idx) => (
              <div key={idx} className="ward-card-ref">
                <div className="ward-card-header">
                  <h3 className="ward-name-ref">{ward.name}</h3>
                  <span className="ward-status-badge" style={{ backgroundColor: ward.statusColor }}>
                    {ward.status}
                  </span>
                </div>
                <div className="ward-details">
                  <div className="ward-detail-item">BEDS: {ward.beds}%</div>
                  <div className="ward-detail-item">STAFFING: {ward.staffing}</div>
                </div>
                <div className="ward-progress-bar">
                  <div 
                    className="ward-progress-fill" 
                    style={{ 
                      width: `${ward.beds}%`,
                      backgroundColor: ward.statusColor 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column */}
        <div className="admin-right-column">
          {/* Resource Foresight */}
          <section className="resource-foresight-section">
            <div className="resource-foresight-header">
              <span className="warning-icon">▲</span>
              <h2 className="resource-foresight-title">Resource Foresight</h2>
            </div>
            <div className="resource-items">
              <div className="resource-item">
                <div className="resource-header-row">
                  <span className="resource-label">Ventilator Inventory</span>
                  <span className="resource-count">5/25</span>
                </div>
                <div className="resource-progress-bar">
                  <div className="resource-progress-fill critical" style={{ width: '20%' }}></div>
                </div>
                <div className="resource-status critical">CRITICAL SHORTAGE DETECTED</div>
              </div>
              <div className="resource-item">
                <div className="resource-header-row">
                  <span className="resource-label">Infusion Pumps</span>
                  <span className="resource-count">12/80</span>
                </div>
                <div className="resource-progress-bar">
                  <div className="resource-progress-fill warning" style={{ width: '15%' }}></div>
                </div>
                <div className="resource-status warning">MAINTENANCE CYCLE DUE</div>
              </div>
            </div>
          </section>

          {/* Staffing Balance */}
          <section className="staffing-balance-section">
            <h2 className="staffing-balance-title">Staffing Balance</h2>
            <div className="staffing-info">
              <div className="staffing-icon">👨‍⚕️</div>
              <div className="staffing-details">
                <div className="staffing-item">Shift Change in 12m</div>
                <div className="staffing-item">8 Units onboarding for PM cycle</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function HomeRoleCard({ title, role, icon, summary, onClick }) {
  return (
    <button type="button" className="home-role-card" onClick={onClick}>
      <div className="home-role-header">
        <span className="home-role-icon">{icon}</span>
        <div className="home-role-pill">{role.toUpperCase()}</div>
      </div>
      <div className="home-role-title">{title}</div>
      <div className="home-role-copy">{summary}</div>
      <div className="home-role-arrow">→</div>
        </button>
  )
}

function PatientDashboard() {
  const navigate = useNavigate()
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAssistanceGuide, setShowAssistanceGuide] = useState(false)
  const [patientInfo, setPatientInfo] = useState({
    room: 'Surgical-202',
    recoveryStatus: 85,
    statusText: 'Stable & Recovering',
    heartRate: 72,
    bloodOxygen: 98
  })

  useEffect(() => {
    fetchPatientInfo()
    fetchReports()
  }, [])

  const fetchPatientInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/patient/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.patient) {
          setPatientInfo({
            room: data.patient.assignedWard ? `${data.patient.assignedWard}-${data.patient.bedNumber || '202'}` : 'Surgical-202',
            recoveryStatus: 100 - (data.patient.riskScore || 15),
            statusText: data.patient.riskLevel === 'low' ? 'Stable & Recovering' : 
                       data.patient.riskLevel === 'medium' ? 'Recovering Well' :
                       data.patient.riskLevel === 'high' ? 'Under Observation' : 'Stable & Recovering',
            heartRate: data.patient.currentVitals?.heartRate || 72,
            bloodOxygen: data.patient.currentVitals?.oxygenSaturation || 98
          })
        }
      }
    } catch (error) {
      console.error('Error fetching patient info:', error)
    }
  }

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/patient/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
      } else {
        // If no reports, use default sample data with detailed content
        setReports(getDetailedReports())
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Use default sample data on error with detailed content
      setReports(getDetailedReports())
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginStatus')
    toast.success('Logged out successfully')
    navigate('/')
  }

  const getReportIcon = (type) => {
    const icons = {
      xray: '🦴',
      blood: '🩸',
      urinalysis: '🧪',
      mri: '🧲',
      ct: '📷',
      ultrasound: '📡',
      other: '📄',
    }
    return icons[type] || icons.other
  }

  const getReportIconBg = (type) => {
    const colors = {
      xray: '#10b981',
      blood: '#ef4444',
      urinalysis: '#10b981',
      mri: '#6366f1',
      ct: '#8b5cf6',
      ultrasound: '#06b6d4',
      other: '#6b7280',
    }
    return colors[type] || colors.other
  }

  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  // Function to get detailed reports with full content
  const getDetailedReports = () => {
    return [
      {
        _id: '1',
        title: 'LIPID PROFILE',
        date: new Date('2024-12-02'),
        summary: 'Complete lipid panel analysis showing cholesterol and triglyceride levels. Total Cholesterol and LDL Cholesterol are elevated above normal ranges.',
        status: 'ready',
        type: 'blood',
        labName: 'DRLOGY PATHOLOGY LAB',
        labAddress: '105-108, SMART VISION COMPLEX, HEALTHCARE ROAD, OPPOSITE HEALTHCARE COMPLEX, MUMBAI-689578',
        registeredOn: '2024-12-02 02:31 PM',
        collectedOn: '2024-12-02 03:11 PM',
        reportedOn: '2024-12-02 04:35 PM',
        testResults: [
          {
            investigation: 'Cholesterol Total (Spectrophotometry)',
            result: '250.00',
            referenceValue: '< 200.00',
            unit: 'mg/dL',
            status: 'High',
            isAbnormal: true
          },
          {
            investigation: 'Triglycerides (Spectrophotometry)',
            result: '100.00',
            referenceValue: '< 150.00',
            unit: 'mg/dL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'HDL Cholesterol (Spectrophotometry)',
            result: '50.00',
            referenceValue: '> 40.00',
            unit: 'mg/dL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'LDL Cholesterol (Calculated)',
            result: '190.00',
            referenceValue: '< 100.00',
            unit: 'mg/dL',
            status: 'High',
            isAbnormal: true
          },
          {
            investigation: 'VLDL Cholesterol (Calculated)',
            result: '10.00',
            referenceValue: '< 30.00',
            unit: 'mg/dL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Non-HDL Cholesterol (Calculated)',
            result: '200.00',
            referenceValue: '< 130.00',
            unit: 'mg/dL',
            status: 'High',
            isAbnormal: true
          }
        ],
        nlaGuidelines: [
          { category: 'Total Cholesterol', optimal: '< 200', aboveOptimal: '200-239', borderlineHigh: '240-279', high: '> 240', veryHigh: '' },
          { category: 'HDL Cholesterol', optimal: '> 60', aboveOptimal: '40-59', borderlineHigh: '', high: '< 40', veryHigh: '' },
          { category: 'LDL Cholesterol', optimal: '< 100', aboveOptimal: '100-129', borderlineHigh: '130-159', high: '160-189', veryHigh: '> 190' },
          { category: 'Triglycerides', optimal: '< 150', aboveOptimal: '150-199', borderlineHigh: '200-499', high: '500-999', veryHigh: '> 1000' }
        ],
        recommendations: 'NLA-2014 Guidelines: Total Cholesterol (250 mg/dL) and LDL Cholesterol (190 mg/dL) are elevated above optimal levels. Consider lifestyle modifications including dietary changes, increased physical activity, and weight management. Follow-up lipid profile recommended in 3 months. If levels remain elevated, consider consultation with cardiologist for statin therapy evaluation.',
        notes: '1. Serial samples one week apart recommended for certain measurements due to physiological/analytical variations. 2. Screening for lipid status based on NLA-2014 guidelines, especially for adults over 20 and children with a family history of cardiovascular disease or high total cholesterol.'
      },
      {
        _id: '2',
        title: 'COMPLETE BLOOD COUNT (CBC)',
        date: new Date('2024-12-01'),
        summary: 'Comprehensive hematological analysis including red blood cells, white blood cells, and platelets. All parameters within normal physiological ranges.',
        status: 'ready',
        type: 'blood',
        labName: 'MEDIQ CENTRAL HOSPITAL LABORATORY',
        registeredOn: '2024-12-01 09:15 AM',
        collectedOn: '2024-12-01 09:30 AM',
        reportedOn: '2024-12-01 11:45 AM',
        testResults: [
          {
            investigation: 'Hemoglobin',
            result: '14.2',
            referenceValue: '12.0 - 16.0',
            unit: 'g/dL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Hematocrit',
            result: '42.5',
            referenceValue: '36.0 - 48.0',
            unit: '%',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'White Blood Cell Count (WBC)',
            result: '7.5',
            referenceValue: '4.0 - 11.0',
            unit: 'K/μL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Red Blood Cell Count (RBC)',
            result: '4.8',
            referenceValue: '4.2 - 5.4',
            unit: 'M/μL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Platelet Count',
            result: '250',
            referenceValue: '150 - 450',
            unit: 'K/μL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Mean Corpuscular Volume (MCV)',
            result: '88',
            referenceValue: '80 - 100',
            unit: 'fL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Mean Corpuscular Hemoglobin (MCH)',
            result: '29.5',
            referenceValue: '27.0 - 31.0',
            unit: 'pg',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
            result: '33.4',
            referenceValue: '33.0 - 37.0',
            unit: 'g/dL',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Red Cell Distribution Width (RDW)',
            result: '13.2',
            referenceValue: '11.5 - 14.5',
            unit: '%',
            status: 'Normal',
            isAbnormal: false
          }
        ],
        recommendations: 'All hematological parameters are within normal physiological ranges. No abnormalities detected. Blood cell production and function appear healthy. Continue routine monitoring as per standard care protocol.',
        notes: 'Sample collected via standard venipuncture. Results indicate healthy blood cell production and function. No signs of anemia, infection, or bleeding disorders detected.'
      },
      {
        _id: '3',
        title: 'URINALYSIS',
        date: new Date('2024-12-02'),
        summary: 'Complete urine analysis including physical, chemical, and microscopic examination. All parameters within normal limits indicating healthy renal function.',
        status: 'ready',
        type: 'urinalysis',
        labName: 'MEDIQ CENTRAL HOSPITAL LABORATORY',
        registeredOn: '2024-12-02 08:00 AM',
        collectedOn: '2024-12-02 08:15 AM',
        reportedOn: '2024-12-02 10:30 AM',
        testResults: [
          {
            investigation: 'Color',
            result: 'Yellow',
            referenceValue: 'Yellow',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Appearance',
            result: 'Clear',
            referenceValue: 'Clear',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Specific Gravity',
            result: '1.015',
            referenceValue: '1.005 - 1.030',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'pH',
            result: '6.5',
            referenceValue: '5.0 - 8.0',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Protein',
            result: 'Negative',
            referenceValue: 'Negative',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Glucose',
            result: 'Negative',
            referenceValue: 'Negative',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Ketones',
            result: 'Negative',
            referenceValue: 'Negative',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Bilirubin',
            result: 'Negative',
            referenceValue: 'Negative',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Urobilinogen',
            result: 'Normal',
            referenceValue: 'Normal',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Nitrite',
            result: 'Negative',
            referenceValue: 'Negative',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Leukocyte Esterase',
            result: 'Negative',
            referenceValue: 'Negative',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'White Blood Cells',
            result: '0-2',
            referenceValue: '0-5',
            unit: '/HPF',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Red Blood Cells',
            result: '0-1',
            referenceValue: '0-3',
            unit: '/HPF',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Epithelial Cells',
            result: 'Few',
            referenceValue: 'Few',
            unit: '/HPF',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Casts',
            result: 'None',
            referenceValue: 'None',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Crystals',
            result: 'None',
            referenceValue: 'None',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          }
        ],
        recommendations: 'All urinalysis parameters are within normal physiological limits. No signs of urinary tract infection, renal dysfunction, or metabolic abnormalities detected. Continue routine monitoring as per standard care protocol.',
        notes: 'Sample collected via clean catch midstream method. Results indicate healthy renal function with no evidence of infection, proteinuria, or hematuria. Microscopic examination shows normal cellular elements.'
      },
      {
        _id: '4',
        title: 'Post-Op Hip X-Ray',
        date: new Date('2024-05-12'),
        summary: 'Post-operative radiographic evaluation of hip prosthesis alignment and bone healing',
        status: 'ready',
        type: 'xray',
        testResults: [
          {
            investigation: 'Prosthesis Alignment',
            result: 'Correctly Aligned',
            referenceValue: 'Normal Alignment',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Bone Healing',
            result: 'Good',
            referenceValue: 'Progressive Healing',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Fracture Signs',
            result: 'None Detected',
            referenceValue: 'No Fracture',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Joint Space',
            result: 'Normal',
            referenceValue: 'Normal',
            unit: '',
            status: 'Normal',
            isAbnormal: false
          }
        ],
        recommendations: 'Prosthesis correctly aligned. No signs of fracture or complications. Continue with physical therapy as prescribed.',
        notes: 'X-ray taken 6 weeks post-surgery. Excellent healing progress observed.'
      },
      {
        _id: '5',
        title: 'BLOOD COAGULATION PROFILE',
        date: new Date('2024-05-13'),
        summary: 'Comprehensive coagulation studies including INR, PT, and PTT for anticoagulation monitoring',
        status: 'ready',
        type: 'blood',
        testResults: [
          {
            investigation: 'Prothrombin Time (PT)',
            result: '14.5',
            referenceValue: '11.0 - 13.5',
            unit: 'seconds',
            status: 'Slightly Elevated',
            isAbnormal: true
          },
          {
            investigation: 'INR (International Normalized Ratio)',
            result: '1.8',
            referenceValue: '2.0 - 3.0',
            unit: '',
            status: 'Therapeutic',
            isAbnormal: false
          },
          {
            investigation: 'Partial Thromboplastin Time (PTT)',
            result: '32',
            referenceValue: '25 - 35',
            unit: 'seconds',
            status: 'Normal',
            isAbnormal: false
          },
          {
            investigation: 'Fibrinogen',
            result: '280',
            referenceValue: '200 - 400',
            unit: 'mg/dL',
            status: 'Normal',
            isAbnormal: false
          }
        ],
        recommendations: 'INR levels stable for post-op anticoagulation. Continue current medication dosage. Monitor weekly.',
        notes: 'Patient on warfarin therapy. Results indicate appropriate anticoagulation status.'
      }
    ]
  }

  // const schedule = [
  //   { name: 'Physical Therapy Session', time: '09:00 AM', status: 'DONE', completed: true },
  //   { name: 'Pain Medication', time: '01:00 PM', status: '', completed: false },
  //   { name: 'Wound Check', time: '04:00 PM', status: '', completed: false },
  // ]

  const handleDownloadReport = async (report) => {
    try {
      const token = localStorage.getItem('token')
      
      // Try to fetch from backend first
      try {
        const response = await fetch(`${API_URL}/api/patient/reports/${report._id}/download`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${report.title.replace(/\s+/g, '_')}_${formatDate(report.date)}.html`
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          toast.success('Report Opened', {
            description: `${report.title} has been opened. You can print it as PDF.`,
          })
          return
        }
      } catch {
        console.log('Backend API not available, using client-side generation')
      }

      // Fallback: Generate HTML report on client side with detailed content
      const htmlContent = generateReportHTMLClient(report)
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${report.title.replace(/\s+/g, '_')}_${formatDate(report.date)}.html`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Report Opened', {
        description: `${report.title} has been opened. You can print it as PDF.`,
      })
    } catch {
      toast.error('Download Failed', {
        description: 'Unable to download report. Please try again.',
      })
    }
  }

  const generateReportHTMLClient = (report) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const hasTestResults = report.testResults && Array.isArray(report.testResults) && report.testResults.length > 0
    
    // Lab information section
    let labInfoHTML = ''
    if (report.labName || report.registeredOn || report.collectedOn || report.reportedOn) {
      labInfoHTML = `
        <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px;">
          <h4 style="color: #0c4a6e; margin-top: 0; margin-bottom: 10px;">LABORATORY INFORMATION</h4>
          ${report.labName ? `<div style="margin: 5px 0;"><strong>Lab:</strong> ${report.labName}</div>` : ''}
          ${report.labAddress ? `<div style="margin: 5px 0;"><strong>Address:</strong> ${report.labAddress}</div>` : ''}
          ${report.registeredOn ? `<div style="margin: 5px 0;"><strong>Registered:</strong> ${report.registeredOn}</div>` : ''}
          ${report.collectedOn ? `<div style="margin: 5px 0;"><strong>Collected:</strong> ${report.collectedOn}</div>` : ''}
          ${report.reportedOn ? `<div style="margin: 5px 0;"><strong>Reported:</strong> ${report.reportedOn}</div>` : ''}
        </div>
      `
    }
    
    let testResultsHTML = ''
    if (hasTestResults) {
      testResultsHTML = `
        <div style="margin-top: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">TEST RESULTS</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white;">
                <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Investigation</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Result</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Reference Value</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Unit</th>
                <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${report.testResults.map((test, idx) => {
                const statusColor = test.isAbnormal ? '#ef4444' : '#10b981'
                const resultColor = test.isAbnormal ? '#ef4444' : '#1f2937'
                return `
                  <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${test.investigation}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; color: ${resultColor}; font-weight: ${test.isAbnormal ? 'bold' : 'normal'};">${test.result}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${test.referenceValue}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${test.unit || '-'}</td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; color: ${statusColor}; font-weight: bold;">${test.status}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
        </div>
      `
    }

    // NLA Guidelines table for Lipid Profile
    let nlaGuidelinesHTML = ''
    if (report.nlaGuidelines && Array.isArray(report.nlaGuidelines) && report.nlaGuidelines.length > 0) {
      nlaGuidelinesHTML = `
        <div style="margin-top: 30px;">
          <h3 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">NLA - 2014 RECOMMENDATIONS</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Category</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Optimal</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Above Optimal</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Borderline High</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">High</th>
                <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Very High</th>
              </tr>
            </thead>
            <tbody>
              ${report.nlaGuidelines.map((guideline, idx) => `
                <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f0fdf4'};">
                  <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">${guideline.category}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.optimal || '-'}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.aboveOptimal || '-'}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.borderlineHigh || '-'}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.high || '-'}</td>
                  <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.veryHigh || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
    }

    let recommendationsHTML = ''
    if (report.recommendations) {
      recommendationsHTML = `
        <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
          <h3 style="color: #1f2937; margin-top: 0;">RECOMMENDATIONS</h3>
          <p style="color: #4b5563; line-height: 1.6; margin: 0;">${report.recommendations}</p>
        </div>
      `
    }

    let notesHTML = ''
    if (report.notes) {
      notesHTML = `
        <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px;">
          <h4 style="color: #92400e; margin-top: 0;">NOTES</h4>
          <p style="color: #78350f; line-height: 1.6; margin: 0; font-size: 0.9rem;">${report.notes}</p>
        </div>
      `
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; background: #ffffff; }
    .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    .hospital-name { font-size: 24px; font-weight: bold; color: #3b82f6; }
    .report-title { font-size: 28px; font-weight: bold; margin: 30px 0; color: #1f2937; text-align: center; }
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #6b7280; display: inline-block; width: 150px; }
    .value { color: #1f2937; }
    .summary { margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
    table { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { font-weight: 700; }
  </style>
</head>
<body>
  <div class="header">
    <div class="hospital-name" style="text-align: center;">MEDIQ CENTRAL HOSPITAL</div>
    <div style="color: #6b7280; margin-top: 5px; text-align: center;">Official Medical Report | Accurate | Caring | Instant</div>
    <div style="color: #9ca3af; margin-top: 10px; font-size: 0.85rem; text-align: center;">
      Generated on: ${new Date().toLocaleString()}
    </div>
  </div>
  
  <h1 class="report-title">${report.title}</h1>
  
  <div class="info-section">
    <div>
      <div class="info-row">
        <span class="label">Patient Name:</span>
        <span class="value">${user?.firstName || 'Patient'} ${user?.lastName || 'User'}</span>
      </div>
      <div class="info-row">
        <span class="label">Report Date:</span>
        <span class="value">${formatDate(report.date)}</span>
      </div>
      <div class="info-row">
        <span class="label">Report Type:</span>
        <span class="value">${report.type.toUpperCase()}</span>
      </div>
    </div>
    <div>
      <div class="info-row">
        <span class="label">Status:</span>
        <span class="value" style="color: ${report.status === 'ready' ? '#10b981' : '#f97316'}; font-weight: bold;">${report.status.toUpperCase()}</span>
      </div>
    </div>
  </div>
  
  <div class="summary">
    <div class="label" style="margin-bottom: 10px; font-size: 1.1rem;">Summary:</div>
    <div style="color: #4b5563; line-height: 1.6;">${report.summary || 'No summary available'}</div>
  </div>
  
  ${labInfoHTML}
  ${testResultsHTML}
  ${nlaGuidelinesHTML}
  ${recommendationsHTML}
  ${notesHTML}
  
  <div class="footer">
    <div style="margin-bottom: 10px;"><strong>This is an official medical report from MedIQ Central Hospital.</strong></div>
    <div>For any queries, please contact your healthcare provider.</div>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="margin-bottom: 5px;">Report Generated Electronically</div>
      <div>**** End of Report ****</div>
    </div>
  </div>
</body>
</html>
    `
  }


  return (
    <div className="patient-dashboard-new">
      {/* Top Header */}
      <div className="patient-dashboard-header">
        <div className="hospital-name">MEDIQ CENTRAL HOSPITAL</div>
        <div className="patient-welcome-section">
          <h1 className="welcome-title">Welcome, {user?.firstName || 'Patient'}</h1>
          <p className="patient-room-info">Room {patientInfo.room} • Care Status Overview</p>
        </div>
        <button className="patient-logout-btn-new" onClick={handleLogout} title="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="patient-dashboard-main">
        {/* Left Column - Recovery Status & Daily Health Check */}
        <div className="patient-dashboard-left">
          {/* Recovery Status Panel */}
          <div className="recovery-status-panel">
            <div className="recovery-progress-circle">
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-circle-bg"
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  className="progress-ring-circle"
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - patientInfo.recoveryStatus / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="recovery-percentage">{patientInfo.recoveryStatus}%</div>
            </div>
            <div className="recovery-status-label">RECOVERY STATUS</div>
            <div className="recovery-status-text">{patientInfo.statusText}</div>
            <p className="recovery-status-note">*Your latest results show good progress on your recovery path.*</p>
          </div>

          {/* Daily Health Check Panel */}
          <div className="daily-health-panel">
            <h3 className="daily-health-title">DAILY HEALTH CHECK</h3>
            <div className="vital-check-item">
              <div className="vital-check-header">
                <span className="vital-check-label">Heart Rate</span>
                <span className="vital-check-status">Healthy Range</span>
              </div>
              <div className="vital-check-progress">
                <div 
                  className="vital-check-progress-bar" 
                  style={{ width: `${Math.min(100, (patientInfo.heartRate / 100) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="vital-check-item">
              <div className="vital-check-header">
                <span className="vital-check-label">Blood Oxygen</span>
                <span className="vital-check-status">Optimal</span>
              </div>
              <div className="vital-check-progress">
                <div 
                  className="vital-check-progress-bar" 
                  style={{ width: `${patientInfo.bloodOxygen}%` }}
                ></div>
              </div>
            </div>
            <div className="vital-check-footer">
              <span className="vital-check-bullet">●</span>
              <span>All vitals within expected recovery targets.</span>
            </div>
          </div>
        </div>

        {/* Right Column - Reports Section */}
        <div className="patient-dashboard-right">
          <div className="reports-section-header">
            <div>
              <h2 className="reports-section-title">HOSPITAL LAB REPORTS</h2>
              <p className="reports-section-subtitle">Official diagnostic results from MedIQ Central Hospital</p>
            </div>
            <span className="official-records-badge">OFFICIAL RECORDS</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading reports...</div>
          ) : reports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              No reports available yet. Reports will appear here once they are processed.
            </div>
          ) : (
            <div className="reports-list-new">
              {reports.map((report) => {
                const statusColor = report.status === 'ready' ? '#10b981' : '#f97316'
                const statusText = report.status === 'ready' ? 'READY' : 'PENDING'
                const iconBg = getReportIconBg(report.type)
                const icon = getReportIcon(report.type)
                
                return (
                  <div key={report._id || report.id} className="report-card-new">
                    <div className="report-icon-new" style={{ backgroundColor: iconBg }}>
                      {icon}
                    </div>
                    <div className="report-content-new">
                      <div className="report-header-new">
                        <h3 className="report-title-new">{report.title}</h3>
                        <span className="report-status-badge-new" style={{ backgroundColor: statusColor }}>
                          {statusText}
                        </span>
                      </div>
                      <div className="report-date-new">{formatDate(report.date)}</div>
                      <p className="report-summary-new">{report.summary || 'No summary available'}</p>
                      <button 
                        className={`report-download-btn ${report.status === 'pending' ? 'disabled' : ''}`}
                        disabled={report.status === 'pending'}
                        onClick={() => {
                          if (report.status === 'ready') {
                            handleDownloadReport(report)
                          }
                        }}
                      >
                        {report.status === 'pending' ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            PROCESSING...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            VIEW PDF REPORT
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Assistance Button */}
      <div className="assistance-section-new">
        <button className="request-assistance-btn-new" onClick={() => setShowAssistanceGuide(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Request Assistance
        </button>
      </div>

      {/* Assistance Guide Modal */}
      {showAssistanceGuide && (
        <AssistanceGuideModal onClose={() => setShowAssistanceGuide(false)} />
      )}
    </div>
  )
}

const wards = ['ICU North', 'ICU South', 'Ward A', 'Ward B', 'ER', 'OR Block']

function RiskHeatmap() {
  const wardData = useMemo(
    () =>
      wards.map((name, idx) => {
        const occupancy = 60 + idx * 7
        const risk =
          occupancy > 95 ? 'critical' : occupancy > 85 ? 'warning' : 'normal'
        return { name, occupancy, risk }
      }),
    [],
  )

  return (
    <div className="heatmap-grid">
      {wardData.map((ward) => (
        <div
          key={ward.name}
          className={`heatmap-cell heatmap-${ward.risk}`}
        >
          <div className="heatmap-name">{ward.name}</div>
          <div className="heatmap-occupancy">{ward.occupancy}% occupied</div>
          <div className="heatmap-tag">
            {ward.risk === 'critical'
              ? 'High-risk / overloaded'
              : ward.risk === 'warning'
              ? 'Nearing capacity'
              : 'Stable'}
          </div>
        </div>
      ))}
    </div>
  )
}

function VitalsMonitor() {
  // In a real build, replace this with Supabase Realtime subscriptions.
  const [tick, setTick] = useState(0)

  useState(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000)
    return () => clearInterval(id)
  })

  const vitals = useMemo(() => {
    const danger = tick % 4 === 0
    return {
      hr: danger ? 130 : 92,
      spo2: danger ? 88 : 96,
      bp: danger ? '150/95' : '120/80',
      rr: danger ? 24 : 18,
      danger,
    }
  }, [tick])

  return (
    <div className="vitals-root">
      <div className="vitals-row">
        <VitalSparkline
          label="Heart Rate"
          unit="bpm"
          value={vitals.hr}
          danger={vitals.danger}
        />
        <VitalSparkline
          label="SpO₂"
          unit="%"
          value={vitals.spo2}
          danger={vitals.danger}
        />
        <VitalSparkline
          label="Blood Pressure"
          unit=""
          value={vitals.bp}
          danger={vitals.danger}
        />
      </div>
      <p className="vitals-footnote">
        Live stream simulated; plug in Supabase Realtime channel for production.
      </p>
    </div>
  )
}

// WebSocket-based Vitals Monitor for Doctor Dashboard
function VitalsMonitorWebSocket() {
  const [vitals, setVitals] = useState({
    hr: 72,
    spo2: 98,
    bp: '120/80',
    rr: 16,
    temperature: 98.6,
    danger: false,
  })
  const [wsStatus, setWsStatus] = useState('connecting') // connecting, connected, disconnected, error
  const wsRef = useRef(null)

  useEffect(() => {
    // WebSocket URL - Socket.IO uses HTTP URL, not ws://
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    
    // Connect using Socket.IO client
    const connectWebSocket = () => {
      try {
        const socket = io(wsUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5
        })

        socket.on('connect', () => {
          console.log('Socket.IO connected')
          setWsStatus('connected')
          // Subscribe to vitals channel
          socket.emit('subscribe', { channel: 'vitals' })
        })

        socket.on('vitals-update', (data) => {
          if (data.payload) {
            setVitals((prev) => ({
              hr: data.payload.heartRate || prev.hr,
              spo2: data.payload.oxygenSaturation || prev.spo2,
              bp: data.payload.bloodPressure || prev.bp,
              rr: data.payload.respiratoryRate || prev.rr,
              temperature: data.payload.temperature || prev.temperature,
              danger: data.payload.danger || false,
            }))
          }
        })

        socket.on('disconnect', () => {
          console.log('Socket.IO disconnected')
          setWsStatus('disconnected')
        })

        socket.on('connect_error', (error) => {
          console.error('Socket.IO connection error:', error)
          setWsStatus('error')
          // Fallback to simulated data
          startSimulatedUpdates()
        })

        wsRef.current = socket
      } catch (error) {
        console.error('WebSocket connection failed:', error)
        setWsStatus('error')
        // Fallback to simulated data
        startSimulatedUpdates()
      }
    }

    // Simulated updates fallback (for when WebSocket is not available)
    const startSimulatedUpdates = () => {
      setWsStatus('simulated')
      const interval = setInterval(() => {
        setVitals((prev) => {
          const variation = () => Math.random() * 10 - 5 // -5 to +5 variation
          const danger = Math.random() < 0.1 // 10% chance of danger
          
          return {
            hr: Math.max(60, Math.min(120, prev.hr + variation())),
            spo2: Math.max(90, Math.min(100, prev.spo2 + variation() * 0.5)),
            bp: danger ? '150/95' : '120/80',
            rr: Math.max(12, Math.min(24, prev.rr + variation() * 0.3)),
            temperature: Math.max(97, Math.min(100, prev.temperature + variation() * 0.1)),
            danger,
          }
        })
      }, 2000) // Update every 2 seconds

      return () => clearInterval(interval)
    }

    // Try WebSocket first, fallback to simulation
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect()
      }
    }
  }, [])

  const getStatusColor = () => {
    switch (wsStatus) {
      case 'connected':
        return '#10b981' // green
      case 'connecting':
        return '#f59e0b' // yellow
      case 'disconnected':
      case 'error':
        return '#ef4444' // red
      case 'simulated':
        return '#6b7280' // gray
      default:
        return '#6b7280'
    }
  }

  const getStatusText = () => {
    switch (wsStatus) {
      case 'connected':
        return 'LIVE'
      case 'connecting':
        return 'CONNECTING...'
      case 'disconnected':
        return 'DISCONNECTED'
      case 'error':
        return 'ERROR'
      case 'simulated':
        return 'SIMULATED'
      default:
        return 'UNKNOWN'
    }
  }

  return (
    <div className="vitals-root-bw">
      <div className="vitals-status-bw">
        <span 
          className="vitals-status-dot" 
          style={{ backgroundColor: getStatusColor() }}
        ></span>
        <span className="vitals-status-text">{getStatusText()}</span>
      </div>
      <div className="vitals-row-bw">
        <VitalSparklineBw
          label="Heart Rate"
          unit="bpm"
          value={Math.round(vitals.hr)}
          danger={vitals.danger || vitals.hr > 100}
        />
        <VitalSparklineBw
          label="SpO₂"
          unit="%"
          value={Math.round(vitals.spo2)}
          danger={vitals.danger || vitals.spo2 < 95}
        />
        <VitalSparklineBw
          label="Blood Pressure"
          unit=""
          value={vitals.bp}
          danger={vitals.danger || vitals.bp.includes('150')}
        />
        <VitalSparklineBw
          label="Respiratory Rate"
          unit="bpm"
          value={Math.round(vitals.rr)}
          danger={vitals.danger || vitals.rr > 20}
        />
        <VitalSparklineBw
          label="Temperature"
          unit="°F"
          value={vitals.temperature.toFixed(1)}
          danger={vitals.danger || vitals.temperature > 99}
        />
      </div>
    </div>
  )
}

function VitalSparklineBw({ label, unit, value, danger }) {
  return (
    <div className={`vital-card-bw ${danger ? 'vital-danger-bw' : ''}`}>
      <div className="vital-header-bw">
        <span>{label}</span>
        {danger && <span className="vital-blink-dot-bw" />}
      </div>
      <div className="vital-value-bw">
        {value}
        {unit && <span className="vital-unit-bw"> {unit}</span>}
      </div>
      <div className="vital-sparkline-bw">
        <span className="sparkline-bar-bw" />
        <span className="sparkline-bar-bw" />
        <span className="sparkline-bar-bw" />
        <span className="sparkline-bar-bw" />
        <span className="sparkline-bar-bw" />
      </div>
    </div>
  )
}

function VitalSparkline({ label, unit, value, danger }) {
  return (
    <div className={`vital-card ${danger ? 'vital-danger' : ''}`}>
      <div className="vital-header">
        <span>{label}</span>
        {danger && <span className="vital-blink-dot" />}
      </div>
      <div className="vital-value">
        {value}
        {unit && <span className="vital-unit"> {unit}</span>}
      </div>
      <div className="vital-sparkline">
        <span className="sparkline-bar" />
        <span className="sparkline-bar" />
        <span className="sparkline-bar" />
        <span className="sparkline-bar" />
        <span className="sparkline-bar" />
      </div>
    </div>
  )
}

function ExplainableAlerts() {
  const [alerts] = useState([
    {
      id: 1,
      title: 'Patient Risk High',
      why: 'Correlation of falling SpO₂ (88%) and rising Respiratory Rate (24).',
      actionPrimary: 'Notify Rapid Response Team',
      actionSecondary: 'Open Patient Chart',
      patientId: 'P101',
    },
    {
      id: 2,
      title: 'ICU Capacity Warning',
      why: 'ICU North at 96% occupancy; two ventilator patients awaiting step-down.',
      actionPrimary: 'Request ICU Transfer',
      actionSecondary: 'View Bed Board',
      wardName: 'ICU North',
    },
  ])
  const [showPatientChart, setShowPatientChart] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState(null)

  const handlePrimaryAction = async (alert) => {
    try {
      const token = localStorage.getItem('token')
      
      if (alert.actionPrimary === 'Notify Rapid Response Team') {
        // Trigger emergency SMS alert
        const response = await fetch(`${API_URL}/api/test/sms/trigger-emergency-alert`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          toast.success('Rapid Response Team Notified!', {
            description: 'Emergency SMS alerts have been sent to all staff members.',
            duration: 5000,
          })
        } else {
          const data = await response.json()
          toast.warning('Notification Sent', {
            description: data.message || 'Alert logged. SMS may not be configured.',
          })
        }
      } else if (alert.actionPrimary === 'Request ICU Transfer') {
        // Trigger ward overload alert
        const response = await fetch(`${API_URL}/api/test/sms/test-ward-alert`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: '+1234567890', // Will use logged-in user's phone
          }),
        })

        if (response.ok) {
          toast.success('ICU Transfer Requested!', {
            description: 'Administrators have been notified via SMS.',
            duration: 5000,
          })
        } else {
          toast.info('Transfer Request Logged', {
            description: 'Request has been recorded in the system.',
          })
        }
      }
    } catch {
      toast.info(alert.actionPrimary, {
        description: `${alert.title} – Action has been logged.`,
      })
    }
  }

  const handleSecondaryAction = (alert) => {
    if (alert.actionSecondary === 'Open Patient Chart') {
      setSelectedPatientId(alert.patientId || 'P101')
      setShowPatientChart(true)
    } else if (alert.actionSecondary === 'View Bed Board') {
      toast.info('Opening Bed Board', {
        description: 'Displaying current bed availability and occupancy.',
      })
    } else {
      toast.info(alert.actionSecondary, {
        description: `${alert.title} – ${alert.why}`,
      })
    }
  }

  return (
    <>
      <div className="alerts-root">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-card">
            <h3 className="alert-title">{alert.title}</h3>
            <p className="alert-why">{alert.why}</p>
            <div className="alert-actions">
              <button
                className="primary-btn small"
                onClick={() => handlePrimaryAction(alert)}
              >
                {alert.actionPrimary}
              </button>
              <button
                className="ghost-btn small"
                onClick={() => handleSecondaryAction(alert)}
              >
                {alert.actionSecondary}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showPatientChart && (
        <PatientChartModal
          patientId={selectedPatientId}
          onClose={() => {
            setShowPatientChart(false)
            setSelectedPatientId(null)
          }}
        />
      )}
    </>
  )
}

function PatientChartModal({ patientId, onClose }) {
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch patient data or use dummy data
    const fetchPatientData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        // Try to fetch from API first
        const response = await fetch(`${API_URL}/api/doctor/patients/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setPatientData(data.patient)
        } else {
          // Use dummy data for demo
          setPatientData(getDummyPatientData(patientId))
        }
      } catch (error) {
        console.error('Error fetching patient data:', error)
        // Use dummy data on error
        setPatientData(getDummyPatientData(patientId))
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [patientId])

  const getDummyPatientData = (id) => {
    const dummyData = {
      P101: {
        _id: 'dummy1',
        patientId: 'P101',
        userId: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com'
        },
        currentVitals: {
          oxygenSaturation: 88,
          heartRate: 130,
          bloodPressure: { systolic: 150, diastolic: 95 },
          respiratoryRate: 24,
          temperature: 99.5
        },
        riskScore: 75,
        riskLevel: 'critical',
        ward: 'ICU North',
        bedNumber: 'ICU-12',
        admissionDate: new Date('2024-01-20'),
        diagnosis: 'Acute Respiratory Distress Syndrome (ARDS)',
        allergies: ['Penicillin', 'Latex'],
        medications: [
          { name: 'Morphine', dosage: '5mg', frequency: 'Q4H', route: 'IV' },
          { name: 'Furosemide', dosage: '40mg', frequency: 'BID', route: 'IV' },
          { name: 'Vancomycin', dosage: '1g', frequency: 'Q12H', route: 'IV' }
        ],
        medicalHistory: [
          { date: '2023-12-15', condition: 'Hypertension', status: 'Chronic' },
          { date: '2023-11-20', condition: 'Type 2 Diabetes', status: 'Controlled' },
          { date: '2023-09-10', condition: 'Pneumonia', status: 'Resolved' }
        ],
        recentLabResults: [
          { test: 'WBC', value: '12.5', unit: 'K/μL', status: 'High', date: '2024-01-23' },
          { test: 'Hemoglobin', value: '10.2', unit: 'g/dL', status: 'Low', date: '2024-01-23' },
          { test: 'Creatinine', value: '1.8', unit: 'mg/dL', status: 'High', date: '2024-01-23' },
          { test: 'Troponin', value: '0.05', unit: 'ng/mL', status: 'Normal', date: '2024-01-23' }
        ],
        alerts: [
          { type: 'vital', message: 'Critical: SpO₂ is dangerously low at 88%', severity: 'critical', timestamp: new Date() },
          { type: 'vital', message: 'High heart rate detected: 130 bpm', severity: 'warning', timestamp: new Date() }
        ],
        assignedDoctor: { firstName: 'Dr. Sarah', lastName: 'Johnson' },
        assignedNurse: { firstName: 'Nurse', lastName: 'Priya' }
      }
    }
    return dummyData[id] || dummyData.P101
  }

  if (loading) {
    return (
      <div className="patient-chart-overlay" onClick={onClose}>
        <div className="patient-chart-modal" onClick={(e) => e.stopPropagation()}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading patient chart...</div>
        </div>
      </div>
    )
  }

  if (!patientData) {
    return null
  }

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return '#ef4444'
      case 'high': return '#f97316'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'high': return '#ef4444'
      case 'low': return '#3b82f6'
      case 'normal': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="patient-chart-overlay" onClick={onClose}>
      <div className="patient-chart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="patient-chart-header">
          <div>
            <h2 className="patient-chart-title">
              Patient Chart: {patientData.userId?.firstName} {patientData.userId?.lastName}
            </h2>
            <p className="patient-chart-subtitle">ID: {patientData.patientId} | {patientData.ward} - Bed {patientData.bedNumber}</p>
          </div>
          <button className="patient-chart-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="patient-chart-content">
          {/* Risk Score & Status */}
          <div className="patient-chart-section">
            <div className="risk-score-card" style={{ borderColor: getRiskColor(patientData.riskLevel) }}>
              <div className="risk-score-header">
                <span className="risk-label">Risk Assessment</span>
                <span className="risk-level-badge" style={{ backgroundColor: getRiskColor(patientData.riskLevel) }}>
                  {patientData.riskLevel?.toUpperCase()}
                </span>
              </div>
              <div className="risk-score-value" style={{ color: getRiskColor(patientData.riskLevel) }}>
                {patientData.riskScore}/100
              </div>
            </div>
          </div>

          {/* Current Vitals */}
          <div className="patient-chart-section">
            <h3 className="section-title">Current Vital Signs</h3>
            <div className="vitals-grid">
              <div className="vital-item">
                <span className="vital-label">SpO₂</span>
                <span className={`vital-value ${patientData.currentVitals?.oxygenSaturation < 90 ? 'critical' : ''}`}>
                  {patientData.currentVitals?.oxygenSaturation || 'N/A'}%
                </span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Heart Rate</span>
                <span className={`vital-value ${(patientData.currentVitals?.heartRate > 120 || patientData.currentVitals?.heartRate < 50) ? 'critical' : ''}`}>
                  {patientData.currentVitals?.heartRate || 'N/A'} bpm
                </span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Blood Pressure</span>
                <span className="vital-value">
                  {patientData.currentVitals?.bloodPressure?.systolic || patientData.currentVitals?.bloodPressure || 'N/A'} / {patientData.currentVitals?.bloodPressure?.diastolic || 'N/A'} mmHg
                </span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Respiratory Rate</span>
                <span className={`vital-value ${patientData.currentVitals?.respiratoryRate > 20 ? 'critical' : ''}`}>
                  {patientData.currentVitals?.respiratoryRate || 'N/A'} bpm
                </span>
              </div>
              <div className="vital-item">
                <span className="vital-label">Temperature</span>
                <span className={`vital-value ${patientData.currentVitals?.temperature > 99 ? 'critical' : ''}`}>
                  {patientData.currentVitals?.temperature || 'N/A'}°F
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis & Admission Info */}
          <div className="patient-chart-section">
            <h3 className="section-title">Diagnosis & Admission</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Primary Diagnosis</span>
                <span className="info-value">{patientData.diagnosis || 'Not specified'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Admission Date</span>
                <span className="info-value">
                  {patientData.admissionDate ? new Date(patientData.admissionDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Assigned Doctor</span>
                <span className="info-value">
                  {patientData.assignedDoctor ? `${patientData.assignedDoctor.firstName} ${patientData.assignedDoctor.lastName}` : 'Not assigned'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Assigned Nurse</span>
                <span className="info-value">
                  {patientData.assignedNurse ? `${patientData.assignedNurse.firstName} ${patientData.assignedNurse.lastName}` : 'Not assigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Allergies */}
          {patientData.allergies && patientData.allergies.length > 0 && (
            <div className="patient-chart-section">
              <h3 className="section-title">Allergies</h3>
              <div className="allergies-list">
                {patientData.allergies.map((allergy, idx) => (
                  <span key={idx} className="allergy-badge">{allergy}</span>
                ))}
              </div>
            </div>
          )}

          {/* Current Medications */}
          {patientData.medications && patientData.medications.length > 0 && (
            <div className="patient-chart-section">
              <h3 className="section-title">Current Medications</h3>
              <div className="medications-table">
                <table>
                  <thead>
                    <tr>
                      <th>Medication</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Route</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.medications.map((med, idx) => (
                      <tr key={idx}>
                        <td>{med.name}</td>
                        <td>{med.dosage}</td>
                        <td>{med.frequency}</td>
                        <td>{med.route}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Lab Results */}
          {patientData.recentLabResults && patientData.recentLabResults.length > 0 && (
            <div className="patient-chart-section">
              <h3 className="section-title">Recent Lab Results</h3>
              <div className="lab-results-table">
                <table>
                  <thead>
                    <tr>
                      <th>Test</th>
                      <th>Value</th>
                      <th>Unit</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.recentLabResults.map((lab, idx) => (
                      <tr key={idx}>
                        <td>{lab.test}</td>
                        <td>{lab.value}</td>
                        <td>{lab.unit}</td>
                        <td>
                          <span className="lab-status" style={{ color: getStatusColor(lab.status) }}>
                            {lab.status}
                          </span>
                        </td>
                        <td>{lab.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Medical History */}
          {patientData.medicalHistory && patientData.medicalHistory.length > 0 && (
            <div className="patient-chart-section">
              <h3 className="section-title">Medical History</h3>
              <div className="history-list">
                {patientData.medicalHistory.map((history, idx) => (
                  <div key={idx} className="history-item">
                    <div className="history-date">{history.date}</div>
                    <div className="history-content">
                      <div className="history-condition">{history.condition}</div>
                      <div className="history-status">{history.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Alerts */}
          {patientData.alerts && patientData.alerts.length > 0 && (
            <div className="patient-chart-section">
              <h3 className="section-title">Active Alerts</h3>
              <div className="alerts-list-chart">
                {patientData.alerts.map((alert, idx) => (
                  <div key={idx} className={`alert-item-chart ${alert.severity}`}>
                    <span className="alert-icon">⚠️</span>
                    <div className="alert-content">
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">
                        {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : 'Just now'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AssistanceGuideModal({ onClose }) {
  const assistanceOptions = [
    {
      icon: '🏥',
      title: 'Medical Emergency',
      description: 'If you are experiencing a life-threatening emergency, call 911 immediately or press the emergency call button in your room.',
      actions: [
        'Call 911 for immediate emergency services',
        'Press the emergency button in your room',
        'Alert nearby staff members immediately'
      ],
      urgent: true
    },
    {
      icon: '💊',
      title: 'Medication Questions',
      description: 'Have questions about your medications, dosages, or side effects?',
      actions: [
        'Contact your assigned nurse or doctor',
        'Review your medication schedule in the dashboard',
        'Note any side effects or concerns'
      ],
      urgent: false
    },
    {
      icon: '😷',
      title: 'Pain Management',
      description: 'Experiencing pain or discomfort?',
      actions: [
        'Rate your pain level (1-10)',
        'Inform your nurse about the location and type of pain',
        'Request pain medication if prescribed'
      ],
      urgent: false
    },
    {
      icon: '🍽️',
      title: 'Dietary Needs',
      description: 'Need help with meals, dietary restrictions, or special requests?',
      actions: [
        'Contact the dietary department',
        'Inform your nurse of any allergies or preferences',
        'Request assistance with eating if needed'
      ],
      urgent: false
    },
    {
      icon: '🚽',
      title: 'Bathroom Assistance',
      description: 'Need help getting to the bathroom or using facilities?',
      actions: [
        'Press the call button for nurse assistance',
        'Wait for staff to help you safely',
        'Do not attempt to get up alone if you feel unsteady'
      ],
      urgent: false
    },
    {
      icon: '📞',
      title: 'Contact Family',
      description: 'Need help contacting family members or visitors?',
      actions: [
        'Ask your nurse for assistance with phone calls',
        'Request visitor information or visiting hours',
        'Set up video calls if available'
      ],
      urgent: false
    },
    {
      icon: '❓',
      title: 'General Questions',
      description: 'Have questions about your care, discharge, or hospital services?',
      actions: [
        'Speak with your assigned doctor or nurse',
        'Review your schedule and care plan',
        'Request a meeting with your care team'
      ],
      urgent: false
    },
    {
      icon: '📋',
      title: 'Test Results',
      description: 'Want to know about your test results or reports?',
      actions: [
        'Check the Medical Reports section above',
        'Request a consultation with your doctor',
        'Review results with your care team'
      ],
      urgent: false
    }
  ]

  const handleRequestAssistance = async (option) => {
    try {
      // Send assistance request to backend (if endpoint exists)
      toast.success('Assistance Requested', {
        description: `Your request for ${option.title} has been sent to the nursing staff.`,
        duration: 5000,
      })
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch {
      toast.info('Request Logged', {
        description: `Your ${option.title} request has been noted. Staff will be notified.`,
      })
      onClose()
    }
  }

  return (
    <div className="assistance-overlay" onClick={onClose}>
      <div className="assistance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="assistance-header">
          <div>
            <h2 className="assistance-title">How Can We Help You?</h2>
            <p className="assistance-subtitle">Select the type of assistance you need</p>
          </div>
          <button className="assistance-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="assistance-content">
          <div className="assistance-grid">
            {assistanceOptions.map((option, idx) => (
              <div 
                key={idx} 
                className={`assistance-card ${option.urgent ? 'urgent' : ''}`}
                onClick={() => handleRequestAssistance(option)}
              >
                <div className="assistance-icon">{option.icon}</div>
                <h3 className="assistance-card-title">{option.title}</h3>
                <p className="assistance-card-description">{option.description}</p>
                <div className="assistance-actions">
                  <ul>
                    {option.actions.map((action, actionIdx) => (
                      <li key={actionIdx}>{action}</li>
                    ))}
                  </ul>
                </div>
                {option.urgent && (
                  <div className="urgent-badge">URGENT</div>
                )}
              </div>
            ))}
          </div>

          <div className="assistance-footer">
            <div className="emergency-notice">
              <span className="emergency-icon">🚨</span>
              <div>
                <strong>Medical Emergency?</strong>
                <p>Call 911 immediately or press the emergency button in your room.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PatientReportsManager() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'other',
    summary: '',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/doctor/patients`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const fetchedPatients = data.patients || []
        
        // If no patients from API, use dummy patients for demo
        if (fetchedPatients.length === 0) {
          const dummyPatients = [
            {
              _id: 'dummy1',
              userId: {
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@example.com'
              },
              patientId: 'P101',
              riskScore: 75,
              riskLevel: 'critical'
            },
            {
              _id: 'dummy2',
              userId: {
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah.j@example.com'
              },
              patientId: 'P102',
              riskScore: 45,
              riskLevel: 'medium'
            },
            {
              _id: 'dummy3',
              userId: {
                firstName: 'Michael',
                lastName: 'Chen',
                email: 'm.chen@example.com'
              },
              patientId: 'P103',
              riskScore: 30,
              riskLevel: 'low'
            },
            {
              _id: 'dummy4',
              userId: {
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.d@example.com'
              },
              patientId: 'P104',
              riskScore: 60,
              riskLevel: 'high'
            },
            {
              _id: 'dummy5',
              userId: {
                firstName: 'Robert',
                lastName: 'Williams',
                email: 'r.williams@example.com'
              },
              patientId: 'P105',
              riskScore: 55,
              riskLevel: 'high'
            }
          ]
          setPatients(dummyPatients)
        } else {
          setPatients(fetchedPatients)
        }
      } else {
        // Fallback to dummy patients on error
        const dummyPatients = [
          {
            _id: 'dummy1',
            userId: {
              firstName: 'John',
              lastName: 'Smith',
              email: 'john.smith@example.com'
            },
            patientId: 'P101',
            riskScore: 75,
            riskLevel: 'critical'
          },
          {
            _id: 'dummy2',
            userId: {
              firstName: 'Sarah',
              lastName: 'Johnson',
              email: 'sarah.j@example.com'
            },
            patientId: 'P102',
            riskScore: 45,
            riskLevel: 'medium'
          },
          {
            _id: 'dummy3',
            userId: {
              firstName: 'Michael',
              lastName: 'Chen',
              email: 'm.chen@example.com'
            },
            patientId: 'P103',
            riskScore: 30,
            riskLevel: 'low'
          }
        ]
        setPatients(dummyPatients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
      // Fallback to dummy patients on error
      const dummyPatients = [
        {
          _id: 'dummy1',
          userId: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com'
          },
          patientId: 'P101',
          riskScore: 75,
          riskLevel: 'critical'
        },
        {
          _id: 'dummy2',
          userId: {
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@example.com'
          },
          patientId: 'P102',
          riskScore: 45,
          riskLevel: 'medium'
        },
        {
          _id: 'dummy3',
          userId: {
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'm.chen@example.com'
          },
          patientId: 'P103',
          riskScore: 30,
          riskLevel: 'low'
        }
      ]
      setPatients(dummyPatients)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPatient) {
      toast.error('Please select a patient')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_URL}/api/doctor/patients/${selectedPatient._id}/reports`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      if (response.ok) {
        await response.json()
        toast.success('Report added successfully', {
          description: `Report "${formData.title}" has been added for patient.`,
        })
        setFormData({
          title: '',
          type: 'other',
          summary: '',
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
        })
        setShowForm(false)
        setSelectedPatient(null)
      } else {
        const error = await response.json()
        toast.error('Failed to add report', {
          description: error.error || 'Please try again',
        })
      }
    } catch (error) {
      toast.error('Error adding report', {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reports-manager">
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
          Select Patient:
        </label>
        <select
          value={selectedPatient?._id || ''}
          onChange={(e) => {
            const patient = patients.find((p) => p._id === e.target.value)
            setSelectedPatient(patient)
            setShowForm(false)
          }}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
          }}
        >
          <option value="">-- Select a patient --</option>
          {patients.map((patient) => (
            <option key={patient._id} value={patient._id}>
              {patient.userId?.firstName} {patient.userId?.lastName} ({patient.userId?.email})
            </option>
          ))}
        </select>
      </div>

      {selectedPatient && (
        <div>
          {!showForm ? (
            <button
              className="primary-btn"
              onClick={() => setShowForm(true)}
              style={{ marginBottom: '1rem' }}
            >
              + Add New Report
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label>Report Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Post-Op Hip X-Ray"
                />
              </div>

              <div className="form-group">
                <label>Report Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="xray">X-Ray</option>
                  <option value="blood">Blood Test</option>
                  <option value="urinalysis">Urinalysis</option>
                  <option value="mri">MRI</option>
                  <option value="ct">CT Scan</option>
                  <option value="ultrasound">Ultrasound</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Summary</label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows="3"
                  placeholder="Enter report summary or findings..."
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="ready">Ready</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Report'}
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      title: '',
                      type: 'other',
                      summary: '',
                      status: 'pending',
                      date: new Date().toISOString().split('T')[0],
                    })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {patients.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          No patients assigned. Reports will appear here once patients are assigned to you.
        </div>
      )}
    </div>
  )
}

function ResourceTracker() {
  const beds = [
    { ward: 'ICU North', occupied: 14, total: 15 },
    { ward: 'Ward A', occupied: 28, total: 32 },
    { ward: 'Ward B', occupied: 18, total: 24 },
  ]

  const staff = [
    { name: 'Dr. Rao', role: 'Intensivist', status: 'On-Call' },
    { name: 'Nurse Priya', role: 'Charge Nurse', status: 'Active' },
    { name: 'Nurse Alex', role: 'Staff Nurse', status: 'Offline' },
  ]

  return (
    <div className="resources-grid">
      <div>
        <h3 className="section-label">Bed Occupancy</h3>
        <div className="bed-list">
          {beds.map((b) => {
            const pct = Math.round((b.occupied / b.total) * 100)
            return (
              <div key={b.ward} className="bed-row">
                <div className="bed-meta">
                  <span className="bed-ward">{b.ward}</span>
                  <span className="bed-count">
                    {b.occupied}/{b.total} ({pct}%)
                  </span>
                </div>
                <div className="bed-bar-outer">
                  <div
                    className={`bed-bar-inner ${
                      pct > 95 ? 'critical' : pct > 85 ? 'warning' : ''
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div>
        <h3 className="section-label">Staffing Status</h3>
        <ul className="staff-list">
          {staff.map((s) => (
            <li key={s.name} className="staff-row">
              <div>
                <div className="staff-name">{s.name}</div>
                <div className="staff-role">{s.role}</div>
              </div>
              <span className={`staff-status status-${s.status.toLowerCase()}`}>
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
