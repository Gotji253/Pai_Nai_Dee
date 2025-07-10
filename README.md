# Pai Nai Dee (Where to Go?) - Monorepo

This project is a monorepo containing the "Pai Nai Dee" application, which helps users discover tourist attractions, plan trips, and more. It's composed of a React frontend and a Python backend/utility set.

## Project Structure

The repository is organized as follows:

-   **`tourist-app/`**: Contains the React + TypeScript frontend application.
    -   Uses Create React App, Material-UI, and Axios.
-   **`wanderlust_guide/`**: Contains the Python backend services and utilities.
    -   Currently includes utility functions and basic search/filter logic.
    -   Uses `pytest` for testing.
-   **`.github/`**: Contains GitHub Actions CI/CD workflows.

## Getting Started

Below are instructions for setting up and running each part of the project.

### 1. Frontend (`tourist-app/`)

**Prerequisites:**
*   Node.js (v18.x or v20.x recommended)
*   npm (usually comes with Node.js)

**Setup & Running:**

1.  **Navigate to the frontend directory:**
    ```bash
    cd tourist-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm start
    ```
    The application will typically be available at `http://localhost:3000`.

4.  **Run tests:**
    ```bash
    npm test
    ```

5.  **Lint and format:**
    ```bash
    npm run lint
    npm run format
    ```

**Environment Variables:**
*   The frontend might require environment variables (e.g., API keys or backend URLs). Create a `.env` file in the `tourist-app/` directory by copying from `tourist-app/.env.example` and fill in the required values.

### 2. Backend (`wanderlust_guide/`)

**Prerequisites:**
*   Python (v3.9+ recommended)
*   pip (Python package installer)

**Setup & Running:**

1.  **Navigate to the backend directory:**
    ```bash
    cd wanderlust_guide
    ```
2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run tests:**
    ```bash
    pytest
    ```
5.  **Run the main script (if applicable for local testing/utility):**
    The backend currently consists of utilities and doesn't run a persistent server. You can execute scripts like `main.py` if needed for specific tasks:
    ```bash
    python app/main.py
    ```

**Environment Variables:**
*   If the backend requires any environment variables, ensure they are set in your shell or via a `.env` file if a library like `python-dotenv` is added later.

## Tech Stack

**Frontend (`tourist-app/`):**
*   React
*   TypeScript
*   Material-UI (MUI)
*   React Router
*   Axios
*   ESLint & Prettier

**Backend (`wanderlust_guide/`):**
*   Python
*   Pytest

## CI/CD

*   **Continuous Integration (CI):** GitHub Actions are configured in `.github/workflows/ci.yml`.
    *   **Frontend:** On every pull request to `main`, the CI installs Node.js dependencies, runs linters, executes tests, and performs a production build.
    *   **Backend:** On every pull request to `main`, the CI installs Python dependencies and runs `pytest`.
*   **Deployment:**
    *   **Frontend (`tourist-app/`):** Can be built using `npm run build` (output in `tourist-app/build/`). This static output can be deployed to services like Vercel, Netlify, AWS S3/CloudFront, Firebase Hosting, etc.
    *   **Backend (`wanderlust_guide/`):** Deployment strategy depends on the nature of the backend. If it evolves into a web service (e.g., using Flask/FastAPI), it can be deployed to platforms like Render, Heroku, AWS Elastic Beanstalk, Google Cloud Run, or Dockerized and run on various container services. Currently, it's a set of utilities.

## Contributing

Please ensure your code adheres to the linting and formatting standards. Update tests and documentation as needed.

---

*Original Thai description (for reference):*
> Pai Nai Dee คือแอปพลิเคชัน/เว็บไซต์/ระบบ (โปรดระบุประเภทโปรเจกต์ของคุณ) ที่ช่วยให้ผู้ใช้สามารถค้นหา/เปรียบเทียบ/แนะนำสถานที่ท่องเที่ยว ร้านอาหาร หรือกิจกรรมต่างๆ ได้อย่างสะดวกและรวดเร็ว (โปรดปรับแก้ให้ตรงกับวัตถุประสงค์ของโปรเจกต์คุณ)
