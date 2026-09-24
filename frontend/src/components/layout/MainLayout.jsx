import { NavLink, Outlet } from 'react-router-dom';
import {
  BsGrid1X2Fill,
  BsShieldCheck,
  BsClockHistory,
  BsGraphUpArrow,
  BsInfoCircle,
  BsChevronRight,
  BsActivity,
} from 'react-icons/bs';

function MainLayout() {
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: BsGrid1X2Fill,
    },
    {
      label: 'Fraud Prediction',
      path: '/prediction',
      icon: BsShieldCheck,
    },
    {
      label: 'Prediction History',
      path: '/history',
      icon: BsClockHistory,
    },
  ];

  const analyticsItems = [
    {
      label: 'Model Insights',
      path: '/model-insights',
      icon: BsGraphUpArrow,
    },
    {
      label: 'About Model',
      path: '/about',
      icon: BsInfoCircle,
    },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">
            <BsShieldCheck />
          </div>

          <div className="brand-content">
            <div className="brand-name">InsureGuard</div>
            <div className="brand-caption">Fraud Analytics</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-navigation">

          <div className="sidebar-section-label">
            WORKSPACE
          </div>

          <div className="sidebar-menu">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-link-icon">
                    <Icon />
                  </span>

                  <span className="sidebar-link-label">
                    {item.label}
                  </span>

                  <BsChevronRight className="sidebar-link-arrow" />
                </NavLink>
              );
            })}
          </div>

          <div className="sidebar-section-label analytics-label">
            ANALYTICS
          </div>

          <div className="sidebar-menu">
            {analyticsItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="sidebar-link-icon">
                    <Icon />
                  </span>

                  <span className="sidebar-link-label">
                    {item.label}
                  </span>

                  <BsChevronRight className="sidebar-link-arrow" />
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Bottom */}
        <div className="sidebar-bottom">
          <div className="model-status">
            <div className="model-status-icon">
              <BsActivity />
            </div>

            <div className="model-status-content">
              <div className="model-status-title">
                Model Status
              </div>

              <div className="model-status-state">
                <span className="status-dot"></span>
                Ready for prediction
              </div>
            </div>
          </div>

          <div className="sidebar-version">
            XGBoost Fraud Detection
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <main className="app-main">

        {/* Top Navbar */}
        <header className="app-navbar">
          <div className="navbar-left">
            <div className="navbar-page-context">
              Insurance Intelligence
            </div>
          </div>

          <div className="navbar-right">
            <div className="navbar-status">
              <span className="navbar-status-dot"></span>
              System Online
            </div>

            <div className="navbar-divider"></div>

            <div className="navbar-user">
              <div className="navbar-user-avatar">
                IA
              </div>

              <div className="navbar-user-info">
                <div className="navbar-user-name">
                  Insurance Analyst
                </div>

                <div className="navbar-user-role">
                  Fraud Detection
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="app-content">
          <Outlet />
        </div>

      </main>
    </div>
  );
}

export default MainLayout;