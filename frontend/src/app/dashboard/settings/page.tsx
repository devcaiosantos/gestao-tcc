"use client"
import { Divider } from "@chakra-ui/react";
import { Container, Title, Item } from "./style";
import { FiSettings } from "react-icons/fi";
import { FaChalkboardTeacher, FaUser, FaBookOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter();
    const basePath = "/dashboard/settings";
    return (
        <Container>
            <Title>
                <FiSettings/>
                Configurações
            </Title>
            <Divider/>
            <Item onClick={()=>router.push(basePath+"/account")}>
                <FaUser/>
                Conta
            </Item>
            <Item onClick={()=>router.push(basePath+"/teachers")}>
                <FaChalkboardTeacher/>
                Professores
            </Item>
            <Item onClick={()=>router.push(basePath+"/texts")}>
                <FaBookOpen/>
                Textos Padrão
            </Item>
        </Container>
       
    );
}