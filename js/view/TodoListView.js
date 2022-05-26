class TodoListView {
  #controller = null;
  #form = null;
  #todoContainer = null;

  constructor(controller) {
    this.#controller = controller;
  }

  clearForm() {
    this.#form.reset();
  }

  renderItem(dataForRender) {
    this.#todoContainer.prepend(TodoListView.#createTemplate(dataForRender));
  }

  removeAllTodos() {
    this.#todoContainer.innerHTML = '';
  }

  removeTodoItem(id) {
    const todoItem = this.#todoContainer.querySelector(
      `[data-todo-item-${id}]`
    );
    todoItem.remove();
  }

  setForm(formNode) {
    if (this.#form) throw new Error('Form already defined');
    this.#form = formNode;
  }

  setTodoContainer(todoContainerNode) {
    if (this.#todoContainer) throw new Error('Todo Container already defined');
    this.#todoContainer = todoContainerNode;
  }

  static #createTemplate({ title, description, itemId, completed }) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('col-4');
    wrapper.setAttribute(`data-todo-item-${itemId}`, '');

    let wrapInnerContent = `<div class="taskWrapper">`;
    wrapInnerContent += `<div class="taskHeading">${title}</div>`;
    wrapInnerContent += `<div class="taskDescription">${description}</div>`;
    // Добавляем элемент checkbox в функцию генерации темплейта
    wrapInnerContent += `<hr>`;
    wrapInnerContent += `<label class="completed form-check">`;
    // Создаем внутри инпута кастовмный аттрибут в которы ложим id текущего todoItem
    wrapInnerContent += `<input data-item-id="${itemId}" type="checkbox" class="form-check-input" >`;
    wrapInnerContent += `<span>Завершено ?</span>`;
    wrapInnerContent += `</label>`;
    // Заканчиваем добавлять checkbox
    // Добавляем кнопку удаления и id текущего todoItem в качестве аттрибута
    wrapInnerContent += `<hr>`;
    wrapInnerContent += `<button class="btn btn-danger delete-btn" data-remove-btn data-item-id="${itemId}">Удалить</button>`;
    // Заканчиваем с кнопкой удаления
    wrapInnerContent += '</div>';

    wrapper.innerHTML = wrapInnerContent;

    // Если задача была завершена отображаем это на элементе
    wrapper.querySelector('input[type=checkbox]').checked = completed;

    return wrapper;
  }
}

new TodoListView(null);
