import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Settings() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        location: user?.location || "",
        specialization: user?.specialization || "",
        experience: user?.experience || "",
        phone: user?.phone || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Assuming endpoint is /api/users/:id or :email
            await axios.put(`/api/users/${user.email}`, formData);
            toast.success("Profile Updated Successfully!");
            // Logic to refresh user context typically needed here, but keeping it simple
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / City</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {user?.role === "lawyer" && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <input
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                <input
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    type="number"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
