import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, ShieldCheck, Edit, 
  Home, Calendar, Heart, Lock, Bell, 
  Shield, MapPin, Activity, ChevronRight 
} from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      // Extracting token from local storage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        alert("Please Login First");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", res.data);

        if (res.data.status) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.log(err.response);
        alert("Session Expired. Login Again");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 md:p-10 animate-fadeIn transition-all duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account information and preferences.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-transform duration-200 active:scale-95 shadow-sm shadow-blue-100">
            <Edit size={16} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Top Feature Card Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Badge Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow duration-300">
            <div className="relative group">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-100 border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
                <User size={56} className="text-slate-400" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h2 className="text-xl font-bold text-slate-900">{user.full_name || "User Profile"}</h2>
              <p className="text-sm text-slate-400">@{user.user_name || "username"}</p>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                <ShieldCheck size={14} />
                <span>Verified User</span>
              </div>

              <div className="pt-2 space-y-1.5 text-sm text-slate-600">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail size={15} className="text-slate-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone size={15} className="text-slate-400" />
                  <span>{user.phone || "No phone added"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Panel Column */}
          <div className="flex flex-col justify-between gap-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Home size={18} />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">12</div>
                <div className="text-xs text-slate-400">Properties</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <Calendar size={18} />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">5</div>
                <div className="text-xs text-slate-400">Bookings</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
                <Heart size={18} />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">8</div>
                <div className="text-xs text-slate-400">Favorites</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Grid: Info Block & Account Action Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Details Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <User size={18} className="text-blue-500" />
              <h3 className="font-semibold text-slate-900">Personal Information</h3>
            </div>
            
            <div className="space-y-4 text-sm pt-2">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Full Name</span>
                <span className="font-medium text-slate-800">{user.full_name}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-50">
                <span className="text-slate-400">Username</span>
                <span className="font-medium text-slate-800">{user.user_name}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-50">
                <span className="text-slate-400">Email</span>
                <span className="font-medium text-slate-800 break-all pl-4 text-right">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-50">
                <span className="text-slate-400">Phone</span>
                <span className="font-medium text-slate-800">{user.phone || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-t border-slate-50">
                <span className="text-slate-400">User ID Reference</span>
                <span className="font-mono text-xs bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100">
                  #{user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Settings Links */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <Shield size={18} className="text-blue-500" />
              <h3 className="font-semibold text-slate-900">Account Settings</h3>
            </div>

            <div className="space-y-1 text-sm pt-1">
              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700 group">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span>Change Password</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700 group">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span>Notification Settings</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700 group">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span>Privacy Settings</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left text-slate-700 group">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span>Manage Addresses</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Activity Streams Footer Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
            <Activity size={18} className="text-emerald-500" />
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-2 before:w-[2px] before:bg-slate-100">
            <div className="relative flex flex-col gap-1 text-sm">
              <div className="absolute -left-[22px] w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
              <p className="text-slate-700 font-medium">You updated your profile information metrics.</p>
              <span className="text-xs text-slate-400">Just now</span>
            </div>

            <div className="relative flex flex-col gap-1 text-sm">
              <div className="absolute -left-[22px] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
              <p className="text-slate-700 font-medium">Successful secure login verified with Bearer authorization.</p>
              <span className="text-xs text-slate-400">2 mins ago</span>
            </div>
          </div>
          
          <div className="pt-2 flex justify-end">
            <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
              View All Activity
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;