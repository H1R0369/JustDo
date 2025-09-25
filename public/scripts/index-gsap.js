function init() {

    const burgerAnc = document.querySelector('.burger-anc');
    const burgerSvg = document.querySelector('.burger-anc path')
    const curtainNav = document.querySelector('.nav-curtain');

    let isDown = false;

    burgerAnc.addEventListener('click', () => {
        gsap.to(curtainNav, {
            y: isDown ? '-100%' : '0%',
            ease: 'power1.inOut'
        });
        gsap.to(burgerSvg, {
            fill: isDown ? '#000000' : '#ffffff',
            ease: 'power1.inOut'
        });

        isDown = isDown ? false : true
    })

}

init();