import SortableTableClass from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTable extends SortableTableClass {
  type = 'asc';
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {})
  {
    super(headersConfig, data);
    this.sorted = sorted;
    this.addMarkedIcon(this.sorted.id);
    this.createAction();
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
    let templateIcon = this.createIconTemplate();

    sortArrow.append(templateIcon);
  }

  createIconTemplate() {
    let templateIcon = document.createElement('div');
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

  createAction() {
    const pointerdown = new MouseEvent('pointerdown', {
      bubbles: true
    });

    document.addEventListener("pointerdown", (event) => {
      this.sortingColumn(event);
    });

    this.addEventsElements(pointerdown);
  }

  sortingColumn(event) {
    this.setTypeSort(event.target);
    this.deleteIconTemplate();
    this.addMarkedIcon(event.target.dataset.id);

    const idColumn = event.target.dataset.id;
    const orderColumn = event.target.dataset.order;
    super.sort(idColumn, orderColumn);

  }
  setTypeSort(column) {
    if (this.type === 'asc') {
      this.type = 'desc';
      column.dataset.order = 'desc';
    } else {
      this.type = 'asc';
      column.dataset.order = 'asc';
    }
  }

  addEventsElements(event) {
    let elementTitle = this.subElements.header.querySelectorAll('[data-sortable="true"]');
    for (let div of elementTitle) {
      div.dispatchEvent(event);
    }
  }
}
