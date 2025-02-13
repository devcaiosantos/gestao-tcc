# 📅 Configuração da Google Calendar API para Seu Software

Este guia fornece um passo a passo para configurar a API do Google Calendar e integrá-la ao seu sistema.

---

## Passo 2: Fazer Login no Google Cloud Console
1. Acesse [Google Cloud Console](https://console.cloud.google.com/).
2. Faça login com a conta Google desejada.

---

## Passo 2: Criar um Novo Projeto
1. Clique em **Select a Project**.
   ![Imagem 1](https://github.com/user-attachments/assets/9ea673e2-9dd2-4cd7-9f4b-285f9c41de75)
2. Clique em **New Project**.
   ![Imagem 2](https://github.com/user-attachments/assets/035e96d8-7d82-4bba-978d-6f11bb6d57d7)
3. Preencha o nome do projeto e selecione a organização desejada. Em seguida, clique em **Create**.
   ![Imagem 3](https://github.com/user-attachments/assets/ae51d73e-761e-45e1-8292-a3760f1c86e9)
4. Após retornar à tela inicial, clique em **Select Project**.
   ![Imagem 4](https://github.com/user-attachments/assets/7d5ba62a-4c16-4375-9c2a-b635ea1f2bf9)

---

## Passo 3: Configurar Credenciais
1. Na barra lateral, acesse **APIs & Services** e clique em **Credentials**.
   ![Imagem 5](https://github.com/user-attachments/assets/c653f478-63fc-4ba2-adcd-5ee40af20d50)
2. No topo da tela, clique em **Create Credentials** e selecione **Service Account**.
   ![Imagem 6](https://github.com/user-attachments/assets/c1220a45-7a01-48b3-a125-cd0f21139f17)
3. Preencha as informações do formulário e clique em **Create and Continue**.
   ![Imagem 7](https://github.com/user-attachments/assets/741425b3-fb6b-47f7-9e44-ff2e321338b1)
4. Clique em **Continue** e em **Done**. (Não é necessário preencher os campos adicionais.)
   ![Imagem 8](https://github.com/user-attachments/assets/b3e4b27d-57e7-4365-9d79-f20f45c0bdb1)

---

## Passo 4: Criar e Baixar a Chave JSON
1. Retorne à tela do projeto e clique na Service Account criada.
   ![Imagem 10](https://github.com/user-attachments/assets/d892cf52-c366-4771-bc9a-9d03a8f09037)
2. Abra a aba **Keys**.
   ![Imagem 11](https://github.com/user-attachments/assets/47ba99fb-4d03-425f-a25a-7ee0360ad91f)
3. Clique em **Add Key** > **Create new key**.
   ![Imagem 12](https://github.com/user-attachments/assets/104589f9-e3e1-4912-a84d-27f11885a9bf)
4. Selecione o formato **JSON** e clique em **Create**. O arquivo .json será baixado automaticamente.
   ![Imagem 13](https://github.com/user-attachments/assets/3a692d49-3226-4ed2-b5f7-e5194368a5a0)

---

## Passo 5: Habilitar a API do Google Calendar
1. No menu lateral, acesse **APIs & Services** > **Library**.
   ![Imagem 14](https://github.com/user-attachments/assets/6e2fba7a-e940-4d4f-8831-943d7dc949e6)
2. Pesquise por **Google Calendar API** e clique nela.
   ![Imagem 15](https://github.com/user-attachments/assets/a18aa613-2f71-41ed-bd9e-7e54132c0521)
3. Clique em **Enable** para ativar a API.
   ![Imagem 16](https://github.com/user-attachments/assets/bf4b3f40-8b60-4734-8511-a673fe1b9c67)

---

## Passo 6: Obter o ID do Calendário
1. Acesse [Google Calendar](https://calendar.google.com/).
2. Crie um novo calendário ou utilize um existente.
3. Para obter o ID do calendário:
   - Passe o mouse sobre o calendário desejado.
   - Clique nos três pontos e selecione **Settings and sharing**.
     ![Imagem 17](https://github.com/user-attachments/assets/6485cf8d-003f-484a-af46-75acb37f46d8)
   - Role a página até encontrar o campo **Calendar ID**.
     ![Imagem 18](https://github.com/user-attachments/assets/45eb8af8-73f7-442f-9303-d5e8fae55f08)

---

Agora a integração com o Google Calendar está configurada! ✅
