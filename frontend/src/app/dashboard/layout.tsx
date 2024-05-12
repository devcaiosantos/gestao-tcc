"use client"
import React from "react";
import Sidebar from "@/components/SideBar";
import { Spinner } from '@chakra-ui/react'
import { useAuthContext } from "@/hooks/useAuthContext";
import { LoadContainer } from "./style";
interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { admin } = useAuthContext();
    if (!admin) {
        return <LoadContainer>
             <Spinner />
        </LoadContainer>
    }
    
    return (
        <Sidebar>
            {children}
        </Sidebar>
    );
};

export default DashboardLayout;

