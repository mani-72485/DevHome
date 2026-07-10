import API_URL from "./api";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  Calendar,
  Briefcase,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Construction,
} from "lucide-react";

function AddLabour() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectId = location.state?.projectId || "";
  const today = new Date().toISOString().split("T")[0];

  const emptyForm = () => ({
    project_id: projectId,
    labour_name: "",
    contractor_name: "",
    working_date: today,
    category: "",
  });

  const [formData, setFormData] = useState([emptyForm()]);
  const [loading, setLoading] = useState(false);

  const handleChange = (index, e) => {
    const updated = [...formData];
    updated[index][e.target.name] = e.target.value;
    setFormData(updated);
  };

  const addLabourForm = () => {
    setFormData([...formData, emptyForm()]);
  };

  const removeLabourForm = (index) => {
    const updated = [...formData];
    updated.splice(index, 1);
    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      

      const response = await axios.post(
        `${API_URL}/labourmanagement/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Labours added successfully.");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to add labour records.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden py-12 px-4 sm:px-6">
      {/* Structural Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-gradient-to-b from-blue-50/70 via-indigo-50/40 to-transparent -z-10 rounded-b-[40px]" />

      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200">
              <Construction size={22} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Add Labour Logs
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Log daily attendance and tasks for workforce orchestration
              </p>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="popLayout">
            {formData.map((labour, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 relative group hover:border-slate-300 transition-all duration-300"
              >
                {/* Individual Form Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                    <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase text-xs">
                      Labour Record #{index + 1}
                    </h2>
                  </div>

                  {formData.length > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => removeLabourForm(index)}
                      className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/70 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    >
                      <Trash2 size={14} />
                      Remove
                    </motion.button>
                  )}
                </div>

                <input type="hidden" name="project_id" value={labour.project_id} />

                {/* Form Elements Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Labour Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Labour Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 text-slate-400 group-hover:text-slate-500 transition-colors" size={18} />
                      <input
                        type="text"
                        name="labour_name"
                        value={labour.labour_name}
                        onChange={(e) => handleChange(index, e)}
                        required
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Contractor Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Contractor Name</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="contractor_name"
                        value={labour.contractor_name}
                        onChange={(e) => handleChange(index, e)}
                        required
                        placeholder="Apex Builds Ltd."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-800 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Working Date Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Working Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                      <input
                        type="date"
                        name="working_date"
                        max={today}
                        value={labour.working_date}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Category Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Category / Specialization</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                      <select
                        name="category"
                        value={labour.category}
                        onChange={(e) => handleChange(index, e)}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-slate-800 text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        <option value="Builder">Builder</option>
                        <option value="Painting">Painting</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Flooring">Flooring</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Action Callout Controls */}
          <div className="pt-2 space-y-4">
            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={addLabourForm}
              className="w-full bg-white hover:bg-slate-50 border-2 border-dashed border-slate-300 hover:border-slate-400 text-slate-700 py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-sm"
            >
              <Plus size={16} className="text-slate-500" />
              Add Another Labour Log
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01, translateY: -1 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className={`w-full text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl transition-all ${
                loading 
                  ? "bg-slate-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20"
              }`}
            >
              <Save size={16} className={loading ? "animate-pulse" : ""} />
              {loading ? "Processing & Syncing..." : "Commit All Labour Records"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddLabour;