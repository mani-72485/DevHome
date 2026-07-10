import API_URL from "./api";

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Save, FileText, Calendar, DollarSign, Layers } from "lucide-react";

const expenseData = {
  "Foundation Work": ["Excavation", "PCC Work", "Footings", "Foundation Concrete", "Waterproofing", "Soil Testing", "Others"],
  "Cement": ["OPC Cement", "PPC Cement", "White Cement", "Cement Transportation", "Others"],
  "Sand": ["River Sand", "M-Sand", "Plaster Sand", "Sand Transportation", "Others"],
  "Bricks": ["Red Bricks", "Fly Ash Bricks", "AAC Blocks", "Brick Transportation", "Others"],
  "Steel": ["TMT Bars", "Binding Wire", "Steel Cutting", "Steel Transportation", "Others"],
  "Electrical Work": ["Electrical Wiring", "Switches", "Sockets", "Distribution Board", "Lights", "Fans", "Electrician Charges", "Others"],
  "Plumbing": ["Water Pipes", "Drainage Pipes", "Bathroom Fittings", "Water Tank", "Plumber Charges", "Others"],
  "Painting": ["Primer", "Wall Putty", "Interior Paint", "Exterior Paint", "Painter Charges", "Others"],
  "Flooring": ["Tiles", "Marble", "Granite", "Tile Adhesive", "Grouting", "Flooring Labor", "Others"],
  "Doors & Windows": ["Main Door", "Internal Doors", "Windows", "Door Frames", "Locks", "Handles", "Glass Installation", "Others"],
  "Furniture": ["Kitchen Cabinets", "Wardrobes", "TV Unit", "Sofa", "Dining Table", "Bedroom Furniture", "Others"],
  "Labor Charges": ["Mason Charges", "Carpenter Charges", "Electrician Charges", "Plumber Charges", "Painter Charges", "Helper Wages", "Others"],
  "Miscellaneous": ["Transportation", "Water Charges", "Electricity Bills", "Equipment Rental", "Site Cleaning", "Security", "Snacks", "Unexpected Expenses", "Others"]
};

const forWhatOptions = ["Punadi", "Home Walls", "Slabs", "Painting", "Flooring", "Water", "Other"];

// Helper function to get today's date in YYYY-MM-DD format based on local time
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Factory function to return a fresh empty row with today's date pre-filled
const createEmptyRow = () => ({
  category: "",
  expense_name: "",
  quantity: "",
  expense_date: getTodayDateString(),
  expense_amount: "",
  supplier_name: "",
  remarks: "",
});

export default function AddExpenses() {
  const location = useLocation();
  // Captures the fallback if routed blindly without a project wrapper context
  const routedProjectId = location.state?.projectId || "";

  const [forWhat, setForWhat] = useState("");
  const [rows, setRows] = useState([createEmptyRow()]);
  const [loading, setLoading] = useState(false);

  const change = (i, key, value) => {
    const copy = [...rows];
    copy[i][key] = value;
    if (key === "category") {
      copy[i].expense_name = "";
      copy[i].remarks = "";
    }
    if (key === "expense_name" && value !== "Others") {
      copy[i].remarks = "";
    }
    setRows(copy);
  };

  const addRow = () => setRows([...rows, createEmptyRow()]);
  const removeRow = (i) => setRows(rows.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    
    // Simple Validation checks before payload preparation
    if (!routedProjectId) {
      alert("Missing Project context ID. Please navigate from a project overview card.");
      return;
    }
    if (!forWhat) {
      alert("Please select a purpose/for what before saving.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Session expired or missing auth token. Please log in again.");
      return;
    }

    // Map rows to match your exact backend structure requirements 
    const payload = rows.map(r => ({
      project_id: routedProjectId,
      for_what: forWhat,
      category: r.category,
      expense_name: r.expense_name,
      quantity: r.quantity || null, 
      expense_date: r.expense_date || null,
      expense_amount: r.expense_amount ? parseFloat(r.expense_amount) : 0.00,
      supplier_name: r.supplier_name,
      remarks: r.remarks
    }));

    setLoading(true);
    try {
      // Sending payload array to Django REST endpoint 
      await axios.post(`${API_URL}/expenses/`, payload, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      alert("Expenses saved successfully!");
      // Reset form states after a successful post
      setRows([createEmptyRow()]);
      setForWhat("");
    } catch (err) {
      console.error("Backend Error: ", err.response?.data || err.message);
      const backendMessage = err.response?.data?.detail || "Error communicating with Django backend servers.";
      alert(`Failed to save: ${backendMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = getTodayDateString();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 antialiased text-slate-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
          <Layers size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Add Project Expenses</h1>
          <p className="text-sm text-slate-500">
            Track and log dynamic items for your site execution. 
            {routedProjectId && <span className="text-blue-600 font-semibold ml-1">(Project ID: {routedProjectId})</span>}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Hidden Global Form field tracking target project id */}
        <input type="hidden" name="project_id" value={routedProjectId} />

        {/* Top Control Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:max-w-xs">
            <label className="block mb-2 text-sm font-semibold text-slate-700">Purpose / For What</label>
            <select
              value={forWhat}
              onChange={(e) => setForWhat(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all rounded-xl p-3 outline-none font-medium text-slate-700"
            >
              <option value="">Select Purpose</option>
              {forWhatOptions.map(x => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          
          <div className="text-right text-xs font-medium text-slate-400 self-end md:self-center">
            Total Items: <span className="text-slate-700 font-bold text-sm bg-slate-100 px-2 py-1 rounded-md">{rows.length}</span>
          </div>
        </div>

        {/* Dynamic Items Cards */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {rows.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95, transition: { duration: 0.2 } }}
                layout
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Visual Indicator Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r" />

                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    Item #{i + 1}
                  </span>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                    <select
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl p-2.5 text-sm outline-none"
                      value={r.category}
                      required
                      onChange={(e) => change(i, "category", e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {Object.keys(expenseData).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Expense Name Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Expense Name</label>
                    <select
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl p-2.5 text-sm outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      value={r.expense_name}
                      disabled={!r.category}
                      required
                      onChange={(e) => change(i, "expense_name", e.target.value)}
                    >
                      <option value="">Select Expense</option>
                      {r.category && expenseData[r.category].map(x => <option key={x} value={x}>{x}</option>)}
                    </select>
                  </div>

                  {/* Quantity Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl pl-9 pr-3 p-2.5 text-sm outline-none"
                        placeholder="e.g. 50 bags"
                        value={r.quantity}
                        onChange={(e) => change(i, "quantity", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Expense Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="date"
                        required
                        max={todayStr}
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl pl-9 pr-3 p-2.5 text-sm outline-none"
                        value={r.expense_date}
                        onChange={(e) => change(i, "expense_date", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Amount</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl pl-9 pr-3 p-2.5 text-sm outline-none"
                        placeholder="0.00"
                        value={r.expense_amount}
                        onChange={(e) => change(i, "expense_amount", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Supplier Name Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier Name</label>
                    <input
                      className="w-full bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all rounded-xl p-2.5 text-sm outline-none"
                      placeholder="Vendor / Agency Name"
                      value={r.supplier_name}
                      onChange={(e) => change(i, "supplier_name", e.target.value)}
                    />
                  </div>
                </div>

                {/* Conditional Remarks Input */}
                {r.expense_name === "Others" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-1"
                  >
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Remarks / Specifications</label>
                    <input
                      className="w-full bg-slate-50/50 border border-emerald-200 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all rounded-xl p-2.5 text-sm outline-none"
                      placeholder="Please specify custom item details here..."
                      value={r.remarks}
                      required={r.expense_name === "Others"}
                      onChange={(e) => change(i, "remarks", e.target.value)}
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-between">
          <button
            type="button"
            onClick={addRow}
            disabled={loading}
            className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/30 active:scale-[0.98] transition-all px-6 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50"
          >
            <Plus size={18} />
            Add Another Item
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-xl shadow-blue-500/10 active:scale-[0.98] transition-all px-8 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Expenses"}
          </button>
        </div>
      </form>
    </div>
  );
}