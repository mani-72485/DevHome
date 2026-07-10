import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home as HomeIcon,
  LogIn,
  ArrowRight,
  FolderPlus,
  Wallet,
  FolderOpen,
  LogOut,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-[#0B1528] text-white py-4 px-6 md:px-12 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-orange-500 p-2 rounded-lg">
            <HomeIcon className="w-5 h-5 text-white" />
          </div>

          <div>
            <span className="font-black text-xl">
              DEVIL<span className="text-orange-500">HOME</span>
            </span>

            <span className="text-[10px] text-slate-400 block">
              Build Smart. Track Every Rupee.
            </span>
          </div>
        </div>

        {/* User Logged In */}
        {isLoggedIn ? (
          <>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">

              <button
                onClick={() => navigate("/new-project")}
                className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4" />
                Add Project
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
              >
                <Wallet className="w-4 h-4" />
                Profile
              </button>

              <button
                onClick={() => navigate("/get-projects")}
                className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                See Projects
              </button>
              <button
                onClick={() => navigate("/changepassword")}
                className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                Change Password
              </button>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Public Navbar */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#home" className="text-orange-500 border-b-2 border-orange-500 pb-1">
                Home
              </a>

              <a href="#features" className="hover:text-white">
                Features
              </a>

              <a href="#how-it-works" className="hover:text-white">
                How It Works
              </a>

              <a href="#pricing" className="hover:text-white">
                Pricing
              </a>

              <a href="#about" className="hover:text-white">
                About Us
              </a>

              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl hover:bg-slate-800"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="flex items-center gap-2 px-5 py-2 bg-orange-500 rounded-xl hover:bg-orange-600"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;