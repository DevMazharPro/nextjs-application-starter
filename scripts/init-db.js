const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Run migrations
    console.log('Running database migrations...');
    execSync('npm run db:migrate', { stdio: 'inherit' });
    
    // Import and run initialization
    const { initializeDatabase } = require('../src/lib/db/index.ts');
    await initializeDatabase();
    
    console.log('Database initialized successfully!');
    console.log('Default admin credentials:');
    console.log('Email: admin@kangantales.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
