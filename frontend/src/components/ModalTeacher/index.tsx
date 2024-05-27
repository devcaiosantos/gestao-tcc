import { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormLabel,
    Input,
    Select,
    Box,
    useDisclosure
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Container } from './style';
import { ITeacher } from '@/interfaces';
import { object, string, number, ValidationError } from 'yup';

interface ModalTeacherProps {
    children: React.ReactNode;
    data?: ITeacher
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}
export default function ModalTeacher({children, data, isOpen, setIsOpen}: ModalTeacherProps) {

    const [tempData, setTempData] = useState({
        id: data?.id || '',
        name: data?.name || '',
        email: data?.email || '',
        departament: data?.department || ''
    });
    const toast = useToast();
    const departaments = [
        "DACOM",
        "DAAMB",
        "DACOC",
        "DAELN",
        "DAAEQ",
        "DAQUI",
        "DABIC",
        "DAFIS",
        "DAGEE",
        "DAHUM",
        "DAMAT",
        "OUTRO"
    ];

    function handleChange(key:string, value:string){
        setTempData({...tempData, [key]: value});
    }

    async function handleSubmit(){
        const schema = object().shape({
            name: string().required("Nome é obrigatório"),
            email: string().email("Email inválido").required("Email é obrigatório"),
            department: string().required("Departamento é obrigatório")
        });

        try{
            await schema.validate(tempData);
        }catch(error){
            if(error instanceof ValidationError){
                return toast({
                    title: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true
                });
            }
        }
    }


    return (
        <>
          {children}
          <Modal isOpen={isOpen} onClose={()=>setIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Informações Professor</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                 <Container>
                    <Box> 
                        <FormLabel>Nome Completo</FormLabel>
                        <Input 
                            value={data?.name} 
                            onChange={(e) =>handleChange("name", e.target.value)} 
                            placeholder="Digite o nome completo do professor" 
                        />
                    </Box>
                    <Box> 
                        <FormLabel>Email</FormLabel>
                        <Input 
                            value={data?.email} 
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Digite o email do professor" 
                        />
                    </Box>
                    <Box> 
                        <FormLabel>Departamento</FormLabel>
                        <Select
                            value={data?.department}
                            onChange={(e) => handleChange("department", e.target.value)}
                            placeholder="Selecione o departamento"
                        >
                            {departaments.map((departament) => (
                                <option key={departament} value={departament}>
                                    {departament}
                                </option>
                            ))} 
                        </Select>
                    </Box>

                 </Container>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={()=>setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  colorScheme='green' 
                //   onClick={handleResetPassword}
                  variant='ghost'
                  onClick={handleSubmit}
                >
                  Cadastrar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}