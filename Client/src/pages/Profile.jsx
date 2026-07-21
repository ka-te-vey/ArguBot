import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Camera,
  Trash2,
  Check,
  ArrowLeft,
  Mail,
  Shield,
  Sparkles,
  Edit3,
  Save,
  X,
  Award
} from "lucide-react";
import { useTheme } from "../components/Theme";
import ImageCrop from "../components/ImageCrop";

export default function Profile({ user, setUser }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  // Load initial user state from props or localStorage
  const storedUser = user || JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(storedUser.name || "Guest Debater");
  const [email] = useState(storedUser.email || "debater@argubot.ai");
  const [avatar, setAvatar] = useState(storedUser.avatar || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const userInitial = name ? name.charAt(0).toUpperCase() : "D";

  // Handle image upload from file input
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle removing profile image
  const handleRemoveImage = () => {
    setAvatar("");
    triggerSuccess("Profile image removed. Click 'Save Profile Changes' to apply.");
  };

  // Helper for success notification banner
  const triggerSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  // Save profile updates to localStorage & parent state
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const updatedUser = {
      ...storedUser,
      name: name.trim() || "Guest Debater",
      email: email,
      avatar: avatar
    };

    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);

      // Dispatch storage event so other components (like Sidebar) sync dynamically
      window.dispatchEvent(new Event("storage"));

      setIsEditingName(false);
      setIsSaving(false);
      triggerSuccess("Profile changes saved successfully!");
    }, 400);
  };

  return (
    <div
      className={`min-h-screen w-screen flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans transition-colors duration-300 select-none ${
        isDark ? "bg-[#131314] text-[#E3E3E3]" : "bg-[#F8F9FA] text-[#1F1F1F]"
      }`}
    >
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />

      {/* Main Profile Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-lg rounded-3xl border shadow-2xl backdrop-blur-md z-10 overflow-hidden transition-all relative ${
          isDark
            ? "bg-[#1E1E1F]/80 border-zinc-800 shadow-black/40"
            : "bg-white/90 border-zinc-200 shadow-zinc-200/60"
        }`}
      >
        {/* Floating Success Banner Notification (Front Overlay) */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="absolute top-3 left-4 right-4 z-50 p-3.5 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center justify-center gap-2 text-xs font-bold border border-emerald-400/30 backdrop-blur-md"
            >
              <Check className="w-4 h-4 shrink-0 stroke-[3px]" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Decorative Banner Header */}
        <div
          className={`h-32 relative p-6 flex items-start justify-between border-b transition-colors ${
            isDark
              ? "bg-[#131314] border-zinc-800 text-white"
              : "bg-white border-zinc-200 text-zinc-900"
          }`}
        >
          <button
            onClick={() => navigate("/")}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs flex items-center justify-center ${
              isDark
                ? "bg-zinc-800/80 hover:bg-zinc-700 text-white"
                : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
            }`}
            title="Return to Arena"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              isDark
                ? "bg-zinc-900/80 border-zinc-700 text-purple-400"
                : "bg-zinc-50 border-zinc-200 text-purple-600"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Debater Profile</span>
          </div>
        </div>

        {/* Profile Avatar & Content Section */}
        <div className="px-6 md:px-8 pb-8 pt-0 relative">

          {/* Avatar Area with Floating Upload / Remove Overlay */}
          <div className="flex flex-col items-center -mt-16 mb-6">
            <div className="relative group">
              {/* Profile Image Container */}
               <div
                    onClick={() => avatar && setIsPreviewOpen(true)}
                    title={avatar ? "Click to view full image" : ""}
                    className={`w-28 h-28 rounded-full border-[3px] ring-[3px] ring-purple-500/50 shadow-lg overflow-hidden bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-black relative transition-all ${
                      avatar ? "cursor-pointer hover:opacity-90 hover:ring-purple-400" : ""
                    } ${isDark ? "border-[#1E1E1F]" : "border-white"}`}
                >
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>

              {/* Upload Floating Camera Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`absolute bottom-0.5 right-0.5 p-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-transform active:scale-95 cursor-pointer border-2 ${
                  isDark ? "border-[#1E1E1F]" : "border-white"
                }`}
                title="Upload Profile Image"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* render the modal inside profile */}
            {tempImage && (
                <ImageCrop
                    imageSrc={tempImage}
                    isDark={isDark}
                    onCancel={() => setTempImage(null)}
                    onCropComplete={(croppedImage) => {
                        setAvatar(croppedImage) 
                        setTempImage(null);
                        triggerSuccess('Profile image updated & cropped.')
                    }}
                />
            )}

            {/* Remove Profile Picture Button (Shows only if avatar exists) */}
            {avatar && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-3 text-xs font-medium text-red-500 hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Profile Image</span>
              </button>
            )}
          </div>

          {/* Form / Profile Fields */}
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest block ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Display Username
              </label>

              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter username"
                      className={`w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border ${
                        isDark
                          ? "border-purple-500 focus:border-purple-400"
                          : "border-purple-500 focus:border-purple-400"
                      } rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/10 text-sm font-semibold transition-all`}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800/80"
                      : "bg-zinc-50 border-zinc-200/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">{name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Username</span>
                  </button>
                </div>
              )}
            </div>

            {/* Email Address Field (Read Only) */}
            <div className="space-y-2">
              <label
                className={`text-[10px] font-bold uppercase tracking-widest block ${
                  isDark ? "text-zinc-400" : "text-zinc-500"
                }`}
              >
                Email Address
              </label>
              <div
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isDark
                    ? "bg-zinc-900/40 border-zinc-800/60 text-zinc-400"
                    : "bg-zinc-50/60 border-zinc-200/60 text-zinc-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm">{email}</span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 font-bold">
                  Verified
                </span>
              </div>
            </div>

            {/* Account Status Stats */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div
                className={`p-4 rounded-2xl border text-center ${
                  isDark
                    ? "bg-zinc-900/40 border-zinc-800/60"
                    : "bg-zinc-50/60 border-zinc-200/60"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-purple-400 text-xs font-bold mb-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Role</span>
                </div>
                <p className="text-sm font-extrabold">Debater</p>
              </div>

              <div
                className={`p-4 rounded-2xl border text-center ${
                  isDark
                    ? "bg-zinc-900/40 border-zinc-800/60"
                    : "bg-zinc-50/60 border-zinc-200/60"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 text-blue-400 text-xs font-bold mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Status</span>
                </div>
                <p className="text-sm font-extrabold text-emerald-400">Active</p>
              </div>
            </div>

            {/* Save Profile Changes Action Button */}
            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSaving}
                className={`w-full py-3.5 argubot-cta-btn font-bold rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  isSaving && "opacity-75 cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Interactive Image Cropper & Reposition Modal */}
      {tempImage && (
        <ImageCrop
          imageSrc={tempImage}
          isDark={isDark}
          onCancel={() => setTempImage(null)}
          onCropComplete={(croppedBase64) => {
            setAvatar(croppedBase64);
            setTempImage(null);
            triggerSuccess("Profile image cropped! Click 'Save Profile Changes' to apply.");
          }}
        />
      )}

      {/* Full-screen profile image preview */}
      <AnimatePresence>
        {isPreviewOpen && avatar && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPreviewOpen(false)}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer select-none"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-lg w-full max-h-[80vh] flex flex-col items-center justify-center"
                >

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(false)}
                        className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer"
                        title="Close Preview"
                    >
                        <X className="w-5 h-5"/>
                    </button>

                    {/* Full circular image preview */}
                    <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-purple-500/80 shadow-2xl bg-black/40 flex items-center justify-center">
                      <img
                        src={avatar}
                        alt="Profile Full View"
                        className="w-full h-full object-cover"
                      />
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
