import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'bio_quiz'
});

const createTables = async () => {
  try {
    console.log('Creating database tables...');
    
    // Create topics (modules)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS topics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        module_number INT,
        parent_topic_id UUID REFERENCES topics(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create quizzes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        topic_id UUID NOT NULL REFERENCES topics(id),
        difficulty VARCHAR(50),
        question_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create questions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quiz_id UUID NOT NULL REFERENCES quizzes(id),
        question TEXT NOT NULL,
        question_type VARCHAR(50) NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create question options
    await pool.query(`
      CREATE TABLE IF NOT EXISTS question_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question_id UUID NOT NULL REFERENCES questions(id),
        option_text TEXT NOT NULL,
        is_correct BOOLEAN DEFAULT FALSE,
        order_number INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Database tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    throw err;
  }
};

const seedAQAContent = async () => {
  try {
    console.log('Seeding AQA A-Level Biology content...');
    
    // Insert AQA Modules
    const modules = [
      { name: 'Module 1: Biological Molecules', moduleNumber: 1, description: 'Monomers, polymers, carbohydrates, lipids, proteins, and nucleic acids' },
      { name: 'Module 2: Cells', moduleNumber: 2, description: 'Cell structure, membranes, transport, division, and DNA' },
      { name: 'Module 3: Organisms Exchange Substances', moduleNumber: 3, description: 'Gas exchange, mass transport in animals and plants' },
      { name: 'Module 4: Genetic Information and Change', moduleNumber: 4, description: 'DNA replication, gene expression, protein synthesis, evolution' },
      { name: 'Module 5: Energy Transfer and Nutrient Cycles', moduleNumber: 5, description: 'Photosynthesis, respiration, nutrient cycles' },
      { name: 'Module 6: Organisms and Their Environment', moduleNumber: 6, description: 'Populations, ecosystems, succession, conservation' }
    ];
    
    const moduleIds: any = {};
    
    for (const module of modules) {
      const result = await pool.query(
        'INSERT INTO topics (name, description, module_number) VALUES ($1, $2, $3) RETURNING id',
        [module.name, module.description, module.moduleNumber]
      );
      moduleIds[module.moduleNumber] = result.rows[0].id;
      console.log(`✅ Created module: ${module.name}`);
    }
    
    // Seed sample quiz for Module 1
    const quiz1 = await pool.query(
      'INSERT INTO quizzes (title, description, topic_id, difficulty) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Carbohydrate Structure and Function', 'Test your knowledge of carbohydrates', moduleIds[1], 'beginner']
    );
    const quizId1 = quiz1.rows[0].id;
    
    // Sample questions for Module 1
    const questions = [
      {
        question: 'Which monosaccharide is found in RNA but not in DNA?',
        type: 'multiple-choice',
        explanation: 'RNA contains ribose sugar, while DNA contains deoxyribose.',
        options: [
          { text: 'Deoxyribose', correct: false },
          { text: 'Ribose', correct: true },
          { text: 'Glucose', correct: false },
          { text: 'Galactose', correct: false }
        ]
      },
      {
        question: 'Starch is a polymer of glucose. True or False?',
        type: 'true-false',
        explanation: 'True. Starch is a polysaccharide made of many glucose molecules.',
        options: [
          { text: 'True', correct: true },
          { text: 'False', correct: false }
        ]
      },
      {
        question: 'Triglycerides are formed from one glycerol and _____ fatty acids.',
        type: 'fill-blank',
        explanation: 'A triglyceride has one glycerol bonded to three fatty acids.',
        options: [
          { text: 'three', correct: true }
        ]
      }
    ];
    
    for (const q of questions) {
      const qResult = await pool.query(
        'INSERT INTO questions (quiz_id, question, question_type, explanation) VALUES ($1, $2, $3, $4) RETURNING id',
        [quizId1, q.question, q.type, q.explanation]
      );
      const questionId = qResult.rows[0].id;
      
      for (let i = 0; i < q.options.length; i++) {
        await pool.query(
          'INSERT INTO question_options (question_id, option_text, is_correct, order_number) VALUES ($1, $2, $3, $4)',
          [questionId, q.options[i].text, q.options[i].correct, i]
        );
      }
      console.log(`✅ Added question: ${q.question}`);
    }
    
    // Update question count
    await pool.query(
      'UPDATE quizzes SET question_count = $1 WHERE id = $2',
      [questions.length, quizId1]
    );
    
    console.log('\n✅ Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    throw err;
  }
};

const seed = async () => {
  try {
    await createTables();
    await seedAQAContent();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
