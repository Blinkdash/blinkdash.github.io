class Game {
    constructor() {
        // Инициализация основных параметров игры
        this.playerName = localStorage.getItem('playerName');
        this.difficulty = localStorage.getItem('difficulty') || 'easy';
        this.currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
        this.score = parseInt(localStorage.getItem('score')) || 0;
        this.gameConfig = GAME_CONFIG.difficulties[this.difficulty];
        this.timeLimit = this.gameConfig.timeLimit;
        this.timer = null;
        this.currentTask = null;
        this.selectedItems = [];
        this.startTime = Date.now();
        this.memoryTimeLeft = null;
        this.testMode = false;

        // Получение DOM элементов
        this.playerNameElement = document.getElementById('playerName');
        this.currentLevelElement = document.getElementById('currentLevel');
        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.taskDescription = document.getElementById('taskDescription');
        this.gameField = document.querySelector('.game-field');
        this.exitButton = document.getElementById('exitGame');
        this.gameControls = document.querySelector('.game-controls');

        this.init();
    }

    init() {
        if (!this.playerName) {
            window.location.href = 'index.html';
            return;
        }

        this.playerNameElement.textContent = this.playerName;
        this.currentLevelElement.textContent = `${this.currentLevel} (${this.gameConfig.name})`;
        this.scoreElement.textContent = this.score;
        this.exitButton.addEventListener('click', () => this.endGame());
        
        this.createTestModeButton(); // Создаем кнопку для тестового режима
        this.startLevel();
    }

    createTestModeButton() {
        const testButton = document.createElement('button');
        testButton.textContent = 'Тестовый режим';
        testButton.id = 'testModeButton';
        
        // Создаем селектор уровней
        const levelSelect = document.createElement('select');
        levelSelect.id = 'levelSelect';
        levelSelect.style.display = 'none';
        
        // Заполняем селектор уровнями
        this.gameConfig.levels.forEach((_, index) => {
            const option = document.createElement('option');
            option.value = index + 1;
            option.textContent = `Уровень ${index + 1}`;
            levelSelect.appendChild(option);
        });
        
        this.gameControls.appendChild(testButton);
        this.gameControls.appendChild(levelSelect);

        // Обработчик для кнопки тестового режима
        testButton.addEventListener('click', () => {
            this.testMode = !this.testMode;
            testButton.classList.toggle('active');
            levelSelect.style.display = this.testMode ? 'inline-block' : 'none';
            
            if (this.testMode) {
                testButton.textContent = 'Выключить тестовый режим';
                this.savedLevel = this.currentLevel;
                levelSelect.value = this.currentLevel;
                // Обновляем отображение текущего уровня
                this.currentLevelElement.textContent = `${this.currentLevel} (${this.gameConfig.name})`;
            } else {
                testButton.textContent = 'Тестовый режим';
                this.currentLevel = this.savedLevel;
            }
            
            this.resetLevel();
        });

        // Обработчик для выбора уровня
        levelSelect.addEventListener('change', (e) => {
            if (this.testMode) {
                this.currentLevel = parseInt(e.target.value);
                // Обновляем отображение текущего уровня
                this.currentLevelElement.textContent = `${this.currentLevel} (${this.gameConfig.name})`;
                this.resetLevel();
            }
        });
    }

    // Добавляем новый метод для сброса уровня
    resetLevel() {
        // Очищаем таймер
        if (this.timer) {
            clearInterval(this.timer);
        }
        // Сбрасываем выбранные элементы
        this.selectedItems = [];
        // Очищаем игровое поле
        this.gameField.innerHTML = '';
        // Запускаем новый уровень
        this.startLevel();
    }

    startLevel() {
        // В начале метода добавляем обновление селектора уровней
        const levelSelect = document.getElementById('levelSelect');
        if (levelSelect) {
            levelSelect.value = this.currentLevel;
        }
        
        // Получаем конфигурацию уровня
        const levelConfig = this.gameConfig.levels[this.currentLevel - 1];
        if (!levelConfig) {
            this.showGameComplete();
            return;
        }

        // Устанавливаем текущее задание
        this.currentTask = levelConfig;
        if (this.currentTask.generateItems) {
            this.currentTask.items = this.currentTask.generateItems();
        }

        // Обновляем описание задания
        this.taskDescription.textContent = this.currentTask.description;
        
        // Создаем индикатор прогресса
        this.createProgressIndicator();
        
        // Создаем игровое поле в зависимости от типа уровня
        this.createFieldForCurrentTask();
        
        // Запускаем таймер
        this.startTimer();
    }

    createFieldForCurrentTask() {
        // Очищаем поле перед созданием нового
        this.gameField.innerHTML = '';
        
        switch(this.currentTask.type) {
            case "sequence":
                this.createSequenceField();
                break;
            case "color":
                this.createColorField();
                break;
            case "pairs":
                this.createPairsField();
                break;
            case "blindPairs":
                this.createBlindPairsField();
                break;
            case "catch":
                this.createCatchField();
                break;
            case "drag":
                this.createDragField();
                break;
            case "keyboard":
                this.createKeyboardField();
                break;
            default:
                console.error('Неизвестный тип уровня:', this.currentTask.type);
        }
    }

    createProgressIndicator() {
        // Удаляем старый прогресс-бар, если он есть
        const oldProgress = document.querySelector('.level-progress');
        if (oldProgress) {
            oldProgress.remove();
        }

        const progressContainer = document.createElement('div');
        progressContainer.className = 'level-progress';

        // Определяем общее количество элементов для прогресса
        let totalItems = 10;
        if (this.currentTask.items) {
            totalItems = this.currentTask.items.length;
            if (this.currentTask.type === "pairs" || this.currentTask.type === "blindPairs") {
                totalItems = this.currentTask.items.length / 2;
            } else if (this.currentTask.type === "color") {
                totalItems = this.currentTask.requiredCount || 
                    this.currentTask.items.filter(i => i.color === this.currentTask.targetColor).length;
            } else if (this.currentTask.type === "catch") {
                totalItems = this.currentTask.requiredCatches;
            }
        }
        
        progressContainer.innerHTML = `
            <div class="progress-text">Прогресс уровня: 
                <span id="progressCount">0</span>/${totalItems}
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        `;

        // Добавляем прогресс-бар после игрового поля
        this.gameField.after(progressContainer);
    }

    createSequenceField() {
        this.gameField.innerHTML = '';
        const items = this.shuffleArray([...this.currentTask.items]);
        
        items.forEach(item => {
            const itemElement = this.createCardElement(item);
            this.gameField.appendChild(itemElement);
        });
    }

    createColorField() {
        this.gameField.innerHTML = '';
        const items = this.shuffleArray([...this.currentTask.items]);
        
        // Выбираем случайный цвет для задания
        const targetColor = this.currentTask.colors[Math.floor(Math.random() * this.currentTask.colors.length)];
        const requiredCount = this.currentTask.requiredCount || 
            items.filter(i => i.color === targetColor).length;
        
        this.taskDescription.textContent = `${this.currentTask.description} (${targetColor}, нужно найти: ${requiredCount})`;
        this.currentTask.targetColor = targetColor;
        
        items.forEach(item => {
            const itemElement = this.createCardElement(item);
            this.gameField.appendChild(itemElement);
        });
    }

    createPairsField() {
        this.gameField.innerHTML = '';
        const items = this.shuffleArray([...this.currentTask.items]);
        
        items.forEach(item => {
            const itemElement = this.createCardElement(item);
            this.gameField.appendChild(itemElement);
        });

        // Показываем карточки на несколько секунд
        const cards = document.querySelectorAll('.card');
        
        // Сначала показываем все карточки (лицевой стороной вверх)
        cards.forEach(card => {
            card.style.transform = 'rotateY(0deg)';
            card.querySelector('.card-front').style.display = 'flex';
            card.querySelector('.card-back').style.display = 'none';
        });

        // Добавляем текст с обратным отсчетом
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        countdownElement.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 48px; color: #fff; background: rgba(0,0,0,0.7); padding: 20px 40px; border-radius: 10px; z-index: 1000;';
        document.body.appendChild(countdownElement);

        // Запускаем обратный отсчет
        this.memoryTimeLeft = 4; // Устанавливаем 4 секунды для показа
        const countdownInterval = setInterval(() => {
            countdownElement.textContent = this.memoryTimeLeft;
            this.memoryTimeLeft--;

            if (this.memoryTimeLeft < 0) {
                clearInterval(countdownInterval);
                countdownElement.remove();
                // Переворачиваем все карточки рубашкой вверх
                cards.forEach(card => {
                    card.style.transform = 'rotateY(180deg)';
                    card.querySelector('.card-front').style.display = 'none';
                    card.querySelector('.card-back').style.display = 'flex';
                });
            }
        }, 1000);
    }

    createBlindPairsField() {
        this.gameField.innerHTML = '';
        const items = this.shuffleArray([...this.currentTask.items]);
        
        items.forEach(item => {
            const itemElement = this.createCardElement(item);
            this.gameField.appendChild(itemElement);
        });

        // Показываем карточки на несколько секунд
        const cards = document.querySelectorAll('.card');
        
        // Сначала показываем все карточки (лицевой стороной вверх)
        cards.forEach(card => {
            card.style.transform = 'rotateY(0deg)';
            card.querySelector('.card-front').style.display = 'flex';
            card.querySelector('.card-back').style.display = 'none';
        });

        // Добавляем текст с обратным отсчетом
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        countdownElement.innerHTML = `
            <div>Запомните</div>
            <div style="font-size: 32px;">${this.currentTask.showTime}</div>
        `;
        document.querySelector('.game-info').appendChild(countdownElement);

        // Запускаем обратный отсчет
        this.memoryTimeLeft = this.currentTask.showTime;
        const countdownInterval = setInterval(() => {
            this.memoryTimeLeft--;
            countdownElement.innerHTML = `
                <div>Запомните</div>
                <div style="font-size: 32px;">${this.memoryTimeLeft}</div>
            `;

            if (this.memoryTimeLeft < 0) {
                clearInterval(countdownInterval);
                countdownElement.remove();
                // Переворачиваем все карточки рубашкой вверх
                cards.forEach(card => {
                    card.style.transform = 'rotateY(180deg)';
                    card.querySelector('.card-front').style.display = 'none';
                    card.querySelector('.card-back').style.display = 'flex';
                });
            }
        }, 1000);
    }

    createCardElement(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'game-item animate__animated animate__fadeIn';
        if (item.color) {
            itemElement.setAttribute('data-color', item.color);
        }
        
        const card = document.createElement('div');
        card.className = 'card';
        card.style.transition = 'transform 0.6s';
        card.style.transformStyle = 'preserve-3d';
        card.style.position = 'relative';
        card.style.width = '100%';
        card.style.height = '100%';
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.innerHTML = item.value;
        front.style.position = 'absolute';
        front.style.width = '100%';
        front.style.height = '100%';
        front.style.backfaceVisibility = 'hidden';
        front.style.display = 'flex';
        front.style.alignItems = 'center';
        front.style.justifyContent = 'center';
        front.style.fontSize = '2.5em';
        front.style.background = 'white';
        front.style.borderRadius = '20px';
        
        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.position = 'absolute';
        back.style.width = '100%';
        back.style.height = '100%';
        back.style.backfaceVisibility = 'hidden';
        back.style.display = 'none';
        back.style.alignItems = 'center';
        back.style.justifyContent = 'center';
        back.style.fontSize = '2.5em';
        back.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
        back.style.borderRadius = '20px';
        back.style.transform = 'rotateY(180deg)';
        
        card.appendChild(front);
        card.appendChild(back);
        itemElement.appendChild(card);
        
        itemElement.addEventListener('click', () => {
            // Проверяем таймер только для уровня blindPairs
            if (this.currentTask.type === 'blindPairs') {
                if (this.memoryTimeLeft < 0) {
                    this.handleClick(item, itemElement);
                }
            } else {
                this.handleClick(item, itemElement);
            }
        });
        
        return itemElement;
    }

    handleClick(item, element) {
        // Если элемент уже отмечен как правильный - ничего не делаем
        if (element.classList.contains('correct')) {
            return;
        }

        if (this.currentTask.type === "sequence") {
            // Проверяем, правильный ли порядок
            const isCorrect = item.order === this.selectedItems.length + 1;
            
            if (isCorrect) {
                element.classList.add('correct');
                this.selectedItems.push(item);
                this.updateScore(this.currentTask.points);
                
                // Обновляем прогресс для sequence
                this.updateProgress(this.selectedItems.length);
                
                // Если все числа найдены в правильном порядке
                if (this.selectedItems.length && this.selectedItems.length === this.currentTask.items.length) {
                    setTimeout(() => this.showLevelComplete(), 500);
                }
            } else {
                element.classList.add('wrong');
                this.updateScore(this.currentTask.penalty);
                setTimeout(() => {
                    element.classList.remove('wrong');
                }, 1000);
            }
            return;
        }

        if (this.currentTask.type === "color") {
            // Проверяем цвет
            const isCorrect = item.color === this.currentTask.targetColor;
            
            if (isCorrect) {
                element.classList.add('correct');
                this.selectedItems.push(item);
                this.updateScore(this.currentTask.points);
                
                // Обновляем прогресс для color
                const correctColors = this.selectedItems.filter(i => i.color === this.currentTask.targetColor).length;
                this.updateProgress(correctColors);
                
                const requiredCount = this.currentTask.requiredCount || (this.currentTask.items &&
                    this.currentTask.items.filter(i => i.color === this.currentTask.targetColor).length);
                    
                if (correctColors === requiredCount) {
                    setTimeout(() => this.showLevelComplete(), 500);
                }
            } else {
                element.classList.add('wrong');
                this.updateScore(this.currentTask.penalty);
                setTimeout(() => {
                    element.classList.remove('wrong');
                }, 1000);
            }
            return;
        }

        if (this.currentTask.type === "pairs" || this.currentTask.type === "blindPairs") {
            const card = element.querySelector('.card');
            const front = card.querySelector('.card-front');
            const back = card.querySelector('.card-back');
            
            // Если карточка уже открыта - ничего не делаем
            if (card.style.transform === 'rotateY(0deg)') {
                return;
            }
            
            // Открываем карточку
            card.style.transform = 'rotateY(0deg)';
            front.style.display = 'flex';
            back.style.display = 'none';
            
            if (this.selectedItems.length === 0) {
                this.selectedItems.push({item, element});
            } else {
                const firstCard = this.selectedItems[0];
                
                if (firstCard.item.pair === item.pair) {
                    element.classList.add('correct');
                    firstCard.element.classList.add('correct');
                    this.updateScore(this.currentTask.points);
                    this.selectedItems = [];
                    
                    if (this.currentTask.items && document.querySelectorAll('.game-item.correct').length === this.currentTask.items.length) {
                        setTimeout(() => this.showLevelComplete(), 500);
                    }
                } else {
                    element.classList.add('wrong');
                    firstCard.element.classList.add('wrong');
                    this.updateScore(this.currentTask.penalty);
                    
                    setTimeout(() => {
                        // Закрываем обе карточки
                        const cards = [card, firstCard.element.querySelector('.card')];
                        cards.forEach(c => {
                            c.style.transform = 'rotateY(180deg)';
                            c.querySelector('.card-front').style.display = 'none';
                            c.querySelector('.card-back').style.display = 'flex';
                        });
                        element.classList.remove('wrong');
                        firstCard.element.classList.remove('wrong');
                    }, 1000);
                }
                this.selectedItems = [];
            }
            
            this.updateProgress(document.querySelectorAll('.game-item.correct').length / 2);
        }
    }

    updateProgress(currentProgress) {
        const progressCount = document.getElementById('progressCount');
        const progressFill = document.querySelector('.progress-fill');
        
        let totalItems;
        if (this.currentTask.type === "catch") {
            totalItems = this.currentTask.requiredCatches;
        } else if (this.currentTask.type === "pairs" || this.currentTask.type === "blindPairs") {
            totalItems = this.currentTask.items.length / 2;
        } else if (this.currentTask.type === "color") {
            totalItems = this.currentTask.requiredCount || 
                this.currentTask.items.filter(i => i.color === this.currentTask.targetColor).length;
        } else if (this.currentTask.type === "keyboard") {
            totalItems = 10;
        } else {
            totalItems = this.currentTask.items.length;
        }
        
        if (progressCount) progressCount.textContent = currentProgress;
        if (progressFill) progressFill.style.width = `${(currentProgress / totalItems) * 100}%`;
    }

    updateScore(points) {
        // Применяем множитель сложности к очкам
        const multipliedPoints = points * this.gameConfig.scoreMultiplier;
        this.score += multipliedPoints;
        this.scoreElement.textContent = this.score;
        localStorage.setItem('score', this.score.toString());
    }

    checkLevelComplete() {
        switch(this.currentTask.type) {
            case "sequence":
                return this.selectedItems.length === this.currentTask.items.length;
            
            case "color":
                const requiredCount = this.currentTask.requiredCount || 
                    this.currentTask.items.filter(i => i.color === this.currentTask.targetColor).length;
                return this.selectedItems.filter(i => i.color === this.currentTask.targetColor).length === requiredCount;
                
            case "pairs":
            case "blindPairs":
                return document.querySelectorAll('.game-item.correct').length === this.currentTask.items.length;
                
            default:
                return false;
        }
    }

    showLevelComplete() {
        const overlay = document.createElement('div');
        overlay.className = 'level-complete-overlay';
        
        overlay.innerHTML = `
            <div class="level-complete-content">
                <h2>Уровень ${this.currentLevel} пройден!</h2>
                <div class="level-stats">
                    <p>Очки: ${this.score}</p>
                    <p>Время: ${this.timeElement.textContent} сек</p>
                </div>
                <button class="next-level-btn">Следующий уровень</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.next-level-btn').addEventListener('click', () => {
            overlay.remove();
            this.completeLevel();
        });
    }

    showTimeUpMessage() {
        clearInterval(this.timer);
        
        const overlay = document.createElement('div');
        overlay.className = 'level-complete-overlay';
        
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        overlay.innerHTML = `
            <div class="level-complete-content">
                <h2>Время вышло!</h2>
                <div class="level-stats">
                    <p>Ваш результат: ${this.score} очков</p>
                    <p>Пройдено уровней: ${this.currentLevel - 1}</p>
                    <p>Сложность: ${this.gameConfig.name}</p>
                    <p>Общее время: ${totalTime} сек</p>
                </div>
                <button class="next-level-btn">Попробовать ещё раз</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.next-level-btn').addEventListener('click', () => {
            overlay.remove();
            this.currentLevel = 1;
            this.score = 0;
            localStorage.setItem('currentLevel', '1');
            localStorage.setItem('score', '0');
            this.startLevel();
        });
    }

    startTimer() {
        clearInterval(this.timer);
        let timeLeft = this.timeLimit;
        this.timeElement.textContent = timeLeft;
        
        this.timer = setInterval(() => {
            timeLeft--;
            this.timeElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.showTimeUpMessage();
            }
        }, 1000);
    }

    completeLevel() {
        clearInterval(this.timer);
        this.currentLevel++;
        
        // Проверяем, не превышает ли номер уровня максимальное количество уровней
        if (this.currentLevel > this.gameConfig.levels.length) {
            const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
            this.showGameComplete(totalTime);
        } else {
            localStorage.setItem('currentLevel', this.currentLevel.toString());
            this.startLevel();
        }
    }

    endGame() {
        clearInterval(this.timer);
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        const overlay = document.createElement('div');
        overlay.className = 'level-complete-overlay';
        
        overlay.innerHTML = `
            <div class="level-complete-content">
                <h2>Игра завершена</h2>
                <div class="level-stats">
                    <p>Ваш результат: ${this.score} очков</p>
                    <p>Пройдено уровней: ${this.currentLevel - 1}</p>
                    <p>Сложность: ${this.gameConfig.name}</p>
                    <p>Общее время: ${totalTime} сек</p>
                </div>
                <div class="game-controls">
                    <button class="next-level-btn view-results">Посмотреть результаты</button>
                    <button class="next-level-btn change-difficulty">Выбрать другую сложность</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.view-results').addEventListener('click', () => {
            overlay.remove();
            this.completeGame();
        });

        overlay.querySelector('.change-difficulty').addEventListener('click', () => {
            overlay.remove();
            localStorage.removeItem('currentLevel');
            localStorage.removeItem('score');
            localStorage.removeItem('difficulty');
            window.location.href = 'index.html';
        });
    }

    completeGame() {
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        saveGameResult(this.playerName, this.difficulty, this.score, totalTime);
        
        localStorage.removeItem('currentLevel');
        localStorage.removeItem('score');
        
        window.location.href = 'rating.html';
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Добавим новый метод для показа окна завершения игры
    showGameComplete(totalTime) {
        const overlay = document.createElement('div');
        overlay.className = 'level-complete-overlay';
        
        overlay.innerHTML = `
            <div class="level-complete-content">
                <h2>Поздравляем!</h2>
                <div class="level-stats">
                    <p>Вы прошли все уровни!</p>
                    <p>Итоговый счет: ${this.score}</p>
                    <p>Сложность: ${this.gameConfig.name}</p>
                    <p>Общее время: ${totalTime} сек</p>
                </div>
                <div class="game-controls">
                    <button class="next-level-btn view-results">Посмотреть результаты</button>
                    <button class="next-level-btn change-difficulty">Выбрать другую сложность</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Обработчик для кнопки "Посмотреть результаты"
        overlay.querySelector('.view-results').addEventListener('click', () => {
            overlay.remove();
            this.completeGame();
        });

        // Обработчи для кнопки "Выбрать другую сложность"
        overlay.querySelector('.change-difficulty').addEventListener('click', () => {
            overlay.remove();
            localStorage.removeItem('currentLevel');
            localStorage.removeItem('score');
            localStorage.removeItem('difficulty');
            window.location.href = 'index.html';
        });
    }

    createCatchField() {
        // Очищаем игровое поле
        this.gameField.innerHTML = '';
        
        // Создаем прогресс-бар
        this.createProgressIndicator();
        
        // Создаем всех животных сразу
        const animals = [];
        for (let i = 0; i < this.currentTask.requiredCatches; i++) {
            const animal = document.createElement('div');
            animal.className = 'moving-animal';
            animal.innerHTML = this.currentTask.items[i % this.currentTask.items.length].value;
            
            // Случайная начальная позиция
            animal.style.left = `${Math.random() * (this.gameField.offsetWidth - 60)}px`;
            animal.style.top = `${Math.random() * (this.gameField.offsetHeight - 60)}px`;
            
            this.gameField.appendChild(animal);
            animals.push(animal);
        }
        
        let catches = 0;
        
        // Функция движения для одного животного
        const moveAnimal = (animal, speed) => {
            let directionX = Math.random() > 0.5 ? 1 : -1;
            let directionY = Math.random() > 0.5 ? 1 : -1;
            
            const update = () => {
                if (animal.classList.contains('caught')) return;
                
                const rect = animal.getBoundingClientRect();
                const fieldRect = this.gameField.getBoundingClientRect();
                
                if (rect.left <= fieldRect.left || rect.right >= fieldRect.right) {
                    directionX *= -1;
                    animal.style.transform = directionX > 0 ? 'scaleX(1)' : 'scaleX(-1)';
                }
                if (rect.top <= fieldRect.top || rect.bottom >= fieldRect.bottom) {
                    directionY *= -1;
                }
                
                const currentLeft = parseFloat(animal.style.left) || 0;
                const currentTop = parseFloat(animal.style.top) || 0;
                
                animal.style.left = `${currentLeft + directionX * speed}px`;
                animal.style.top = `${currentTop + directionY * speed}px`;
                
                requestAnimationFrame(update);
            };
            
            update();
        };
        
        // Запускаем движение для каждого животного
        animals.forEach(animal => {
            const speed = 1; // Базовая скорость движения
            moveAnimal(animal, speed);
            
            animal.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (!animal.classList.contains('caught')) {
                    animal.classList.add('caught');
                    catches++;
                    this.updateScore(this.currentTask.points);
                    this.updateProgress(catches);
                    
                    if (catches >= this.currentTask.requiredCatches) {
                        setTimeout(() => {
                            this.showLevelComplete();
                        }, 500);
                    }
                }
            });
        });
    }

    createDragField() {
        this.gameField.innerHTML = ''; // Очищаем поле
        const items = this.shuffleArray([...this.currentTask.items]);
        const targets = [...this.currentTask.targets];
        let correctPlacements = 0;
        
        // Создаем прогресс-бар
        this.createProgressIndicator();
        
        const fruitsZone = document.createElement('div');
        fruitsZone.className = 'fruits-zone';
        
        const basketsZone = document.createElement('div');
        basketsZone.className = 'baskets-zone';
        
        items.forEach(item => {
            const fruit = document.createElement('div');
            fruit.className = 'draggable';
            fruit.innerHTML = item.value;
            fruit.setAttribute('data-type', item.type);
            fruit.draggable = true;
            
            fruit.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.type);
                fruit.classList.add('dragging');
            });
            
            fruit.addEventListener('dragend', () => {
                fruit.classList.remove('dragging');
            });
            
            fruitsZone.appendChild(fruit);
        });
        
        targets.forEach(target => {
            const basket = document.createElement('div');
            basket.className = 'basket-target';
            basket.innerHTML = `${target.value}<div>${target.label}</div>`;
            basket.setAttribute('data-type', target.id);
            
            basket.addEventListener('dragover', (e) => {
                e.preventDefault();
                basket.classList.add('drag-over');
            });
            
            basket.addEventListener('dragleave', () => {
                basket.classList.remove('drag-over');
            });
            
            basket.addEventListener('drop', (e) => {
                e.preventDefault();
                basket.classList.remove('drag-over');
                
                const fruitType = e.dataTransfer.getData('text/plain');
                if (fruitType === target.id) {
                    correctPlacements++;
                    this.updateScore(this.currentTask.points);
                    const fruit = document.querySelector(`.draggable[data-type="${fruitType}"]`);
                    fruit.remove();
                    
                    this.updateProgress(correctPlacements);
                    
                    // Проверяем, все ли фрукты размещены
                    const remainingFruits = document.querySelectorAll('.draggable');
                    if (remainingFruits.length === 0) {
                        // Проверяем, что это 5-й уровень
                        if (this.currentLevel === 5) {
                            const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
                            setTimeout(() => this.showGameComplete(totalTime), 500);
                        } else {
                            setTimeout(() => this.showLevelComplete(), 500);
                        }
                    }
                } else {
                    this.updateScore(this.currentTask.penalty);
                }
            });
            
            basketsZone.appendChild(basket);
        });
        
        this.gameField.appendChild(fruitsZone);
        this.gameField.appendChild(basketsZone);
    }

    createKeyboardField() {
        const sequence = this.currentTask.generateSequence();
        let currentIndex = 0;
        this.currentTask.items = [0, 0, 0, 0, 0]
        
        const sequenceDisplay = document.createElement('div');
        sequenceDisplay.className = 'sequence-display';
        sequence.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key-element';
            keyElement.textContent = key;
            sequenceDisplay.appendChild(keyElement);
        });
        document.getElementById('levelSelect').blur()
        this.gameField.appendChild(sequenceDisplay);
        
        
        const keyHandler = (e) => {
            const pressedKey = e.key.toUpperCase();
            const currentKey = sequence[currentIndex];
            
            const isCorrect = 
                pressedKey === currentKey ||
                (e.key === 'ArrowUp' && currentKey === '↑') ||
                (e.key === 'ArrowDown' && currentKey === '↓') ||
                (e.key === 'ArrowLeft' && currentKey === '←') ||
                (e.key === 'ArrowRight' && currentKey === '→');
            
            if (isCorrect) {
                sequenceDisplay.children[currentIndex].classList.add('correct');
                currentIndex++;
                this.updateScore(this.currentTask.points);
                this.updateProgress(currentIndex);
                
                if (currentIndex >= sequence.length) {
                    document.removeEventListener('keydown', keyHandler);
                    setTimeout(() => this.showLevelComplete(), 500);
                }
            } else {
                this.updateScore(this.currentTask.penalty);
            }
        };
        
        document.addEventListener('keydown', keyHandler);
    }
}

// Инициализация игры при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 