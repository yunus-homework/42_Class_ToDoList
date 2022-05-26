// все методы в controller
class TodoListController {
  _formSelector = null;
  _todosContainerSelector = null;
  _removeBtnSelector = null;
  _formFields = null;
  _currentItemId = 0;

  _form = null;
  _todoContainer = null;
  clearAllBtn = null;

  #view = null;
  #model = null;

  constructor(formConfiguration, ViewClass, ModelClass) {
    this.#setView(ViewClass);
    this.#setModel(ModelClass);

    this._formSelector = formConfiguration.form;
    this._todosContainerSelector = formConfiguration.todosContainer;
    this._removeBtnSelector = formConfiguration.removeBtn;

    // form config
    this.form = TodoListController.#getElementFromDOM(this.formSelector);
    this.#setFormSubmitEvent();
    this.#getFields();

    // todoContainer config
    this.todoContainer = TodoListController.#getElementFromDOM(
      this.todosContainerSelector
    );
    this.#setChangeStatusEvent();
    this.#setRemoveItemEvent();

    this.clearAllBtn = TodoListController.#getElementFromDOM(
      this.removeBtnSelector
    );
    this.#setClearFormEvent();

    // Connect model and controller
    this.#model.registerController(this);
    this.#model.registerDatabaseName(this._formSelector);

    // Fill data
    this.#setWindowOnloadEvent();
  }

  formSubmitHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!this.#validateInputs()) return;

    this.currentItemId += 1;

    let data = {
      completed: false,
      itemId: this.currentItemId,
      ...this.#findInputsData(),
    };

    this.#model.setData(data);
    this.#view.renderItem(data);
    this.#view.clearForm();
  };

  clearFormHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.#model.clearDatabase();
    this.#view.removeAllTodos();
  };

  changeStatusHandler = (event) => {
    event.stopPropagation();
    const { target } = event;

    const id = target.getAttribute('data-item-id');
    const status = target.checked;

    this.#model.patchData(id, 'completed', status);
  };

  removeItemHandler = (event) => {
    event.stopPropagation();
    const { target } = event;
    if (!target.hasAttribute('data-remove-btn')) return;

    const itemId = target.getAttribute('data-item-id');

    this.#model.deleteData(itemId);
    this.#view.removeTodoItem(itemId);
  };

  windowOnloadHandler = () => {
    if (!this.#model.hasItem()) return;

    const data = [...this.#model.getData()];

    for (const todoItem of data) {
      this.#view.renderItem(todoItem);
    }
  };

  #setFormSubmitEvent() {
    const options = {};

    this.form.addEventListener('submit', this.formSubmitHandler, options);
  }

  #setClearFormEvent() {
    const options = {};

    this.clearAllBtn.addEventListener('click', this.clearFormHandler, options);
  }

  #setChangeStatusEvent() {
    const options = {};

    this.todoContainer.addEventListener(
      'change',
      this.changeStatusHandler,
      options
    );
  }

  #setRemoveItemEvent() {
    const options = {};

    this.todoContainer.addEventListener(
      'click',
      this.removeItemHandler,
      options
    );
  }

  #setWindowOnloadEvent() {
    const options = {};

    window.addEventListener(
      'DOMContentLoaded',
      this.windowOnloadHandler,
      options
    );
  }

  #getFields() {
    this.formFields = this.form.querySelectorAll('input[type=text], textarea');
  }

  #findInputsData() {
    const inputsData = {};

    for (const node of this.formFields) {
      inputsData[node.name] = node.value;
    }

    return inputsData;
  }

  #validateInputs() {
    let formValidated = true;

    for (const node of this.formFields) {
      if (node.value.trim()) continue;

      formValidated = false;
      // this.#view.showError(node, 'input value is empty')
    }

    return formValidated;
  }

  #setView(ViewClass) {
    this.#view = new ViewClass(this);
  }

  #setModel(ModelClass) {
    this.#model = new ModelClass(this);
  }

  static #getElementFromDOM(elementSelector) {
    const element = document.querySelector(elementSelector);

    if (!(element instanceof HTMLElement)) {
      throw new Error('Value is not HTML element');
    }

    return element;
  }

  get formSelector() {
    return this._formSelector;
  }

  get todosContainerSelector() {
    return this._todosContainerSelector;
  }

  get removeBtnSelector() {
    return this._removeBtnSelector;
  }

  get currentItemId() {
    return this._currentItemId;
  }

  set currentItemId(id) {
    if (id === 0) throw new Error('ID cannot be 0');

    if (id === this._currentItemId) {
      throw new Error(
        'ID of current element the same as ID of previous element'
      );
    }

    this._currentItemId = id;
  }

  get formFields() {
    return this._formFields;
  }

  set formFields(fieldsList) {
    if (fieldsList && !fieldsList.length) {
      throw new Error('You cannot set empty inputs list');
    }

    this._formFields = fieldsList;
  }

  get todoItems() {}

  set form(formNode) {
    this.#view.setForm(formNode);
    this._form = formNode;
  }

  get form() {
    return this._form;
  }

  get todoContainer() {
    return this._todoContainer;
  }

  set todoContainer(todoContainerNode) {
    this.#view.setTodoContainer(todoContainerNode);
    this._todoContainer = todoContainerNode;
  }
}
