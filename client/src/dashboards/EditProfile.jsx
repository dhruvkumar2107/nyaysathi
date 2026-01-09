import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function EditProfile() {
    const { user, loginWithToken } = useAuth();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [formData, setFormData] = useState({
        bio: "",
        headline: "",
        specialization: "",
        experience: "",
        location: "",
        languages: "",
        courts: "",
        awards: "",
        linkedin: "",
        website: "",
        consultationFee: "",
        availability: "Mon-Fri, 9am - 6pm"
    });

    useEffect(() => {
        if (user) {
            setFormData({
                bio: user.bio || "",
                headline: user.headline || "",
                specialization: user.specialization || "",
                experience: user.experience || "",
                location: typeof user.location === 'string' ? user.location : user.location?.city || "",
                languages: user.languages?.join(", ") || "",
                courts: user.courts?.join(", ") || "",
                awards: user.awards?.join(", ") || "",
                linkedin: user.socials?.linkedin || "",
                website: user.socials?.website || "",
                consultationFee: user.consultationFee || "",
                availability: user.availability || "Mon-Fri, 9am - 6pm"
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append("file", file);

        const toastId = toast.loading("Uploading photo...");
        try {
            const res = await axios.post("/api/uploads", uploadData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Immediate partial update to user context/backend
            await updateProfile({ profileImage: res.data.path });
            toast.success("Photo Uploaded!", { id: toastId });
        } catch (err) {
            toast.error("Upload Failed", { id: toastId });
        }
    };

    const updateProfile = async (updates) => {
        try {
            // If updates not passed, use form data
            const dataToSend = updates || {
                ...formData,
                languages: formData.languages.split(",").map(s => s.trim()).filter(Boolean),
                courts: formData.courts.split(",").map(s => s.trim()).filter(Boolean),
                awards: formData.awards.split(",").map(s => s.trim()).filter(Boolean),
                socials: {
                    linkedin: formData.linkedin,
                    website: formData.website
                },
                // Location logic: keep it simple string for now or object if backend needs
                location: { city: formData.location },
                isProfileComplete: true
            };

            const res = await axios.put(`/api/users/${user.id}`, dataToSend);
            // Update local context
            // We need a fresh token usually if details change deeply, but mainly user obj
            // Assuming context has a way to update user without re-login, 
            // or we just reuse loginWithToken with same token but new user obj if backend returned it?
            // Backend /users/:id PUT returns updated user.
            const currentToken = localStorage.getItem("token");
            loginWithToken(res.data, currentToken);

            if (!updates) toast.success("Profile Updated Successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Update Failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await updateProfile();
        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Profile</h1>
            <p className="text-gray-500 mb-8">
                Complete your profile to rank higher and attract more clients.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
                {/* LEFT COLUMN - PHOTO */}
                <div className="col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                        <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg relative">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                                    📷
                                </div>
                            )}
                        </div>
                        <label className="cursor-pointer inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition text-sm">
                            Upload Photo
                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                        </label>
                        <p className="text-xs text-gray-400 mt-2">Recommended: Square JPG/PNG</p>
                    </div>
                </div>

                {/* RIGHT COLUMN - FORM */}
                <div className="col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">

                        {/* HEADLINE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Headline</label>
                            <input
                                name="headline"
                                placeholder="e.g. Senior Criminal Defense Attorney | 15+ Years Experrience"
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.headline}
                                onChange={handleChange}
                            />
                        </div>

                        {/* BIO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">About Me (Bio)</label>
                            <textarea
                                name="bio"
                                rows="4"
                                placeholder="Tell clients about your expertise, approach, and success stories..."
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.bio}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {/* SPECIALIZATION */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <input
                                    name="specialization"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* EXPERIENCE */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                <input
                                    type="number"
                                    name="experience"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.experience}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* LANGUAGES & COURTS */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Languages (Comma separated)</label>
                                <input
                                    name="languages"
                                    placeholder="English, Hindi, Marathi"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.languages}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Courts Practicing In</label>
                                <input
                                    name="courts"
                                    placeholder="Supreme Court, Bombay High Court"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.courts}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* AWARDS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Awards & Recognition</label>
                            <input
                                name="awards"
                                placeholder="Best Lawyer 2023, Gold Medalist..."
                                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                value={formData.awards}
                                onChange={handleChange}
                            />
                        </div>

                        {/* FEES & LOCATION */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (₹/hr)</label>
                                <input
                                    type="number"
                                    name="consultationFee"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                                <input
                                    name="location"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* SOCIAL LINKS */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                <input
                                    name="linkedin"
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    name="website"
                                    placeholder="https://mylawfirm.com"
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition disabled:opacity-70"
                        >
                            {loading ? "Saving Changes..." : "Save Profile"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
