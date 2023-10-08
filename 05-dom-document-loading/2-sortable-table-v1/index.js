export default class SortableTable {
  element;
  subElements = {header: '', body: ''};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement();
    this.createSubElement();
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();
    return element.firstElementChild;
  }

  createSubElement() {

    const subElements = this.element.querySelectorAll('[data-element="body"]');


    Array.from(subElements).forEach(element => {

      this.subElements[element.getAttribute('data-element')] = element});

    // this.subElements = {
    //   header:  this.element.querySelector('[data-element="header"]'),
    //   body:  this.element.querySelector('[data-element="body"]')
    // };

  }

  createTemplate() {
    return `<div data-element="productsContainer" class="products-list__container">
               <div class="sortable-table">
                    ${this.createHeaderTemplate()}
                    ${this.createBodyTemplate()}

              </div>
            </div>`;
  }

  createHeaderTemplate() {
    let templateHeader = `<div data-element="header" class="sortable-table__header sortable-table__row">`;
    for (let i of this.headerConfig) {
      templateHeader += `<div class="sortable-table__cell" data-id="${i.id}" data-sortable="${i.sortable}" >
                            <span>${i.title}</span>
                         </div>`;
    }
    templateHeader += `</div>`;
    return templateHeader;
  }

  createBodyTemplate() {
    let templateBody = `<div data-element="body" class="sortable-table__body">`;
    for (let i of this.data) {
      templateBody += `<a href="/products/${i.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="">
        </div>
        <div class="sortable-table__cell">${i.title}</div>
        <div class="sortable-table__cell">${i.quantity}</div>
        <div class="sortable-table__cell">${i.price}</div>
        <div class="sortable-table__cell">${i.sales}</div>
      </a>`;
    }

    templateBody += '</div>';
    return templateBody;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field, type) {
    let sortArr = [];

    if (field === 'title') {
      sortArr = this.sortStrings(field, type);
    } else {
      sortArr = this.sortNumber(field, type);
    }

    this.update(sortArr);
  }

  update(newData) {
    this.data = newData;
    const newElement = document.createElement('div');
    let div = document.querySelector('[data-element="body"]');

    newElement.innerHTML = this.createBodyTemplate();
    div.replaceWith(newElement.firstElementChild);

    this.element = newElement;
    this.createSubElement();
  }

  sortStrings(field, type) {
    let collator = new Intl.Collator(['ru', 'en'], {caseFirst: 'upper'});
    const direction = type === 'asc' ? 1 : -1;

    return this.makeSorting(field, direction, collator);
  }

  sortNumber(field, type) {
    // debugger;
    const direction = type === 'asc' ? 1 : -1;
    return [...this.data].sort((a, b) => direction * (a[field] - b[field]));
  }

  makeSorting(field, direction = 1, collator) {
    return [...this.data].sort((a, b) => direction * collator.compare(a[field], b[field]));
  }


}

