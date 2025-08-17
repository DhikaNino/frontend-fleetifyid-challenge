import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI, departmentAPI, attendanceAPI } from '../services/api';
import { format } from 'date-fns';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    todayAttendance: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll(),
        attendanceAPI.getAll({ start_date: format(new Date(), 'yyyy-MM-dd') })
      ]);

      const employees = employeesRes.data.data || employeesRes.data;
      const departments = departmentsRes.data.data || departmentsRes.data;
      const todayAttendance = attendanceRes.data.data || attendanceRes.data;

      setStats({
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        todayAttendance: todayAttendance.length,
        recentActivities: todayAttendance.slice(0, 5) 
      });
    } catch (err) {
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Tepat Waktu': { bg: '#dcfce7', color: '#166534', text: 'Tepat Waktu' },
      'Terlambat': { bg: '#fef3c7', color: '#92400e', text: 'Terlambat' },
      'Pulang lebih awal': { bg: '#dbeafe', color: '#1e40af', text: 'Pulang lebih awal' },
    };

    const statusConfig = statusColors[status] || { bg: '#f3f4f6', color: '#374151', text: status };

    return (
      <span
        style={{
          backgroundColor: statusConfig.bg,
          color: statusConfig.color,
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '500'
        }}
      >
        {statusConfig.text}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Memuat dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Dashboard sistem manajemen karyawan</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => navigate('/attendance-entry')}>
            Absensi Cepat
          </button>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
          <button 
            onClick={() => setError(null)}
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" fill="#1e40af"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalEmployees}</h3>
            <p className="stat-label">Total Karyawan</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.totalDepartments}</h3>
            <p className="stat-label">Departemen</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.todayAttendance}</h3>
            <p className="stat-label">Absensi Hari Ini</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f3e8ff' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.recentActivities.length}</h3>
            <p className="stat-label">Aktivitas Terbaru</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Aktivitas Terbaru</h2>
        <div className="activities-list">
          {stats.recentActivities.length === 0 ? (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ color: '#9ca3af' }}>
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
                             <p>Tidak ada aktivitas terbaru</p>
            </div>
          ) : (
            stats.recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.attendance_type === 1 ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#10b981' }}>
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: '#f59e0b' }}>
                      <path d="M18 9l-6 6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="activity-content">
                                     <p className="activity-text">
                     <strong>{activity.employee_name}</strong> {activity.attendance_type === 1 ? 'masuk' : 'keluar'}
                   </p>
                  <p className="activity-time">
                    {format(new Date(activity.date_attendance), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
                <div className="activity-status">
                  {getStatusBadge(activity.status_ketepatan)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Navigasi</h2>
        <div className="quick-actions">
          <button 
            className="quick-action-btn"
            onClick={() => navigate('/attendance-entry')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
                         <span>Catat Absensi</span>
          </button>
          
          <button 
            className="quick-action-btn"
            onClick={() => navigate('/employees')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
                         <span>Kelola Karyawan</span>
          </button>
          
          <button 
            className="quick-action-btn"
            onClick={() => navigate('/departments')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
                         <span>Kelola Departemen</span>
          </button>
          
          <button 
            className="quick-action-btn"
            onClick={() => navigate('/attendance')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
                         <span>Lihat Laporan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
