# Instagram Clone Project

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Logo" width="80" height="80" style="margin: 10px;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/Nextjs-logo.svg" alt="Next.js Logo" width="120" height="80" style="margin: 10px;">
  <img src="https://nestjs.com/img/logo_text.svg" alt="NestJS Logo" width="120" height="80" style="margin: 10px;">
</p>

## Project Description

This project is an Instagram clone that implements the main features of Instagram. The frontend is built using Next.js and the backend is built using NestJS.

## Installation and Running

### Prerequisites

- Node.js (v14 or higher)
- pnpm
- docker

### Clone and Install

1. Clone the repository.

   ```bash
   git clone https://github.com/GWjun/insta-clone.git
   cd insta-clone
   ```

2. Install dependencies.

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

1. Create `.env.local` files in the frontend directory and configure them as needed.

   ```bash
   NEXT_PUBLIC_SERVER_URL=http://localhost:8000
   NEXT_PUBLIC_TOKEN_EXPIRE=300000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=gwjun-mooyaho
   ```

### Running the Project

1. Turn on the Docker app before starting your project to access the database.

2. To run both the frontend and backend servers simultaneously, go to the root directory and run:
   ```bash
   pnpm start
   ```
3. Accessing the Application

- You can access the frontend application at http://localhost:3000.
- You can access the backend application at http://localhost:8000.

### Scripts

- `start`: Runs both frontend and backend servers concurrently.
- `start:frontend`: Runs the frontend server only.
- `start:backend`: Runs the backend server only.

## License

This project is licensed under the MIT License.
