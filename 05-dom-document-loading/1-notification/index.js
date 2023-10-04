export default class NotificationMessage {
  element;
  static lastNotification;
  constructor(message, props = {}) {
    const {
      duration = 0,
      type = 'success'
    } = props;
    this.message = message;

    this.duration = duration;
    this.type = type;

    this.show();
  }

  show(container = document.body) {
    this.element = this.createElement();
    this.checkLastNotification();

    container.append(this.element);
    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  checkLastNotification() {
    if (NotificationMessage.lastNotification) {
      NotificationMessage.lastNotification.destroy();
    }
    NotificationMessage.lastNotification = this;
  }

  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    return element.firstElementChild;
  }

  createTemplate() {
    return `<div class="notification success ${this.type}"style="--value:20s">
              <div class="timer"></div>
              <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
              </div>
            </div>`;
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }
}
