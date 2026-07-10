import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Plus, 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter,
  MoreVertical,
  Download
} from "lucide-react";

function Dashboard() {
  // --- STATE FOR DYNAMIC DATA ---
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalBudget: 4500000, // Kept static as requested/implied since project budget isn't in expenses model
    totalSpent: 0,
    remainingBudget: 4500000,
    monthlySpent: 0,
  });
  const [projects, setProjects] = useState([]);
  const [categoriesPercentage, setCategoriesPercentage] = useState({
    materials: 0,
    labor: 0,
    permits: 0
  });
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));



  // --- API INTEGRATION 
  useEffect(() => {
    // Replace 'USER_ID_HERE' with your dynamic user ID context/prop or authentication id
    const userId = user.id; 
    
    fetch(`http://127.0.0.1:8000/get-all-project-expenses/${user.id}/`)
  .then((res) => res.json())
  .then((resData) => {

      const rawExpenses = resData.expenses || [];
      const projectList = resData.projects || [];

      setProjects(projectList);

      const transformedTransactions = rawExpenses.map((expense) => ({
          id: expense.id,
          description: `${expense.expense_name} (${expense.quantity})`,
          category: expense.category,
          amount: Number(expense.expense_amount),
          type: "expense",
          date: expense.expense_date
      }));

      setRecentTransactions(transformedTransactions);

      const totalBudget = Number(resData.total_budget);

      const totalSpent = transformedTransactions.reduce(
          (sum, item) => sum + item.amount,
          0
      );

      const currentMonth = new Date().toISOString().slice(0, 7);

      const monthlySpent = transformedTransactions.reduce((sum, item) => {
          return item.date.startsWith(currentMonth)
              ? sum + item.amount
              : sum;
      }, 0);

      setMetrics({
          totalBudget,
          totalSpent,
          remainingBudget: totalBudget - totalSpent,
          monthlySpent,
      });

      setLoading(false);
  })
  .catch((err) => {
      console.log(err);
      setLoading(false);
  });
  }, []);

  // Helper to format currency to Rupee style
  const formatRupee = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  };

  const percentSpent = metrics.totalBudget > 0 
    ? ((metrics.totalSpent / metrics.totalBudget) * 100).toFixed(1) 
    : "0.0";

  // Filter local state rows when changing dropdown selection
  const filteredTransactions = recentTransactions.filter((tx) => {
    if (selectedCategory === "All Categories") return true;
    return tx.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans antialiased text-slate-600">
        <p className="text-sm font-bold tracking-wide">Loading Dashboard Financials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
      
      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        
        {/* TOP HEADER BAR */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Project Overview Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time financials for your residential construction progress.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
            <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-orange-500/10 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Log Expense
            </button>
          </div>
        </header>

        {/* 4-COLUMN FINANCIAL CARDS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card: Total Allocated Budget */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Total Budget</span>
              <h3 className="text-xl font-black text-slate-900">{formatRupee(metrics.totalBudget)}</h3>
            </div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Amount Spent */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Total Spent</span>
              <h3 className="text-xl font-black text-slate-900">{formatRupee(metrics.totalSpent)}</h3>
            </div>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>

          {/* Card: Balance Available */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Remaining Funds</span>
              <h3 className="text-xl font-black text-slate-900">{formatRupee(metrics.remainingBudget)}</h3>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>

          {/* Card: This Month Run-Rate */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Spent This Month</span>
              <h3 className="text-xl font-black text-slate-900">{formatRupee(metrics.monthlySpent)}</h3>
            </div>
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </section>

        {/* CORE ANALYTICS PANEL & TRANSACTION LOGS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Progress Tracker Card & Visual Meter */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900">Budget Consumption</h3>
                  <p className="text-xs text-slate-400">Visual pacing of total structural usage.</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
              </div>

              {/* Progress Bar Component */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600">Overall Cost Threshold</span>
                  <span className="font-black text-orange-500">{percentSpent}% Exhausted</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percentSpent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Informational Grid Info */}
            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-slate-50 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 font-medium block">Project Start</span>
                <span className="font-bold text-slate-700">June 15, 2026</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 font-medium block">Estimated Completion</span>
                <span className="font-bold text-slate-700">Dec 20, 2026</span>
              </div>
            </div>
          </div>

          {/* Breakdown / Info Panel Sidecar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-1">Expense Categories</h3>
            <p className="text-xs text-slate-400 mb-4">Allocation metrics by usage target.</p>
            
            <div className="space-y-3.5 pt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Raw Materials</span>
                  <span>{categoriesPercentage.materials}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${categoriesPercentage.materials}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Labor & Contracting</span>
                  <span>{categoriesPercentage.labor}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full">
                  <div className="bg-slate-700 h-full rounded-full" style={{ width: `${categoriesPercentage.labor}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Permits & Legal</span>
                  <span>{categoriesPercentage.permits}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: `${categoriesPercentage.permits}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* FULL ROW TRANSACTION TABLE */}
          <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Recent Ledger Transactions</h3>
                <p className="text-xs text-slate-400">Historical records of invoices, payouts, and balances.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-orange-500 appearance-none cursor-pointer"
                  >
                    <option>All Categories</option>
                    <option>Materials</option>
                    <option>Labor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Container Layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Description</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right pr-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-slate-800">{tx.description}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.category.toLowerCase() === "materials" ? "bg-orange-50 text-orange-600" :
                          tx.category.toLowerCase() === "labor" ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-600"
                        }`}>
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400 font-medium">{tx.date}</td>
                      <td className={`py-3.5 text-right pr-2 font-black ${tx.type === "expense" ? "text-slate-800" : "text-emerald-600"}`}>
                        {tx.type === "expense" ? "-" : "+"}{formatRupee(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-400">
                        No transactions found for this category selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Dashboard;