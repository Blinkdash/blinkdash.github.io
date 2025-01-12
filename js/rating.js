document.addEventListener('DOMContentLoaded', () => {
    const ratingsList = document.getElementById('ratingsList');
    const playAgainButton = document.getElementById('playAgain');

    // Отображаем рейтинги
    const ratings = getSortedRatings();
    
    if (ratings.length > 0) {
        ratingsList.innerHTML = ratings.map((rating, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${rating.name}</td>
                <td>${rating.score}</td>
                <td>${rating.difficulty}</td>
                <td>${rating.totalTime} сек</td>
                <td>${rating.date}</td>
            </tr>
        `).join('');
    } else {
        ratingsList.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">Пока нет результатов</td>
            </tr>
        `;
    }

    // Обработчик для кнопки "Играть снова"
    playAgainButton.addEventListener('click', () => {
        localStorage.setItem('currentLevel', '1');
        localStorage.setItem('score', '0');
        window.location.href = 'index.html';
    });
}); 

function saveGameResult(playerName, difficulty, score, totalTime) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    
    if (!ratings[playerName] || ratings[playerName].score < score) {
        ratings[playerName] = {
            score,
            difficulty,
            totalTime,
            date: new Date().toISOString()
        };
    }
    
    localStorage.setItem('ratings', JSON.stringify(ratings));
}

// Обновляем отображение таблицы
function displayRatings() {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    const ratingsList = document.getElementById('ratingsList');
    
    const sortedRatings = Object.entries(ratings)
        .sort(([,a], [,b]) => b.score - a.score)
        .map(([name, data]) => ({name, ...data}));
    
    ratingsList.innerHTML = sortedRatings.map((rating, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${rating.name}</td>
            <td>${rating.score}</td>
            <td>${rating.difficulty}</td>
            <td>${Math.floor(rating.totalTime)}с</td>
            <td>${new Date(rating.date).toLocaleDateString()}</td>
        </tr>
    `).join('');
} 