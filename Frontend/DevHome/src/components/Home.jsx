import { motion } from "framer-motion";
import { 
  BarChart3, 
  PieChart, 
  FileText, 
  Receipt, 
  Bell, 
  ArrowRight, 
  TrendingUp, 
  Grid 
} from "lucide-react";

function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-orange-500 selection:text-white antialiased">
      
      {/* HERO SECTION */}
      <section id="home" className="relative bg-[#0B1528] text-white pt-16 pb-32 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={staggerContainer} 
            className="lg:col-span-5 space-y-6 text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              Smart Construction Expense Tracker
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Build Your Dream Home <br />
              Without <span className="text-orange-500">Budget Stress</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-slate-400 text-base leading-relaxed">
              <strong>Devil Home</strong> helps you track every expense, manage your budget, and bring your dream home to life—smarter and easier.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-2">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition-all cursor-pointer text-sm">
                Get Started for Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-all cursor-pointer text-sm">
                <Grid className="w-4 h-4 text-slate-400" />
                Explore Features
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 relative h-[380px] lg:h-[450px] w-full rounded-2xl bg-slate-800 border border-white/10 overflow-hidden shadow-2xl bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1528]/80 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* FLOATING FEATURES ROW */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 items-start"
        >
          <div className="flex gap-3">
            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl shrink-0"><BarChart3 className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Track Expenses</h4>
              <p className="text-xs text-slate-400 mt-0.5">Track all construction expenses in one place.</p>
            </div>
          </div>
          <div className="flex gap-3 border-t sm:border-t-0 sm:pt-0 pt-4 border-slate-100">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl shrink-0"><PieChart className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Budget Management</h4>
              <p className="text-xs text-slate-400 mt-0.5">Set budgets, compare, and stay on track.</p>
            </div>
          </div>
          <div className="flex gap-3 border-t md:border-t-0 md:pt-0 pt-4 border-slate-100">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl shrink-0"><FileText className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Reports & Insights</h4>
              <p className="text-xs text-slate-400 mt-0.5">Get detailed reports and visual insights.</p>
            </div>
          </div>
          <div className="flex gap-3 border-t md:border-t-0 md:pt-0 pt-4 border-slate-100">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl shrink-0"><Receipt className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Store Bills</h4>
              <p className="text-xs text-slate-400 mt-0.5">Upload and store all bills and receipts digitally.</p>
            </div>
          </div>
          <div className="flex gap-3 border-t md:border-t-0 md:pt-0 pt-4 border-slate-100">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl shrink-0"><Bell className="w-5 h-5" /></div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Smart Alerts</h4>
              <p className="text-xs text-slate-400 mt-0.5">Get alerts for budget overruns and deadlines.</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* REPLICATED DASHBOARD MOCK */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">How It Works</span>
            <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Simple Steps to Manage Your <span className="text-orange-500">Home Construction</span>
            </h3>
          </div>

          <div className="space-y-6 relative pl-4 border-l-2 border-slate-100">
            {[
              { num: "1", title: "Create Project", desc: "Add your project details and budget." },
              { num: "2", title: "Add Expenses", desc: "Add expenses with bills and categories." },
              { num: "3", title: "Track & Analyze", desc: "Track spending and get insights." },
              { num: "4", title: "Stay on Budget", desc: "Stay updated and complete on time." },
            ].map((step, i) => (
              <div key={i} className="group relative flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold text-sm text-slate-700 group-hover:border-orange-500 group-hover:text-orange-500 transition-all shrink-0">
                  {step.num}
                </div>
                <div>
                  <h5 className="font-bold text-base text-slate-900 group-hover:text-orange-500 transition-colors">{step.title}</h5>
                  <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Total Budget</span>
              <span className="text-xl font-black text-slate-900 block mt-1">₹50,000,000</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[100%]" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Estimated Budget</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Total Spent</span>
              <span className="text-xl font-black text-slate-900 block mt-1">₹18,75,000</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-orange-500 h-full w-[37.5%]" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">37.5% of Budget</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Remaining</span>
              <span className="text-xl font-black text-slate-900 block mt-1">₹31,25,000</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-blue-500 h-full w-[62.5%]" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">62.5% Remaining</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block">Total Expenses</span>
              <span className="text-xl font-black text-slate-900 block mt-1">48</span>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-purple-500 h-full w-[50%]" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">This Project</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            <div className="md:col-span-5 border border-slate-100 rounded-xl p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Expense Overview</h4>
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32 rounded-full border-8 border-slate-200 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-500 border-r-orange-400 border-l-purple-500 rotate-45" />
                  <span className="text-xs font-bold text-slate-400">Categories</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-medium text-slate-600">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" /> Material (40%)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 block" /> Labor (25%)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 block" /> Electrical (15%)</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 block" /> Plumbing (10%)</div>
              </div>
            </div>

            <div className="md:col-span-7 border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Monthly Spending</h4>
              </div>
              <div className="h-32 flex items-end justify-between gap-1 px-2 border-b border-l border-slate-200 relative pt-4">
                <div className="absolute left-2 top-2 text-[9px] text-slate-400">8L</div>
                <div className="absolute left-2 top-14 text-[9px] text-slate-400">4L</div>
                <div className="w-full flex justify-between items-end h-full px-4">
                  {[25, 40, 35, 50, 85, 45, 52, 50].map((h, i) => (
                    <div key={i} className="flex flex-col items-center w-full group">
                      <div style={{ height: `${h}%` }} className="w-1 bg-gradient-to-t from-orange-100 to-orange-400 rounded-t-full relative">
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow shadow-orange-500/50" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 px-4 mt-2">
                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;