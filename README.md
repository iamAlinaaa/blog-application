### Blog Application - Setup Instructions
---

**Backend:**

- **Tech Stack**: Nest.js, PostgreSQL, TypeORM
- **Setup**:
  - Create a `.env` file in the `backend/` folder.
  - Copy the relevant database configuration values from the `.env.example` file into the `.env` file and provide your own credentials for:
    - `DATABASE_USERNAME=your_username`
    - `DATABASE_PASSWORD=your_password`
  - Install dependencies: `npm install`.

**Frontend:**

- **Tech Stack**: Next.js, TypeScript, Redux
- **Setup**:
  - Create a `.env.local` file in the `frontend/` folder.
  - Copy the API URL from the `.env.example` file into the `.env.local` file.
  - Install dependencies: `npm install`.
  - 
**Run:**

- Start the backend first: `npm run start:dev` (in the `backend/` folder).
- Then start the frontend: `npm run dev` (in the `frontend/` folder).
