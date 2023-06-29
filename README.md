# Ale FM

## 🚀 Projeto
Uma rádio web tocando minhas músicas preferidas, 24h por dia!

<p align="center">
    <img src="github/home.png" alt="home" title="Homepage" width="85%"/>
</p>

## ▶️ Play!:
Confira em [https://ale-fm.vercel.app](https://ale-fm.vercel.app)

## 🛠️ Tecnologias
- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)

## 🧊 Cool features:
- Uma função carrega os nomes de todas as musicas da minha pasta do Dropbox, montando uma variável 'playlist' com os links dos arquivos;
- A playlist é embaralhada 1x por dia. Tenha sempre uma programação variada!
- A hora do dia define o ponto da playlist que irá começar a tocar (ex: começou a ouvir as seis da tarde? Já passou 75% das músicas!)/
- Por fim, uma API busca as informações do álbum da música atual para exibir nomes, datas, e arte de capa!
- As informações também podem ser lidas dos metadados do arquivo, se disponíveis.

## 🗂️ Desenvolvimento:

### 🐑🐑 Clonando o repositório:

```bash
  $ git clone url-do-projeto.git
```

### 🎵 Customizando a playlist:
Crie um arquivo playlist.txt no seu Dropbox. Use o link de compartilhamento desse arquivo em <code>[index.tsx](https://github.com/Alessandro1918/aleFM/blob/main/src/pages/index.tsx)</code>:
```bash
  const playlistUrl = "https://www.dropbox.com/s/ms2oldzgrkuquj4/playlist.txt?dl=0"
```

Preencha esse arquivo playlist.txt com o ID de compartilhamento e nome do arquivo de suas músicas do Dropbox:
- Link do Dropbox: <code>https://www.dropbox.com/s/0br63l7o6o3yq8r/ACDC%20-%20Thunderstruck.mp3?dl=0</code>
- playlist.txt: <code>0br63l7o6o3yq8r - ACDC - Thunderstruck</code>

Dica: para obter o ID de compartilhamento de todas as músicas de uma pasta do seu Dropbox, use o script <code>[utils/getDropboxLinks.js](https://github.com/Alessandro1918/aleFM/blob/main/src/utils/getDropboxLinks.js)</code>. Funcionamento descrito no arquivo.

### ▶️ Rodando o App:

```bash
  $ cd aleFM
  $ npm install             #download dependencies to node_modules
  $ npm run dev             #start the project
```

Ver o projeto rodando em:
<code>[http://localhost:3000](http://localhost:3000)</code>

## ⭐ Like, Subscribe, Follow
Curtiu o projeto? Marque esse repositório com uma Estrela ⭐!
