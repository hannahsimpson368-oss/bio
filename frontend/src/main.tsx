import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom'
import './index.css'

// Types
interface Module {
  id: string
  name: string
  description: string
  module_number: number
}

interface Quiz {
  id: string
  title: string
  description: string
  difficulty: string
}

interface Question {
  id: string
  question: string
  question_type: string
  explanation: string
  options: Array<{ id: string; option_text: string; is_correct: boolean }>
}

interface QuizDetail {
  id: string
  title: string
  description: string
  difficulty: string
  questions: Question[]
}

// Home Page
const Home = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        setModules(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching modules:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-indigo-900">📚 AQA A-Level Biology Quiz</h1>
          <p className="text-gray-600 mt-2">Master biology concepts with interactive quizzes</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center text-gray-600">Loading modules...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map(module => (
              <Link key={module.id} to={`/module/${module.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer h-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900">{module.name}</h3>
                      <p className="text-gray-600 text-sm mt-2">{module.description}</p>
                    </div>
                    <span className="text-2xl font-bold text-indigo-600">{module.module_number}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// Module Page
const ModulePage = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!moduleId) return
    fetch(`/api/modules/${moduleId}/quizzes`)
      .then(res => res.json())
      .then(data => {
        setQuizzes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching quizzes:', err)
        setLoading(false)
      })
  }, [moduleId])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">← Back</Link>
          <h1 className="text-3xl font-bold text-indigo-900">Quizzes</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center text-gray-600">Loading quizzes...</div>
        ) : quizzes.length === 0 ? (
          <div className="text-center text-gray-600">No quizzes available for this module</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map(quiz => (
              <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
                  <h3 className="text-lg font-semibold text-indigo-900">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">{quiz.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      {quiz.difficulty}
                    </span>
                    <span className="text-indigo-600 font-semibold">Start →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// Quiz Page
const QuizPage = () => {
  const { quizId } = useParams<{ quizId: string }>()
  const [quiz, setQuiz] = useState<QuizDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!quizId) return
    fetch(`/api/quizzes/${quizId}`)
      .then(res => res.json())
      .then(data => {
        setQuiz(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching quiz:', err)
        setLoading(false)
      })
  }, [quizId])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading quiz...</div>
  if (!quiz) return <div className="flex items-center justify-center min-h-screen">Quiz not found</div>

  const question = quiz.questions[currentQuestion]
  const answered = answers[question.id]
  const isLast = currentQuestion === quiz.questions.length - 1

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [question.id]: optionId })
  }

  const handleNext = () => {
    if (isLast) {
      setShowResults(true)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach(q => {
      const selectedOptionId = answers[q.id]
      const selectedOption = q.options.find(opt => opt.id === selectedOptionId)
      if (selectedOption?.is_correct) correct++
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-indigo-600 text-center mb-4">{score}%</div>
          <p className="text-gray-600 text-center mb-8">Well done! You scored {Math.round(score / 10)} out of 10.</p>
          <Link to="/" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-center">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-indigo-900 mb-2">{quiz.title}</h1>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>

          <div className="my-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h2>
            
            <div className="space-y-3">
              {question.options.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answered === option.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                >
                  <input type="radio" checked={answered === option.id} readOnly className="mr-3" />
                  {option.option_text}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!answered}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            {isLast ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)
