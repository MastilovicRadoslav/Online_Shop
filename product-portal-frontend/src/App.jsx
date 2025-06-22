import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminHome from "./pages/AdminHome";
import AdminProducts from "./pages/AdminProducts";
import CustomerDashboard from "./pages/CustomerDashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import CustomerProducts from "./pages/CustomerProducts"; // dodaj ovo

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<AdminHome />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route
            path="/customer-dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<CustomerProducts />} />
            <Route path="products" element={<CustomerProducts />} />
            <Route path="profile" element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
