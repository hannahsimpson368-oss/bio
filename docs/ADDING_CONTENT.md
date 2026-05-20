# How to Add AQA A-Level Biology Content to Your Platform

This guide explains how to populate your quiz platform with AQA A-Level Biology content in different ways.

## Option 1: Using the Seed Script (Fastest) ⚡

The easiest way to get started with sample AQA content:

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Run the seed script
npm run seed
```

This will:
- Create all 6 AQA modules in the database
- Add sample quizzes with questions
- Populate questions with multiple choice, true/false, and fill-in-blank types

## Option 2: Adding Content via REST API 🌐

Once your server is running, create custom quizzes using API requests:

```bash
# Start the backend
cd backend
npm run dev

# In another terminal, make a POST request
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Enzyme Kinetics",
    "description": "Test your knowledge of enzyme activity and Michaelis-Menten",
    "moduleId": "module-1",
    "difficulty": "intermediate",
    "questions": [...]
  }'
```

## Option 3: Direct Database Insert 🗄️

For bulk imports, you can insert data directly into PostgreSQL:

```sql
-- First, get your module IDs
SELECT id, name FROM topics;

-- Insert a new quiz
INSERT INTO quizzes (title, description, topic_id, difficulty)
VALUES ('Cell Division', 'Mitosis and Meiosis', '<module-2-id>', 'intermediate')
RETURNING id;

-- Insert questions (use the quiz ID from above)
INSERT INTO questions (quiz_id, question, question_type, explanation)
VALUES (
  '<quiz-id>',
  'How many chromosomes are in a human cell after meiosis I?',
  'multiple-choice',
  'After meiosis I, cells are haploid with 23 chromosomes (compared to 46 in diploid cells).'
)
RETURNING id;

-- Insert question options
INSERT INTO question_options (question_id, option_text, is_correct, order_number)
VALUES 
  ('<question-id>', '23', true, 0),
  ('<question-id>', '46', false, 1),
  ('<question-id>', '92', false, 2),
  ('<question-id>', '11.5', false, 3);
```

## Adding Content to Specific AQA Modules

### Module 1: Biological Molecules
Topics to cover:
- Monomers and polymers
- Carbohydrates (glucose, disaccharides, polysaccharides)
- Lipids (triglycerides, phospholipids, cholesterol)
- Proteins (amino acids, peptide bonds, protein structures)
- Nucleic acids (DNA, RNA, replication, genetic code)

**Example quiz:**
```json
{
  "title": "Protein Synthesis",
  "description": "DNA to protein - transcription and translation",
  "difficulty": "intermediate",
  "questions": [
    {
      "question": "Which organelle is the site of protein synthesis?",
      "type": "multiple-choice",
      "explanation": "Ribosomes are the site of protein synthesis. They read mRNA and assemble amino acids.",
      "options": [
        { "text": "Ribosome", "correct": true },
        { "text": "Golgi apparatus", "correct": false },
        { "text": "Mitochondrion", "correct": false },
        { "text": "Nucleus", "correct": false }
      ]
    }
  ]
}
```

### Module 2: Cells
Topics to cover:
- Cell structure (prokaryotic vs eukaryotic)
- Cell membranes and transport (osmosis, diffusion, active transport)
- Cell division (mitosis, meiosis)
- DNA and the genetic code

### Module 3: Organisms Exchange Substances
Topics to cover:
- Gas exchange in plants and animals
- Ventilation in mammals
- Mass transport (circulatory system, xylem and phloem)

### Module 4: Genetic Information and Change
Topics to cover:
- DNA replication
- Gene expression and protein synthesis
- Genetic variation
- Evolution and natural selection
- Speciation

### Module 5: Energy Transfer and Nutrient Cycles
Topics to cover:
- Photosynthesis (light and dark reactions)
- Respiration (aerobic and anaerobic)
- Energy flow through ecosystems
- Nitrogen and carbon cycles

### Module 6: Organisms and Their Environment
Topics to cover:
- Populations and ecosystems
- Energy flow and trophic levels
- Succession (primary and secondary)
- Conservation
- Biotechnology applications

## Creating High-Quality Questions

### Multiple Choice Questions
```json
{
  "question": "Which of the following correctly describes the lock-and-key model of enzyme action?",
  "type": "multiple-choice",
  "explanation": "The lock-and-key model suggests the enzyme's active site is complementary to its specific substrate, like a lock and key.",
  "options": [
    { "text": "The substrate is identical to the enzyme", "correct": false },
    { "text": "The enzyme's active site is complementary to its substrate", "correct": true },
    { "text": "Enzymes can catalyze any reaction", "correct": false },
    { "text": "The enzyme is permanently changed by the substrate", "correct": false }
  ]
}
```

### True/False Questions
```json
{
  "question": "Mitochondria are present in plant cells but not animal cells.",
  "type": "true-false",
  "explanation": "False. Mitochondria are present in BOTH plant and animal cells. Plants also have chloroplasts, but both have mitochondria.",
  "options": [
    { "text": "True", "correct": false },
    { "text": "False", "correct": true }
  ]
}
```

### Fill-in-the-Blank Questions
```json
{
  "question": "The process by which plants convert light energy into chemical energy is called ___________.",
  "type": "fill-blank",
  "explanation": "Photosynthesis is the process where plants use light energy to produce glucose and oxygen from carbon dioxide and water.",
  "options": [
    { "text": "photosynthesis", "correct": true }
  ]
}
```

## Best Practices

1. **Use AQA Terminology**: Stick to terminology used in the AQA specification
2. **Include Explanations**: Every question should have a detailed explanation of the correct answer
3. **Vary Question Types**: Mix multiple choice, true/false, and fill-in-blank questions
4. **Set Difficulty Levels**: Use "beginner", "intermediate", or "advanced" based on question complexity
5. **Reference Past Papers**: Use actual AQA past exam questions as inspiration
6. **Test Your Questions**: Make sure the correct answer is actually correct!
7. **Add Keywords**: Consider adding tags for easy filtering (e.g., "calculation", "diagram", "recall")

## Using Past Papers for Content

The AQA A-Level Biology past papers are available at: https://www.aqa.org.uk/subjects/science/a-level/biology-7402

1. Download past papers
2. Extract relevant questions
3. Rephrase slightly to avoid copyright issues
4. Add explanations based on mark schemes
5. Insert into database

## Database Tips

To check what modules and quizzes are in your database:

```bash
# Connect to PostgreSQL
psql -U postgres -d bio_quiz

# List all modules
SELECT id, name, module_number FROM topics WHERE parent_topic_id IS NULL;

# Count quizzes per module
SELECT t.name, COUNT(q.id) as quiz_count 
FROM topics t 
LEFT JOIN quizzes q ON t.id = q.topic_id 
GROUP BY t.id, t.name;

# Count questions per quiz
SELECT q.title, COUNT(questions.id) as question_count 
FROM quizzes q 
LEFT JOIN questions ON q.id = questions.quiz_id 
GROUP BY q.id, q.title;
```

## Next Steps

1. ✅ Run the seed script to get sample data
2. ✅ Start the frontend and backend
3. ✅ Verify quizzes appear in the UI
4. ✅ Add more questions using the API
5. ✅ Test the spaced repetition algorithm
6. ✅ Implement user accounts for progress tracking

Happy learning! 📚
