"use client"
import { useState, useEffect } from 'react';
import RetrieveTeachers from '../../services/teacher/findAll';
import DefineAdvisorStudent from '@/services/enrollment/defineAdvisorStudent';
import { ITeacher } from '@/interfaces';
import { useSearchParams } from 'next/navigation';
import parseJwtStudent from '@/utils/parseJwtStudent';
import { Container, InputsContainer, Note } from './style';
import { FormLabel, Box, Select, Button, useToast } from '@chakra-ui/react';
import { object, number, ValidationError } from 'yup';

interface IFormData {
    advisorId: number;
    coadvisorId?: number;
}

const defaultFormData: IFormData = {
    advisorId: 0,
    coadvisorId: 0,
}

export default function DefineAdvisor() {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isDone, setIsDone] = useState(false);
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState(defaultFormData);
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

        fetchData();
    }, [searchParams]);

    function handleChange({key, value}: {key: string, value: number}) {
        setFormData({
            ...formData,
            [key]: value
        }); 
    }

    async function handleSubmit() {
      const schema = object().shape({
        advisorId: number().required(),
        coadvisorId: number(),
      });

      try{
       await schema.validate(formData);
      }
      catch(error){
        if(error instanceof ValidationError){
          toast({
            title: "Falha ao definir orientador(es)",
            description: error.message,
            status: "error",
            duration: 6000,
            isClosable: true,
          });
        }
        return;
      }

      const response = await DefineAdvisorStudent({
        advisorId: formData.advisorId,
        coAdvisorId: formData.coadvisorId,
        token: searchParams.get('token') || '',
      });

      toast({
        title: response.message,
        status: response.status,
        duration: 6000,
        isClosable: true,
      });

      if(response.status === "success"){
        setFormData(defaultFormData);
        setIsDone(true);
      }
    }

    if(isDone){
      return <Container>
        <div>Orientador definido com sucesso!</div>
      </Container>
    }

    if (isLoading) {
        return <Container>
          <div>Carregando...</div>;
        </Container>
    }

    if (tokenError) {
        return <Container>{tokenError}</Container>;
    }

    return (
      <Container>
        <InputsContainer>
          <Box>
            <FormLabel>Selecione o professor orientador</FormLabel>
            <Select 
            value={formData.advisorId}
            onChange={(event) => handleChange({key: 'advisorId', value: Number(event.target.value)})}
            placeholder="Selecione um professor">
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <FormLabel>Selecione o professor coorientador</FormLabel>
            <Select 
            value={formData.coadvisorId}
            onChange={(event) => handleChange({key: 'coadvisorId', value: Number(event.target.value)})}
            placeholder="Selecione um professor">
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </Select>
            <Note>* Não obrigatório</Note>
          </Box>
          <Button 
          onClick={handleSubmit}
          colorScheme="blue" size="lg">
            Definir Orientador(es)
          </Button>
        </InputsContainer>
          
      </Container>
    );
}