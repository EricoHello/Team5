fetch("https://students.washington.edu/is04/learn2code_db/api.php?action=getQuiz&lesson_id=1")
    .then(response => response.json())
    .then(data => {
        console.log("Quiz Data:", data); // Debugging

        // Display quiz
        document.getElementById("quiz").innerHTML = data.map(q =>
            `<h3>${q.question}</h3>
       <ul>${q.choices.map(choice => `<li>${choice}</li>`).join('')}</ul>`
        ).join('');
    })
    .catch(error => console.error("Error fetching quiz:", error));