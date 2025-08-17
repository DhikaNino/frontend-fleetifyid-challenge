import React, { useState, useEffect, useMemo } from 'react';
import { departmentAPI } from '../services/api';
import Table from '../components/Table';
import DialogComponent from '../components/Dialog';
import Search from '../components/Search';
import Pagination from '../components/Pagination';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    max_clock_in: '',
    max_clock_out: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentAPI.getAll();
      setDepartments(response.data.data || response.data);
    } catch (err) {
      setError('Gagal memuat departemen. Silakan coba lagi.');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingDepartment(null);
    setFormData({ name: '', max_clock_in: '', max_clock_out: '' });
    setDialogOpen(true);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.departement_name,
      max_clock_in: department.max_clock_in_time,
      max_clock_out: department.max_clock_out_time
    });
    setDialogOpen(true);
  };

  const confirmDelete = (department) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await departmentAPI.delete(departmentToDelete.id);
      await fetchDepartments();
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
    } catch (err) {
      setError('Gagal menghapus departemen. Silakan coba lagi.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        departement_name: formData.name,
        max_clock_in_time: formData.max_clock_in,
        max_clock_out_time: formData.max_clock_out
      };
      
      if (editingDepartment) {
        await departmentAPI.update(editingDepartment.id, submitData);
      } else {
        await departmentAPI.create(submitData);
      }
      setDialogOpen(false);
      await fetchDepartments();
    } catch (err) {
      setError('Gagal menyimpan departemen. Silakan coba lagi.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    return departments.filter(department => 
      department.departement_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const paginatedDepartments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDepartments.slice(startIndex, endIndex);
  }, [filteredDepartments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatTime = (time) => {
    if (!time) return 'Belum diatur';
    return time;
  };

  const columns = [
    { key: 'departement_name', label: 'Nama Departemen' },
    { 
      key: 'max_clock_in_time', 
      label: 'Maksimal Masuk',
      render: (value) => formatTime(value)
    },
    { 
      key: 'max_clock_out_time', 
      label: 'Maksimal Keluar',
      render: (value) => formatTime(value)
    },
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
              confirmDelete(row);
            }}
          >
            Hapus
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="loading">Memuat departemen...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Data Departemen</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          Tambah Departemen
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
          placeholder="Cari departemen berdasarkan nama..."
          className="table-search"
        />
      </div>

      <Table 
        columns={columns} 
        data={paginatedDepartments}
        onRowClick={handleEdit}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={filteredDepartments.length}
        itemsPerPage={itemsPerPage}
        className="table-pagination"
      />

      <DialogComponent
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingDepartment ? 'Ubah Departemen' : 'Tambah Departemen'}
        description="Masukkan informasi departemen di bawah ini."
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Departemen</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Waktu Maksimal Masuk</label>
            <input
              type="time"
              className="form-input"
              value={formData.max_clock_in}
              onChange={(e) => handleInputChange('max_clock_in', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Waktu Maksimal Keluar</label>
            <input
              type="time"
              className="form-input"
              value={formData.max_clock_out}
              onChange={(e) => handleInputChange('max_clock_out', e.target.value)}
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
              {editingDepartment ? 'Perbarui' : 'Buat'}
            </button>
          </div>
        </form>
      </DialogComponent>

      <DialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Konfirmasi Hapus"
        description={`Apakah Anda yakin ingin menghapus departemen "${departmentToDelete?.departement_name}"?`}
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
            onClick={handleDelete}
          >
            Hapus
          </button>
        </div>
      </DialogComponent>
    </div>
  );
};

export default DepartmentsPage;
