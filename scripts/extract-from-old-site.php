<?php
// Script to extract data from old MySQL database
// Run this on the server where the old site is hosted

$host = "localhost";
$dbname = "israel-escorts";
$username = "phpmyadmin";
$password = "Iin0vKDb7XyP4b4%";

try {
    $db = new PDO("mysql:host=localhost;dbname=israel-escorts", "phpmyadmin", "Iin0vKDb7XyP4b4%");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $data = [];
    
    // Export cities
    echo "Exporting cities...\n";
    $cities = $db->query("SELECT * FROM cities")->fetchAll(PDO::FETCH_ASSOC);
    $data['cities'] = $cities;
    echo "  Found " . count($cities) . " cities\n";
    
    // Export ankety (profiles)
    echo "Exporting profiles (ankety)...\n";
    $ankety = $db->query("SELECT * FROM ankety")->fetchAll(PDO::FETCH_ASSOC);
    $data['ankety'] = $ankety;
    echo "  Found " . count($ankety) . " profiles\n";
    
    // Export users if exists
    echo "Checking for users table...\n";
    try {
        $users = $db->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
        $data['users'] = $users;
        echo "  Found " . count($users) . " users\n";
    } catch (PDOException $e) {
        echo "  Users table not found, skipping...\n";
        $data['users'] = [];
    }
    
    // Save to JSON
    $outputFile = __DIR__ . '/old-data-export.json';
    file_put_contents($outputFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo "\nData exported to: $outputFile\n";
    
    // Show sample
    echo "\n--- Sample Data ---\n";
    if (!empty($data['cities'])) {
        echo "Sample city:\n";
        print_r($data['cities'][0]);
    }
    if (!empty($data['ankety'])) {
        echo "\nSample profile:\n";
        print_r($data['ankety'][0]);
    }
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
    echo "Make sure MySQL is running and credentials are correct.\n";
}
?>
