const slides = document.querySelectorAll('.ad-slide');
const dots = document.querySelectorAll('.ad-dot');
let currentIndex = 0;

function showSlide(index) {
    const offset = index * -100; // Shift by 100% per slide
    document.querySelector('.ad-slider').style.transform = `translateX(${offset}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    currentIndex = index;
}

function nextSlide() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto-slide every 5 seconds
setInterval(nextSlide, 3000);
