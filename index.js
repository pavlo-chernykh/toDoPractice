class ToDoModel {
  #baseUrl = 'https://todo.hillel.it';
  token = '';

  constructor() {

    this.list = [];
  }

  async auth(email, password) {

    const requestBody = JSON.stringify({
      value: email + password
    })
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.#baseUrl}/auth/login`, {
      method: 'POST',
      headers,
      body: requestBody
    })
    const { access_token: accessToken } = await response.json();
    this.token = accessToken;
  }

  async addNote(toDoName, toDoText, priority = 1) {

    const requestBody = JSON.stringify({
      value: `${toDoName} + ${toDoText}`,
      priority
    })
    
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${this.token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.#baseUrl}/todo`, {
      method: 'POST',
      headers,
      body: requestBody
    })

    const note = await response.json();
    
    console.log('note', note);
    
    this.list.push(note);
  }

  async getAll() {

    const headers = new Headers();
    headers.set('Authorization', `Bearer ${this.token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.#baseUrl}/todo`, {
      method: 'GET',
      headers
    })

    const allNotes = await response.json();
    this.list.push(allNotes);
    console.log('all notes', allNotes);
    return allNotes;
  }

  async deleteNote(id) {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${this.token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.#baseUrl}/todo/${id}`, {
      method: 'DELETE',
      headers
    })
  }

for (const key in ToDoModel) {
  Object.defineProperty(ToDoModel, key, {
    configurable: false
  });
}

class TodoView {

  constructor(model) {
    this.model = model;
    this.form = document.querySelector('.create-form');
    this.list = document.querySelector('.todo-list');
    this.total = document.querySelector('.total');
    this.finished = document.querySelector('.finished');
    this.notFinished = document.querySelector('.not-finished');

    this.login();
    this.loginSignIn()
    this.initSubmit();
  }

  renderList( {value, id} ) {
    
    const val = value.split('+');
    const fragment = new DocumentFragment();
    // const val = JSON.parse(JSON.stringify(value)).value;
    // const _id = JSON.parse(JSON.stringify(value))._id;
    // console.log(_id);

    for (const toDoModelCard of this.model.list) {
      const listItem = document.createElement('li');
      listItem.classList.add('todo-card');
      listItem.setAttribute('id', id)

      const toDoName = document.createElement('div');
      toDoName.classList.add('todo-card__name');
      toDoName.textContent = val[0];

      const toDoText = document.createElement('div');
      toDoText.classList.add('todo-card__task');
      toDoText.textContent = val[1];

      const removeButton = document.createElement('button');
      removeButton.classList.add('todo-card__remove');
      removeButton.textContent = 'Done';
      removeButton.dataset.id = toDoModelCard.toDoName;

      listItem.append(toDoName, toDoText, removeButton);
      fragment.append(listItem);


    }
    this.list.append(fragment);
  }

  async renderAll() {
    const notesArr = await this.model.getAll();
    console.log(notesArr);
    notesArr.forEach(note => this.renderList(note));

    const loginArea = document.querySelector('.signup-form');
    loginArea.hidden = true;

    const todoArea = document.querySelector('.create-form');
    todoArea.hidden = false;
  }
  
  loginSignIn() {
    const localToken = localStorage.getItem('localToken');
    if (!localToken) {
      this.login();
    } else {
      this.model.token = localToken;
      this.renderAll();
    }
  }

  login() {
    const loginBtn = document.querySelector('.create-form__submit');
    loginBtn.addEventListener('click', async(e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      await this.model.auth(email, password);

      this.renderAll();
      localStorage.setItem('localToken', this.model.token);
    })
  }

  initSubmit() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const name = formData.get('todoName').trim();
      const text = formData.get('todoText').trim();

      if(name && text) {
        await this.model.addNote(name, text);
        // this.renderList()  NOT WORKING!
        console.log('name, test', name, text);
      }
    });
  }

  initRemove() {
    this.list.addEventListener('click', ({target: {dataset: {id}}}) => {
      if (id) {
        console.log('test', this.id);
        this.model.remove(id);
        this.renderList(note);
        this.finished.textContent = this.total.textContent - this.notFinished.textContent;
        if (!this.model.list.length) {
          this.total.textContent = 0;
          this.finished.textContent = 0 ;
          this.notFinished.textContent = 0;
        }
      }
    });
  }
}
const tdlm = new ToDoModel();
const tdlv = new TodoView(tdlm);

