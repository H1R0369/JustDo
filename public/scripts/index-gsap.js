export const gs = {

    attachPermanantAnimations() {

        console.log('GSAP Initialized')

        const burgerAnc = document.querySelector('.burger-anc');
        const burgerSvg = document.querySelector('.burger-anc path')
        const curtainNav = document.querySelector('.nav-curtain');
        const popEls = document.querySelectorAll('.gsap-pop');

        // Handle Curtain Menu

        let isMenuDown = false;
        burgerAnc.addEventListener('click', () => {
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

    bubble(el, maxScale, duration=1) {

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

    setupSlides(slides, positions) {
        const tasks = slides[0];
        const calendar = slides[1];

        gsap.set(tasks, {
            transform: 'translate(-50%, 0)',
        });
        gsap.set(calendar, {
            transform: 'translate(50%, 0)'
        });
        this.centerSlide(tasks, slides, positions);
    },

    centerSlide(slide, slides, positions) {
        if (!(slide.classList.contains('active'))) {
            const slideIdx = slides.findIndex(s => s === slide);
            const slideLeft = slides[slideIdx - 1];
            const slideRight = slides[slideIdx + 1];
            // console.log('slide-left', slideLeft);
            // console.log('slide-right\n', slideRight);

            slides.forEach(s => {
                s.classList.remove('active');
            });
            slide.classList.add('active');

            slides.forEach(s => {
                gsap.killTweensOf(s);
            })

            gsap.to(slides.filter(s => s !== slide), {
                zIndex: 0,
                opacity: 0.5
            })
            
            gsap.to(slide, {
                transform: 'translate(-50%, 0)',
                scale: 1.3,
                opacity: 1,
                zIndex: 2
            })

            if (slideLeft) {
                gsap.to(slideLeft, {
                    transform: `translate(${positions[slideLeft.id].left}, 0)`
                })
            }

            if (slideRight) {
                gsap.to(slideRight, {
                    transform: `translate(${positions[slideRight.id].right}, 0)`
                })
            }
        }

    },

    slide(slides, diff, positions) {
        const activeSlide = slides.filter(s => s.classList.contains('active'))[0];
        const slideIdx = slides.findIndex(s => s === activeSlide);
        const slideLeft = slides[slideIdx - 1];
        const slideRight = slides[slideIdx + 1];
        console.log('slide-left', slideLeft);
        console.log('slide-right\n', slideRight);

        
        if (diff > 0) {
            if (slideLeft) {
                this.centerSlide(slideLeft, slides, positions);
            }
        } else {
            if (slideRight) {
                this.centerSlide(slideRight, slides, positions);
            }
        }
    }
}



