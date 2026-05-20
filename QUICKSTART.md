# Quick Start Guide

Get your AQA Biology Quiz Platform up and running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- PostgreSQL 12+ ([Download](https://www.postgresql.org/download/)) OR Docker

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/hannahsimpson368-oss/bio.git
cd bio

# Install all dependencies
npm install
```

## Step 2: Database Setup

### Option A: Using Docker (Recommended) 🐳

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Wait 10 seconds for database to initialize
sleep 10
```

### Option B: Local PostgreSQL

```bash
# Create database and user
createdb bio_quiz
psql -U postgres -d bio_quiz

# Or on Windows:
# Use pgAdmin or run:
# CREATE DATABASE bio_quiz;
```

Update `.env` with your database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=bio_quiz
```

## Step 3: Populate Database with AQA Content

```bash
# Navigate to backend
cd backend

# Seed the database with sample AQA quizzes
npm run seed
```

You should see:
```
✅ Created module: Module 1: Biological Molecules
✅ Created module: Module 2: Cells
... (and 4 more modules)
✅ Added question: Which monosaccharide is found in RNA...
✅ Database seeding completed successfully!
```

## Step 4: Start the Application

### Terminal 1 - Start Backend:
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Biology Quiz API running on http://localhost:3000
📚 Health check: http://localhost:3000/health
🎯 AQA Modules: http://localhost:3000/api/modules
```

### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

## Step 5: Open in Browser

Go to **http://localhost:5173** and start taking quizzes!

## What You Get

✅ **6 AQA Modules** - All official A-Level Biology topics  
✅ **Sample Quizzes** - Questions for each module  
✅ **Interactive Interface** - Beautiful UI with TailwindCSS  
✅ **Progress Tracking** - See your quiz results  
✅ **Multiple Question Types** - Multiple choice, true/false, fill-in-blank  

## Using the Platform

1. **Home Page** - Select an AQA module to study
2. **Module Page** - View all quizzes for that module
3. **Quiz Page** - Answer questions and get instant feedback
4. **Results Page** - See your score and progress

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Make sure PostgreSQL is running
- Docker: `docker-compose up -d`
- Local: `pg_ctl -D /usr/local/var/postgres start` (macOS) or check Services (Windows)

### Port Already in Use
```
Error: EADDRINUSE: address already in use :::3000
```
**Solution:** Kill the process using port 3000
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API Not Responding
Make sure both backend and frontend servers are running in separate terminals, and check that they're on the right ports (3000 and 5173).

## Adding More Content

Once you have the basic setup, you can easily add more AQA questions:

```bash
cd backend
npm run seed  # Adds sample content

# Or add custom content via:
# 1. REST API (see docs/API.md)
# 2. Direct SQL (see docs/ADDING_CONTENT.md)
```

See `docs/ADDING_CONTENT.md` for detailed instructions on adding your own questions.

## Project Structure

```
bio/
├── frontend/          # React UI
│   ├── src/
│   │   ├── main.tsx   # Main app (modules, quizzes, interface)
│   │   └── index.css  # TailwindCSS styling
│   ├── vite.config.ts # Vite configuration
│   └── package.json
│
├── backend/           # Express API
│   ├── src/
│   │   ├── index.ts   # API endpoints
│   │   └── seed.ts    # Database seeding script
│   ├── tsconfig.json
│   └── package.json
│
├── docs/              # Documentation
│   ├── API.md         # API documentation
│   ├── AQA_CONTENT.md # AQA modules explanation
│   ├── ADDING_CONTENT.md  # How to add questions
│   └── DATABASE.md    # Database schema
│
├── docker-compose.yml # Docker setup
└── README.md
```

## Next Steps

1. ✅ **Explore the platform** - Try taking a few quizzes
2. ✅ **Add more content** - See `docs/ADDING_CONTENT.md`
3. ✅ **Customize questions** - Edit database directly
4. ✅ **Implement features** - User accounts, progress tracking, spaced repetition
5. ✅ **Deploy** - Host on Vercel (frontend) + Heroku/Railway (backend)

## Additional Resources

- **AQA Biology Specification**: https://www.aqa.org.uk/subjects/science/a-level/biology-7402
- **AQA Past Papers**: https://www.aqa.org.uk/past-papers
- **React Documentation**: https://react.dev/
- **Express.js Guide**: https://expressjs.com/

## Need Help?

- Check `docs/` folder for detailed documentation
- Review error messages carefully - they usually indicate what's wrong
- Ensure all dependencies are installed: `npm install`
- Make sure .env file is in the root directory with correct DB credentials

Happy studying! 🎓
