import React, { createContext, useContext, useState } from "react";
import { apiConfig } from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ✅ Update only firstName and lastName
 const updateProfile = async (profileData) => {
  try {
    const allowedData = {
      firstname: profileData.firstname,
      lastname: profileData.lastname,
    };

    const response = await apiConfig.put(`/auth/update/${user.id}`, allowedData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const updatedUser = response.data.user || response.data;

    // ✅ Merge using correct backend field names
    const newUserData = {
      ...user,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
    };

    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));

    return updatedUser;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

  const deleteAccount = async () => {
    try {
      await apiConfig.delete(`/auth/delete/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setUser(null);
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
