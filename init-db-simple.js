const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Initializing database with default data...');
    
    const db = new Database('sqlite.db');
    
    // Create default categories
    const defaultCategories = [
      { name: 'Traditional Bangles', description: 'Classic handmade bangles with traditional designs' },
      { name: 'Modern Bangles', description: 'Contemporary designs with modern aesthetics' },
      { name: 'Bridal Collection', description: 'Special bangles for weddings and ceremonies' },
      { name: 'Casual Wear', description: 'Everyday bangles for casual occasions' },
      { name: 'Festival Special', description: 'Festive bangles for celebrations' },
    ];

    // Check if categories already exist
    const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
    
    if (existingCategories.count === 0) {
      const insertCategory = db.prepare('INSERT INTO categories (name, description, created_at) VALUES (?, ?, ?)');
      
      for (const category of defaultCategories) {
        insertCategory.run(category.name, category.description, Date.now());
      }
      console.log('Default categories created');
    }

    // Create default admin user (password: admin123)
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const existingAdmin = db.prepare('SELECT COUNT(*) as count FROM admin_users WHERE email = ?').get('admin@kangantales.com');

    if (existingAdmin.count === 0) {
      const insertAdmin = db.prepare('INSERT INTO admin_users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)');
      insertAdmin.run('admin@kangantales.com', hashedPassword, 'Admin User', Date.now());
      console.log('Default admin user created: admin@kangantales.com / admin123');
    }

    // Create some sample products
    const sampleProducts = [
      {
        name: 'Golden Rose Bangle',
        description: 'A beautiful handcrafted bangle with intricate rose patterns, perfect for special occasions.',
        price: 2500,
        category: 'Traditional Bangles',
        images: '[]',
        in_stock: 1,
        featured: 1
      },
      {
        name: 'Silver Minimalist Set',
        description: 'Modern minimalist bangles in sterling silver, ideal for everyday wear.',
        price: 1800,
        category: 'Modern Bangles',
        images: '[]',
        in_stock: 1,
        featured: 1
      },
      {
        name: 'Bridal Kundan Collection',
        description: 'Exquisite kundan work bangles designed specially for brides.',
        price: 4500,
        category: 'Bridal Collection',
        images: '[]',
        in_stock: 1,
        featured: 1
      }
    ];

    const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
    
    if (existingProducts.count === 0) {
      const insertProduct = db.prepare(`
        INSERT INTO products (name, description, price, category, images, in_stock, featured, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      for (const product of sampleProducts) {
        insertProduct.run(
          product.name,
          product.description,
          product.price,
          product.category,
          product.images,
          product.in_stock,
          product.featured,
          Date.now(),
          Date.now()
        );
      }
      console.log('Sample products created');
    }

    db.close();
    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initializeDatabase();
