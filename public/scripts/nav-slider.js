import { gs } from './index-gsap.js';

class NavigationSlider {

    constructor(containerID) {
        this.slider = document.getElementById(containerID);
        this.slides = Array.from(this.slider.querySelectorAll('.nav-slide'));
        this.currentIdx = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        gs.setupSlides(this.slides, this.getPositions());
    }

    setupEventListeners() {
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                this.centerSlide(slide);
            })
        });

        let startX = 0;
        let endX = 0;

        this.slider.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        this.slider.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(this.slides, this.getPositions());
        });

        function handleSwipe(slides, positions) {
        const diff = endX - startX;

            if (Math.abs(diff) > 10) { 
                gs.slide(slides, diff, positions);
            }
        }
    }

    centerSlide(slide) {

        gs.centerSlide(slide, this.slides, this.getPositions());
    }

    getPositions() {
        return {
            tasks: {left: '-210%', right: '20%'},
            calendar: {left: '-150%', right: '50%'}
        };
    }
}

const navSlider = new NavigationSlider('nav-slider-container');