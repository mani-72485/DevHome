import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Users, Calendar, Briefcase, User, Search, RefreshCw, Folder } from "lucide-react";
import API_URL from "./api";

function GetLabour() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.state?.projectId || "";
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLabours(selectedDate);
  }, [selectedDate]);

  const fetchLabours = async (date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_URL}/get_labour/${projectId}/`,
        {
          params: { working_date: date },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLabours(response.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch labour details.");
    } finally {
      setLoading(false);
    }
  };

  // Live filter feature for an even better user experience
  const filteredLabours = labours.filter(
    (labour) =>
      labour.labour_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.contractor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labour.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans antialiased pb-12">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-200"
          >
            <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Projects</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm animate-fade-in">
            <Folder size={14} />
            <span>Project ID: {projectId || "N/A"}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Labour Attendance & Allocation
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor, search, and verify workforce deployment data.
            </p>
          </div>

          {/* Quick Stats Banner if records exist */}
          {!loading && labours.length > 0 && (
            <div className="flex gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm self-start">
              <div className="text-center px-4 border-r border-slate-100">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Active</span>
                <span className="text-xl font-bold text-slate-800">{labours.length}</span>
              </div>
              <div className="text-center px-4">
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Matches</span>
                <span className="text-xl font-bold text-blue-600">{filteredLabours.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Controls Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 transform transition-all hover:shadow-md duration-300">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 max-w-3xl">
            {/* Live Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by labour, contractor, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading || labours.length === 0}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-60 disabled:bg-slate-100"
              />
            </div>

            {/* Date Input */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  max={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto pl-4 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-slate-700"
                />
              </div>
              <button
                onClick={() => fetchLabours(selectedDate)}
                title="Refresh Page"
                className="p-2.5 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 transition-all duration-200"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Display Logic */}
        {loading ? (
          /* Shimmer/Skeleton Loading State */
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white h-16 rounded-xl border border-slate-200/60 animate-pulse flex items-center justify-between px-6">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                  <div className="w-32 h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-20 h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredLabours.length === 0 ? (
          /* Refined Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-sm max-w-md mx-auto my-12 transform transition-all duration-300 hover:scale-[1.01]">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4 shadow-inner">
              <Users size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Workforce Records</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              {labours.length === 0 
                ? "No entries logged for this specific operational date." 
                : "No matching workforce elements align with your text filters."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-16">#</th>
                    <th className="py-4 px-6">Labour Name</th>
                    <th className="py-4 px-6">Contractor / Agency</th>
                    <th className="py-4 px-6">Category / Trade</th>
                    <th className="py-4 px-6 text-right">Working Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-sm text-slate-700">
                  {filteredLabours.map((labour, index) => (
                    <tr 
                      key={labour.id || index} 
                      className="group hover:bg-blue-50/40 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-center font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 rounded-lg transition-colors">
                            <User size={16} />
                          </div>
                          {labour.labour_name}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Users size={15} className="text-slate-400" />
                          {labour.contractor_name}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-800 rounded-md border border-slate-200/60 transition-colors">
                          <Briefcase size={13} />
                          {labour.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-slate-500">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <Calendar size={14} className="text-slate-400" />
                          {labour.working_date}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive List Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredLabours.map((labour, index) => (
                <div 
                  key={labour.id || index} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 transform active:scale-[0.99] transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <User size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{labour.labour_name}</h4>
                        <span className="text-xs text-slate-400 font-medium">Record #{index + 1}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200">
                      {labour.category}
                    </span>
                  </div>
                  
                  <hr className="border-slate-100" />
                  
                  <div className="grid grid-cols-2 gap-y-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block font-medium mb-0.5">Contractor</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Users size={13} className="text-slate-400" /> {labour.contractor_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block font-medium mb-0.5">Date</span>
                      <span className="font-semibold text-slate-700 inline-flex items-center gap-1 justify-end">
                        <Calendar size={13} className="text-slate-400" /> {labour.working_date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default GetLabour;