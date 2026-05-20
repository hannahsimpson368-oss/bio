# Biology Quiz Platform - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 201
{
  "token": "jwt_token",
  "user": { ... }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt_token",
  "user": { ... }
}
```

### Quizzes

#### Get All Quizzes
```
GET /quizzes

Response: 200
[
  {
    "id": "uuid",
    "title": "Cell Biology Basics",
    "description": "Learn about cell structure and function",
    "topicId": "uuid",
    "questionCount": 10,
    "difficulty": "beginner"
  }
]
```

#### Get Quiz by ID
```
GET /quizzes/:id

Response: 200
{
  "id": "uuid",
  "title": "Cell Biology Basics",
  "description": "...",
  "questions": [
    {
      "id": "uuid",
      "type": "multiple-choice",
      "question": "What is the powerhouse of the cell?",
      "options": [
        { "id": "a", "text": "Mitochondria" },
        { "id": "b", "text": "Nucleus" }
      ],
      "correctAnswer": "a"
    }
  ]
}
```

#### Create Quiz
```
POST /quizzes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Cell Biology Basics",
  "description": "...",
  "topicId": "uuid",
  "questions": [...]
}

Response: 201
{ ... }
```

### Questions

#### Get Quiz Questions
```
GET /quizzes/:quizId/questions

Response: 200
[
  {
    "id": "uuid",
    "question": "...",
    "type": "multiple-choice",
    "options": [...]
  }
]
```

### Progress & Results

#### Submit Quiz Attempt
```
POST /attempts
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "uuid",
  "answers": [
    { "questionId": "uuid", "answer": "a" }
  ]
}

Response: 201
{
  "attemptId": "uuid",
  "score": 80,
  "correctAnswers": 8,
  "totalQuestions": 10
}
```

#### Get User Progress
```
GET /users/progress
Authorization: Bearer <token>

Response: 200
{
  "userId": "uuid",
  "totalAttempts": 15,
  "averageScore": 85,
  "topicProgress": [
    {
      "topicId": "uuid",
      "topicName": "Cell Biology",
      "quizzesCompleted": 5,
      "averageScore": 87
    }
  ]
}
```

## Error Responses

All error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
