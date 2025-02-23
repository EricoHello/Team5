<?php
require 'config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Handle different API actions
if (!isset($_GET['action'])) {
    echo json_encode(["error" => "No action specified"]);
    exit;
}

$action = $_GET['action'];

switch ($action) {
    case "getLessons":
        getLessons();
        break;
    case "getQuiz":
        if (isset($_GET['lesson_id'])) {
            getQuiz($_GET['lesson_id']);
        } else {
            echo json_encode(["error" => "Lesson ID required"]);
        }
        break;
    default:
        echo json_encode(["error" => "Invalid action"]);
}

// Fetch all lessons
function getLessons() {
    global $pdo;
    $stmt = $pdo->query("SELECT id, title, content, video_url FROM lessons");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function getQuiz($lesson_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id, question, choices, correct_answer FROM quizzes WHERE lesson_id = ?");
    $stmt->execute([$lesson_id]);
    $quiz = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode choices JSON before returning it
    foreach ($quiz as &$q) {
        $q['choices'] = json_decode($q['choices']); 
    }

    echo json_encode($quiz);
}
?>