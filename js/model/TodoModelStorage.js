class TodoModelStorage {
  databaseKey = null;

  #get() {
    return JSON.parse(localStorage.getItem(this.databaseKey));
  }

  #setItem(data) {
    return localStorage.setItem(this.databaseKey, JSON.stringify(data));
  }

  #hasItem() {
    let data = localStorage.getItem(this.databaseKey);
    if (data === null) return false;

    return !!JSON.parse(data).length;
  }

  _clearAll() {
    localStorage.removeItem(this.databaseKey);
  }

  get _data() {
    return this.#get();
  }

  setItem(data) {
    this.#setItem(data);
  }

  hasItem() {
    return this.#hasItem();
  }
}
