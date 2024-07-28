import {useState} from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure, 
  } from "@chakra-ui/react"
import { Container } from "./style"
import { FaTrash } from "react-icons/fa"
import { useToast } from "@chakra-ui/react"
import unenrollStudent from "@/services/enrollment/unenroll";
import { IEnrollmentStudent } from "@/interfaces";

interface ModalEnrollProps {
    enrollment: IEnrollmentStudent
    fetchEnrollments: () => void
}



export default function ModalUnenroll({enrollment, fetchEnrollments}: ModalEnrollProps) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    async function handleUnenroll() {
        if(!enrollment.id || typeof(enrollment.id) !== "number"){
            toast({
                title: "ID inválido",
                description: "Erro ao desmatricular aluno",
                status: "error",
                duration: 4000,
                isClosable: true,
            })
        }

        const response = await unenrollStudent(enrollment.id)
        
        toast({
            title: response.message,
            status: response.status,
            duration: 4000,
            isClosable: true,
        })

        if(response.status === "success"){
            fetchEnrollments()
            onClose()
        }

    }

    return (
      <>
        <Button
            onClick={onOpen}
            variant={"outline"}
            colorScheme="red"
        >
            <FaTrash/>
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Desmatricular Aluno</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Container>
                    Tem certeza que deseja desmatricular o aluno?
                </Container>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                colorScheme='red' 
                onClick={handleUnenroll}
                variant='ghost'>
                Desmatricular 
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }