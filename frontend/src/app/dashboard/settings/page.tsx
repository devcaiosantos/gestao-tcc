"use client"
import { Divider } from "@chakra-ui/react";
import { Container, Item } from "./style";
import { TitlePage } from "../style";
import { FiSettings } from "react-icons/fi";
import { FaChalkboardTeacher, FaUser, FaBookOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter();
    const basePath = "/dashboard/settings";
    return (
        <Container>
            <TitlePage>
                <FiSettings/>
                Configurações
            </TitlePage>
            <Divider/>
            <Item onClick={()=>router.push(basePath+"/account")}>
                <FaUser/>
                Conta
            </Item>
            <Item onClick={()=>router.push(basePath+"/teachers")}>
                <FaChalkboardTeacher/>
                Professores
            </Item>
            <Item onClick={()=>router.push(basePath+"/text-templates")}>
                <FaBookOpen/>
                Textos Padrão
            </Item>
        </Container>
       
    );
}