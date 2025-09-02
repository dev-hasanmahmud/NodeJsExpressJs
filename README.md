# NodeJsExpressJs API

A RESTful API built with **Node.js**, **Express.js**, **Sequelize**, and **MySQL**, supporting user authentication (register, login, profile, logout).  
Dockerized for easy development and deployment.

---

## Features

- User registration and login
- JWT-based authentication
- Profile retrieval
- Logout
- Input validation using **express-validator**
- Secure password hashing with **bcryptjs**
- MySQL database management using **Sequelize ORM**
- Fully Dockerized environment

---

## Prerequisites

- Node.js (v22 LTS recommended)
- npm
- Docker (optional, for containerized setup)
- MySQL (if running locally without Docker)

---

## Quick Setup (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/dev-hasanmahmud/NodeJsExpressJs.git
cd NodeJsExpressJs

npm install

# MySQL Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=saas_db
DB_PORT=3306

# JWT Secret
JWT_SECRET=supersecret

# Server
PORT=3000

mysql -u root -p
CREATE DATABASE api_db;
npm run dev
```

## Docker Setup

```
docker-compose build --no-cache
docker-compose up
or
docker-compose down
```

### For production deployment:

Use proper MySQL credentials in .env.

Disable Sequelize logging:
```
logging: false
```

### Enable automatic migrations with Sequelize CLI:
```
npx sequelize-cli db:migrate
```


### API Endpoints:
Method	Endpoint	Description	Body / Params
POST	/register	Create new user	{ name, email, password }
POST	/login	Login user	{ email, password }
GET	/profile	Get logged-in user profile	JWT token in headers
POST	/logout	Logout user	JWT token in headers

```
npm run dev	-Run server in development mode (nodemon)
npm start	-Run server in production mode
```

### License

This project is licensed under the Software License.  
See the [LICENSE] file for details.
