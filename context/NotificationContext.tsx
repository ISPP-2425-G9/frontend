import { useFocusEffect } from "@react-navigation/native";
import React, { createContext, ReactNode, useContext, useState } from "react";
import Notification from "../components/Notification";

type NotificationType = {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    duration?: number;
    id?: string;
};

type NotificationContextType = {
    showNotification: (notification: NotificationType) => void;
    hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<NotificationType | null>(null);
    const [isFocused, setIsFocused] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            setIsFocused(true);
            return () => setIsFocused(false);
        }, [])
    );

    const showNotification = (newNotification: NotificationType) => {
        setNotification({
            ...newNotification,
            id: Math.random().toString(36).substring(7)
        });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ showNotification, hideNotification }}>
            {children}
            {isFocused && notification && (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    duration={notification.duration}
                    onHide={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};