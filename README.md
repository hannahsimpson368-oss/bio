# Biology Quizzing Platform

An interactive web-based platform for studying and memorizing biology content through intelligent quizzing.

## Features

- 📝 **Interactive Quizzes**: Multiple choice, true/false, and fill-in-the-blank questions
- 🧠 **Spaced Repetition**: Smart algorithm to optimize learning based on memory curves
- 📊 **Progress Tracking**: Track your learning progress with detailed statistics
- 🏷️ **Topic Organization**: Organize biology content by topics and subtopics
- 🎯 **Custom Quizzes**: Create and customize quizzes for specific topics
- 📈 **Performance Analytics**: Visualize your learning journey with charts and metrics

## Tech Stack

### Frontend
- React 18+
- TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Axios (HTTP client)

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (authentication)

## Project Structure

```
bio/
├── frontend/              # React application
├── backend/              # Node.js/Express API
├── docs/                 # Documentation
├── docker-compose.yml    # Docker setup
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL (or Docker)

### Quick Start

#### Backend Setup
```bash
cd backend
npm install
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

```bash
# Run both frontend and backend
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
