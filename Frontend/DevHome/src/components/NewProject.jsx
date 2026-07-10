import React, { useState, useEffect } from 'react';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    user_id: '', // Dynamically retrieved from localStorage
    project_name: '',
    plot_size: '',
    constrution_start_date: '',
    expected_completion_date: '',
    project_status: 'Planning', 
    estimated_cost: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Retrieve user_id from localStorage on component mount
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    setFormData((prev) => ({
      ...prev,
      user_id: user.id,
    }));
  } else {
    console.warn("No user found in localStorage.");
  }
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Replace with your actual backend host domain if it's not localhost:8000
      // Django routers map router.register(r'newproject', NewProject) to /newproject/
      const response = await fetch('http://localhost:8000/newproject/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include an Authorization header if your Django backend uses Token/JWT auth
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        alert('Project saved successfully!');
        
        // Optional: Reset form fields (keeping user_id intact)
        setFormData((prev) => ({
          ...prev,
          project_name: '',
          plot_size: '',
          constrution_start_date: '',
          expected_completion_date: '',
          project_status: 'Planning',
          estimated_cost: '',
        }));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend validation errors:', errorData);
        alert(`Failed to save project: ${JSON.stringify(errorData) || response.statusText}`);
      }
    } catch (error) {
      console.error('Network error connecting to Django:', error);
      alert('Network error. Could not connect to the backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Container with a subtle fade-in and scale animation */}
      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-8 shadow-2xl transition-all duration-300 hover:border-slate-600 animate-fadeIn">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create New Project
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Fill in the details below to initialize your construction tracking node.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* USER_ID IS HIDDEN HERE */}
          <input type="hidden" name="user_id" value={formData.user_id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Name */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Project Name</label>
              <input
                type="text"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., Nexus Tower Alpha"
              />
            </div>

            {/* Plot Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Plot Size</label>
              <input
                type="text"
                name="plot_size"
                value={formData.plot_size}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., 2400 sq ft"
              />
            </div>

            {/* Estimated Cost */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Estimated Cost</label>
              <input
                type="text"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                placeholder="e.g., $150,000"
              />
            </div>

            {/* Construction Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Start Date</label>
              <input
                type="date"
                name="constrution_start_date"
                value={formData.constrution_start_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Expected Completion Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Expected Completion</label>
              <input
                type="date"
                name="expected_completion_date"
                value={formData.expected_completion_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Project Status */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-300">Project Status</label>
              <select
                name="project_status"
                value={formData.project_status}
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="Planning" className="bg-slate-800">Planning</option>
                <option value="In Progress" className="bg-slate-800">In Progress</option>
                <option value="On Hold" className="bg-slate-800">On Hold</option>
                <option value="Completed" className="bg-slate-800">Completed</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving Blueprint...
                  </>
                ) : (
                  'Save Project Blueprint'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProjectForm;