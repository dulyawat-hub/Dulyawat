import React, { createContext, useState } from 'react';

// สร้าง Context เพื่อให้ Component อื่นๆ เข้าถึงข้อมูลได้
export const AuthContext = createContext();

// สร้าง Provider Component เพื่อครอบ Application ทั้งหมด
export const AuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ เพิ่ม: สร้าง State สำหรับเก็บ token

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  // ✅ แก้ไข: รับ userData และ token เข้ามา
  const login = (userData, userToken) => {
    // เมื่อล็อกอินสำเร็จ ให้เก็บข้อมูลผู้ใช้และ token ไว้ใน State
    setUser(userData);
    setToken(userToken); // ✅ เพิ่ม: บันทึก token
    setIsUserLoggedIn(true);
  };

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = () => {
    setUser(null);
    setToken(null); // ✅ เพิ่ม: ลบ token เมื่อออกจากระบบ
    setIsUserLoggedIn(false);
  };

  // ฟังก์ชันสำหรับอัปเดตข้อมูลโปรไฟล์ผู้ใช้
  const updateUserProfile = (updatedData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedData
    }));
  };

  return (
    // ✅ แก้ไข: ส่งค่า token ที่ต้องการให้ Component อื่นๆ เข้าถึงได้
    <AuthContext.Provider value={{ user, isUserLoggedIn, token, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
