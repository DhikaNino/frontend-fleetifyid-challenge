import React, { useState, useEffect, useMemo } from 'react';
import { employeeAPI, departmentAPI } from '../services/api';
import Table from '../components/Table';
import DialogComponent from '../components/Dialog';
import SelectComponent from '../components/Select';
import Search from '../components/Search';
import Pagination from '../components/Pagination';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department_id: '',
    address: ''
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, departmentsRes] = await Promise.all([
        employeeAPI.getAll(),
        departmentAPI.getAll()
      ]);
      setEmployees(employeesRes.data.data || employeesRes.data);
      setDepartments(departmentsRes.data.data || departmentsRes.data);
    } catch (err) {
      setError('Gagal memuat data. Silakan coba lagi.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setFormData({ name: '', department_id: 'none', address: '' });
    setDialogOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      department_id: employee.departement_id?.toString() || 'none',
      address: employee.address
    });
    setDialogOpen(true);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;
    try {
      await employeeAPI.delete(selectedEmployee.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError('Gagal menghapus karyawan. Silakan coba lagi.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        departement_id: formData.department_id === 'none' ? null : parseInt(formData.department_id)
      };
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.employee_id, submitData);
      } else {
        await employeeAPI.create(submitData);
      }
      setDialogOpen(false);
      await fetchData();
    } catch (err) {
      setError('Gagal menyimpan karyawan. Silakan coba lagi.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const getDepartmentName = (departmentId) => {
    const department = (departments || []).find(d => d.id === departmentId);
    return department ? department.departement_name : 'Tidak Diketahui';
  };

  const columns = [
    { key: 'employee_id', label: 'ID Karyawan' },
    { key: 'name', label: 'Nama' },
    {
      key: 'departement_id',
      label: 'Departemen',
      render: (value) => getDepartmentName(value)
    },
    { key: 'address', label: 'Alamat' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            Ubah
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            Hapus
          </button>
        </div>
      )
    }
  ];

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const departmentOptions = [
    { value: 'none', label: 'Pilih Departemen' },
    ...(departments || []).map(dept => ({
      value: dept.id.toString(),
      label: dept.departement_name
    }))
  ];

  if (loading) {
    return <div className="loading">Memuat karyawan...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Karyawan</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          Tambah Karyawan
        </button>
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

      <div className="table-controls">
        <Search 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari karyawan berdasarkan nama, ID, atau alamat..."
          className="table-search"
        />
      </div>

      <Table 
        columns={columns} 
        data={paginatedEmployees}
        onRowClick={handleEdit}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredEmployees.length}
        itemsPerPage={itemsPerPage}
        className="table-pagination"
      />

      <DialogComponent
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingEmployee ? 'Ubah Karyawan' : 'Tambah Karyawan'}
        description="Masukkan informasi karyawan di bawah ini."
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Departemen</label>
            <SelectComponent
              value={formData.department_id}
              onValueChange={(value) => handleInputChange('department_id', value)}
              options={departmentOptions}
              placeholder="Pilih departemen"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alamat</label>
            <textarea
              className="form-input"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              style={{ height: '80px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setDialogOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEmployee ? 'Perbarui' : 'Buat'}
            </button>
          </div>
        </form>
      </DialogComponent>

      <DialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Konfirmasi Hapus"
        description={`Apakah Anda yakin ingin menghapus ${selectedEmployee?.name}?`}
      >
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Batal
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={handleDeleteConfirm}
          >
            Hapus
          </button>
        </div>
      </DialogComponent>
    </div>
  );
};

export default EmployeesPage;
