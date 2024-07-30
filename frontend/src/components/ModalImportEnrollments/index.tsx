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

interface ModalImportEnrollmentsProps {
    fetchEnrollments: () => void;
}


export default function ModalImportEnrollments({ fetchEnrollments }: ModalImportEnrollmentsProps) {
    const [semesters, setSemesters] = useState<ISemester[]>([]);
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

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
        if(!selectedSemesterId){
            toast({
                title: "Selecione um semestre",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }
        
        const response = await importEnrollmentsFromSemester(Number(selectedSemesterId));
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
          <Button
            onClick={onOpen}
            colorScheme="yellow"
            variant="outline"
            leftIcon={<FaArrowDown/>}
          >
            Importar Matrículas
          </Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Importar Matrículas</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {
                    semesters && 
                    <Select 
                    placeholder="Selecione um semestre"
                    value={selectedSemesterId}
                    onChange={(e) => setSelectedSemesterId(e.target.value)}
                    >
                    {
                        semesters.map(semester => (
                        <option key={semester.id} value={semester.id}>{semester.year}/{semester.number}</option>
                        ))
                    }
                    </Select>
                }
            
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                    colorScheme='green' 
                    variant='outline'
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