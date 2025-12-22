# CodeOrb: Code Execution Platform

CodeOrb is a full-stack web application that allows users to run code securely in multiple programming languages directly from the browser. It uses Docker for isolated execution, Redis and Celery for background job handling, and FastAPI for the backend API.

Note: True asynchronous execution is not yet implemented, although Celery is set up. See TODOs below.

## Technologies Used

| Component  | Technology        | Purpose                                  |
|------------|-------------------|------------------------------------------|
| Backend    | Python (FastAPI)  | Routing and API handling                 |
| Task Queue | Celery + Redis    | Background code execution                |
| Container  | Docker            | Secure and isolated code execution       |
| Frontend   | Next.js           | A simple and performant UI               |

## Languages Supported

- C
- C++
- Java
- Node.js
- Python 3

## TODOs

- Implement fully asynchronous execution (currently synchronous with Celery setup)

## Installation and Usage

### Prerequisites

- Python 3.10+
- Docker
- Redis server (or Valkey)

### 1. Clone and install dependencies

```bash
git clone https://github.com/Soham-Kakkar/CodeOrb
cd CodeOrb/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run the Backend Server

```bash
honcho start
```

### 3. Run the Frontend

- Open a new terminal
- `cd` to the `frontend` directory
- Run:

```bash
npm run dev
```

### 4. Visit the Application

Go to [http://localhost:3000](http://localhost:3000) to use CodeOrb.

## Notes

- Docker must be installed and running for code execution to work properly
- Each code submission is isolated via Docker for safety.

## License
The project is licensed under the MIT license.
