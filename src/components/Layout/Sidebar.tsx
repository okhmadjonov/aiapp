import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store';
import { setSidebarExpanded } from '../../store/slices/uiSlice';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiSettings, 
  FiGrid,
  FiCheckSquare,
  FiActivity,
  FiFileText,
  FiChevronRight
} from 'react-icons/fi';
import { RiShieldFlashLine } from 'react-icons/ri';
import './Sidebar.scss';

interface NavLinkItem {
  type: 'link';
  path: string;
  label: string;
  icon: React.ReactNode;
}

interface NavSubmenuItem {
  type: 'submenu';
  id: string;
  label: string;
  icon: React.ReactNode;
  children: {
    path: string;
    label: string;
    icon?: React.ReactNode;
  }[];
}

type NavItem = NavLinkItem | NavSubmenuItem;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarExpanded } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const navItems: NavItem[] = [
    { type: 'link', path: '/', label: 'Dashboard', icon: <FiGrid className="nav-icon" /> },
    {
      type: 'submenu',
      id: 'users',
      label: 'User Control',
      icon: <FiUsers className="nav-icon" />,
      children: [
        { path: '/users', label: 'Users CRUD', icon: <FiUsers className="nav-icon" /> },
        { path: '/logs', label: 'Audit Logs', icon: <FiFileText className="nav-icon" /> },
      ],
    },
    {
      type: 'submenu',
      id: 'inventory',
      label: 'Inventory',
      icon: <FiShoppingBag className="nav-icon" />,
      children: [
        { path: '/products', label: 'Products API', icon: <FiShoppingBag className="nav-icon" /> },
        { path: '/analytics', label: 'Analytics', icon: <FiActivity className="nav-icon" /> },
      ],
    },
    {
      type: 'submenu',
      id: 'system',
      label: 'System Settings',
      icon: <FiSettings className="nav-icon" />,
      children: [
        { path: '/kanban', label: 'Task Board', icon: <FiCheckSquare className="nav-icon" /> },
        { path: '/settings', label: 'Settings', icon: <FiSettings className="nav-icon" /> },
      ],
    },
  ];

  // Auto-expand submenu if one of its children is active on load or location change
  React.useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.type === 'submenu') {
        const hasActiveChild = item.children.some(
          (child) => location.pathname === child.path
        );
        if (hasActiveChild) {
          initialExpanded[item.id] = true;
        }
      }
    });
    setExpandedItems((prev) => ({ ...prev, ...initialExpanded }));
  }, [location.pathname]);

  const handleParentClick = (id: string) => {
    if (!sidebarExpanded) {
      dispatch(setSidebarExpanded(true));
      setExpandedItems((prev) => ({
        ...prev,
        [id]: true,
      }));
    } else {
      setExpandedItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  return (
    <>
      <aside className={`sidebar ${sidebarExpanded ? '' : 'collapsed'}`}>
        <div className="logo-container">
          <RiShieldFlashLine className="logo-icon" />
          <h2>AURA ADMIN</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            if (item.type === 'link') {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              );
            } else {
              const isExpanded = !!expandedItems[item.id];
              const hasActiveChild = item.children.some(
                (child) => location.pathname === child.path
              );

              return (
                <div key={item.id} className="nav-group">
                  <div
                    className={`nav-item nav-parent-item ${isExpanded ? 'open' : ''} ${
                      hasActiveChild ? 'child-active' : ''
                    }`}
                    onClick={() => handleParentClick(item.id)}
                  >
                    {item.icon}
                    <span className="nav-label">{item.label}</span>
                    <FiChevronRight
                      className={`chevron-icon ${isExpanded ? 'rotated' : ''}`}
                    />
                  </div>
                  <div
                    className={`submenu-wrapper ${
                      isExpanded && sidebarExpanded ? 'expanded' : ''
                    }`}
                  >
                    <div className="submenu-list">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `nav-item submenu-item ${isActive ? 'active' : ''}`
                          }
                        >
                          {child.icon}
                          <span className="nav-label">{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </nav>

        {user && (
          <div className="sidebar-footer">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
              alt={user.username} 
              className="user-avatar" 
            />
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className="user-role">{user.role}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
