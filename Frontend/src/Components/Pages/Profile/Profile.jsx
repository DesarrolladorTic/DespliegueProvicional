import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";

// Datos dummy para simular el perfil
const dummyProfileData = {
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  description: "Este es un perfil de prueba.",
  phone: "123456789",
  profile_photo: "/default-user.png", // Asegúrate de tener este archivo en public
  companyName: "Empresa Demo",
  companyDescription: "Descripción de la empresa demo.",
  companyLocation: "Ciudad, País",
  companyPhone: "987654321",
  companyPhoto: "/default-company.png", // Asegúrate de tener este archivo en public
  companyContact: "contacto@empresa.com",
};

const Profile = () => {
  const { authenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Usamos datos dummy para la vista previa
  const [profileData, setProfileData] = useState(dummyProfileData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (authenticated) {
      // Si hay datos guardados en localStorage, los usamos (simulación)
      const savedProfile = localStorage.getItem("dummyProfile");
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    }
  }, [authenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      // Se simula la carga creando una URL temporal
      const fileUrl = URL.createObjectURL(files[0]);
      setProfileData((prev) => ({
        ...prev,
        [name]: fileUrl,
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simula el guardado local, por ejemplo, en localStorage
    localStorage.setItem("dummyProfile", JSON.stringify(profileData));
    setShowSuccess(true);
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing((prev) => !prev);
  };

  if (loading) {
    return <p className="text-center text-xl">Cargando perfil...</p>;
  }
  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="mt-20 min-h-screen bg-gray-50">
      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">TIC Americas</h2>
            <p className="text-gray-800">¡Perfil actualizado con éxito!</p>
            <button
              className="bg-red-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-red-700 transition"
              onClick={() => setShowSuccess(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-8">
        {/* Título principal */}
        <h2 className="text-5xl font-extrabold text-center text-red-600 mb-10">
          Mi Perfil
        </h2>

        <div className={`grid gap-10 ${isAdmin ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
          {/* Tarjeta de Perfil de Usuario */}
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto transform transition hover:scale-105 duration-300">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl">
                <img
                  src={profileData.profile_photo}
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              {editing && (
                <div className="mt-4">
                  <label className="cursor-pointer bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
                    Cambiar Imagen
                    <input
                      type="file"
                      name="profile_photo"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-lg font-semibold text-gray-800">
                Nombre:
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
                />
              ) : (
                <p className="text-gray-700 mt-2">{profileData.name}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-800">
                Email:
              </label>
              <p className="text-gray-700 mt-2">{profileData.email}</p>
            </div>

            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-800">
                Descripción:
              </label>
              {editing ? (
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
                />
              ) : (
                <p className="text-gray-700 mt-2">{profileData.description}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-800">
                Teléfono:
              </label>
              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
                />
              ) : (
                <p className="text-gray-700 mt-2">{profileData.phone}</p>
              )}
            </div>
          </div>

          {/* Tarjeta de Información de la Empresa (solo para admin) */}
          {isAdmin && (
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto transform transition hover:scale-105 duration-300">
              <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
                Empresa
              </h2>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-md overflow-hidden shadow-2xl">
                  <img
                    src={profileData.companyPhoto}
                    alt="Foto de la empresa"
                    className="w-full h-full object-cover"
                  />
                </div>
                {editing && (
                  <div className="mt-4">
                    <label className="cursor-pointer bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
                      Cambiar Imagen
                      <input
                        type="file"
                        name="companyPhoto"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-lg font-semibold">Nombre:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyName}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Descripción:</label>
                {editing ? (
                  <textarea
                    name="companyDescription"
                    value={profileData.companyDescription}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyDescription}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Ubicación:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyLocation"
                    value={profileData.companyLocation}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyLocation}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Teléfono:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyPhone"
                    value={profileData.companyPhone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyPhone}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Contacto:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyContact"
                    value={profileData.companyContact}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyContact}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botón Editar / Guardar */}
        <div className="mt-8 flex justify-center">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300 text-xl font-semibold"
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition duration-300 text-xl font-semibold"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
