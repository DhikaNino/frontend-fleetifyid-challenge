import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';
import DialogComponent from '../components/Dialog';

const AttendanceEntryPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [attendanceType, setAttendanceType] = useState('in');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data || response.data);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async (employee) => {
    setSelectedEmployee(employee);
    setAttendanceType('in');
    setDialogOpen(true);
  };

  const handleClockOut = async (employee) => {
    setSelectedEmployee(employee);
    setAttendanceType('out');
    setDialogOpen(true);
  };

  const handleSubmitAttendance = async () => {
    try {
      if (attendanceType === 'in') {
        await attendanceAPI.attendanceIn({ employee_id: selectedEmployee.employee_id });
        setSuccess(`${selectedEmployee.name} berhasil masuk!`);
      } else {
        await attendanceAPI.attendanceOut({ employee_id: selectedEmployee.employee_id });
        setSuccess(`${selectedEmployee.name} berhasil keluar!`);
      }
      setDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError(err.response.data.message || `Gagal ${attendanceType === 'in' ? 'masuk' : 'keluar'}. Silakan coba lagi.`);
      console.error('Error submitting attendance:', err);
    }
  };

  const columns = [
    { key: 'employee_id', label: 'ID Karyawan' },
    { key: 'name', label: 'Nama' },
    { key: 'address', label: 'Alamat' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClockIn(row);
            }}
          >
            Masuk
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClockOut(row);
            }}
          >
            Keluar
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="loading">Memuat karyawan...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Absensi</h1>
                  <p className="page-subtitle">Pilih karyawan untuk absensi masuk atau keluar</p>
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

      {success && (
        <div className="success">
          {success}
          <button 
            onClick={() => setSuccess(null)}
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                  Tidak ada karyawan tersedia
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.employee_id}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(employee[column.key], employee) : employee[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DialogComponent
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Konfirmasi ${attendanceType === 'in' ? 'Masuk' : 'Keluar'}`}
        description={`Apakah Anda yakin ingin mencatat ${selectedEmployee?.name} ${attendanceType === 'in' ? 'masuk' : 'keluar'}?`}
      >
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDialogOpen(false)}
          >
            Batal
          </button>
          <button 
            type="button" 
            className={`btn ${attendanceType === 'in' ? 'btn-primary' : 'btn-danger'}`}
            onClick={handleSubmitAttendance}
          >
            {attendanceType === 'in' ? 'Masuk' : 'Keluar'}
          </button>
        </div>
      </DialogComponent>
    </div>
  );
};

export default AttendanceEntryPage;
