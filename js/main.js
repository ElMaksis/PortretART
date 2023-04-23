window.addEventListener('DOMContentLoaded', () => {
    "use strict"

    //===================== MODAL =========================

    let btnPressed = false;

    function bindModal(triggerSelector, modalSelector, closeSelector, destroy = false) {
        const trigger = document.querySelectorAll(triggerSelector),
            modal = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            windows = document.querySelectorAll('[data-modal]'),
            scroll = calcScroll();


        trigger.forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target) {
                    e.preventDefault();
                }

                btnPressed = true;

                if (destroy) {
                    item.remove();
                }

                windows.forEach(item => {
                    item.style.display = 'none';
                    item.classList.add('animated', 'fadeIn');
                });

                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                document.body.style.marginRight = `${scroll}px`;

            });
        });

        close.addEventListener('click', () => {
            windows.forEach(item => {
                item.style.display = 'none';
            });

            modal.style.display = 'none';
            document.body.style.overflow = '';
            document.body.style.marginRight = `0px`;
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                windows.forEach(item => {
                    item.style.display = 'none';
                });

                modal.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.marginRight = `0px`;
            }
        });
    }

    function showModalByTime(selector, time) {
        setTimeout(function () {
            let display;

            document.querySelectorAll('[data-modal]').forEach(item => {
                if (getComputedStyle(item).display !== 'none') {
                    display = 'block';
                }
            });
            if (!display) {
                document.querySelector(selector).style.display = 'block';
                document.body.style.overflow = 'hidden';
                scroll = calcScroll();
                document.body.style.marginRight = `${scroll}px`;
            }

        }, time);
    }
    function showModalByScroll(selector) {
        window.addEventListener('scroll', () => {
            if (!btnPressed && (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight)) {
                document.querySelector(selector).click();
            }
        });
    }

    function calcScroll() {
        const div = document.createElement('div');
        div.style.cssText = "height: 50px; width: 50px; overflow-y: scroll; visibility: hidden";
        document.body.append(div);

        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        return scrollWidth;
    }

    bindModal('.button-design', '.popup-design', '.popup-design .popup-close');
    bindModal('.button-consultation', '.popup-consultation', '.popup-consultation .popup-close');
    bindModal('.fixed-gift', '.popup-gift', '.popup-gift .popup-close', true);
    // showModalByTime('.popup-consultation', 5000);
    showModalByScroll('.fixed-gift');

    //===================  SLIDER ============================

    const sliders = (slides, dir, prev, next) => {
        let indexSlide = 1,
            paused = false;
        const items = document.querySelectorAll(slides);


        function showSlides(n) {
            if (n > items.length) {
                indexSlide = 1;
            }
            if (n < 1) {
                indexSlide = items.length;
            }

            items.forEach(item => {
                item.classList.add('animated');
                item.style.display = 'none';
            });

            items[indexSlide - 1].style.display = 'block';
        }

        showSlides(indexSlide);

        function chengeSlide(n) {
            showSlides(indexSlide += n);
        }

        try {
            const prevBtn = document.querySelector(prev),
                nextBtn = document.querySelector(next);

            prevBtn.addEventListener('click', () => {
                chengeSlide(-1);
                items[indexSlide - 1].classList.remove('slideInRight');
                items[indexSlide - 1].classList.add('slideInLeft');
            });
            nextBtn.addEventListener('click', () => {
                chengeSlide(1);
                items[indexSlide - 1].classList.remove('slideInLeft');
                items[indexSlide - 1].classList.add('slideInRight');
            });

        } catch (e) { }

        function activateAnimation() {
            if (dir === 'vertical') {
                paused = setInterval(function () {
                    chengeSlide(1);
                    items[indexSlide - 1].classList.add('slideInDown');
                }, 3000);
            } else {
                paused = setInterval(function () {
                    chengeSlide(1);
                    items[indexSlide - 1].classList.remove('slideInLeft');
                    items[indexSlide - 1].classList.add('slideInRight');
                }, 3000);
            }
        }

        activateAnimation();

        items[0].parentNode.addEventListener('mouseenter', () => {
            clearInterval(paused);
        });
        items[0].parentNode.addEventListener('mouseleave', () => {
            activateAnimation();
        });
    }

    sliders('.feedback-slider-item', 'horizontal', '.main-prev-btn', '.main-next-btn');
    sliders('.main-slider-item', 'vertical');

    //==========================  FORM  ============================

    function postForms() {
        const form = document.querySelectorAll('form'),
            inputs = document.querySelectorAll('input'),
            upload = document.querySelectorAll('[name="upload"]');

        const message = {
            loading: 'Загрзка...',
            sucsses: 'Спасибо! Скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...',
            spinner: 'assets/img/spinner.gif',
            ok: 'assets/img/ok.png',
            fail: 'assets/img/fail.png'
        };
        const path = {
            designer: 'assets/server.php',
            question: 'assets/question.php'
        }

        const clearInputs = () => {
            inputs.forEach(item => {
                item.value = '';
            });

            upload.forEach(item => {
                item.previousElementSibling.textContent = "Файл не выбран";
            });
        };

        upload.forEach(item => {
            item.addEventListener('input', () => {
                console.log(item.files[0]);
                let dots;
                const arr = item.files[0].name.split('.');

                arr[0].length > 6 ? dots = "..." : dots = ".";
                const name = arr[0].substring(0, 6) + dots + arr[1];
                item.previousElementSibling.textContent = name;
            });
        });

        form.forEach(item => {
            item.addEventListener('submit', (e) => {
                e.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.classList.add('status');
                item.parentNode.appendChild(statusMessage);

                item.classList.add('animated', 'fadeOutUp');
                setTimeout(() => {
                    item.style.display = 'none'
                }, 400);

                let statusImg = document.createElement('img');
                statusImg.src = message.spinner;
                statusImg.classList.add('animated', 'fadeInUp');
                statusMessage.appendChild(statusImg);

                let textMessage = document.createElement('div');
                textMessage.textContent = message.loading;
                statusMessage.appendChild(textMessage);

                const formData = new FormData(item);
                let api;
                item.closest('.popup-design') || item.classList.contains('calc_form') ? api = path.designer : api = path.question;
                console.log(api);

                postData(api, formData)
                    .then(res => {
                        console.log(res);
                        statusImg.src = message.ok;
                        textMessage.textContent = message.sucsses;
                    })
                    .catch(() => {
                        statusImg.src = message.fail;
                        textMessage.textContent = message.failure;
                    })
                    .finally(() => {
                        clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                            item.style.display = 'block';
                            item.classList.remove('fadeOutUp');
                            item.classList.add('fadeInUp');
                        }, 5000);
                    });
            });
        });

    }
    postForms();

    //================= ADITIONAL STYLES  ======================

    const showMoreStyles = (trigger, wrapper) => {
        const btn = document.querySelector(trigger);

        btn.addEventListener('click', function () {
            getResource('assets/db.json')
                .then(res => createCards(res.styles))
                .catch(error => console.log(error))
                .finally(this.remove());
        });

        function createCards(response) {
            response.forEach(({ src, title, link }) => {
                let card = document.createElement('div');
                card.classList.add('animated', 'fadeInUp', 'col-sm-3', 'col-sm-offset-0', 'col-xs-10', 'col-xs-offset-1')
                card.insertAdjacentHTML('beforeend',
                    `<div class=styles-block>
						<img src=${src} alt="styles">
						<h4>${title}</h4>
						<a href="${link}">Подробнее</a>
					</div>`);
                document.querySelector(wrapper).append(card);
            });
        }



    };

    showMoreStyles('.button-styles', '#styles .row');

    //===================== REQUESTS ==========================

    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    };

    const getResource = async (url) => {
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };





});