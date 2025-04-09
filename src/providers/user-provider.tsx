'use client';
import { AuthUser, getAuthUser } from '@/actions/get-auth-user';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserContextType {
    user: AuthUser | null;
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    loading: boolean;
    handleRefreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const handleRefreshUser = async () => {
        const response = await getAuthUser();
        if(response.data){
            setUser(response.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!user) {
            const getLoggedUser = async () => {
                const response = await getAuthUser();
                if (response.data) {
                    setUser(response.data);
                    setLoading(false);
                }
            };
            getLoggedUser();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, handleRefreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUser(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}