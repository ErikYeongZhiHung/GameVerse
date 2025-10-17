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
    // userData is the full object from backend (includes token)
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await apiConfig.put(`/auth/${user.id}`, profileData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const updatedUser = response.data;
      const newUserData = { ...user, ...updatedUser };
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

      // Clear user data and local storage
      setUser(null);
      localStorage.removeItem("user");
      
      return true;
    } catch (error) {
      console.error("Delete account error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};
