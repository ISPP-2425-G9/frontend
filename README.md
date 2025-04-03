# CARONTE - Frontend  

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/8a2b25799bbb4c179815520623e7a73d)](https://app.codacy.com/gh/ISPP-2425-G9/frontend/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)  

## Description  

This is the frontend of CARONTE developed with Expo and React Native to provide an intuitive and accessible interface for users. This project allows the management of obituaries and post-mortem messages with a modern design adaptable to different devices. Additionally, we offer funeral industry businesses the opportunity to promote themselves on our application.  

## Requirements  

- **Node.js** (recommended version: 18 or higher)  
- **npm** (included with Node.js) or **yarn**  
- **Expo CLI**  

### Installation on Ubuntu  

1. **Install Node.js and npm:**  

   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```  

   Verify the installation with:  
   ```bash
   node -v
   npm -v
   ```  

2. **Install Expo CLI:**  

   ```bash
   npm install -g expo-cli
   ```  

   Verify the installation with:  
   ```bash
   expo --version
   ```  

### Installation on Windows  

1. **Install Node.js:**  

- Download the installer from the [official Node.js website](https://nodejs.org/).  
- Run the installer and follow the instructions.  
- Verify the installation with:  

   ```bash
   node -v
   npm -v
   ```  

2. **Install Expo CLI:**  
   ```bash
   npm install -g expo-cli
   ```  

   Verify the installation with:  

   ```bash
   expo --version
   ```  

## Project Installation  

### Step 1: Clone the repository  

   Clone the repository to your machine:  
   ```bash
   git clone git@github.com:ISPP-2425-G9/frontend.git
   cd frontend
   ```  

### Step 2: Install dependencies  

   Run the following command to install the project dependencies:  
   ```bash
   npm install
   ```  
   If you are using Yarn, you can run:  
   ```bash
   yarn install
   ```  

### Step 3: Start the application  

   To start the application in development mode, run:  
   ```bash
   npx expo start
   ```  
   Alternatively, you can also run:  
   ```bash
   npm start
   ```  

In the console output, you will find options to open the app in:  
- By entering in the browser: `http://localhost:8081`.  
- Expo Go  

## Reset the project  

   If you want to start with a clean version of the project, you can run:  
   ```bash
   npm run reset-project
   ```  
   This command will move the initial code to an example directory and create a new `app` directory where you can start developing.


## Test

   In case you want to run test, you just have to run the following command:
      ```bash
      npm test
      ```  
