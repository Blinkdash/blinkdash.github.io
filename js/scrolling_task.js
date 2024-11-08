document.getElementById("contact-button").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
})

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
