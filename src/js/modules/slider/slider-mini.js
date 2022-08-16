import Slider from './slider';

export default class MiniSlider extends Slider {
  constructor(container, next, prev, activeClass, animate, autoplay, paused) {
    super(container, next, prev, activeClass, animate, autoplay, paused);
  }

  decorizeSlides() {
    this.slides.forEach(slide => {
      slide.classList.remove(this.activeClass);
      if (this.animate) {
        slide.querySelector('.card__title').style.opacity = '0.4';
        slide.querySelector('.card__controls-arrow').style.opacity = '0';
      }
    });

    if (!this.slides[0].closest('button')) {
      this.slides[0].classList.add(this.activeClass);
    } // Метод возвращает ближайший родительский элемент или самого же себя (дословно: если активный слайд(первый) не является кнопкой, то добавляем ему класс, если является кнопкой, то не добавляем)

    if (this.animate) {
      this.slides[0].querySelector('.card__title').style.opacity = '1';
      this.slides[0].querySelector('.card__controls-arrow').style.opacity = '1';
    }
  } // Удаляем активный класс со всех элементов и устанавливаем первому

  nextSlide() {
    if (this.slides[1].tagName == 'BUTTON' && this.slides[2].tagName == 'BUTTON') {
      this.container.appendChild(this.slides[0]); // Slide
      this.container.appendChild(this.slides[1]); // Btn
      this.container.appendChild(this.slides[2]); // Btn
      this.decorizeSlides();
    } else if (this.slides[1].tagName == 'BUTTON') {
      this.container.appendChild(this.slides[0]); // Slide
      this.container.appendChild(this.slides[1]); // Btn
      this.decorizeSlides();
    } else {
      this.container.appendChild(this.slides[0]); // Slide
      this.decorizeSlides();
    } // Исправление бага, где кнопки расположены внутри контейнера, перемещаем слайд и эти кнопки в конец
  }

  bindTriggers() {
    this.next.addEventListener('click', () => this.nextSlide()); // Переносим первый слайд в конец при нажатии на кнопку вперед

    this.prev.addEventListener('click', () => {

      for (let i = this.slides.length - 1; i > 0; i--) {
        if (this.slides[i].tagName !== 'BUTTON') {
          let active = this.slides[i];
          this.container.insertBefore(active, this.slides[0]); // Поместить active перед первым элементом
          this.decorizeSlides();
          break;
        }
      }
    }); // Пеереносим последний слайд в начало при нажатии на кнопку назад
  }

  bindInterval() {
    this.paused = setInterval(() => this.nextSlide(), 5000);
  }

  init() {
    try {
      this.container.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    align-items: flex-start;
    `;

      this.bindTriggers();
      this.decorizeSlides();

      if (this.autoplay) {

        // Код для того, чтобы при навождении курсора на кнопки или слайды автоматическое переключение слайдов отключалось

        this.bindInterval();

        this.slides[0].parentNode.addEventListener('mouseenter', () => {
          clearInterval(this.paused);
        });
        this.next.parentNode.addEventListener('mouseenter', () => {
          clearInterval(this.paused);
        });
        this.prev.parentNode.addEventListener('mouseenter', () => {
          clearInterval(this.paused);
        });

        this.slides[0].parentNode.addEventListener('mouseleave', () => {
          this.bindInterval();
        });
        this.next.addEventListener('mouseleave', () => {
          this.bindInterval();
        });
        this.prev.addEventListener('mouseleave', () => {
          this.bindInterval();
        });
      }
    } catch (e) { }
  }
}