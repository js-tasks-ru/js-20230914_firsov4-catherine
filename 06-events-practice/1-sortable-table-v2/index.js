import SortableTableClass from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableClass {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {})
  {
    super(headersConfig, data);
    this.sorted = sorted;
    this.addMarkedIcon(this.sorted.id);
    this.createEventListeners();
    this.addDataOrder();
  }

  addDataOrder() {
    const sortOrder = this.subElements.header.querySelectorAll('[data-id]');
    for (let i of sortOrder) {
      i.dataset.order = 'asc';
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

  createEventListeners() {

    const header = this.subElements.header;

    header.addEventListener("pointerdown", (event) => {
      this.onDocumentPointerDown(event);
    });
  }

  onDocumentPointerDown = (event) => {

    const element = event.target.closest('.sortable-table__cell[data-id]');
    if (!element) {
      return;
    }
    if (!this.subElements.header.contains(element)) {
      return;
    }

    this.deleteIconTemplate();
    this.addMarkedIcon(event.target.dataset.id);
    this.sortTableByColumns(event.target);
  }

  sortTableByColumns(column) {
    const orderElement = column.dataset.order;
    const idElement = column.dataset.id;

    if (orderElement) {
      if (orderElement === 'asc') {
        super.sort(idElement, 'desc');
      }
      if (orderElement === 'desc') {
        super.sort(idElement, 'asc');
      }
    }
    else {
      this.sort(idElement, 'desc');
    }

    if (orderElement === 'desc') {
      column.dataset.order = 'asc';
    } else {
      column.dataset.order = 'desc';
    }
  }

  destroy() {
    super.destroy();
    this.subElements.header.removeEventListener("pointerdown", (event) => {
      this.onDocumentPointerDown(event);
    });
  }
}
