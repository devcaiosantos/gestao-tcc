import styled from 'styled-components';
import theme from '@/style/theme';
import { MdOutlineAlternateEmail, MdKey } from "react-icons/md";
const { colors, fonts } = theme;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${colors.dark};
`;

export const Form = styled.div`
  display: flex;
  width: 600px;
  background-color: transparent;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  flex-direction: column;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  background-color: transparent;
  border: 1px solid ${colors.secondary};
  border-radius: 4px;
  color: ${colors.light};
  font-size: 1.1rem;
  font-family: ${fonts.secondary};
  &:focus {
    outline: none;
    box-shadow: 0px 0px 2px ${colors.primary};
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${colors.primary};
  color: ${colors.light};
  border: none;
  border-radius: 4px;

  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  color: ${colors.light};
  margin: 5px;
  font-size: 1.0rem;
  font-weight: 500;
`;

export const ErrorMessage = styled.p`
  color: ${colors.danger};
`;

export const MailIcon = styled(MdOutlineAlternateEmail)`
  color: ${colors.light};
  font-size: 1.3rem;
`;

export const PasswordIcon = styled(MdKey)`
  color: ${colors.light};
  font-size: 1.3rem;
`;