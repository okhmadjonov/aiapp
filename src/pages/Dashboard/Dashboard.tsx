import React, { useState } from 'react';
import AreaChart from '../../components/Visuals/AreaChart';
import DoughnutChart from '../../components/Visuals/DoughnutChart';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiActivity, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCpu,
  FiCheckSquare
} from 'react-icons/fi';
import './Dashboard.scss';

const METRICS = [
  { 
    id: 1, 
    label: 'Total Earnings', 
    value: '$24,892.50', 
    change: '+12.4%', 
    trend: 'up', 
    icon: <FiDollarSign />, 
    color: 'indigo' 
  },
  { 
    id: 2, 
    label: 'Sales Volume', 
    value: '1,482', 
    change: '+8.2%', 
    trend: 'up', 
    icon: <FiShoppingBag />, 
    color: 'teal' 
  },
  { 
    id: 3, 
    label: 'Active Users', 
    value: '4,821', 
    change: '+15.1%', 
    trend: 'up', 
    icon: <FiUsers />, 
    color: 'blue' 
  },
  { 
    id: 4, 
    label: 'Conversion Rate', 
    value: '2.48%', 
    change: '-3.2%', 
    trend: 'down', 
    icon: <FiActivity />, 
    color: 'amber' 
  }
];

const SALES_REVENUE = [
  { label: 'Jan', value: 12400 },
  { label: 'Feb', value: 15300 },
  { label: 'Mar', value: 11200 },
  { label: 'Apr', value: 18900 },
  { label: 'May', value: 22100 },
  { label: 'Jun', value: 25400 }
];

const VISITOR_TRAFFIC = [
  { label: 'Jan', value: 8500 },
  { label: 'Feb', value: 12100 },
  { label: 'Mar', value: 9400 },
  { label: 'Apr', value: 15200 },
  { label: 'May', value: 18100 },
  { label: 'Jun', value: 20600 }
];

const CATEGORY_SHARE = [
  { label: 'Electronics', value: 540, color: '#3b82f6' },
  { label: 'Furniture', value: 310, color: '#14b8a6' },
  { label: 'Accessories', value: 240, color: '#a855f7' },
  { label: 'Clothing', value: 180, color: '#f59e0b' }
];

const RECENT_ACTIVITIES = [
  { id: 'act-1', user: 'Lazizbek Khasanov', action: 'added a new product "Quantum Leap Monitor"', time: '12 min ago', type: 'product' },
  { id: 'act-2', user: 'Dilnoza Salimova', action: 'updated role of Sherzod Alimov to Editor', time: '1 hour ago', type: 'user' },
  { id: 'act-3', user: 'System', action: 'completed database replication cycle', time: '2 hours ago', type: 'system' },
  { id: 'act-4', user: 'Otabek Rasulov', action: 'signed in from a new IP location (195.25.10.12)', time: '4 hours ago', type: 'security' }
];

interface ChecklistItem {
  id: number;
  label: string;
  checked: boolean;
}

const Dashboard: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 1, label: 'Run weekly database indexing routine', checked: true },
    { id: 2, label: 'Verify SSL certificate renewal parameters', checked: false },
    { id: 3, label: 'Clear cache indexes of deleted items', checked: true },
    { id: 4, label: 'Audit active moderator access privileges logs', checked: false }
  ]);

  const toggleChecklistItem = (id: number) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="dashboard-welcome">
        <h1>Overview Workspace</h1>
        <p>Real-time analytics metrics and dashboard health monitoring.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        {METRICS.map((metric) => (
          <div key={metric.id} className="card metric-card">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <div className={`metric-icon-wrap ${metric.color}`}>
                {metric.icon}
              </div>
            </div>
            <div className="metric-body">
              <h2 className="metric-value">{metric.value}</h2>
              <div className={`metric-trend ${metric.trend}`}>
                {metric.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{metric.change}</span>
                <span className="trend-lbl">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="charts-grid">
        <div className="card chart-card area-chart-wrap">
          <AreaChart 
            data1={SALES_REVENUE} 
            data2={VISITOR_TRAFFIC} 
            title1="Revenue Sales Analytics" 
            title2="Visitor Web Traffic" 
          />
        </div>
        <div className="card chart-card doughnut-chart-wrap">
          <DoughnutChart 
            data={CATEGORY_SHARE} 
            title="Product Sales Distribution" 
          />
        </div>
      </div>

      {/* System Resources & Task Audit Checklist Grid */}
      <div className="system-monitor-grid">
        {/* System Resources Usage Monitor */}
        <div className="card resource-card">
          <div className="card-heading-row">
            <FiCpu />
            <h3>System Status Monitor</h3>
          </div>
          <div className="resource-bars-stack">
            <div className="bar-item">
              <div className="bar-info">
                <span>CPU Load (Xeon E5)</span>
                <span>45%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill blue" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="bar-item">
              <div className="bar-info">
                <span>Memory Pool (DDR4)</span>
                <span>68%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill teal" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="bar-item">
              <div className="bar-info">
                <span>Disk Storage (NVMe SSD)</span>
                <span>34%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill amber" style={{ width: '34%' }}></div>
              </div>
            </div>

            <div className="status-footer">
              <span className="status-dot success"></span>
              <span>All database clusters operating normally</span>
            </div>
          </div>
        </div>

        {/* Operational Checklist */}
        <div className="card checklist-card">
          <div className="card-heading-row">
            <FiCheckSquare />
            <h3>Daily Operations Checklist</h3>
          </div>
          <div className="checklist-stack">
            {checklist.map(item => (
              <label key={item.id} className="checklist-item-label">
                <input 
                  type="checkbox" 
                  checked={item.checked} 
                  onChange={() => toggleChecklistItem(item.id)} 
                />
                <span className="checkmark-box"></span>
                <span className={`text-label ${item.checked ? 'completed' : ''}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card activity-card">
        <div className="card-header">
          <h3>Recent Operations Logs</h3>
          <span className="badge badge-info">Active Session</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Operator</th>
                <th>Action details</th>
                <th>Timestamp</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITIES.map((act) => (
                <tr key={act.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.user}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{act.action}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{act.time}</td>
                  <td>
                    <span className={`badge badge-${
                      act.type === 'product' ? 'success' : 
                      act.type === 'user' ? 'info' : 
                      act.type === 'system' ? 'warning' : 'danger'
                    }`}>
                      {act.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
