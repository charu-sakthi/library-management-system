import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BooksProvider } from './context/BooksContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AddBookPage from './pages/AddBookPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EditBookPage from './pages/EditBookPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ManageBooksPage from './pages/ManageBooksPage.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BooksProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <ManageBooksPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/books/add"
                element={
                  <ProtectedRoute>
                    <AddBookPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/books/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditBookPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </BooksProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
