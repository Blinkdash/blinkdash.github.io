document.getElementById("contact-button").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
})
document.getElementById("banner-button").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("banner").scrollIntoView({ behavior: "smooth" });
})
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.posts__list');

    function checkVisibility() {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('slide-in');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
});
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.banner');
    function checkVisibility() {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('slide-in');
            }
        });
    }
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
});
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.works__list');
    function checkVisibility() {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                element.classList.add('slide-in_r');
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
});
document.getElementById("guide-button").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("posts").scrollIntoView({ behavior: "smooth", block: "start" });
});
window.addEventListener('scroll', function() {
    const header = document.querySelector('.main-header');
    const initialImage = document.querySelector('.initial');
    const scrollImage = document.querySelector('.scroll');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
        initialImage.style.opacity = '0';
        initialImage.style.transform = 'scale(0.3)';
        initialImage.style.right = '82%';
        initialImage.style.top = '-50%';
        initialImage.style.left = 'auto';
        scrollImage.style.opacity = '1';
    } else {
        header.classList.remove('scrolled');
        initialImage.style.opacity = '1';
        initialImage.style.transform = 'scale(1)';
        initialImage.style.right = '80%';
        initialImage.style.top = '0';
        initialImage.style.left = 'auto';
        scrollImage.style.opacity = '0';
    }
});

function getDeclension(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[
        (number % 100 > 4 && number % 100 < 20) ? 2 : cases[Math.min(number % 10, 5)]
        ];
}

function updateCountdown() {
    const endDate = new Date("2024-11-26T00:00:00");
    const now = new Date();
    const timeRemaining = endDate - now;

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const daysText = getDeclension(days, ["день", "дня", "дней"]);
    const hoursText = getDeclension(hours, ["час", "часа", "часов"]);
    const minutesText = getDeclension(minutes, ["минута", "минуты", "минут"]);
    const secondsText = getDeclension(seconds, ["секунда", "секунды", "секунд"]);

    document.getElementById("timer").innerHTML =
        `${days} ${daysText} ${hours} ${hoursText} ${minutes} ${minutesText} ${seconds} ${secondsText}`;
}
updateCountdown(); // Initial call
setInterval(updateCountdown, 1000); // Update every second
