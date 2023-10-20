export default class DoubleSlider {
  element;
  subElement = {progress: '', thumbLeft: '', thumbRight: '', from: '', to: ''};
  constructor(props = {}) {
    const {
      min = 100,
      max = 200,
      formatValue = value => '$' + value,
      selected = {
        from: min,
        to: max,

      }
    } = props;

    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.element = this.createElement();
    this.createSubElement();

    this.createEventListeners();
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();

    return element.firstElementChild;
  }

  createSubElement() {
    const subElement = this.element.querySelectorAll('[data-element]');

    Array.from(subElement).forEach(element => {
      this.subElement[element.getAttribute('data-element')] = element;
    });

    this.subElement.progress = this.element.querySelector('.range-slider__progress');
    this.subElement.thumbLeft = this.element.querySelector('.range-slider__thumb-left');
    this.subElement.thumbRight = this.element.querySelector('.range-slider__thumb-right');
  }

  createTemplate() {
    const {from, to} = this.selected;
    return `<div class="range-slider">
              <span data-element="from">${this.formatValue(from)}</span>
              <div class="range-slider__inner">
                <span class="range-slider__progress" style="left: 0; right: 0"></span>
                <span class="range-slider__thumb-left" style="left: 0"></span>
                <span class="range-slider__thumb-right" style="right: 0"></span>
              </div>
              <span data-element="to">${this.formatValue(to)}</span>
             </div>`;
  }

  createEventListeners() {
    this.subElement.thumbRight.addEventListener('pointerdown', this.onThumbElementPointerDown);
    this.subElement.thumbLeft.addEventListener('pointerdown', this.onThumbElementPointerDown);
  }

  onThumbElementPointerDown = event => {
    const thumbElement = event.target;
    event.preventDefault();
    const {left, right} = thumbElement.getBoundingClientRect();

    if (thumbElement === this.subElement.thumbLeft) {
      this.shiftX = right - event.clientX;
    } else {
      this.shiftX = left - event.clientX;
    }
    this.dragging = thumbElement;
    this.element.classList.add('.range-slider_dragging');

    document.addEventListener('pointermove', this.onDocumentPointerMove);
    document.addEventListener('pointerup', this.onDocumentPointerUp);
  }

  onDocumentPointerMove = (event) => {
    event.preventDefault();

    let {left: innerLeft, right: innerRight, width} = this.subElement.progress.getBoundingClientRect();

    if (this.dragging === this.subElement.thumbLeft) {
      let newLeft = (event.clientX - innerLeft + this.shiftX) / width;
      if (newLeft < 0) {
        newLeft = 0;
      }
      newLeft *= 100;
      let right = parseFloat(this.subElement.thumbRight.style.right);
      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.dragging.style.left = this.subElement.progress.style.left = newLeft + '%';
      this.subElement.from.innerHTML = this.formatValue(this.getValueLeft(newLeft));
      this.selected.from = Number(this.getValueLeft(newLeft));
    }

    if (this.dragging === this.subElement.thumbRight) {
      let newRight = (innerRight - event.clientX - this.shiftX) / width;
      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;
      let left = parseFloat(this.subElement.thumbLeft.style.left);
      if (newRight + left > 100) {
        newRight = 100 - left;
      }
      this.dragging.style.right = this.subElement.progress.style.right = newRight + '%';
      this.subElement.to.innerHTML = this.formatValue(this.getValueRight(newRight));
      this.selected.to = Number(this.getValueRight(newRight));
    }
  }

  getValueLeft(value) {
    let result = value * (this.max - this.min) / 100;
    return (this.min + result).toFixed(0);
  }
  getValueRight(value) {
    let result = value * (this.max - this.min) / 100;
    return (this.max - result).toFixed(0);
  }

  onDocumentPointerUp = () => {

    this.element.dispatchEvent(
      new CustomEvent('range-select', {detail: this.selected, bubbles: true})
    );

    this.element.classList.remove('.range-slider_dragging');
    this.dragging = null;
    document.removeEventListener('pointermove', this.onDocumentPointerMove);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    const thumbs = this.element.querySelectorAll('.range-slider__inner span:not(:first-child)');

    this.subElement.thumbRight.removeEventListener('pointerdown', this.onThumbElementPointerDown);
    this.subElement.thumbLeft.removeEventListener('pointerdown', this.onThumbElementPointerDown);
    this.remove();
    document.removeEventListener('pointerup', this.onDocumentPointerUp);
  }
}
