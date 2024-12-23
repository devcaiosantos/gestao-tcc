Faça login na conta google desejada

Acesse console.cloud.google.com

Clique em "Select a project"
![1img](https://github.com/user-attachments/assets/9ea673e2-9dd2-4cd7-9f4b-285f9c41de75)

Clique em "New Project"
![2img](https://github.com/user-attachments/assets/035e96d8-7d82-4bba-978d-6f11bb6d57d7)

Preencha o nome para seu projeto  e selecione e organização desejada. Em seguida clique em "Create".
![3img](https://github.com/user-attachments/assets/ae51d73e-761e-45e1-8292-a3760f1c86e9)


Após retornar à tela inicial, clique em "Select Project".
![4img](https://github.com/user-attachments/assets/7d5ba62a-4c16-4375-9c2a-b635ea1f2bf9)


Na barra lateral, acesse "APIs & Services" e clique na opção "Credentials". 
![5img](https://github.com/user-attachments/assets/c653f478-63fc-4ba2-adcd-5ee40af20d50)


No topo da tela, clique em "Create Credentials" e logo em seguida em "Service Account".
![6img](https://github.com/user-attachments/assets/c1220a45-7a01-48b3-a125-cd0f21139f17)

Preencha as informações do formulário e clique em "Create and Continue".
![7img](https://github.com/user-attachments/assets/741425b3-fb6b-47f7-9e44-ff2e321338b1)


Em seguida clique em "Continue" e "Done". 
Não é necessário preencher esses campos.
![8img](https://github.com/user-attachments/assets/b3e4b27d-57e7-4365-9d79-f20f45c0bdb1)
![9img](https://github.com/user-attachments/assets/b7634803-58dd-4fa6-af5b-704221121031)

Voltando a tela do projeto, clique no Service Account criado.
![10img](https://github.com/user-attachments/assets/d892cf52-c366-4771-bc9a-9d03a8f09037)


Abra a aba de "Keys"
![11img](https://github.com/user-attachments/assets/47ba99fb-4d03-425f-a25a-7ee0360ad91f)


Abra o dropdown "Add Key" e clique na opção "Create new key"
![12img](https://github.com/user-attachments/assets/104589f9-e3e1-4912-a84d-27f11885a9bf)


Selecione a opção "JSON" e clique em "Create". Um arquivo .json que contém as chaves será baixado.
![13img](https://github.com/user-attachments/assets/3a692d49-3226-4ed2-b5f7-e5194368a5a0)

Já com as chaves criadas e baixadas, abra o menu lateral.
![14img](https://github.com/user-attachments/assets/6e2fba7a-e940-4d4f-8831-943d7dc949e6)

Passe com o mouse sobre "APIs & Services" e selecione a opção "Libray".
![15img](https://github.com/user-attachments/assets/a18aa613-2f71-41ed-bd9e-7e54132c0521)


Procure pelo "Google Calendar API" e o selecione.
![16img](https://github.com/user-attachments/assets/4b14d032-69da-4d74-a3d3-bd99f2a360df)

Clique no botão "Enable".
![17img](https://github.com/user-attachments/assets/bf4b3f40-8b60-4734-8511-a673fe1b9c67)

Agora com a API de calendário habilitada, é pegar o id do calendário que será manipulado. 
Para isso, acesse: https://calendar.google.com/

Agora você pode criar um novo calendário ou utilizar os que já estão disponíveis.

Para pegar o id do calendário "devgestaotcc1", basta passar o mouse sobre o mesmo, clicar nos 3 pontos e selecionar a opção "Settings and sharing"
![18img](https://github.com/user-attachments/assets/6485cf8d-003f-484a-af46-75acb37f46d8)

Desça até encontrar o campo com a informação do "Calendar ID".
![19img](https://github.com/user-attachments/assets/45eb8af8-73f7-442f-9303-d5e8fae55f08)
