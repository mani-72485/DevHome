import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Calendar, Tag, Search, Filter, RefreshCw, DollarSign, ListOrdered } from 'lucide-react';
import API_URL from './api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function ExpenseTracker() {
  
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [category, setCategory] = useState('All');
  const [expenseName, setExpenseName] = useState('');
    const location = useLocation();
  const navigate = useNavigate(); // Fixed: Added missing initialization
  const projectId = location.state?.projectId || "";
  
  // Dynamic Database Options
  const [dbCategories, setDbCategories] = useState([]);
  const [dbExpenseNames, setDbExpenseNames] = useState([]);

  // Data States
  const [expenses, setExpenses] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Dynamic Dropdown Meta Options from Database
  const fetchMetaOptions = async () => {
    try {
     const token = localStorage.getItem("accessToken");
     

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      } 
      const response = await axios.get(
        `${API_URL}/expense_meta_options/${projectId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDbCategories(response.data.categories);
      setDbExpenseNames(response.data.expense_names);
    } catch (err) {
      console.error("Failed to load filter metadata options:", err);
    }
  };

  // 2. Fetch Filtered Core Expenses
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      } 
      const params = new URLSearchParams();
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      if (category) params.append('category', category);
      if (expenseName) params.append('expense_name', expenseName);

      const response = await axios.get(
        `${API_URL}/filter_expenses/${projectId}/?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setExpenses(response.data.data);
      setCount(response.data.count);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  // Lifecycle Management
  useEffect(() => {
     const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      } 
    if (projectId) {
      fetchMetaOptions(); // Seed unique options on load
      fetchExpenses();
    }
  }, [projectId]);

  // Trigger quick fetch whenever dates or categories change
  useEffect(() => {
    if (projectId) fetchExpenses();
  }, [fromDate, toDate, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  // Data mapping for charts
  const totalAmount = expenses.reduce((sum, item) => sum + parseFloat(item.expense_amount || 0), 0);
  const categoryData = Object.values(
    expenses.reduce((acc, item) => {
      const amt = parseFloat(item.expense_amount || 0);
      if (!acc[item.category]) acc[item.category] = { name: item.category, value: 0 };
      acc[item.category].value += amt;
      return acc;
    }, {})
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Project Analytics
            </h1>
            <p className="text-slate-400 text-sm mt-1">Real-time database-driven tracking and charts.</p>
          </div>
          <button 
            onClick={() => { fetchMetaOptions(); fetchExpenses(); }}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all duration-200"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>

        {/* Filters Form */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* From Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
            </div>

            {/* Dynamic Category Dropdown from DB */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              >
                <option value="All">All Categories</option>
                {dbCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Search with Auto-suggestions */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Expense Name</label>
              <div className="relative flex">
                <input 
                  type="text" 
                  list="expense-suggestions"
                  placeholder="Type or select database item..."
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm pr-12"
                />
                <datalist id="expense-suggestions">
                  {dbExpenseNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
                <button type="submit" className="absolute right-2 top-2 bottom-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors">Find</button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl text-white shadow-md flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Tracked Expenditure</p>
              <h2 className="text-4xl font-bold mt-2">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="p-4 bg-white/10 rounded-xl"><DollarSign className="w-8 h-8" /></div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Invoices / Entries</p>
              <h2 className="text-4xl font-bold text-slate-800 mt-2">{count} Entries</h2>
            </div>
            <div className="p-4 bg-slate-100 rounded-xl text-slate-600"><ListOrdered className="w-8 h-8" /></div>
          </motion.div>
        </div>

        {/* Visual Charts */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Category Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Budget Consumption</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Data Table */}
        <motion.div layout className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2"><Filter className="w-4 h-4 text-blue-500" /> Itemized Breakdown</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="py-4 px-6">Expense Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Qty</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                <AnimatePresence>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-400">Loading records...</td></tr>
                  ) : error ? (
                    <tr><td colSpan="5" className="text-center py-10 text-red-500 font-medium">{error}</td></tr>
                  ) : expenses.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-400">No records match filter criteria.</td></tr>
                  ) : (
                    expenses.map((item, index) => (
                      <motion.tr 
                        key={item.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-slate-800">{item.expense_name}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">{item.category}</span>
                        </td>
                        <td className="py-4 px-6 text-slate-400">{item.expense_date}</td>
                        <td className="py-4 px-6">{item.quantity}</td>
                        <td className="py-4 px-6 text-right font-semibold text-slate-800">${parseFloat(item.expense_amount).toFixed(2)}</td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}