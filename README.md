# Lab Reservations

Welcome to the **Lab Reservations** application! This project is designed to automate and streamline the process of reserving engineering laboratories at the **Escuela Colombiana de Ingeniería**. Built with the powerful full-stack framework, **Remix**, this application provides a seamless and efficient way to manage lab bookings for the **Systems Engineering** department.

---

## 📚 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🧑‍💻 About the Project

The **Lab Reservations** application is a tailored solution for the **Systems Engineering** department to facilitate the reservation of labs. This project aims to simplify the booking process, providing an intuitive interface for both students and faculty members.

### Key Objectives:
- **Automation**: Reduce manual intervention in the lab booking process.
- **Efficiency**: Ensure quick and easy reservations without the need for complex procedures.
- **Transparency**: Provide a clear overview of available labs and existing reservations.

---

## ✨ Features

- **User Authentication**: Secure login for students and staff.
- **Real-Time Availability**: Check lab availability in real-time.
- **Automated Notifications**: Receive email alerts for confirmed reservations.
- **User-Friendly Interface**: Simple and intuitive design for ease of use.
- **Admin Dashboard**: Manage labs, users, and reservations with ease.

---

## 🛠️ Tech Stack

- **Frontend**: [Remix](https://remix.run/)
- **Backend**: [Remix (full-stack capabilities)](https://remix.run/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: Not defined yet ;)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js and pnpm installed. Download [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/installation) if you haven't already.
- PostgreSQL installed. Download [PostgreSQL](https://www.postgresql.org/download/) or using [Docker](https://hub.docker.com/_/postgres)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Laboratorio-de-Informatica/ReservasLab
   cd ReservasLab
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials and other environment variables.

4. Run database migrations:
   ```bash
   pnpm migration:generate
   pnpm migration:push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

---

## 📖 Usage

Once the server is running, you can access the application locally at `http://localhost:5173`. Log in with your credentials to start reserving labs.

---

## 🤝 Contributing

Contributions are welcome! Only the Monitors team can contribute to this repository. If you would like to contribute, please write an email to the project maintainers.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or further information, please contact:

- **Tomas Panqueva** (T-Hash06)
- **Andres Serrato** (AndresSerrato2004)
- **Email:** [labinfo@escuelaing.edu.co](mailto:labinfo@escuelaing.edu.co)
