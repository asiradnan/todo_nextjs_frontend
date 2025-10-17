<p align="center">
    <img src="https://raw.githubusercontent.com/asiradnan/todo_nextjs_frontend/refs/heads/main/app/favicon.ico" align="center" width="30%">
</p>
<p align="center">
    <h1 align="center">Cross Platform Todo App</h1>
</p>
<h3 align="center"> 
Web: <a href="https://todo.asiradnan.com">https://todo.asiradnan.com </a> 
</h3>
<p align="center">Built with the tools and technologies:</p>
<p align="center">
<img src="https://img.shields.io/badge/Python-3776AB.svg?style=for-the-badge&logo=Python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=Next.js&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/Kotlin-7F52FF.svg?style=for-the-badge&logo=Kotlin&logoColor=white" alt="Kotlin">
    <img src="https://img.shields.io/badge/Android-3DDC84.svg?style=for-the-badge&logo=Android&logoColor=white" alt="Android">
    

</p>
<br>

##  Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Tech](#tech)
- [Features](#features)
  - [Web Version](#web-version)
  - [Android Version](#android-version)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation (Web Version)](#installation-web-version)
  - [Usage](#usage)
- [License](#license)

---

##  Overview
Cross Platform Todo App is a full-stack application that helps users manage their tasks on both web and android platforms. The web version is built with Next.js, and the Android version is developed using Kotlin. Both the versions use a shared backend built with FastAPI with data consistent across devices.

---

## Tech
- **Web Version**: Next.js, HTML, CSS, Javascript, Tailwind CSS
- **Backend**: FastAPI, Python
- **Android Version**: Kotlin, XML, Material UI
- **Database**: SQLite
- **Backeend Deployment**: Self-hosted on a private VPS with Nginx
- **Frontend Deployment**: Self-hosted on a private VPS with Nginx
- **Version Control**: Git, GitHub


##  Features

### Web Version
- **Authentication**: Signup, Login and Logout
- **Task Management**: Create, edit with date/time, marking complete/incomplete and delete tasks
- **Task Sorting**: Tasks are sorted by due date/time
- **Task Filters**: Separate tabs for complete and incomplete tasks
- **Delete All Completed Tasks**: Single click to delete all completed tasks for minimalism 
- **Sync**: Tasks are synced across devices
- **Notification**: Notification pop up with sound for task reminder
- **Profile**: View and edit user profile, change and confirm email and change password
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for various screen sizes

### Android Version
- **Offline first**: All features work offline and syncs when online
- **Separate Database**: Uses ROOM DB for offline storage
- **Push Notifications**: Push notifications for task reminders
- **Auto Sync**: Auto syncs with backend based on last modification time
- **Other features**: All other features - authentication, dark/light theme, task sorting, task filters, delete all completed tasks are available on Android

---

##  Project Structure

```sh
└── todo_nextjs_frontend/
    ├── README.md
    ├── app
    │   ├── favicon.ico
    │   ├── forgot-password
    │   ├── globals.css
    │   ├── layout.js
    │   ├── page.js
    │   ├── profile
    │   └── reset-password
    ├── components
    │   ├── AuthForm.js
    │   ├── ThemeProvider.js
    │   ├── ThemeToggle.js
    │   ├── TimePicker.js
    │   ├── Todo.js
    │   ├── TodoItem.js
    │   └── ui
    ├── components.json
    ├── eslint.config.mjs
    ├── helpers
    │   └── sortTasks.js
    ├── jsconfig.json
    ├── lib
    │   └── utils.js
    ├── next.config.mjs
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── public
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── notification.mp3
    │   ├── vercel.svg
    │   └── window.svg
    └── tailwind.config.mjs
```
##  Getting Started

###  Prerequisites

Before getting started with todo_nextjs_frontend, ensure your runtime environment meets the following requirements:

- **Programming Language:** JavaScript
- **Package Manager:** Npm


###  Installation (Web Version)

1. Clone the todo_nextjs_frontend repository:
```sh
git clone https://github.com/asiradnan/todo_nextjs_frontend
```

1. Navigate to the project directory:
```sh
cd todo_nextjs_frontend
```

1. Install the project dependencies:

```sh
npm install
```




###  Usage

```sh
npm run dev
```


##  License

This project is protected under the [MIT LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---



