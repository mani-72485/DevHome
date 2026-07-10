import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Maximize2, 
  Activity, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  PlusCircle
} from "lucide-react";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        handleLogout();
        return;
      }

      const response = await axios.get(
        `${API_URL}/project/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setProject(response.data.data);
        setTimeout(() => setIsLoaded(true), 50);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);

      if (err.response && err.response.status === 401) {
        alert("Session expired. Please login again.");
        handleLogout();
      } else if (err.response && err.response.status === 404) {
        alert("Project not found.");
        navigate("/projects");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname.startsWith(path);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium tracking-wide animate-pulse">Loading project data...</p>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    const normalStatus = status?.toLowerCase() || "";
    if (normalStatus.includes("complete") || normalStatus.includes("done")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (normalStatus.includes("progress") || normalStatus.includes("active")) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
    return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  };

  // Nav link configuration with current project ID context passed via state
  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Projects", icon: FolderKanban, alternatePath: "/project" },
    { path: "/addexpenses", label: "Add Expenses", icon: ClipboardList, state: { projectId: id } },
    { path: "/addlabour", label: "Add Labour", icon: ClipboardList, state: { projectId: id } },
    { path: "/get_labour", label: "Get Labour", icon: ClipboardList, state: { projectId: id } },
   { path: "/expenses_dashboard", label: "Expense Dashboard", icon: ClipboardList, state: { projectId: id } },
     { path: "/expense_tracker", label: "Expense tracker", icon: ClipboardList, state: { projectId: id } },


  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row relative selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Mobile Top Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-900 sticky top-0 z-50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Navigation</span>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Side Navigation Bar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900/30 backdrop-blur-xl border-r border-slate-900/80 p-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:h-screen
        ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="space-y-2 mt-4 md:mt-0">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const linkActive = isActive(link.path) || (link.alternatePath && isActive(link.alternatePath));
            return (
              <Link
                key={link.path}
                to={link.path}
                state={link.state || null}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  linkActive 
                    ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${linkActive ? "text-emerald-400" : "text-slate-400 group-hover:scale-110 group-hover:text-slate-200"}`} />
                {link.label}
                {linkActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-800/60 pt-4 mt-auto space-y-2">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs uppercase border border-emerald-500/10">
              {user.username?.substring(0, 2) || <User className="w-4 h-4" />}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate">{user.username || "User Session"}</span>
              <span className="text-[10px] text-slate-500 truncate">Active</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-rose-400/80 group-hover:translate-x-0.5 transition-transform" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06),transparent_50%)] pointer-events-none" />

        <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-700 transform ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          
          <button 
            onClick={() => navigate(-1)}
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Projects
          </button>

          <header className="mb-10 border-b border-slate-800/60 pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Project Overview
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight mt-3 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {project.project_name}
              </h1>
            </div>
            
            <div className="flex items-center gap-3 self-start sm:self-center">
              <button
                onClick={() => navigate("/addexpenses", { state: { projectId: id } })}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-emerald-500/10 active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Add Expense
              </button>
              <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusStyles(project.project_status)}`}>
                {project.project_status}
              </div>
            </div>
          </header>

          {/* Container Clickable Shortcut Area */}
          <div 
            onClick={() => navigate("/addexpenses", { state: { projectId: id } })}
            className="cursor-pointer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Card: Plot Size */}
            <div className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Plot Size</h3>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100 tracking-tight">{project.plot_size}</p>
            </div>

            {/* Card: Estimated Cost */}
            <div className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Estimated Cost</h3>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100 tracking-tight">{project.estimated_cost}</p>
            </div>

            {/* Card: Status Indicator */}
            <div className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Current Status</h3>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-100 tracking-tight">{project.project_status}</p>
            </div>

            {/* Card: Construction Start */}
            <div className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Construction Start</h3>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xl font-semibold text-slate-200 tracking-tight">{project.construction_start_date}</p>
            </div>

            {/* Card: Expected Completion */}
            <div className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Expected Completion</h3>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xl font-semibold text-slate-200 tracking-tight">{project.expected_completion_date}</p>
            </div>

            {/* Card: Construction End */}
            <div className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/60 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Construction End</h3>
                <div className="p-2 rounded-xl bg-slate-800/80 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-xl font-semibold tracking-tight ${project.construction_end_date ? "text-slate-200" : "text-slate-500 italic"}`}>
                {project.construction_end_date ?? "Not Completed"}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ProjectDetails;