// frontend/src/pages/Profile.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUrl";

const Profile = () => {
  const { user, login } = useAuth(); // reuse login() to refresh stored user data after update
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileFile, setProfileFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture ? getImageUrl(user.profilePicture) : null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be under 5MB");
      return;
    }

    setProfileFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("bio", bio.trim());
      if (profileFile) formData.append("profilePicture", profileFile);

      const res = await axiosInstance.put("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Get the current token back out so we can re-save the updated user object
      // alongside it — login() expects both.
      const token = localStorage.getItem("ff_token");
      login(res.data, token);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
        {/* Profile picture */}
        <div className="flex justify-center">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-orange-100"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-gray-300" />
            )}
            <label className="absolute bottom-0 right-0 bg-orange-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-orange-700">
              <FaCamera size={14} />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="Tell the community a bit about yourself..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{bio.length}/200</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;