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
    this.addMarkedIcon();
    this.createAction();
  }

  addMarkedIcon () {
    const sortedCol = this.sorted.id;
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
    this.setTypeSort();
    this.deleteIconTemplate();
    this.addMarkedIcon();
    super.sort(event.target.dataset.id, this.type);
  }

  setTypeSort() {
    if (this.type === 'asc') {
      this.type = 'desc';
    } else {
      this.type = 'asc';
    }
  }

  addEventsElements(event) {
    let elementTitle = this.subElements.header.querySelectorAll('[data-sortable="true"]');
    for (let div of elementTitle) {
      div.dispatchEvent(event);
    }
  }
}
