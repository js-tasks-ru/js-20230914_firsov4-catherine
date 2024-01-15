import FetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {header: '', body: ''};
  data = [];
  countDataStart = 0;
  countDataEnd = 30;
  countDataFixed = 30;
  
  constructor(headersConfig, {
    url, isSortLocally,
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.url = new URL(`https://course-js.javascript.ru/${url}`);
    this.isSortLocally = isSortLocally;
    if (Object.keys(sorted).length === 0) {
      this.setSorted();
    } else {
      this.sorted = sorted;
    }


    this.element = this.createElement();
    this.createSubElement();
    this.addMarkedIcon(this.sorted.id);


    this.render()
      .then(r => {
      });
  }

  setSorted() {
    this.sorted = {
      id: this.headerConfig.find(item => item.sortable).id,
      order: 'asc'
    };
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
    return `<div data-element="productsContainer" class="products-list__container">
               <div class="sortable-table">
                  <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${this.createHeaderTemplate()}
                  </div>
                  <div data-element="body" class="sortable-table__body">
                    ${this.createBodyTemplate()}
                  </div>
              </div>
            </div>`;
  }

  createHeaderTemplate() {
    let templateHeader = ``;
    for (let i of this.headerConfig) {
      templateHeader += `<div class="sortable-table__cell" data-id="${i.id}" data-sortable="${i.sortable} " >
                            <span>${i.title}</span>
                         </div>`;
    }
    return templateHeader;
  }

  createBodyTemplate() {
    let templateBody = ``;
    for (let i of this.data) {
      templateBody += `<a href="/products/${i.id}" class="sortable-table__row">
                            ${this.createBodyContentTemplate(i)}
                       </a>`;
    }
    return templateBody;
  }

  //src="${elementData[content.id[0].url]}
  createBodyContentTemplate(elementData) {
    let templateBody = ``;
    for (let content of this.headerConfig) {
      if (content.id === 'images') {
        templateBody += `<div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src=""">
        </div>`;
      } else {
        templateBody += `<div class="sortable-table__cell">${elementData[content.id]}</div>`;
      }
    }
    return templateBody;
  }

  addDataOrder() {
    const sortOrder = this.subElements.header.querySelectorAll('[data-id]');
    for (let i of sortOrder) {
      i.dataset.order = 'desc';
    }
  }

  addMarkedIcon (sortedCol) {
    const sortArrow = this.subElements.header.querySelector(`[data-id = ${sortedCol}]`);
    const templateIcon = this.createIconElement();

    sortArrow.append(templateIcon);
  }

  createIconElement() {
    const templateIcon = document.createElement('div');
    templateIcon.innerHTML = `<span data-element="arrow" class="sortable-table__sort-arrow">
                                <span class="sort-arrow"></span>
                              </span>`;
    return templateIcon.firstElementChild;
  }

  deleteIconTemplate() {
    const sortArrow = this.subElements.header.querySelector(`[data-element = "arrow"]`);
    const parent = sortArrow.parentNode;
    parent.removeChild(sortArrow);
  }

  createEventListener() {
    for (let elem of this.subElements.header.children) {
      elem.addEventListener('pointerdown', event => { this.handleClick(event); });
    }

    window.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        this.loadMoreData();
      }
    });
  }

  handleClick(event) {
    const dataId = event.currentTarget.getAttribute('data-id');
    const dataOrder = event.currentTarget.getAttribute('data-order');
    const dataSortable = event.currentTarget.getAttribute('data-sortable');

    if (dataSortable) {
      this.deleteIconTemplate();
      this.addMarkedIcon(dataId);

      if (this.isSortLocally) {
        this.sortOnClient(dataId, dataOrder);
      } else {
        this.sortOnServer(dataId, dataOrder);
      }
      if (this.sorted.order === 'desc') {
        event.target.dataset.order = 'asc';
      } else {
        event.target.dataset.order = 'desc';
      }
    }
  }

  async render(id, order) {

    const {params, urlWithParams} = this.loadData(id, order);

    try {
      this.data = await FetchJson(urlWithParams, params);

      this.subElements.body.innerHTML = this.createBodyTemplate();
      this.createEventListener();
      this.addDataOrder();
      return this.data;
    } catch (error) {
    }

  }

  loadData (id, order) {
    const params = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let urlWithParams;
    if (id && order) {
      urlWithParams = `${this.url}?_embed=subcategory.category&_sort=${id}&_order=${order}&_start=${this.countDataStart}&_end=${this.countDataEnd}`;
    } else {
      urlWithParams = `${this.url}?_embed=subcategory.category&_sort=${this.sorted.id}&_order=${this.sorted.order}&_start=${this.countDataStart}&_end=${this.countDataEnd}`;
    }

    return {params, urlWithParams};
  }

  async loadMoreData() {
    this.countDataStart += this.countDataFixed;
    this.countDataEnd += this.countDataFixed;

    const {params, urlWithParams} = this.loadData();

    try {
      this.data = await FetchJson(urlWithParams, params);

      this.subElements.body.insertAdjacentHTML('beforeend', this.createBodyTemplate());
      this.createEventListener();
      this.addDataOrder();
      return this.data;
    } catch (error) {
    }
  }

  update(newData) {
    this.data = newData;
    this.subElements.body.innerHTML = this.createBodyTemplate();
  }

  sortStrings(field, type) {
    let collator = new Intl.Collator(['ru', 'en'], {caseFirst: 'upper'});
    const direction = type === 'asc' ? 1 : -1;

    return this.makeSorting(field, direction, collator);
  }

  sortNumber(field, type) {
    const direction = type === 'asc' ? 1 : -1;
    return [...this.data].sort((a, b) => direction * (a[field] - b[field]));
  }

  makeSorting(field, direction = 1, collator) {
    return [...this.data].sort((a, b) => direction * collator.compare(a[field], b[field]));
  }

  sortOnClient (id, order) {
    let sortArr;

    if (id === 'title') {
      sortArr = this.sortStrings(id, order);
    } else {
      sortArr = this.sortNumber(id, order);
    }
    this.update(sortArr);
  }

  sortOnServer (id, order) {
    this.countDataEnd = this.countDataFixed;
    this.countDataStart = 0;
    this.render(id, order).then(r=>{});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
