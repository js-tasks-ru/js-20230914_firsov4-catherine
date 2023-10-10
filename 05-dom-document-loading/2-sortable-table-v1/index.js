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
      templateHeader += `<div class="sortable-table__cell" data-id="${i.id}" data-sortable="${i.sortable}" >
                            <span>${i.title}</span>
                         </div>`;
    }
    return templateHeader;
  }

  createBodyTemplate() {
    let templateBody = ``;
    for (let i of this.data) {
      templateBody += `<a href="/products/${i.id}" class="sortable-table__row">`;
      templateBody += this.createBodyContentTemplate(i);
      templateBody += `</a>`;
    }
    return templateBody;
  }

  createBodyContentTemplate(elementData) {
    let templateBody = ``;
    for (let content of this.headerConfig) {
      if (content.id === 'images') {
        templateBody += `<div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${elementData[content.id[0].url]}">
        </div>`;
      } else {
        templateBody += `<div className="sortable-table__cell">${elementData[content.id]}</div>`;
      }
    }
    return templateBody;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field, type) {
    let sortArr;

    if (field === 'title') {
      sortArr = this.sortStrings(field, type);
    } else {
      sortArr = this.sortNumber(field, type);
    }

    this.update(sortArr);
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


}

