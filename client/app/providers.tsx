"use client";

import { setUser } from "@/lib/redux/authSlice";
import { store } from "@/lib/redux/store";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import axiosInstance from "./utils/axiosInstance";
import { Toaster } from "react-hot-toast";

// User
function AuthHydrator({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();

    const getUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(setUser(null));
            return;
        }

        try {
            const res = await axiosInstance.get("/users/me");

            dispatch(setUser(res.data?.user));
        } catch (err) {
            console.error("Auth hydration failed", err);
            dispatch(setUser(null));
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthHydrator>
                {children}
                <Toaster />
            </AuthHydrator>
        </Provider>
    );
}