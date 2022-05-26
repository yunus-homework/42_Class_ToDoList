'use strict';

const app = (() => {
  const formConfiguration = {
    form: '#todoForm',
    todosContainer: '#todoItems',
    removeBtn: '.remove-all',
  };

  const controller = new TodoListController(
    formConfiguration,
    TodoListView,
    TodoListModel
  );

  return controller;
})();
