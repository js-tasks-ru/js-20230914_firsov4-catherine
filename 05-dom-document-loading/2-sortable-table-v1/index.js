export default class SortableTable {
  element;
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createTemplate();

    return element.firstElementChild;
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
      templateHeader += `<div class="sortable-table__cell" data-id="${i.id}" data-sortable="${i.sortable}" data-order="asc">
                            <span>${i.title}</span>
                         </div>`;
    }

    return templateHeader;
  }

  createBodyTemplate() {
    let templateBody = ``;
    for (let i of this.data) {
      templateBody += `<a href="/products/${i.id}" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="${i.images[0]}">
        </div>
        <div class="sortable-table__cell">${i.title}</div>

        <div class="sortable-table__cell">${i.quantity}</div>
        <div class="sortable-table__cell">${i.price}</div>
        <div class="sortable-table__cell">${i.sales}</div>
      </a>`;
    }

    return templateBody;
  }

}

