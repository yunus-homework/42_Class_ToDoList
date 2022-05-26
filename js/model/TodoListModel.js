// береться и сохраняется в TodoModelStorage
class TodoListModel extends TodoModelStorage {
  #controller = null;
  databaseKey = null;

  getData() {
    return this._data;
  }

  setData(todoItemData) {
    if (!this.hasItem()) {
      this.setItem([todoItemData]);
      return;
    }

    const currentData = [...this._data, todoItemData];
    this.setItem(currentData);
  }

  patchData(id, fieldName, fieldValue) {
    const data = [...this._data];
    const currentItem = data.find((todoItem) => {
      return todoItem.itemId === +id;
    });

    currentItem[fieldName] = fieldValue;
    this.setItem(data);
  }

  deleteData(id) {
    const data = [...this._data];
    const currentItemIndex = data.findIndex((todoItem) => {
      return todoItem.itemId === +id;
    });

    data.splice(currentItemIndex, 1);
    this.setItem(data);
  }

  clearDatabase() {
    this._clearAll();
  }

  registerController(controllerInstance) {
    if (this.#controller) throw new Error('Controller is already defined');
    this.#controller = controllerInstance;
  }

  registerDatabaseName(databaseKey) {
    if (this.databaseKey) throw new Error('Database Key is already defined');
    this.databaseKey = databaseKey;
  }
}
