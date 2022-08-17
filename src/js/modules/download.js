export default class Download {
  constructor(triggers) {
    this.btns = document.querySelectorAll(triggers);
    this.path = 'assets/img/mainbg.jpg'; // Пока путь общий для всех кнопок, но в будущем пути будут разные(можно провернуть через конструкцию switch case)
  }

  downloadItem(path){
    const link = document.createElement('a'); // Создание ссылки вручную, затем будет произведен клик на неё и начнется скачивание
    link.setAttribute('href', path); // Добавляем атрибут href и путь для скачивания
    link.setAttribute('download', 'nice_picture'); // Добавляем атрибут download и название nice_picture

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  }

  init() {
    this.btns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.downloadItem(this.path);
      });
    });
  }
} 