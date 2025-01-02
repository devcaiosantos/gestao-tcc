"use client"
import { useState, useEffect, Suspense } from 'react';
import RetrieveTeachers from '../../services/teacher/findAll';
import { ITeacher } from '@/interfaces';
import { useSearchParams } from 'next/navigation';
import parseJwtStudent from '@/utils/parseJwtStudent';
import { Container, InputsContainer, Note, StudentInfo, ResponseContainer } from './style';
import { Box, Button, useToast } from '@chakra-ui/react';
import { object, array, number, ValidationError, string } from 'yup';
import validateStudentToken from '@/services/validateStudentToken';
import TagsInput from '@/components/TagsInput';
import defineBoardStudent from '@/services/enrollment/defineBoardStudent';
import { Spinner } from '@chakra-ui/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface IFormData {
    advisorId: number;
    coadvisorId?: number;
}

interface Option {
    id: number;
    title: string;
}

function DefineBoardComponent() {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isDone, setIsDone] = useState(false);
    const searchParams = useSearchParams();
    const [selectedTeachers, setSelectedTeachers] = useState<Option[]>([]);
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
                status: "definir-banca",
                token: token || "",
            });

            if (response.status === "error") {
                setTokenError("[3] Link inválido");
            }
        }

        validateToken();

        async function fetchData() {
            try {
                const response = await RetrieveTeachers();
                if(response.data){
                  setTeachers(response.data.filter((teacher) => teacher.active));
                }
            } finally {
                setIsLoading(false);
            }
        }

        setStudent({
            id: payload.id,
            name: payload.student.nome,
            ra: payload.student.ra,
        });

        fetchData();
    }, [searchParams]);

    async function handleChange(value: Option[]) {
        setSelectedTeachers(value);
    }

    async function handleClick(){
        setIsLoading(true);

        const formattedData = {
            token: searchParams.get('token') || "",
            memberIds: selectedTeachers.map(teacher => teacher.id)
        }

        const schema = object().shape({
            memberIds:
            array()
            .min(3, "A banca deve ter no mínimo 3 membros").
            of(number()).required(),
            token: string().required()
        });
  
        try {
            await schema.validate(formattedData);
        } catch (error) {
            if (error instanceof ValidationError) {
                toast({
                title: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
                });
                setIsLoading(false);
                return;
            }
        }
  
        const response = await defineBoardStudent(formattedData);
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
            Banca definida com sucesso!
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
          <TagsInput
            id="tags-input"
            label={"Membros da banca:"}
            selectedTags={selectedTeachers}
            placeholder='Selecione os professores'
            onChange={handleChange}
            options={teachers.map(teacher => ({id: teacher.id, title: teacher.name}))}
          />
          <Note>Selecione no mínimo 3 professores</Note>
        </InputsContainer>
          
        <Button
          colorScheme="yellow"
          onClick={handleClick}
          isLoading={isLoading}
          loadingText="Definindo banca..."
        >
            Definir banca
        </Button>
      </Container>
    );
}

export default function DefineBoard() {
    return (
      <Suspense fallback={<div><Spinner/></div>}>
        <DefineBoardComponent />
      </Suspense>
    );
}
