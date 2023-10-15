class Tooltip {
  static #instance = null;
  element;

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    } else {
      return this.createInstance();
    }
  }

  createInstance() {
    Tooltip.#instance = this;
    this.render();
  }

  render() {
    this.element = this.createElement();
    document.body.prepend(this.element);
  }

  createElement() {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    return element;
  }

  initialize () {
    this.createEventListener();
  }

  createEventListener() {
    document.addEventListener('pointerover', (event) => this.onDocumentPointerover(event));
    document.addEventListener('pointermove', (event) => this.onDocumentPointermove(event));
    document.addEventListener('pointerout', (event) => this.onDocumentPointerout(event));
  }

  onDocumentPointerover = (event) => {
    const tooltip = event.target.dataset.tooltip;
    if (!tooltip) {return;}
    this.render();
    this.createElementTooltip(tooltip);
    this.setCoordinatesElement(event);
  }

  onDocumentPointerout = (event) => {
    const tooltip = event.target.dataset.tooltip;
    if (!tooltip) {return;}
    const element = this.element.querySelector('div');
    element.removeChild('span');
  }

  onDocumentPointermove = (event) => {
    const tooltip = event.target.dataset.tooltip;
    if (!tooltip) {return;}

    this.setCoordinatesElement(event);
  }

  setCoordinatesElement(event) {
    this.element.style.top = event.clientY + 'px';
    this.element.style.left = event.clientX + 'px';
  }

  createElementTooltip(tooltip) {
    const tooltipElement = this.createTemplateTooltip(tooltip);
    this.element.prepend(tooltipElement);
  }

  createTemplateTooltip(contentTooltip) {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.innerHTML = `<span class="tooltip"> ${contentTooltip} </span>`;

    return element.firstElementChild;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', (event) => this.onDocumentPointerover(event));
    document.removeEventListener('pointerout', (event) => this.onDocumentPointerout(event));
    document.removeEventListener('pointermove', (event) => this.onDocumentPointermove(event));
  }
}

export default Tooltip;
