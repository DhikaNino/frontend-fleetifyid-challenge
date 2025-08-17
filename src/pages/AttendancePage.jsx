import React, { useState, useEffect } from 'react';
import { attendanceAPI, departmentAPI } from '../services/api';
import { format } from 'date-fns';
import Table from '../components/Table';
import SelectComponent from '../components/Select';

const AttendancePage = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department_id: 'none',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    fetchDepartments();
    fetchAttendanceLogs();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data || response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.department_id && filters.department_id !== 'none') {
        params.departement_id = filters.department_id;
      }
      if (filters.start_date) {
        params.start_date = filters.start_date;
      }
      if (filters.end_date) {
        params.end_date = filters.end_date;
      }

      const response = await attendanceAPI.getAll(params);
      setAttendanceLogs(response.data.data || response.data);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
      console.error('Error fetching attendance logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchAttendanceLogs();
  };

  const handleClearFilters = () => {
    setFilters({
      department_id: 'none',
      start_date: '',
      end_date: ''
    });
  };

  const getDepartmentName = (departmentId) => {
    const department = (departments || []).find(d => d.id === departmentId);
    return department ? department.departement_name : 'Tidak Diketahui';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return format(new Date(dateTimeString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateTimeString;
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
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '500'
        }}
      >
        {statusConfig.text}
      </span>
    );
  };

  const columns = [
    { key: 'employee_id', label: 'ID Karyawan' },
    { key: 'employee_name', label: 'Nama Karyawan' },
    { 
      key: 'departement_name', 
      label: 'Departemen',
      render: (value) => value
    },
    { 
      key: 'date_attendance', 
      label: 'Tanggal',
      render: (value) => formatDate(value)
    },
    { 
      key: 'attendance_type', 
      label: 'Tipe',
      render: (value) => value === 1 ? 'Masuk' : 'Keluar'
    },
    { key: 'description', label: 'Deskripsi' },
    { 
      key: 'status_ketepatan', 
      label: 'Status',
      render: (value) => getStatusBadge(value)
    }
  ];

  const departmentOptions = [
    { value: 'none', label: 'Semua Departemen' },
    ...(departments || []).map(dept => ({
      value: dept.id.toString(),
      label: dept.departement_name
    }))
  ];

  if (loading) {
    return <div className="loading">Memuat log absensi...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Log Absensi</h1>
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

      <div className="filters">
        <div className="filter-group">
          <label className="form-label">Departemen</label>
          <SelectComponent
            value={filters.department_id}
            onValueChange={(value) => handleFilterChange('department_id', value)}
            options={departmentOptions}
            placeholder="Pilih departemen"
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Tanggal Mulai</label>
          <input
            type="date"
            className="form-input"
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">Tanggal Akhir</label>
          <input
            type="date"
            className="form-input"
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label className="form-label">&nbsp;</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-primary"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <Table 
        columns={columns} 
        data={attendanceLogs}
      />
    </div>
  );
};

export default AttendancePage;
