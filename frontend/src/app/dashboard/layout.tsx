"use client"
import React from "react";
import Sidebar from "@/components/SideBar";
import { Spinner, Button, Flex } from '@chakra-ui/react'
import { useAuthContext } from "@/hooks/useAuthContext";
import { LoadContainer, FailedConnectionBox } from "./style";
import { deleteCookie } from "@/utils/cookies";
import { useRouter } from "next/navigation";
interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { admin, connectionError, clearAdmin } = useAuthContext();
    const router = useRouter();

    function handleLogout() {
        deleteCookie("tcc-token");
        clearAdmin();
        router.refresh();
    }

    if (connectionError.message) {
        return (
            <LoadContainer>
                <FailedConnectionBox>
                    <p>
                        {connectionError.message}
                    </p>
                    <Button onClick={handleLogout}>
                        Sair
                    </Button>
                </FailedConnectionBox>
            </LoadContainer>
        )
    }

    if (!admin) {
        return (
            <LoadContainer>
                <Spinner />
            </LoadContainer>
        ) 
    }
    
    return (
        <Sidebar>
            {children}
        </Sidebar>
    );
};

export default DashboardLayout;

