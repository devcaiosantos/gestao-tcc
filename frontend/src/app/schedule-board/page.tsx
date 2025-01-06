"use client"
import { useState, useEffect, Suspense } from 'react';
import RetrieveTeachers from '../../services/teacher/findAll';
import { ITeacher } from '@/interfaces';
import { useSearchParams } from 'next/navigation';
import parseJwtStudent from '@/utils/parseJwtStudent';
import { Container, InputsContainer, Note, StudentInfo, ResponseContainer, ErrorText } from "./style";
import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import { object, array, number, ValidationError, string } from 'yup';
import validateStudentToken from '@/services/validateStudentToken';
import scheduleBoardStudent from '@/services/enrollment/scheduleBoardStudent';
import { Spinner } from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface IFormData {
    location: string;
    dateTime: string;
}

function ScheduleBoardComponent() {
    const [formData, setFormData] = useState<IFormData>({
        location: "",
        dateTime: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({
        location: "",
        dateTime: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isDone, setIsDone] = useState(false);
    const searchParams = useSearchParams();
    const [student, setStudent] = useState({
        id: 0,
        name: "",
        ra: "",
    });
    const toast = useToast();

    useEffect(() => {
        const token = searchParams.get('token');
      
        if (!token) {
            setTokenError("[1] Link inválido");
            setIsLoading(false);
            return;
        }

        const payload = parseJwtStudent(token);

        if (!payload) {
            setTokenError("[2] Link inválido");
            setIsLoading(false);
            return;
        }

        if(payload.exp < Date.now() / 1000){
            setTokenError("Seu link expirou :(");
            setIsLoading(false);
            return;
        }

        async function validateToken() {
            const response = await validateStudentToken({
                status: "agendar-banca",
                token: token || "",
            });

            if (response.status === "error") {
                setTokenError("[3] Link inválido");
            }
            setIsLoading(false);
        }

        validateToken();

        setStudent({
            id: payload.id,
            name: payload.student.nome,
            ra: payload.student.ra,
        });

    }, [searchParams]);

    async function handleClick(){
        setIsLoading(true);

        const schema = object().shape({
            location: string().required("Informe o local"),
            dateTime: string().required("Informe a data e horário")
        });
  
        try {
            await schema.validate(formData, {abortEarly: false});
        } catch (error) {
            if (error instanceof ValidationError) {
                const yupErrors: ValidationError = error;
                const newErrors: Record<string, string> = {};
                yupErrors.inner.forEach((e) => {
                    newErrors[e.path as string] = e.message;
                });
                setErrors(newErrors);
            }
            setIsLoading(false);
            return;
        }

        const formattedData = {
            studentToken: searchParams.get('token') || "",
            location: formData.location,
            dateTime: new Date(formData.dateTime)?.toISOString()
        }
  
        const response = await scheduleBoardStudent(formattedData);
        setIsLoading(false);
        
        if(response.status === "error"){
            toast({
                title: response.message,
                status: "error",
                duration: 5000,
                isClosable: true
            });
            return;
        }

        if(response.status === "success"){
            setIsDone(true);
        }
    }
    

    if(isDone){
      return <Container>
        <ResponseContainer>
            <p>
                <FaCheckCircle color="green" size={30} />
            </p>
            Banca agendada com sucesso!
        </ResponseContainer>
      </Container>
    }

    if (isLoading) {
        return <Container>
          <div><Spinner/></div>
        </Container>
    }

    if (tokenError) {
        return <Container>
            <ResponseContainer>
                <p>
                    <FaExclamationCircle color="yellow" size={30} />
                </p>
            </ResponseContainer>
            {tokenError}
        </Container>;
    }

    return (
      <Container>
        <StudentInfo>
          <Box>Aluno: {student.name}</Box>
          <Box>RA: {student.ra}</Box>
        </StudentInfo>

        <InputsContainer>
            <FormControl>
                <FormLabel><b>Local:</b></FormLabel>
                <Input 
                    type="text" 
                    placeholder="Digite o local, ex: Bloco A, Sala 101"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                {errors.location && <ErrorText>{errors.location}</ErrorText>}
            </FormControl>
            <FormControl>
                <FormLabel><b>Data/Horário:</b></FormLabel>
                <Input 
                    type="datetime-local" 
                    placeholder="Digite a data e horário"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                />
                {errors.dateTime && <ErrorText>{errors.dateTime}</ErrorText>}
            </FormControl>
        </InputsContainer>
          
        <Button
          colorScheme="yellow"
          onClick={handleClick}
          isLoading={isLoading}
          loadingText="Definindo banca..."
        >
            Agendar Banca
        </Button>
      </Container>
    );
}

export default function ScheduleBoard() {
    return (
      <Suspense fallback={<div><Spinner/></div>}>
        <ScheduleBoardComponent />
      </Suspense>
    );
}
