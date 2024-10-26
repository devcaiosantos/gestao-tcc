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
    Box,
    Radio,
    RadioGroup,
    Stack,
    Switch
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { Container } from './style';
import { ISemester } from '@/interfaces';
import { boolean, number, object, ValidationError } from 'yup';
import createSemester from '@/services/semester/create';
import updateSemester from '@/services/semester/update';
interface ModalSemesterProps {
    children?: React.ReactNode;
    data?: ISemester;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    fetchSemesters: () => void;
}

interface TempDataProps {
    year: number;
    number: number;
    active: boolean;
}

export default function ModalCreateUpdateSemester({children, data, isOpen, setIsOpen, fetchSemesters}: ModalSemesterProps) {

    const [tempData, setTempData] = useState<TempDataProps>({
        year: data?.year || new Date().getFullYear(),
        number: data?.number || 1,
        active: data?.active || true
    });
    const toast = useToast();

    useEffect(() => {
        if (!isOpen) {
            setTempData({
                year: new Date().getFullYear(),
                number: 1,
                active: true
            });
        }

        if (data && data.id) {
            setTempData({
                year: data.year,
                number: data.number,
                active: data.active
            });
        }

    }, [isOpen, data]);

    function handleChange(key: string, value: string | number | boolean) {
        setTempData({ ...tempData, [key]: value });
    }

    async function handleSubmit() {
        const schema = object().shape({
            year: number().required("Ano é obrigatório").min(2000, "Ano deve ser maior que 2000").max(2100, "Ano deve ser menor que 2100"),
            number: number().required("Número é obrigatório").min(1, "Número deve ser 1 ou 2").max(2, "Número deve ser 1 ou 2"),
            active: boolean().required("Selecione um status válido")
        });

        try {
            await schema.validate(tempData);
        } catch (error) {
            if (error instanceof ValidationError) {
                return toast({
                    title: error.message,
                    status: "error",
                    position: "top",
                    duration: 5000,
                    isClosable: true
                });
            }
        }

        if (data && data.id) {
            handleUpdateSemester();
            return;
        }
        handleCreateSemester();
    }

    async function handleCreateSemester() {
        const response = await createSemester(tempData);
        toast({
            title: response.message,
            status: response.status,
            position: "top",
            duration: 5000,
            isClosable: true
        });
        if (response.status === "success") {
            fetchSemesters();
            setIsOpen(false);
        }
    }

    async function handleUpdateSemester() {
        if (data && data.id) {
            const response = await updateSemester({ ...tempData, id: data.id });
            toast({
                title: response.message,
                status: response.status,
                position: "top",
                duration: 5000,
                isClosable: true
            });
            if (response.status === "success") {
                fetchSemesters();
                setIsOpen(false);
            }
        }
    }

    return (
        <>
            {children}
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Informações do Semestre</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Container>
                            <Box>
                                <FormLabel>Ano</FormLabel>
                                <Input 
                                    type="number"
                                    value={tempData?.year}
                                    min={2000}
                                    max={2100}
                                    onChange={(e) => handleChange("year", parseInt(e.target.value))}
                                />
                            </Box>
                            <Box>
                                <FormLabel>Número</FormLabel>
                                <RadioGroup 
                                    value={tempData?.number.toString()}
                                    onChange={(value) => handleChange("number", parseInt(value))}
                                >
                                    <Stack direction="row">
                                        <Radio value="1">1</Radio>
                                        <Radio value="2">2</Radio>
                                    </Stack>
                                </RadioGroup>
                            </Box>
                            <Box>
                                <Switch 
                                    isChecked={tempData.active}
                                    onChange={(e) => handleChange("active", e.target.checked)}>
                                    Ativo
                                </Switch>
                            </Box>
                        </Container>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            colorScheme='green'
                            variant='ghost'
                            onClick={handleSubmit}
                        >
                            {data && data.id ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
