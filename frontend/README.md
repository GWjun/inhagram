# Inhagram Frontend

This project is a frontend clone of Instagram

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/GWjun/inhagram.git
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Create `.env.local` files in the frontend directory and configure them as needed.

   ```bash
   NEXT_PUBLIC_SERVER_URL=http://localhost:8080
   NEXT_PUBLIC_SERVER_DOMAIN=localhost
   NEXT_PUBLIC_TOKEN_EXPIRE=your-accessToken-expire-milli-second
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

## Usage

Start the development server:

```bash
pnpm dev
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
