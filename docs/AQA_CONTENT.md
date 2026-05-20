# AQA A-Level Biology Quiz Platform

This platform is specifically designed for AQA A-Level Biology students to study and memorize content across all modules.

## AQA A-Level Biology Structure

### **Module 1: Biological Molecules**
- Monomers and polymers
- Carbohydrates (monosaccharides, disaccharides, polysaccharides)
- Lipids (triglycerides, phospholipids)
- Proteins (amino acids, peptide bonds, protein structure)
- Nucleic acids (DNA, RNA, replication)

### **Module 2: Cells**
- Cell structure (prokaryotic and eukaryotic)
- Cell membranes and transport
- Cell division (mitosis, meiosis)
- DNA and the genetic code

### **Module 3: Organisms Exchange Substances**
- Gas exchange (plants and animals)
- Mass transport in animals (circulatory system)
- Mass transport in plants (xylem and phloem)

### **Module 4: Genetic Information and Change**
- DNA replication and the genetic code
- Gene expression
- Protein synthesis
- Genetic variation and evolution
- Selection and speciation

### **Module 5: Energy Transfer and Nutrient Cycles**
- Energy transfers in and between organisms
- Photosynthesis
- Respiration
- Nutrient cycles (nitrogen and carbon)

### **Module 6: Organisms and Their Environment**
- Populations and ecosystems
- Energy flow through ecosystems
- Succession
- Conservation
- Biotechnology applications

## How to Add AQA Content

### 1. **Via Seed Script**
The easiest way to populate your database with AQA content:

```bash
cd backend
npm install
npm run seed
```

This will automatically create:
- All 6 AQA modules as topics
- Sample quizzes for each module
- Multiple question types (MCQ, True/False, Fill-in-blank)

### 2. **Via REST API**
Create custom quizzes using API requests:

```bash
POST /api/quizzes
Authorization: Bearer <token>

{
  "title": "Cell Membranes - Transport",
  "description": "Test your knowledge of active and passive transport",
  "moduleId": "module-2",
  "difficulty": "intermediate",
  "questions": [...]
}
```

### 3. **Direct Database Insert**
Add questions directly to PostgreSQL using SQL scripts.

## Content Sources

For accurate AQA A-Level Biology content, refer to:
- **AQA Specification**: https://www.aqa.org.uk/subjects/science/a-level/biology-7402
- **Textbooks**: Campbell Biology, AQA Student Books
- **Exam Papers**: Past papers from AQA website

## Question Format

Each question should include:
1. **Module**: 1-6 (which AQA module)
2. **Question**: Clear, concise wording
3. **Type**: Multiple choice, True/False, or Fill-in-blank
4. **Options**: With one marked as correct
5. **Explanation**: Why the answer is correct
6. **Difficulty**: Beginner/Intermediate/Advanced

## Example Quiz JSON

```json
{
  "id": "quiz-001",
  "title": "Carbohydrate Structure and Function",
  "module": 1,
  "difficulty": "beginner",
  "questions": [
    {
      "id": "q001",
      "type": "multiple-choice",
      "question": "Which monosaccharide is found in RNA?",
      "options": [
        { "id": "a", "text": "Deoxyribose", "correct": false },
        { "id": "b", "text": "Ribose", "correct": true },
        { "id": "c", "text": "Glucose", "correct": false },
        { "id": "d", "text": "Fructose", "correct": false }
      ],
      "explanation": "RNA contains ribose sugar, while DNA contains deoxyribose."
    }
  ]
}
```
