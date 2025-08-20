# Todoist Clone Backend

A RESTful API backend for a Todoist clone application built with Node.js, Express, and MongoDB.

## Features

- **User Management**: User registration, authentication, and profile management
- **Todo Management**: Create, read, update, and delete todos with priorities and deadlines
- **Project Management**: Organize todos into projects with custom colors and favorites
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens
- **Input Validation**: Robust input validation using Zod schemas
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Helmet.js for security headers and CORS protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **Security**: Helmet.js, bcrypt for password hashing
- **Development**: Nodemon for hot reloading

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd todoist-clone/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your configuration:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/todoist-clone

   # JWT Configuration
   JWT_USER=your-super-secret-jwt-key-here
   ```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Create a database named `todoist-clone`

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Start the Server

#### Development Mode

```bash
npm start
```

#### Production Mode

```bash
NODE_ENV=production npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /users/signup` - User registration
- `POST /users/signin` - User login
- `GET /users/profile` - Get user profile (protected)

### Todos

- `GET /todos` - Get all todos (protected)
- `POST /todos` - Create a new todo (protected)
- `GET /todos/:id` - Get a specific todo (protected)
- `PUT /todos/:id` - Update a todo (protected)
- `DELETE /todos/:id` - Delete a todo (protected)

### Projects

- `GET /projects` - Get all projects (protected)
- `POST /projects` - Create a new project (protected)
- `GET /projects/:id` - Get a specific project (protected)
- `PUT /projects/:id` - Update a project (protected)
- `DELETE /projects/:id` - Delete a project (protected)

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware (auth)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── utils/           # Utility functions
├── index.js             # Main server file
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

## Environment Variables

| Variable      | Description               | Required | Default     |
| ------------- | ------------------------- | -------- | ----------- |
| `PORT`        | Server port number        | Yes      | 3000        |
| `NODE_ENV`    | Environment mode          | Yes      | development |
| `MONGODB_URI` | MongoDB connection string | Yes      | -           |
| `JWT_USER`    | JWT secret key            | Yes      | -           |

## Development

### Running Tests

```bash
# Add test script to package.json when tests are implemented
npm test
```

### Code Formatting

```bash
# Add prettier/eslint scripts when configured
npm run format
npm run lint
```

### Database Seeding

```bash
# Add seed script when implemented
npm run seed
```

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schemas for request validation
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable CORS settings

## Error Handling

The application includes comprehensive error handling:

- Validation errors (400)
- Authentication errors (401)
- Not found errors (404)
- Conflict errors (409)
- Internal server errors (500)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.
