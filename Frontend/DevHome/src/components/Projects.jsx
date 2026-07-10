import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Assumes you are using react-router-dom for navigation
import axios from "axios";
import { Calendar, DollarSign, Layers, CheckCircle2, AlertCircle, Clock, PauseCircle } from "lucide-react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const token = localStorage.getItem("accessToken");

    // Session validation check
    if (!token) {
      alert("Session expired. You need to log in.");
      navigate("/login"); // Redirects directly to your login page route
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/get_projects/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error(error);
      // If backend returns a 401 Unauthorized status, handle expired token
      if (error.response && error.response.status === 401) {
        alert("Session expired. You need to log in.");
        localStorage.removeItem("accessToken"); // clear bad token
        navigate("/login");
      } else {
        alert("Unable to fetch projects.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to color-code status badges beautifully
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse">
            <Clock className="h-3.5 w-3.5" /> In Progress
          </span>
        );
      case "On Hold":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <PauseCircle className="h-3.5 w-3.5" /> On Hold
          </span>
        );
      default: // Planning
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-300 border border-slate-600/30">
            <Layers className="h-3.5 w-3.5" /> Planning
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 sm:p-10 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              My Active Deployments
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Overview of your registered architecture and construction nodes.
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/new-project")} // Optional link to your form page
            className="self-start sm:self-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold py-2.5 px-5 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            + Create New Project
          </button>
        </div>

        {/* Loading State Skeleton Containers */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-800/30 rounded-2xl border border-slate-800 p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded-lg w-2/3"></div>
                <div className="h-4 bg-slate-700/30 rounded-lg w-1/3"></div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-10 bg-slate-700/20 rounded-xl"></div>
                  <div className="h-10 bg-slate-700/20 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          
          /* Beautiful Empty State */
          <div className="text-center py-20 bg-slate-800/20 backdrop-blur-md rounded-2xl border border-dashed border-slate-800 max-w-xl mx-auto p-8 animate-fadeIn">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <h4 className="text-xl font-bold text-slate-300">No Projects Initialized</h4>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              Your tracking repository is empty. Launch your first build blueprint to begin monitoring metrics.
            </p>
          </div>
        ) : (
          
          /* Beautiful Cards Grid Container */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {projects.map((project) => (
              <div 
                key={project.project_id || project.id} 
                 onClick={() => navigate(`/project/${project.project_id}`)}
                className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Subtle top decorative light streak */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Top Row: Name and Status */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors duration-200">
                      {project.project_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Layers className="h-3 w-3" /> Size: <span className="text-slate-400 font-medium">{project.plot_size}</span>
                    </p>
                  </div>
                  <div>
                    {getStatusBadge(project.project_status)}
                  </div>
                </div>

                {/* Info Metrics Sub-containers */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800/60">
                  
                  {/* Budget Segment */}
                  <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/50">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1 font-medium">
                      <DollarSign className="h-3 w-3 text-emerald-400" /> Valuation
                    </span>
                    <p className="text-base font-bold text-slate-200 mt-1">
                      {project.estimated_cost}
                    </p>
                  </div>

                  {/* Timeline Segment */}
                  <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-800/50">
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="h-3 w-3 text-indigo-400" /> Timeline Range
                    </span>
                    <div className="text-xs font-semibold text-slate-300 mt-1 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-normal">Start:</span>
                        <span>{project.construction_start_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-normal">Est:</span>
                        <span className="text-indigo-300">{project.expected_completion_date}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Projects;