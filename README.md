# CARONTE - Frontend

## Descripción

Caronte es la aplicación frontend desarrollada con Expo y React Native para proporcionar una interfaz intuitiva y accesible a los usuarios. Este proyecto permite la gestión de esquelas y mensajes post-mortem con un diseño moderno y adaptable a distintos dispositivos. Además, ofrecemos a empresas del sector funerario poder promocionarse en nuestra aplicación.


## Requisitos

- **Node.js** (versión recomendada: 18 o superior)
- **npm** (incluido con Node.js) o **yarn**
- **Expo CLI**

### Instalación en Ubuntu

1. **Instalar Node.js y npm:**

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

   Verifica la instalación con:
   ```bash
   node -v
   npm -v
   ```
   
2. **Instalar Expo CLI:**

   ```bash
   npm install -g expo-cli
   ```
   
   Verifica la instalación con:
   ```bash
   expo --version
   ```
   
### Instalación en Windows

1. **Instalar Node.js:**

- Descarga el instalador desde la [página oficial de Node.js](https://nodejs.org/).
- Ejecuta el instalador y sigue las instrucciones.
- Verifica la instalación con:

   ```bash
   node -v
   npm -v
   ```
   
2. **Instalar Expo CLI:**
   ```bash
   npm install -g expo-cli
   ```

   Verifica la instalación con:

   ```bash
   expo --version
   ```

   
## Instalación del proyecto

### Paso 1: Clonar el repositorio

   Clona el repositorio en tu máquina:
   ```bash
   git clone git@github.com:ISPP-2425-G9/frontend.git
   cd caronte-frontend
   ```

### Paso 2: Instalar dependencias

   Ejecuta el siguiente comando para instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
   Si estás usando Yarn, puedes ejecutar:
   ```bash
   yarn install
   ```

### Paso 3: Iniciar la aplicación

   Para iniciar la aplicación en modo desarrollo, ejecuta:
   ```bash
   npx expo start
   ```
   o también puedes hacer
   ```bash
   npm start
   ```

En la salida de la consola, encontrarás opciones para abrir la app en un:
- Poniendo en el navegador: `http://localhost:8081`.
- Expo Go


## Restablecer el proyecto
   
   Si deseas comenzar con una versión limpia del proyecto, puedes ejecutar:
   ```bash
   npm run reset-project
   ```
   Este comando moverá el código inicial a un directorio de ejemplo y creará un nuevo directorio app donde podrás empezar a desarrollar.

