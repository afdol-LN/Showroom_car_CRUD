'use client'

import { createContext, useContext } from "react";

// 1. สร้าง Context
export const ProfileContext = createContext(null);

// 2. Custom Hook สำหรับใช้งานใน page/component ลูก
export const useProfile = () => {
    return useContext(ProfileContext);
};
