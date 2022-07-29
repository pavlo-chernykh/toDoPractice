// class StarWars {
//   async getCharacters() {
//     const response = await fetch('https://swapi.dev/api/people/');
//     const people = await response.json();

//     console.log(people);
  
//   }
// }
// const sw = new StarWars();

// sw.getCharacters();

class ToDoList {
  #baseUrl = 'https://todo.hillel.it';

  #token = '';

  constructor() {
    this.login(); 
  }
  // in HW need interface.
  login() {
    const email = prompt('enter email');

     this.auth(email);
  }

  async auth(email) {

    const requestBody = JSON.stringify({
      value: email
    })
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.#baseUrl}/auth/login`, {
      method: 'POST',
      headers,
      // headers: {
      //   'Content-Type': 'application/json'
      // },
      body: requestBody
    })
    const { access_token: accessToken } = await response.json();
    this.#token = accessToken;
  }

  async addNote(text, priority = 1) {
    const requestBody = JSON.stringify({
      value: text,
      priority
    })
    
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${this.#token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${this.#baseUrl}/todo`, {
      method: 'POST',
      headers,
      body: requestBody
    })

    const note = await response.json();
    console.log(note);
  }
}

const todo = new ToDoList;