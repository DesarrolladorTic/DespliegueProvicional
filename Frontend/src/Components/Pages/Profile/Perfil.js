import { useState } from "react";

export const useProfile = () => {
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "123456789",
    description: "Este es un perfil de prueba.",
    profilePhoto: "/default-user.png",
    companyInfo: {
      companyName: "Empresa Demo",
      companyDescription: "Descripción de la empresa demo.",
      companyLocation: "Ciudad, País",
      companyPhone: "987654321",
    },
  });

  const handleEdit = () => setEditing((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prevInfo,
          [keys[0]]: { ...prevInfo[keys[0]], [keys[1]]: value },
        };
      }
      return { ...prevInfo, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleSave = async () => {
    // Simula el guardado sin llamadas al backend
    alert("Cambios guardados exitosamente (simulación).");
    setEditing(false);
  };

  return {
    editing,
    userInfo,
    handleEdit,
    handleChange,
    handleFileChange,
    handleSave,
  };
};
