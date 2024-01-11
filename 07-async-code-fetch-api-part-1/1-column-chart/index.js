import FetchJson from "./utils/fetch-json.js";

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  value;
  data = {};
  chartHeight = 50;
  element;
  subElements = {header: '', body: ''};

  constructor(props = {}) {
    const {
      url = '',
      range = {},
      label = '',
      link = '',
      formatHeading = (value) => value
    } = props;

    this.url = new URL(`https://course-js.javascript.ru/${url}`);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.element = this.createElement();
    this.createSubElement();

    this.update(this.range.from, this.range.to);
  }

  createElement() {
    const element = document.createElement('div');

    element.innerHTML = this.createTemplate();

    return element.firstElementChild;
  }

  createSubElement() {
    const subElements = this.element.querySelectorAll('[data-element]');
    Array.from(subElements).forEach(element => {
      this.subElements[element.getAttribute('data-element')] = element;
    });
  }

  createTemplate() {
    return `
    <div class="column-chart_loading dashboard__chart_${this.label} ">
      <div class="column-chart " style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.createLinkTemplate()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
          ${this.createHeaderTemplate()}
          </div>
          <div data-element="body" class="column-chart__chart">
          ${this.createBodyTemplate()}
          </div>
        </div>
      </div>
     </div>`;
  }

  createBodyTemplate() {
    return `
          ${this.createChartTemplate()}
        `;
  }

  createHeaderTemplate() {
    return `${this.formatHeading(this.value)}`;
  }

  createLinkTemplate() {
    if (this.link !== '') {
      return `<a href="${this.link}" class="column-chart__link">View all</a>`;
    }
  }

  createChartTemplate() {
    const values = Object.values(this.data);
    return this.getColumnProps(values).map(({percent, value}) => (`<div style="--value: ${value}" data-tooltip="${percent}"></div>`
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

  async update(from, to) {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const queryParams = new URLSearchParams({
      from: from,
      to: to,
    });

    const urlWithParams = `${this.url}?${queryParams.toString()}`;

    try {
      this.data = await FetchJson(urlWithParams, params);

      this.value = this.countValue();
      this.subElements.header.innerHTML = this.createHeaderTemplate();
      this.subElements.body.innerHTML = this.createBodyTemplate();
      this.element.classList.remove('column-chart_loading');
      return this.data;
    } catch (error) {
      console.error(error);
    }
  }

  countValue() {
    let result = 0;
    for (let elem of Object.values(this.data)) {
      result += elem;
    }

    return result;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
