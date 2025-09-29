import { gs } from './index-gsap.js';
class NavigationSlider {

    constructor(containerID) {
        this.slider = document.getElementById(containerID);
        this.slides = Array.from(this.slider.querySelectorAll('.nav-slide'));
        this.currentIdx = 0;
        this.isSliding = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                if (!this.isSliding) {
                    this.centerSlide(slide);
                }
            })
        });

        let startX = 0;
        let endX = 0;

        this.slider.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        });

        this.slider.addEventListener("touchend", (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe(this.slides, this.getPositions(), this.isSliding);
        });

        function handleSwipe(slides, positions, isSliding) {
        const diff = endX - startX;

            if (Math.abs(diff) > 10) { 
                if (!isSliding) {
                    gs.slide(slides, diff, positions);
                }
            }
        }
    }

    centerSlide(slide) {
        gs.centerSlide(slide, this.slides, this.getPositions());
    }

    getPositions() {
        return {
            'tasks-slide': {
                left: '-210%', 
                right: '20%', 
                // leftRotateX: '-10deg', 
                // rightRotateX: '0deg',
                // leftRotateY: '-20deg', 
                // rightRotateY: '20deg', 
            },

            'calendar-slide': {
                left: '-150%', 
                right: '50%', 
                // leftRotateX: '0deg', 
                // rightRotateX: '0deg',
                // leftRotateY: '-20deg', 
                // rightRotateY: '20deg', 
            }    
        }
    };
}

export default NavigationSlider;
