# Instagram Clone Project

## Project Description

This project is an Instagram clone that implements the main features of Instagram. The frontend is built using Next.js and the backend is built using NestJS.

## Installation and Running

### Prerequisites

- Node.js (v14 or higher)
- pnpm

### Clone and Install

1. Clone the repository.

   ```bash
   git clone https://github.com/GWjun/insta-clone.git
   cd insta-clone
   ```

2. (opontial)Install frontend dependencies.

   ```bash
   pnpm install:all
   ```

3. (opontial) You can install frontend and backend dependencies separately.
   ```bash
   cd frontend
   pnpm install
   ```
   ```bash
   cd backend
   pnpm install
   ```

### Environment Variables

Create `.env` files in both the frontend and backend directories and configure them as needed.

### Running the Project

1. To run both the frontend and backend servers simultaneously, go to the root directory and run:
   ```bash
   pnpm start
   ```
2. Accessing the Application

- You can access the frontend application at http://localhost:3000.
- You can access the backend application at http://localhost:8000.

### Scripts

- `start`: Runs both frontend and backend servers concurrently.
- `start:frontend`: Runs the frontend server only.
- `start:backend`: Runs the backend server only.

## License

This project is licensed under the MIT License.
