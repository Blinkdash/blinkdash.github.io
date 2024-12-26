document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startGame');
    const playerNameInput = document.getElementById('playerName');
    const difficultySelect = document.getElementById('difficulty');

    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        const difficulty = difficultySelect.value;
        
        const existingError = document.querySelector('.error-overlay');
        if (existingError) {
            existingError.remove();
        }
        
        if (playerName.length < 2) {
            showError('Пожалуйста, введите имя (минимум 2 символа)');
            return;
        }

        localStorage.setItem('playerName', playerName);
        localStorage.setItem('difficulty', difficulty);
        localStorage.setItem('currentLevel', '1');
        localStorage.setItem('score', '0');

        window.location.href = 'game.html';
    });

    function showError(message) {
        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        
        overlay.innerHTML = `
            <div class="error-content animate__animated animate__fadeIn">
                <h2>Ошибка</h2>
                <p>${message}</p>
                <button class="error-close">OK</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const closeButton = overlay.querySelector('.error-close');
        closeButton.addEventListener('click', () => {
            overlay.remove();
            playerNameInput.focus();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                playerNameInput.focus();
            }
        });
    }
}); 