const CARD_SETS = [
    // Набор 1: Масти
    [
        { id: 1, value: "♠", pair: 1 },
        { id: 2, value: "♠", pair: 1 },
        { id: 3, value: "♥", pair: 2 },
        { id: 4, value: "♥", pair: 2 },
        { id: 5, value: "♦", pair: 3 },
        { id: 6, value: "♦", pair: 3 },
        { id: 7, value: "♣", pair: 4 },
        { id: 8, value: "♣", pair: 4 }
    ],
    // Набор 2: Геометрические фигуры
    [
        { id: 1, value: "●", pair: 1 },
        { id: 2, value: "●", pair: 1 },
        { id: 3, value: "■", pair: 2 },
        { id: 4, value: "■", pair: 2 },
        { id: 5, value: "▲", pair: 3 },
        { id: 6, value: "▲", pair: 3 },
        { id: 7, value: "★", pair: 4 },
        { id: 8, value: "★", pair: 4 }
    ],
    // Набор 3: Эмодзи животных
    [
        { id: 1, value: "🐶", pair: 1 },
        { id: 2, value: "🐶", pair: 1 },
        { id: 3, value: "🐱", pair: 2 },
        { id: 4, value: "🐱", pair: 2 },
        { id: 5, value: "🐰", pair: 3 },
        { id: 6, value: "🐰", pair: 3 },
        { id: 7, value: "🦊", pair: 4 },
        { id: 8, value: "🦊", pair: 4 }
    ],
    // Набор 4: Фрукты
    [
        { id: 1, value: "🍎", pair: 1 },
        { id: 2, value: "🍎", pair: 1 },
        { id: 3, value: "🍌", pair: 2 },
        { id: 4, value: "🍌", pair: 2 },
        { id: 5, value: "🍇", pair: 3 },
        { id: 6, value: "🍇", pair: 3 },
        { id: 7, value: "🍊", pair: 4 },
        { id: 8, value: "🍊", pair: 4 }
    ]
];

const GAME_CONFIG = {
    difficulties: {
        easy: {
            name: "Легкий",
            timeLimit: 60,
            scoreMultiplier: 1,
            levels: [
                {
                    id: 1,
                    name: "Числа по порядку",
                    description: "Кликайте по числам по возрастанию",
                    type: "sequence",
                    items: Array.from({length: 10}, (_, i) => ({
                        id: i + 1,
                        name: String(i + 1),
                        value: String(i + 1),
                        order: i + 1
                    })),
                    points: 10,
                    penalty: -5
                },
                {
                    id: 2,
                    name: "Цветные фигуры",
                    description: "Найдите все фигуры указанного цвета",
                    type: "color",
                    colors: ["красные", "синие", "зеленые", "желтые"],
                    items: [
                        { id: 1, value: "●", color: "красные" },
                        { id: 2, value: "■", color: "синие" },
                        { id: 3, value: "●", color: "зеленые" },
                        { id: 4, value: "★", color: "желтые" },
                        { id: 5, value: "♥", color: "красные" },
                        { id: 6, value: "♦", color: "синие" },
                        { id: 7, value: "▲", color: "зеленые" },
                        { id: 8, value: "☀", color: "желтые" }
                    ],
                    points: 15,
                    penalty: -5
                },
                {
                    id: 3,
                    name: "Найди пару",
                    description: "Запомните расположение фигур и найдите пары (карточки будут скрыты через 4 секунды)",
                    type: "blindPairs",
                    generateItems: () => {
                        // Выбираем случайный набор карточек
                        return CARD_SETS[Math.floor(Math.random() * CARD_SETS.length)];
                    },
                    showTime: 4,
                    points: 20,
                    penalty: -5
                },
                {
                    id: 4,
                    name: "Поймай зверушку",
                    description: "Поймайте убегающих животных кликом мыши",
                    type: "catch",
                    items: [
                        { id: 1, value: "🐰", speed: 2 },
                        { id: 2, value: "🐱", speed: 3 },
                        { id: 3, value: "🐶", speed: 4 }
                    ],
                    requiredCatches: 5,
                    points: 25,
                    penalty: -5
                },
                {
                    id: 5,
                    name: "Перетащи в корзину",
                    description: "Перетащите фрукты в соответствующие корзины",
                    type: "drag",
                    items: [
                        { id: 1, value: "🍎", type: "red" },
                        { id: 2, value: "🍏", type: "green" },
                        { id: 3, value: "🍌", type: "yellow" }
                    ],
                    targets: [
                        { id: "red", value: "🧺", label: "Красные" },
                        { id: "green", value: "🧺", label: "Зеленые" },
                        { id: "yellow", value: "🧺", label: "Желтые" }
                    ],
                    points: 30,
                    penalty: -5
                },
                {
                    id: 6,
                    name: "Клавиатурный ниндзя",
                    description: "Нажимайте указанные клавиши в правильном порядке",
                    type: "keyboard",
                    generateSequence: () => {
                        const keys = ['W', 'A', 'S', 'D', '↑', '↓', '←', '→'];
                        const sequence = [];
                        for(let i = 0; i < 5; i++) {
                            sequence.push(keys[Math.floor(Math.random() * keys.length)]);
                        }
                        return sequence;
                    },
                    showTime: 3,
                    points: 35,
                    penalty: -5
                }
            ]
        },
        normal: {
            name: "Нормальный",
            timeLimit: 30,
            scoreMultiplier: 2,
            levels: [
                {
                    id: 1,
                    name: "Случайные числа",
                    description: "Кликайте по числам по возрастанию",
                    type: "sequence",
                    generateItems: () => {
                        const numbers = new Set();
                        while(numbers.size < 10) {
                            numbers.add(Math.floor(Math.random() * 1000) + 1);
                        }
                        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
                        return sortedNumbers.map((num, index) => ({
                            id: index + 1,
                            name: String(num),
                            value: String(num),
                            order: index + 1
                        }));
                    },
                    points: 20,
                    penalty: -10
                },
                {
                    id: 2,
                    name: "Цветные фигуры",
                    description: "Найдите все фигуры указанного цвета (нужно найти 3)",
                    type: "color",
                    colors: ["красные", "синие", "зеленые", "желтые"],
                    items: [
                        { id: 1, value: "●", color: "красные" },
                        { id: 2, value: "■", color: "синие" },
                        { id: 3, value: "●", color: "зеленые" },
                        { id: 4, value: "★", color: "желтые" },
                        { id: 5, value: "♥", color: "красные" },
                        { id: 6, value: "♦", color: "синие" },
                        { id: 7, value: "▲", color: "зеленые" },
                        { id: 8, value: "☀", color: "желтые" },
                        { id: 9, value: "♡", color: "красные" },
                        { id: 10, value: "◆", color: "синие" },
                        { id: 11, value: "△", color: "зеленые" },
                        { id: 12, value: "☆", color: "желтые" }
                    ],
                    requiredCount: 3,
                    points: 25,
                    penalty: -10
                },
                {
                    id: 3,
                    name: "Найди пару",
                    description: "Запомните рас��оложение фигур и найдите пары (карточки будут скрыты через 4 секунды)",
                    type: "blindPairs",
                    items: [
                        { id: 1, value: "♠", pair: 1 },
                        { id: 2, value: "♠", pair: 1 },
                        { id: 3, value: "♥", pair: 2 },
                        { id: 4, value: "♥", pair: 2 },
                        { id: 5, value: "♦", pair: 3 },
                        { id: 6, value: "♦", pair: 3 },
                        { id: 7, value: "♣", pair: 4 },
                        { id: 8, value: "♣", pair: 4 },
                        { id: 9, value: "★", pair: 5 },
                        { id: 10, value: "★", pair: 5 }
                    ],
                    showTime: 4,
                    points: 30,
                    penalty: -10
                },
                {
                    id: 4,
                    name: "Быстрые зверушки",
                    description: "Поймайте убегающих животных кликом мыши (они двигаются быстрее)",
                    type: "catch",
                    items: [
                        { id: 1, value: "🐰", speed: 3 },
                        { id: 2, value: "🐱", speed: 4 },
                        { id: 3, value: "🐶", speed: 5 }
                    ],
                    requiredCatches: 7,
                    points: 30,
                    penalty: -10
                },
                {
                    id: 5,
                    name: "Сортировка фруктов",
                    description: "Перетащите фрукты в соответствующие корзины (больше фруктов)",
                    type: "drag",
                    items: [
                        { id: 1, value: "🍎", type: "red" },
                        { id: 2, value: "🍏", type: "green" },
                        { id: 3, value: "🍌", type: "yellow" },
                        { id: 4, value: "🍎", type: "red" },
                        { id: 5, value: "🍏", type: "green" },
                        { id: 6, value: "🍌", type: "yellow" }
                    ],
                    targets: [
                        { id: "red", value: "🧺", label: "Красные" },
                        { id: "green", value: "🧺", label: "Зеленые" },
                        { id: "yellow", value: "🧺", label: "Желтые" }
                    ],
                    points: 35,
                    penalty: -10
                }
            ]
        },
        hard: {
            name: "Сложный",
            timeLimit: 20,
            scoreMultiplier: 3,
            levels: [
                {
                    id: 1,
                    name: "Отрицательные числа",
                    description: "Кликайте по числам по возрастанию (включая отрицательные)",
                    type: "sequence",
                    generateItems: () => {
                        const numbers = new Set();
                        while(numbers.size < 15) {
                            numbers.add(Math.floor(Math.random() * 2000) - 1000);
                        }
                        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
                        return sortedNumbers.map((num, index) => ({
                            id: index + 1,
                            name: String(num),
                            value: String(num),
                            order: index + 1
                        }));
                    },
                    points: 30,
                    penalty: -15
                },
                {
                    id: 2,
                    name: "Цветные фигуры",
                    description: "Найдите все фигуры указанного цвета (нужно найти 4)",
                    type: "color",
                    colors: ["красные", "синие", "зеленые", "желтые"],
                    items: [
                        { id: 1, value: "🔴", color: "красные" },
                        { id: 2, value: "🟦", color: "синие" },
                        { id: 3, value: "🟢", color: "зеленые" },
                        { id: 4, value: "⭐", color: "желтые" },
                        { id: 5, value: "❤️", color: "красные" },
                        { id: 6, value: "🔷", color: "синие" },
                        { id: 7, value: "🍀", color: "зеленые" },
                        { id: 8, value: "☀️", color: "желтые" },
                        { id: 9, value: "💝", color: "красные" },
                        { id: 10, value: "💠", color: "синие" },
                        { id: 11, value: "🌿", color: "зеленые" },
                        { id: 12, value: "🌟", color: "желтые" },
                        { id: 13, value: "💗", color: "красные" },
                        { id: 14, value: "🌀", color: "синие" },
                        { id: 15, value: "🌱", color: "зеленые" },
                        { id: 16, value: "✨", color: "желтые" }
                    ],
                    requiredCount: 4,
                    points: 40,
                    penalty: -15
                },
                {
                    id: 3,
                    name: "Слепые пары",
                    description: "Запомните расположение фигур и найдите пары (карточки будут скрыты через 5 секунд)",
                    type: "blindPairs",
                    items: [
                        { id: 1, value: "🐶", pair: 1 },
                        { id: 2, value: "🐶", pair: 1 },
                        { id: 3, value: "🐱", pair: 2 },
                        { id: 4, value: "🐱", pair: 2 },
                        { id: 5, value: "🐰", pair: 3 },
                        { id: 6, value: "🐰", pair: 3 },
                        { id: 7, value: "🦊", pair: 4 },
                        { id: 8, value: "🦊", pair: 4 },
                        { id: 9, value: "🐼", pair: 5 },
                        { id: 10, value: "🐼", pair: 5 }
                    ],
                    showTime: 5,
                    points: 50,
                    penalty: -15
                },
                {
                    id: 4,
                    name: "Супер быстрые зверушки",
                    description: "Поймайте убегающих животных кликом мыши (они очень быстрые)",
                    type: "catch",
                    items: [
                        { id: 1, value: "🐰", speed: 5 },
                        { id: 2, value: "🐱", speed: 6 },
                        { id: 3, value: "🐶", speed: 7 }
                    ],
                    requiredCatches: 10,
                    points: 40,
                    penalty: -15
                },
                {
                    id: 5,
                    name: "Мастер сортировки",
                    description: "Перетащите фрукты в соответствующие корзины (много фруктов)",
                    type: "drag",
                    items: [
                        { id: 1, value: "🍎", type: "red" },
                        { id: 2, value: "🍏", type: "green" },
                        { id: 3, value: "🍌", type: "yellow" },
                        { id: 4, value: "🍎", type: "red" },
                        { id: 5, value: "🍏", type: "green" },
                        { id: 6, value: "🍌", type: "yellow" },
                        { id: 7, value: "🍎", type: "red" },
                        { id: 8, value: "🍏", type: "green" },
                        { id: 9, value: "🍌", type: "yellow" }
                    ],
                    targets: [
                        { id: "red", value: "🧺", label: "Красные" },
                        { id: "green", value: "🧺", label: "Зеленые" },
                        { id: "yellow", value: "🧺", label: "Желтые" }
                    ],
                    points: 45,
                    penalty: -15
                }
            ]
        }
    }
}; 