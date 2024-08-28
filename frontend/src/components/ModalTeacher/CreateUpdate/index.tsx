import { useEffect, useState } from 'react';
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
    Checkbox
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Container } from './style';
import { ITeacher } from '@/interfaces';
import { boolean, object, string, ValidationError } from 'yup';
import createTeacher from '@/services/teacher/create';
import updateTeacher from '@/services/teacher/update';
interface ModalTeacherProps {
    children?: React.ReactNode;
    data?: ITeacher
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    fetchTeachers: () => void;
}

interface TempDataProps {
    name: string;
    email: string;
    department: string;
    active: boolean;
}

export default function ModalCreateUpdateTeacher({children, data, isOpen, setIsOpen, fetchTeachers}: ModalTeacherProps) {
    
    const [tempData, setTempData] = useState<TempDataProps>({
        name: data?.name || '',
        email: data?.email || '',
        department: data?.department || '',
        active: data?.active || true
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

    useEffect(() => {
        if(!isOpen){
            setTempData({
                name: '',
                email: '',
                department: '',
                active: true
            });
        }

        if(data && data.id){
            setTempData({
                name: data.name,
                email: data.email,
                department: data.department,
                active: data.active
            });
        }

    }, [isOpen,data]);

    function handleChange(key:string, value:string | boolean){
        setTempData({...tempData, [key]: value});
    }

    async function handleSubmit(){
        const schema = object().shape({
            name: string().required("Nome é obrigatório"),
            email: string().email("Email inválido").required("Email é obrigatório"),
            department: string().required("Selecione um departamento válido"),
            active: boolean().required("Selecione um status válido")
        });

        try{
            await schema.validate(tempData);
        }catch(error){
            if(error instanceof ValidationError){
                return toast({
                    title: error.message,
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true
                });
            }
        }

        if(data && data.id){
            handleUpdateTeacher();
            return;
        }
        handleCreateTeacher();
    }

    async function handleCreateTeacher(){
        const response = await createTeacher(tempData);
        toast({
            title: response.message,
            status: response.status,
            position: "top",
            duration: 5000,
            isClosable: true
        });
        if(response.status === "success"){
            fetchTeachers();
            setIsOpen(false);
        }
    }

    async function handleUpdateTeacher(){
        if(data && data.id){
            const response = await updateTeacher({...tempData, id: data.id});
            toast({
                title: response.message,
                status: response.status,
                position: "top",
                duration: 5000,
                isClosable: true
            });
            if(response.status === "success"){
                fetchTeachers();
                setIsOpen(false);
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
                            value={tempData?.name} 
                            onChange={(e) =>handleChange("name", e.target.value)} 
                            placeholder="Digite o nome completo do professor" 
                        />
                    </Box>
                    <Box> 
                        <FormLabel>Email</FormLabel>
                        <Input 
                            value={tempData?.email} 
                            onChange={(e) => handleChange("email", e.target.value)}
                            placeholder="Digite o email do professor" 
                        />
                    </Box>
                    <Box> 
                        <FormLabel>Departamento</FormLabel>
                        <Select
                            value={tempData?.department}
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
                    <Box> 
                        {/* Check box */}
                        <Checkbox 
                        isChecked={tempData.active}
                        onChange={(e) => handleChange("active", e.target.checked)}
                        borderColor={"black"}
                        >
                        Ativo
                        </Checkbox>
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
                  {
                    data && data.id? "Atualizar" : "Cadastrar"
                  }
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}