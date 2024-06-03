"use client"
import useAuthContext from "@/hooks/useAuthContext";
import { WelcomeTitle } from "./style";
export default function Dashboard() {
    const { admin } = useAuthContext();
    return (
      <div>
        <WelcomeTitle>Bem vindo, {admin?.name.split(" ")[0]}.</WelcomeTitle>
      </div>
    );
  }
  