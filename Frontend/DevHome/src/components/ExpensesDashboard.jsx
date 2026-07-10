import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Filter, DollarSign, ListFilter } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function ExpensesDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States (Defaults to all dates and 'all' categories)
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const location = useLocation();
  const navigate = useNavigate(); // Fixed: Added missing initialization
  const projectId = location.state?.projectId || "";

  // Fetch data from API
  const fetchExpenses = async () => {
    setLoading(true);
    try {
     
      
      let url = `http://localhost:8000/get_expenses/${projectId}/?category=${selectedCategory}`;      
      if (fromDate && toDate) {
        url += `&from_date=${fromDate}&to_date=${toDate}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const resData = await response.json();
      
      if (response.ok) {
        setExpenses(resData.data);
        
        // Extract unique categories dynamically for the dropdown if initializing
        if (selectedCategory === 'all' && !fromDate) {
          const uniqueCats = [...new Set(resData.data.map(item => item.category))];
          setCategories(uniqueCats);
        }
      } else {
        console.error(resData.message);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [selectedCategory, fromDate, toDate, projectId]);
   const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      } 

  // Clear filters helper
  const handleClearFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedCategory('all');
  };

  // --- DATA TRANSFORMATION FOR VISUALS ---
  
  // 1. Total Aggregates
  const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.expense_amount || 0), 0);

  // 2. Pie Chart Data: Grouping by Category
  const categoryDataMap = expenses.reduce((acc, item) => {
    const amt = parseFloat(item.expense_amount || 0);
    acc[item.category] = (acc[item.category] || 0) + amt;
    return acc;
  }, {});

  const pieChartData = Object.keys(categoryDataMap).map(cat => ({
    name: cat,
    value: categoryDataMap[cat]
  }));

  // 3. Bar Chart Data: Grouping by Date
  const dateDataMap = expenses.reduce((acc, item) => {
    acc[item.expense_date] = (acc[item.expense_date] || 0) + parseFloat(item.expense_amount || 0);
    return acc;
  }, {});

  const barChartData = Object.keys(dateDataMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(date => ({
      date: date,
      Amount: dateDataMap[date]
    }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans transition-all duration-500 ease-in-out">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Analytics</h1>
          <p className="text-gray-500 mt-1">Track and filter expenditure patterns for Project ID: <span className="font-semibold text-blue-600">{projectId}</span></p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 transform hover:scale-105 transition-transform duration-300">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Spent</p>
            <p className="text-2xl font-bold text-gray-800">${totalSpent.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>
      </div>

      {/* Control Panel / Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 opacity-0 animate-[fadeIn_0.5s_ease-out_0.1s_forwards]">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
          <Filter className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-700">Filter Board</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> From Date
            </label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> To Date
            </label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
              <ListFilter className="w-4 h-4" /> Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <button 
              onClick={handleClearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 px-4 rounded-xl transition duration-200 target-button"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      {expenses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
          {/* Timeline Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Daily Expense Timeline</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} />
                  <YAxis tick={{fontSize: 12, fill: '#6b7280'}} />
                  <Tooltip cursor={{fill: '#f3f4f6'}} />
                  <Legend />
                  <Bar 
                    dataKey="Amount" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categorized Share Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-md font-semibold text-gray-700 mb-4">Category Distribution</h3>
            <div className="h-72 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="40%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white text-center py-12 rounded-2xl border border-dashed border-gray-200 text-gray-400 mb-8 opacity-0 animate-[fadeIn_0.5s_ease-out_0.2s_forwards]">
          No transactions match the chosen parameters.
        </div>
      )}

      {/* Structured Details Table View */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-0 animate-[fadeIn_0.6s_ease-out_0.3s_forwards]">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-md font-semibold text-gray-700">Detailed Line Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">For What</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">Loading data patterns...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-400">No items listed.</td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-900">{exp.expense_name}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-full capitalize">{exp.category}</span></td>
                    <td className="p-4 text-gray-500">{exp.for_what}</td>
                    <td className="p-4">{exp.quantity}</td>
                    <td className="p-4">{exp.expense_date}</td>
                    <td className="p-4 text-right font-semibold text-gray-900">${parseFloat(exp.expense_amount).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded CSS Animation styles inside the component */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  ); 
}