import {setupPermanantListeners} from './index.js';
import NavigationSlider from './nav-slider.js';

export const gs = {
    extryPlaying: true,
    navSlider: undefined,

    setupEntry() {
        const logoName = document.querySelector('#logo-name');
        const logoIcon = document.querySelector('#logo-icon');
        gsap.set(logoName, {y: -100});
        gsap.set(logoIcon, {scale: 0});

        const burgerAnc = document.querySelector('#burger-link');
        gsap.set(burgerAnc, {opacity: 0});

        const tasksSlide = document.querySelector('#tasks-slide');
        const calendarSlide = document.querySelector('#calendar-slide');
        gsap.set(tasksSlide, {
            scale: 0,
            transform: 'translate(-50%, 0)'
        });
        gsap.set(calendarSlide, {
            scale: 0,
            transform: 'translate(70%, 0)'
        });

        const taskContainer = document.querySelector('#task-container');
        const addTaskLink = document.querySelector('#add-task-link');
        const tasks = document.querySelectorAll('.task-li');
        const deleteIconLarge = document.querySelector('#delete-icon-large');
        gsap.set(taskContainer, {scaleY: 0});
        gsap.set(addTaskLink, {x: -1000});
        gsap.set(tasks, {x: 1000});
        gsap.set(deleteIconLarge, {scale: 0});

        const tasksContentSlide = document.querySelector('#tasks-content-slide');
        const calendarContentSlide = document.querySelector('#calendar-content-slide');

        gsap.set(tasksContentSlide, {
            transform: 'translate(-50%, 0)'
        })
        gsap.set(calendarContentSlide, {
            transform: 'translate(50%, 0)'
        })

    },
    
    async playEntry() {
        const logo = this.playLogoEntry();
        const burger = this.playBurgerEntry();
        const slides = this.playSlidesEntry();
        const tasks = this.playTasksEntry();
        
        const tl = gsap.timeline()
            .add(logo)
            .add(burger, '>-0.5')
            .add(slides)
            .add(tasks, '>-0.3')

        tl.eventCallback('onComplete', () => {
            setupPermanantListeners();
            this.setupPermanantAnimations();
            this.entryPlaying = false;
        });
    },

    playLogoEntry() {
        const logoName = document.querySelector('#logo-name');
        const logoIcon = document.querySelector('#logo-icon');

        return gsap.timeline()
            .to(logoName, {
                y: 0
            })
            .to(logoIcon, {
                scale: 1
            })
    },

    playBurgerEntry() {
        const burgerAnc = document.querySelector('#burger-link');
        return gsap.to(burgerAnc, {opacity: 1});
    },

    playSlidesEntry() {
        const taskSlide = document.querySelector('#tasks-slide');
        const calendarSlide = document.querySelector('#calendar-slide');

        return gsap.timeline()
            .to(taskSlide, {
                scale: 1.3,
                opacity: 1,
                zIndex: 2
            })
            .to(calendarSlide, {
                scale: 1,
            }, '>-0.3')
    },

    playTasksEntry() {
        const taskContainer = document.querySelector('#task-container');
        const addTaskLink = document.querySelector('#add-task-link');
        const tasks = document.querySelectorAll('.task-li');
        const deleteIconLarge = document.querySelector('#delete-icon-large');
        
        return gsap.timeline()
            .to(taskContainer, {scaleY: 1})
            .to(addTaskLink, {x: 0})
            .to(tasks, {x: 0, stagger: 0.1}, '>-0.3')
            .to(deleteIconLarge, {scale: 1})
    },

    setupPermanantAnimations() {

        console.log('Permanant animations attached')

        const burgerLink = document.querySelector('#burger-link');
        const burgerSvg = document.querySelector('#burger-link path');
        const curtainNav = document.querySelector('#nav-curtain');

        let isMenuDown = false;
        burgerLink.addEventListener('click', () => {
            gsap.to(curtainNav, {
                y: isMenuDown ? '-100%' : '0%',
                ease: 'power1.inOut'
            });
            gsap.to(burgerSvg, {
                fill: isMenuDown ? '#000000' : '#ffffff',
                ease: 'power1.inOut'
            });

            isMenuDown = isMenuDown ? false : true
        });

    },

    pop(el, maxScale, duration=0.1, attachListener = true) {

        function anim() {
            gsap.fromTo(el, {
                scale: 1
            }, {
                scale: maxScale,
                repeat: 1,
                yoyo: true,
                duration: duration
            })
        }

        if (attachListener) {
            el.addEventListener('click', () => {
                anim()
            })
        } else {
            anim()
        }

    },

    bubble(el, maxScale, duration=0.5) {

        const tw = gsap.fromTo(el, {
                scale: 1
            }, {
                scale: maxScale,
                repeat: -1,
                yoyo: true,
                duration: duration,
            });
        
        tw.eventCallback('onUpdate', () => {
            if (el.dataset.state === 'none') {
                tw.time(0);
                tw.kill();
            }
        })
    },

    centerSlide(slide, slides, positions) {
        if (!(slide.classList.contains('active'))) {

            this.navSlider.isSliding = true;
            const slideIdx = slides.findIndex(s => s === slide);
            const slideLeft = slides[slideIdx - 1];
            const slideRight = slides[slideIdx + 1];
            
            slides.forEach(s => {
                s.classList.remove('active');
            });
            slide.classList.add('active');

            slides.forEach(s => {
                gsap.killTweensOf(s);
            })

            const tl = gsap.timeline();

            tl.to(slides.filter(s => s !== slide), {
                zIndex: 0,
                opacity: 0.5,
            })
            
            tl.to(slide, {
                transform: 'translate(-50%, 0)',
                scale: 1.3,
                opacity: 1,
                zIndex: 2
            }, '<')

            if (slideLeft) {
                tl.to(slideLeft, {
                    transform: `translate(${positions[slideLeft.id].left}, 0)`,
                }, '<')
            }

            if (slideRight) {
                tl.to(slideRight, {
                    transform: `translate(${positions[slideRight.id].right}, 0)`
                }, '<')
            }

            tl.eventCallback('onComplete', () => this.navSlider.isSliding = false);
            tl.eventCallback('onUpdate', () => console.log(this.navSlider.isSliding))
        }

    },

    slide(slides, diff, positions) {
        const activeSlide = slides.filter(s => s.classList.contains('active'))[0];
        const slideIdx = slides.findIndex(s => s === activeSlide);
        const slideLeft = slides[slideIdx - 1];
        const slideRight = slides[slideIdx + 1];
        
        if (diff > 0) {
            if (slideLeft) {
                this.centerSlide(slideLeft, slides, positions);
            }
        } else {
            if (slideRight) {
                this.centerSlide(slideRight, slides, positions);
            }
        }
    },

    centerContent(content, contents, positions) {

    }
}

window.addEventListener('load', () => {
    gs.navSlider = new NavigationSlider('nav-slider-container');
});

