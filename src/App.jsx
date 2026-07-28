import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TreatmentsPage from './pages/TreatmentsPage';
import DoctorsPage from './pages/DoctorsPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import BookingsPage from './pages/BookingsPage';
import CallbacksPage from './pages/CallbacksPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="treatments" element={<TreatmentsPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="case-studies" element={<CaseStudiesPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="callbacks" element={<CallbacksPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
