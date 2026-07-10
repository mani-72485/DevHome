import { Routes, Route } from "react-router-dom";
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
import Footer from "./components/Footer"; // 1. Import the Footer

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/new-project" element={<ProjectForm />} />
        <Route path="/get-projects" element={<Projects />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/addexpenses" element={<AddExpenses />} />
        <Route path="/addlabour" element={<AddLabour />} />
        <Route path="/get_labour" element={<GetLabour />} />
        <Route path="/expenses_dashboard" element={<ExpensesDashboard />} />
        <Route path="/expense_tracker" element={<ExpenseTracker />} />
        <Route path="/changepassword" element={<ChangePassword />} />
      </Routes>
      <Footer /> {/* 2. Place it here */}
    </>
  );
}

export default App;