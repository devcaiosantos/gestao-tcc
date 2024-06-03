"use client"
import {useState} from "react";
import ModalCreateUpdateTextTemplate from "@/components/ModalTextTemplate/CreateUpdate";
import {Button} from "@chakra-ui/react";

export default function TextTemplates() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <ModalCreateUpdateTextTemplate
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            fetchTextTemplates={() => {}}
        >
            <Button onClick={()=>setIsOpen(true)}>
                Adicionar Modelo de Texto
            </Button>
        </ModalCreateUpdateTextTemplate>
    )
}