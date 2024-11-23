'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NetworkProvider({ children }: { children: React.ReactNode }) {
    const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? window.navigator.onLine : false);
    
    useEffect(() => {
        if(!navigator) return;

        if('serviceWorker' in navigator) {
           navigator.serviceWorker
           .register('/firebase-messaging-sw.js')
           .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
            // Cache additional pages after service worker registration
           })
           .catch((error) => {
            console.error('Service Worker registration failed:', error);
           });
        }
    }, []);

    useEffect(() => {
        const goOnline = () => {
         setIsOnline(true);
         toast.success("You are Online, Welcome Back!");
        };
      
        const goOffline = () => {
         setIsOnline(false);
         toast.error("You are offline, some features may not work properly.");
        };
      
        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);
      
        return () => {
         window.removeEventListener("online", goOnline);
         window.removeEventListener("offline", goOffline);
        };
    }, []);
    
    return <>{children}</>;
}