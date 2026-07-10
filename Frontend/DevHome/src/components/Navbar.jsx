import { useNavigate, useLocation } from "react-router-dom"; // Updated: Added useLocation
import { useEffect, useState } from "react";
import {
  Home as HomeIcon,
  LogIn,
  ArrowRight,
  FolderPlus,
  Wallet,
  FolderOpen,
  LogOut,
  Menu, 
  X,    
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Updated: Initialized the location hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  useEffect(() => {
    // This effect now re-runs every time the user navigates to a new page/route
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, [location]); // Updated: Added location as a dependency

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); 
  };

  return (
    <nav className="bg-[#0B1528] text-white py-4 px-6 md:px-12 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNavigation("/")}
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

        {/* --- DESKTOP NAVIGATION --- */}
        {isLoggedIn ? (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => handleNavigation("/new-project")}
              className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              Add Project
            </button>

            <button
              onClick={() => handleNavigation("/profile")}
              className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => handleNavigation("/get-projects")}
              className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              See Projects
            </button>
            
            <button
              onClick={() => handleNavigation("/changepassword")}
              className="hover:text-orange-500 flex items-center gap-2 cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              Change Password
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
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
            
            <div className="flex items-center gap-4 ml-4">
              <button
                onClick={() => handleNavigation("/login")}
                className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl hover:bg-slate-800"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>

              <button
                onClick={() => handleNavigation("/register")}
                className="flex items-center gap-2 px-5 py-2 bg-orange-500 rounded-xl hover:bg-orange-600"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* --- MOBILE/TABLET HAMBURGER BUTTON --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none p-1"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE/TABLET DROPDOWN MENU --- */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-slate-800 flex flex-col gap-4 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => handleNavigation("/new-project")}
                className="hover:text-orange-500 flex items-center gap-3 py-2"
              >
                <FolderPlus className="w-5 h-5" />
                Add Project
              </button>

              <button
                onClick={() => handleNavigation("/profile")}
                className="hover:text-orange-500 flex items-center gap-3 py-2"
              >
                <Wallet className="w-5 h-5" />
                Profile
              </button>

              <button
                onClick={() => handleNavigation("/get-projects")}
                className="hover:text-orange-500 flex items-center gap-3 py-2"
              >
                <FolderOpen className="w-5 h-5" />
                See Projects
              </button>

              <button
                onClick={() => handleNavigation("/changepassword")}
                className="hover:text-orange-500 flex items-center gap-3 py-2"
              >
                <FolderOpen className="w-5 h-5" />
                Change Password
              </button>

              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold w-full mt-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-orange-500 py-1">Home</a>
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-white py-1">Features</a>
              <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-white py-1">How It Works</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="hover:text-white py-1">Pricing</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-white py-1">About Us</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-white py-1">Contact</a>
              
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-700 rounded-xl hover:bg-slate-800 w-full"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </button>

                <button
                  onClick={() => handleNavigation("/register")}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 rounded-xl hover:bg-orange-600 w-full"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;