# kothabill-backend

A production-ready REST-API application built with Node.js and TypeScript.

## 🚀 Features

- ⚡ **TypeScript** - Type safety and modern syntax
- 🏗️ **MVC Architecture** - Clean and maintainable code structure
- 🗄️ **Postgresql** - Database integration
- 🔐 **JWT Authentication** - Secure user authentication
- ✅ **Request Validation** - Input validation with Zod
- 📝 **Logging** - Structured logging with Winston
- 📚 **API Documentation** - Auto-generated Swagger docs
- 🛡️ **Rate Limiting** - API rate limiting protection
- 🌐 **CORS** - Cross-origin resource sharing configuration


- 📧 **Email Service** - Email sending with Nodemailer
- 📁 **File Upload** - File upload handling
- 🧪 **Testing** - Unit and integration tests with Jest



## 📋 Prerequisites

- Node.js >= 16.x
- npm or yarn
- PostgreSQL >= 13.x





## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kothabill-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Set up the database:
```bash
# Create database
createdb myapp_db

# Run migrations
npm run migrate:up
```

## 🚀 Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```



The application will be running at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/api-docs`


## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```


## 📁 Project Structure

```
kothabill-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point


├── tests/               # Test files
├── dist/               # Compiled JavaScript (generated)
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json       # TypeScript configuration
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## 🌍 Environment Variables

See `.env.example` for all available environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Generated with [create-nodejs-app](https://github.com/yourusername/create-nodejs-app)
