import React, { ReactNode } from "react";
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button
} from "@chakra-ui/react";
import {
  FiHome,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";
import { 
  FaChalkboardTeacher, 
  FaFileAlt,
  FaCalendarCheck,
  FaEdit 
} from "react-icons/fa";
import { TbHexagonNumber1, TbHexagonNumber2 } from "react-icons/tb";
import { SiGoogleforms } from "react-icons/si";
import { IconType } from "react-icons";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/hooks/useAuthContext";
import { deleteCookie } from "@/utils/cookies";
import theme from "@/style/theme";
import findActiveSemester from "@/services/semester/findActive";


const { colors } = theme;
interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const RegistrationItems: Array<LinkItemProps> = [
  //{ name: "Alunos", icon: IoMdSchool, path: "/dashboard/students" },
  { name: "Professores", icon: FaChalkboardTeacher, path: "/dashboard/teachers" },
  { name: "Modelos de Texto", icon: FaFileAlt, path: "/dashboard/text-templates" },
];

const LinkItems: Array<LinkItemProps> = [
  { name: "Tela Inicial", icon: FiHome, path: "/dashboard" },
  { name: "Configurações", icon: FiSettings, path: "/dashboard/settings" },
];

export default function Sidebar({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={colors.dark}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  const {activeSemester} = useAuthContext();
  return (
    <Box
      transition="3s ease"
      bg={colors.dark}
      borderRight="1px"
      borderRightColor={colors.dark700}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex 
      cursor={"pointer"}
      onClick={() => router.push("/dashboard")}
      h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Gestão TCC
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex
        pl={4}
        pr={2}
        mb={4}
        flexDir={"column"}
        alignItems={"start"}
        gap={2}
      >
        <Text
          display={"flex"}
          alignItems={"center"}
          gap={2}
          fontSize="md"
          fontWeight="semibold"
        >
          <FaCalendarCheck />
          Semestre ativo: 
        </Text>
        <Button
          onClick={()=>router.push("/dashboard/semesters")}
          bgColor={colors.dark600}
          width={"100%"}
          rightIcon={<FaEdit/>}
        >
          {
            activeSemester 
            ? `${activeSemester.year}/${activeSemester.number}`
            : "Nenhum semestre ativo"
          }
        </Button>
      </Flex>
      
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Flex fontWeight={"semibold"}
              alignItems={"center"} textAlign={"left"} w={"100%"} gap={2}>
                <SiGoogleforms />
                Cadastros
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pl={4} pb={0}>
            {RegistrationItems.map((link) => (
              <NavItem key={link.name} icon={link.icon} path={link.path}>
                {link.name}
              </NavItem>
            ))}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Flex fontWeight={"semibold"}
                alignItems={"center"} textAlign={"left"} w={"100%"} gap={2}>
                <TbHexagonNumber1 />
                TCC 1
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pl={4} pb={0}>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Flex fontWeight={"semibold"}
                alignItems={"center"} textAlign={"left"} w={"100%"} gap={2}>
                <TbHexagonNumber2 />
                TCC 2
              </Flex>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pl={4} pb={0}>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: string | number;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  return (
    <Link href={path} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
      <Flex
        align="center"
        p="2"
        mx="1"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: colors.dark800,
          color: "white",
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const router = useRouter();
  const { admin, clearAdmin } = useAuthContext();

  function handleLogout() {
    deleteCookie("tcc-token");
    clearAdmin();
    router.push("/");
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={colors.dark}
      borderBottomWidth="1px"
      borderBottomColor={colors.dark700}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Gestão TCC
      </Text>
      
      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}>
              <HStack>
                <Avatar
                  size={"sm"}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{admin?.name || ""}</Text>
                  <Text fontSize="xs" color={colors.dark600}>
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={colors.dark}
              borderColor={colors.dark700}>
              <MenuItem bg="transparent" onClick={()=>router.push("/dashboard/profile")}>
                Perfil
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={()=>handleLogout()}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};