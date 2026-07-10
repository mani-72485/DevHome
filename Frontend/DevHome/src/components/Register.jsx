import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  UserPlus, 
  Home as HomeIcon, 
  BarChart3, 
  PieChart, 
  FileText,
  ShieldCheck,
  LockKeyhole,
  Headphones,
  Fingerprint
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    user_name: "", 
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerUser = async (e) => {
  e.preventDefault();

  if (form.password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post(
      `${API_URL}/devhome/`,
      form
    );

    alert(response.data.message);
    navigate("/login");

  } catch (err) {

    if (err.response && err.response.data) {
      alert(err.response.data.message);
    } else {
      alert("Something went wrong. Please try again.");
    }

    console.error(err);
  }
};

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      
      {/* LEFT SIDE PANEL: Branding & Image Showcase */}
      <div 
        className="hidden lg:flex lg:w-[42%] bg-[#0B1528] relative text-white flex-col justify-between p-12 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80')` }}
      >
        {/* Dark Tint Overlay to replicate img124.png opacity */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1528]/95 via-[#0B1528]/85 to-[#0B1528]/95" />

        <div className="relative z-10 space-y-12">
          {/* Brand Logo Header */}
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <HomeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block text-white">DEVIL<span className="text-orange-500">HOME</span></span>
              <span className="text-[10px] text-slate-400 block -mt-1 tracking-wide">Build Smart. Track Every Rupee.</span>
            </div>
          </div>

          {/* Core Marketing Copy */}
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Track Every Expense. <br />
              Build Your <span className="text-orange-500">Dream Home.</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Devil Home helps you manage your construction budget, track expenses, store bills, and stay in control of your dream home.
            </p>
          </div>

          {/* Bullet Feature Set */}
          <div className="space-y-6 pt-2">
            <div className="flex gap-4">
              <div className="p-2.5 bg-white/5 border border-white/10 text-orange-500 rounded-xl h-fit">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Track Expenses</h4>
                <p className="text-xs text-slate-400 mt-0.5">Add and track all construction expenses in one place.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2.5 bg-white/5 border border-white/10 text-orange-500 rounded-xl h-fit">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Manage Budget</h4>
                <p className="text-xs text-slate-400 mt-0.5">Set budgets, compare, and stay on track.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2.5 bg-white/5 border border-white/10 text-orange-500 rounded-xl h-fit">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Store Bills</h4>
                <p className="text-xs text-slate-400 mt-0.5">Upload and store all your bills and receipts digitally.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Graphic Accent at Bottom */}
        <div className="relative z-10 text-[11px] text-slate-500 font-medium">
          © {new Date().getFullYear()} DEVILHOME. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE PANEL: Detailed Register Form */}
      <div className="w-full lg:w-[58%] flex flex-col justify-between p-6 sm:p-12 relative overflow-y-auto">
        
        {/* Redirect Header Element */}
        <div className="flex justify-end items-center gap-3 text-sm font-medium mb-6 lg:mb-0">
          <span className="text-slate-500">Already have an account?</span>
          <button 
            onClick={() => navigate("/login")}
            className="border border-orange-500 text-orange-500 hover:bg-orange-500/5 px-4 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer"
          >
            Login
          </button>
        </div>

        {/* Central Registration Card Wrapper */}
        <div className="max-w-xl w-full mx-auto my-auto bg-white border border-slate-100 rounded-2xl p-6 sm:p-10 shadow-sm">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Create Your Account</h3>
            <p className="text-xs text-slate-400 mt-0.5">Join Devil Home and start building smart.</p>
          </div>

          <form onSubmit={registerUser} className="space-y-4">
            
            {/* Full Name field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Mobile number field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your mobile number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Username field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Username</label>
              <div className="relative">
                <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="user_name"
                  placeholder="Choose a unique username"
                  value={form.user_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password input with toggle hidden visibility functionality */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms and conditions verification checkbox */}
            

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-orange-500/10 transition-all mt-4 cursor-pointer text-sm"
            >
              Create Account
            </button>
          </form>

          {/* Social Sign Up Partition divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">or register with</span>
          </div>

          {/* Social OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.56 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 6.84 8.74 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.45h6.45c-.28 1.47-1.11 2.72-2.35 3.55l3.6 2.8c2.1-1.94 3.3-4.8 3.3-8.45z"/>
                <path fill="#34A853" d="M5.1 14.3c-.23-.68-.35-1.4-.35-2.15s.12-1.47.35-2.15L1.5 7.2C.54 9.12 0 11.25 0 13.5s.54 4.38 1.5 6.3l3.6-2.8z"/>
                <path fill="#FBBC05" d="M12 23c3.24 0 5.97-1.07 7.96-2.9l-3.6-2.8c-1.1.74-2.5 1.18-4.36 1.18-3.26 0-5.99-1.8-6.97-4.46l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-2 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

        </div>

        {/* Global Footer trust features indicators block */}
        <div className="flex justify-center items-center gap-6 text-[11px] font-semibold text-slate-400 mt-6 pt-4 border-t border-slate-100">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-slate-300" /> Secure & Safe</span>
          <span className="h-3 w-[1px] bg-slate-200" />
          <span className="flex items-center gap-1.5"><LockKeyhole className="w-4 h-4 text-slate-300" /> Your Data is Protected</span>
          <span className="h-3 w-[1px] bg-slate-200" />
          <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4 text-slate-300" /> 24/7 Support</span>
        </div>

      </div>

    </div>
  );
}

export default Register;