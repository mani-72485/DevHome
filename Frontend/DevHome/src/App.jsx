import { Routes, Route, Navigate } from "react-router-dom"; // Updated: Added Navigate
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import ProjectForm from "./components/NewProject";
import Projects from "./components/Projects";
import ProjectDetails from "./components/ProjectDetails";
import AddExpenses from "./components/AddExpenses";
import AddLabour from "./components/AddLabour";
import GetLabour from "./components/GetLabour";
import ExpensesDashboard from "./components/ExpensesDashboard";
import ExpenseTracker from "./components/ExpenseTracker";
import ChangePassword from "./components/changepassword";
import Footer from "./components/Footer"; 

// Helper wrapper to redirect logged-in users away from public pages (Home, Login, Register)
function PublicRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

// Optional Helper wrapper to protect internal pages from unauthorized users
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes: If logged in, these automatically redirect to /dashboard */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes: Require token to view */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/new-project" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
        <Route path="/get-projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        <Route path="/addexpenses" element={<ProtectedRoute><AddExpenses /></ProtectedRoute>} />
        <Route path="/addlabour" element={<ProtectedRoute><AddLabour /></ProtectedRoute>} />
        <Route path="/get_labour" element={<ProtectedRoute><GetLabour /></ProtectedRoute>} />
        <Route path="/expenses_dashboard" element={<ProtectedRoute><ExpensesDashboard /></ProtectedRoute>} />
        <Route path="/expense_tracker" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      </Routes>
      <Footer /> 
    </>
  );
}

export default App;