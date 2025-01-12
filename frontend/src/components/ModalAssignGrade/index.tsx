import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Tooltip,
    Text,
    Button,
    useDisclosure,
    ModalHeader,
    useToast
} from '@chakra-ui/react';
import { GrScorecard } from "react-icons/gr";
import { IEnrollmentStudent } from '@/interfaces';
import {
    StyledFormLabel,
    StyledInput,
    StyledButton,
} from "./style";
import assignGrade  from '@/services/enrollment/assignGrade';


interface ModalAssignGradeProps {
    data: IEnrollmentStudent;
    fetchEnrollments: () => void;
}

const ModalAssignGrade = ({ data, fetchEnrollments }: ModalAssignGradeProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [grade, setGrade] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    const formatGrade = (grade: string) => grade.replace(/[^0-9.]/g, "");

    const handleChangeGrade = (input: string) => {
        const formatted = formatGrade(input);
        setGrade(formatted);
    };

    const validGrade = () => {
        const gradeFloat = parseFloat(grade);
        return !isNaN(gradeFloat) && gradeFloat >= 0 && gradeFloat <= 10;
    }

    const handleSave = async () => {
        setIsLoading(true);

        if(!validGrade()) {
            toast({
                title: "Nota deve ser um número entre 0.0 e 10.0",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        const response = await assignGrade({
            enrollmentId: data.id,
            grade: parseFloat(grade)
        });

        if (response.status === "error") {
            toast({
                title: "Erro ao atribuir nota",
                description: response.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        fetchEnrollments();
        onClose();
    };

    return (
        <>
            <Tooltip label="Atribuir Nota" aria-label="A tooltip">
                <Button 
                colorScheme='blue'
                variant='outline'
                onClick={onOpen}>
                    <GrScorecard />
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Atribuir Nota - {data.studentName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mt={4}>
                            <StyledFormLabel>NOTA:</StyledFormLabel>
                            <StyledInput
                                type="text"
                                variant="flushed"
                                value={grade}
                                onChange={(e) => handleChangeGrade(e.target.value)}
                                placeholder="0.0 à 10.0"
                                maxLength={4}
                            />
                            {grade && !validGrade() &&(
                                <Text color="red.500" fontSize="sm">
                                    A nota deve estar entre 0.0 e 10.0
                                </Text>
                            )}
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            isDisabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <StyledButton
                            colorScheme={parseFloat(grade) >= 6 ? "green" : "red"}
                            onClick={handleSave}
                            isDisabled={grade === "" || !validGrade() || isLoading}
                        >
                            {parseFloat(grade) >= 6 ? "Aprovar" : "Reprovar"}
                        </StyledButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ModalAssignGrade;
