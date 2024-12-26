// Функция сохранения результата игры
function saveGameResult(playerName, difficulty, score, totalTime) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '[]');
    
    // Преобразуем сложность в русский текст
    const difficultyNames = {
        'easy': 'Легкий',
        'normal': 'Нормальный',
        'hard': 'Сложный'
    };
    
    const difficultyText = difficultyNames[difficulty] || difficulty;
    
    // Создаем новый результат
    const newResult = {
        name: playerName,
        score: score,
        difficulty: difficultyText,
        totalTime: totalTime,
        date: new Date().toLocaleDateString('ru-RU')
    };

    // Добавляем новый результат и сортируем по убыванию очков
    ratings.push(newResult);
    ratings.sort((a, b) => b.score - a.score);

    // Сохраняем только топ-10 результатов
    const topResults = ratings.slice(0, 10);
    localStorage.setItem('ratings', JSON.stringify(topResults));
}

// Функция получения отсортированного списка рейтингов
function getSortedRatings() {
    return JSON.parse(localStorage.getItem('ratings') || '[]');
} 