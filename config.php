<?php
$servername = "vergil.u.washington.edu"; 
$username = "root";  
$password = "I118whenB210";  
$database = "learn2code_db";  
$port = 12455;  

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$database", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>