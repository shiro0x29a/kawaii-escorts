const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function exportData() {
  console.log('Connecting to MySQL database...');
  
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: 'Iin0vKDb7XyP4b4%',
    database: 'israel-escorts'
  });

  console.log('Connected! Exporting data...\n');

  const data = {};

  // Export ankety (profiles)
  console.log('Exporting ankety (profiles)...');
  const [ankety] = await connection.query('SELECT * FROM ankety');
  data.ankety = ankety;
  console.log(`  Found ${ankety.length} profiles\n`);

  // Export cities
  console.log('Exporting cities...');
  const [cities] = await connection.query('SELECT * FROM cities');
  data.cities = cities;
  console.log(`  Found ${cities.length} cities\n`);

  // Export users if exists
  try {
    console.log('Exporting users...');
    const [users] = await connection.query('SELECT * FROM users');
    data.users = users;
    console.log(`  Found ${users.length} users\n`);
  } catch (e) {
    console.log('  Users table not found, skipping...\n');
    data.users = [];
  }

  await connection.end();

  // Save to JSON file
  const outputPath = path.join(__dirname, 'old-data-export.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Data exported to: ${outputPath}`);

  // Print sample data
  console.log('\n--- Sample Data ---');
  if (data.cities.length > 0) {
    console.log('Sample city:', JSON.stringify(data.cities[0], null, 2));
  }
  if (data.ankety.length > 0) {
    console.log('\nSample profile:', JSON.stringify(data.ankety[0], null, 2));
  }
}

exportData().catch(console.error);
