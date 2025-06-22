import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useProfileQuery, useUpdateProfileMutation } from "../redux/slices/UserApi";
import { setProfile } from "../redux/slices/UserSlice";

const MyProfile = () => {
  const dispatch = useDispatch();
  const { data: profileData, isLoading, error } = useProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (profileData?.user) {
      dispatch(setProfile(profileData.user));
    }
  }, [profileData, dispatch]);

  const profile = useSelector((state) => state.user.profile);

  const handleUpdateRole = async () => {
    if (!selectedRole || selectedRole === profile.role) {
      toast.warn("Vă rugăm să alegeți un rol diferit.");
      return;
    }

    try {
      const resp = await updateProfile({ role: selectedRole });
      if (resp.error) {
        toast.error(resp.error.data?.message || "Actualizarea rolului a eșuat");
      } else {
        toast.success(resp.data?.message || "Rol actualizat cu succes");
        dispatch(setProfile(resp.data?.user));
        setShowRoleModal(false);
      }
    } catch (error) {
      toast.error("A apărut o eroare la actualizarea rolului");
    }
  };

  if (isLoading) return <div className="text-center mt-10">Se încarcă...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Eroare la încărcarea profilului</div>;
  if (!profile) return <div className="text-center mt-10">Niciun profil găsit</div>;

  const userInitial = profile?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="flex justify-center my-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gray-100 text-2xl font-bold text-blue-600">
          {userInitial}
        </div>

        <p className="text-2xl font-bold mt-4 text-blue-600">Salut, {profile.name}</p>
        <p className="text-lg font-medium text-gray-700">{profile.email}</p>
        <p className="text-sm text-gray-500">Rol: {profile.role}</p>

        <div className="w-full flex justify-between mt-6 gap-4">
          <Link
            to="/update-password"
            className="w-1/2 py-2 rounded-md text-white font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 transition-all duration-300 shadow-md"
          >
            Actualizează parola
          </Link>
          <button
            onClick={() => setShowRoleModal(true)}
            className="w-1/2 py-2 rounded-md text-white font-medium bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-500 transition-all duration-300 shadow-md"
          >
            Actualizează rolul
          </button>
        </div>
      </div>

      {/* Modal pentru actualizare rol */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-[#000000ae] bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Selectează rolul</h3>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mb-4"
            >
              <option value="">-- Alege rolul --</option>
              <option value="User">Utilizator</option>
              <option value="Transporter">Transportator</option>
            </select>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="w-1/2 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500"
              >
                Anulează
              </button>
              <button
                onClick={handleUpdateRole}
                className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Actualizează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
