export default class VideoPlayer {
  constructor(triggers, overlay) {
    this.btns = document.querySelectorAll(triggers);
    this.overlay = document.querySelector(overlay);
    this.close = this.overlay.querySelector('.close');
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this); // Жестко привязываем контекст вызова к этому методу и этому классу
  }

  bindTriggers() {
    this.btns.forEach((btn, i) => {
      try {
        const blockedElem = btn.closest('.module__video-item').nextElementSibling;

        if (i % 2 == 0) {
          blockedElem.setAttribute('data-disabled', 'true');
        } // Закрытие нажатия на плей кнопку
      } catch (e) { }

      btn.addEventListener('click', () => {
        if (!btn.closest('.module__video-item') || btn.closest('.module__video-item').getAttribute('data-disabled') !== 'true') {
          this.activeBtn = btn; // Узнаём кнопку, на которую произошло нажатие

          if (document.querySelector('iframe#frame')) {
            this.overlay.style.display = 'flex';
            if (this.path !== btn.getAttribute('data-url')) {
              this.path = btn.getAttribute('data-url');
              this.player.loadVideoById({ videoId: this.path });
            } // Условие для того, чтобы открывались разные плееры с видео, а не одно и тоже видео на всех
          } else {
            this.path = btn.getAttribute('data-url');

            this.createPlayer(this.path);
          }
        }
      }); // Если блок не заблокирован, мы выполняем определенные действия
    });
  }

  bindCloseBtn() {
    this.close.addEventListener('click', () => {
      this.overlay.style.display = 'none';
      this.player.stopVideo();
    });
  }

  createPlayer(url) {
    this.player = new YT.Player('frame', {
      height: '100%',
      width: '100%',
      videoId: `${url}`,
      events: {
        'onStateChange': this.onPlayerStateChange
      }
    }); // Из документашки API YouTube

    this.overlay.style.display = 'flex';
  }

  onPlayerStateChange(state) {
    try {
      const blockedElem = this.activeBtn.closest('.module__video-item').nextElementSibling; // Метод находит первую ноду по селектору, который передается (выше по иерархии) и если подходит тот элемент, на котором это сработало, то вернется сам элемент, а затем получаем его следущего соседа
      const playBtn = this.activeBtn.querySelector('svg').cloneNode(true); // Включаем глубокое копирование, чтобы скорпировать svg элемент на кнопке play (включая все теги внутри svg)

      if (state.data === 0) {
        if (blockedElem.querySelector('.play__circle').classList.contains('closed')) {
          blockedElem.querySelector('.play__circle').classList.remove('closed');
          blockedElem.querySelector('svg').remove();
          blockedElem.querySelector('.play__circle').appendChild(playBtn);
          blockedElem.querySelector('.play__text').textContent = 'play video';
          blockedElem.querySelector('.play__text').classList.remove('attention');
          blockedElem.style.opacity = 1;
          blockedElem.style.filter = 'none';

          blockedElem.setAttribute('data-disabled', 'false');
        }
      } // (state.date === 0) - из документашки API YouTube. После просмотра открытого видео делаем возможным просмотр другого видео на странице
    } catch (e) { }
  }

  init() {
    if (this.btns.length > 0) {
      const tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      this.bindTriggers();
      this.bindCloseBtn();
    }
  }
}