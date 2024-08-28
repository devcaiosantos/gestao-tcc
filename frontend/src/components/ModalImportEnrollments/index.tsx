import { use, useState, useEffect } from 'react';
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
    useToast,
    Select,
} from '@chakra-ui/react'
import { ISemester } from '@/interfaces';
import { FaArrowDown } from 'react-icons/fa';
import importEnrollmentsFromSemester from '@/services/enrollment/importFromSemester';
import findAllSemesters from '@/services/semester/findAll';
import useAuthContext from '@/hooks/useAuthContext';

interface ModalImportEnrollmentsProps {
    fetchEnrollments: () => void;
}


export default function ModalImportEnrollments({ fetchEnrollments }: ModalImportEnrollmentsProps) {
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { activeSemester } = useAuthContext();
    const toast = useToast();

    const lastSemester = semesters.find((s)=>{
        if(activeSemester?.number === 1){
            return s.year == activeSemester?.year - 1 && s.number == 2;
        }
        return s.year == activeSemester?.year && s.number == activeSemester?.number - 1;
    })

    useEffect(() => {
        if(!isOpen){
            setSelectedSemesterId("");
        }
    }, [isOpen]);

    useEffect(() => {
        async function fetchSemesters(){
            const response = await findAllSemesters();
            if(response.status === "error"){
                toast({
                    title: response.message,
                    status: response.status,
                    duration: 5000,
                    isClosable: true
                });
                return;
            }
            if(response.data) {
                const othersSemesters = response.data.filter(semester => !semester.active);
                setSemesters(othersSemesters);
            }
        }
        fetchSemesters();
    }, []);

    async function handleSubmit(){
        if(!lastSemester){
            toast({
                title: "Nenhum semestre anterior encontrado",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        
        const response = await importEnrollmentsFromSemester(Number(lastSemester?.id));
        toast({
            title: response.message,
            status: response.status,
            duration: 5000,
            isClosable: true
        });
        if(response.status === "success"){
            fetchEnrollments();
            onClose();
        }
        
    }

    return (
        <>
        {
            lastSemester
            &&
            (
                <Button
                    onClick={onOpen}
                    colorScheme="yellow"
                    leftIcon={<FaArrowDown/>}
                >
                    Importar Matrículas
                </Button>
            )
        }
          

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Importar Matrículas</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Último semestre: {lastSemester?.year}/{lastSemester?.number}
            
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                    colorScheme='green' 
                    onClick={()=>handleSubmit()}
                >
                    Importar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
    )
}