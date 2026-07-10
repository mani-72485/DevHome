import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function ChangePassword() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (error) setError(""); // Clear errors on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password !== formData.confirm_password) {
            setError("New passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/change-password/",
                {
                    user_id: user?.id,
                    old_password: formData.old_password,
                    new_password: formData.new_password,
                    confirm_password: formData.confirm_password,
                }
            );

            setSuccess(response.data.message || "Password changed successfully!");
            
            // Wait for 2 seconds to show success animation before logging out
            setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }, 2000);

        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Something went wrong.");
            } else {
                setError("Server connection failed.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 px-4">
            {/* Main Container Animation */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white"
            >
                <h2 className="text-3xl font-extrabold mb-2 text-center bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                    Secure Account
                </h2>
                <p className="text-sm text-slate-400 text-center mb-8">
                    Update your password to keep your profile protected.
                </p>

                {/* Animated Alerts */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm text-center"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Old Password */}
                    <div className="relative">
                        <input
                            type="password"
                            name="old_password"
                            id="old_password"
                            value={formData.old_password}
                            onChange={handleChange}
                            placeholder=" "
                            className="peer w-full bg-slate-900/50 border border-slate-700 p-3 pt-6 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all placeholder-transparent"
                            required
                        />
                        <label htmlFor="old_password" className="absolute left-3 top-2 text-xs text-indigo-400 font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-450 pointer-events-none">
                            Old Password
                        </label>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <input
                            type="password"
                            name="new_password"
                            id="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            placeholder=" "
                            className="peer w-full bg-slate-900/50 border border-slate-700 p-3 pt-6 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all placeholder-transparent"
                            required
                        />
                        <label htmlFor="new_password" className="absolute left-3 top-2 text-xs text-indigo-400 font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-450 pointer-events-none">
                            New Password
                        </label>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            placeholder=" "
                            className="peer w-full bg-slate-900/50 border border-slate-700 p-3 pt-6 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none transition-all placeholder-transparent"
                            required
                        />
                        <label htmlFor="confirm_password" className="absolute left-3 top-2 text-xs text-indigo-400 font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-450 pointer-events-none">
                            Confirm New Password
                        </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/20 active:shadow-none transition-all disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            "Update Password"
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

export default ChangePassword;