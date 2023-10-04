export default class ColumnChart {
  element;
  chartHeight = 50;
  #data;

  constructor(props = {}) {

    const {
      data = [],
      label = '',
      link = '',
      value = 0,
      formatHeading = (value) => value
    } = props;

    this.#data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
    this.addLoadingClass();

  }

  addLoadingClass() {
    if (this.#data.length === 0) {
      this.element.classList.add('column-chart_loading');
    }
  }
  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    return element.firstElementChild;
  }

  createTemplate() {
    return ` <div class="dashboard__chart_${this.label} ">
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
          ${this.createChartTemplate()}
        </div>
      </div>
    </div>
  </div>`;
  }

  createLinkTemplate() {
    if (this.link !== '') {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }
    return '';
  }

  createChartTemplate() {
    return this.getColumnProps(this.#data).map(({percent, value}) => (`<div style="--value: ${value}" data-tooltip="${percent}"></div>`
    )).join('');
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  update(newData) {
    this.#data = newData;
    const oldElement = this.element;
    const newElement = this.createElement();
    oldElement.replaceWith(newElement);

    this.element = newElement;
  }

  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }
}
