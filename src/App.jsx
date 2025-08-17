import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AttendancePage from './pages/AttendancePage';
import AttendanceEntryPage from './pages/AttendanceEntryPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="container">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/attendance" element={<AttendanceEntryPage />} />
            <Route path="/attendance-logs" element={<AttendancePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
