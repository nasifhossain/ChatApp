import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import assets from "../../../src/assets/assets";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/cropImage";
import axios from "axios";
import getDetails from "./utils/GetDetails";
import { useNavigate } from "react-router-dom";

const cloudUrl = import.meta.env.VITE_CLOUD_URL;
const cloudName = import.meta.env.VITE_CLOUD_NAME;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const token = localStorage.getItem("token");
  const { user, loading, error } = getDetails(token);

  const [avatarPreview, setAvatarPreview] = useState(
    "http://localhost:3000/avatar_icon.png"
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileError, setFileError] = useState("");
  const [croppedBlob, setCroppedBlob] = useState(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        bio: user.bio || "",
        username: user.username || "",
      });
      setAvatarPreview(user.image || "http://localhost:3000/avatar_icon.png");
      setProfileImageUrl(user.image || "http://localhost:3000/avatar_icon.png");
    }
  }, [user, reset]);

  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size exceeds 5MB. Please choose a smaller file.");
        return;
      } else {
        setFileError("");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropSave = async () => {
    try {
      setUploading(true);
      const blob = await getCroppedImg(selectedImage, croppedAreaPixels);
      const imageUrl = URL.createObjectURL(blob);

      setAvatarPreview(imageUrl);
      setCroppedBlob(blob);
      setCropping(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Cropping failed:", err.message);
      setFileError("Cropping failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      let uploadedImageUrl = profileImageUrl;

      if (croppedBlob) {
        const formData = new FormData();
        formData.append("file", croppedBlob);
        formData.append("upload_preset", "ReactAPP");
        formData.append("cloud_name", cloudName);

        const uploadRes = await axios.post(cloudUrl, formData);
        uploadedImageUrl = uploadRes.data.url;
      }

      const res = await axios.put(
        `${backendUrl}/user/update`,
        {
          name: data.name,
          bio: data.bio,
          image: uploadedImageUrl,
          username: data.username,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.status === 200) {
        //console.log("Profile updated successfully:", res.data);
        setUpdateMessage(res.data.message);
        setTimeout(() => {
          setUpdateMessage(null);
        }, 3000);
      }
      setProfileImageUrl(uploadedImageUrl);
    } catch (err) {
      console.log("Error during profile update:", err.response);
      setFileError(err.response.data.message|| "Error updating profile. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white w-full h-screen flex items-center justify-center bg-slate-900">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center px-4 py-8">
      {/* Profile Card */}
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 shadow-xl relative">
        {/* Back Button Inside the Card */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-sm text-amber-400 hover:underline"
        >
          ← Back
        </button>

        <h3 className="text-2xl font-bold text-center mb-6">Profile Details</h3>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center gap-3">
            <img
              src={avatarPreview}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-amber-400 object-cover"
            />
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-1 rounded-md"
              >
                Upload Photo
              </button>
              <button
                type="button"
                onClick={() => setPreviewVisible(true)}
                className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-1 rounded-md"
              >
                View Photo
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".png, .jpg, .jpeg"
              className="hidden"
              onChange={handleAvatarChange}
            />
            {fileError && (
              <p className="text-red-500 mt-2 text-sm">{fileError}</p>
            )}
          </div>

          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Your Name"
            className="bg-slate-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
          <input
            {...register("username", { required: "Username is required" })}
            placeholder="Your Username"
            className="bg-slate-700 text-white placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.username && (
            <span className="text-sm text-red-500">
              {errors.username.message}
            </span>
          )}

          <textarea
            {...register("bio", { required: "Bio is required" })}
            rows="4"
            placeholder="Your Bio"
            className="bg-slate-700 text-white placeholder-gray-400 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.bio && (
            <span className="text-sm text-red-500">{errors.bio.message}</span>
          )}

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-2 rounded-md transition flex justify-center items-center"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
        {updateMessage ? (
          <p className="text-green-500 mt-2 text-center text-sm">
            {updateMessage}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <img src={assets.logo_big} alt="logo" className="h-16" />
      </div>

      {previewVisible && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-slate-800 p-4 rounded-xl shadow-xl relative">
            <button
              onClick={() => setPreviewVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-lg"
            >
              ✕
            </button>
            <img
              src={avatarPreview}
              alt="Full View"
              className="w-64 h-64 rounded-xl object-cover border-2 border-amber-400"
            />
          </div>
        </div>
      )}

      {cropping && selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-slate-900 p-4 rounded-xl shadow-xl w-full max-w-md flex flex-col items-center">
            <div className="relative w-full h-[300px] sm:h-[350px]">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex justify-end gap-4 mt-4 w-full">
              <button
                className="px-4 py-1 rounded bg-gray-600 hover:bg-gray-500"
                onClick={() => {
                  setCropping(false);
                  setSelectedImage(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                onClick={handleCropSave}
                disabled={uploading}
              >
                {uploading ? "Cropping..." : "Crop & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
