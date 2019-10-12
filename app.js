// Person class: represent a Person
class Person {
    constructor(firstname, lastname, city, postalcode) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.city = city;
        this.postalcode = postalcode;
    }
}
// UI Class: Handle UI Tasks
class UI {
    static displayPeople() {
        // const StoredPeople = [
        //     {
        //         firstname: 'Andrei',
        //         lastname: 'Popescu',
        //         city: 'Timisoara',
        //         postalcode: 300101
        //     },
        //     {
        //         firstname: 'Adina',
        //         lastname: 'Popovici',
        //         city: 'Timisoara',
        //         postalcode: 300121
        //     }
        // ];

        const people = Store.getPeople();

        people.forEach((person) => UI.addPersonToList(person));
    }

    static addPersonToList(person) {
        const list = document.querySelector('#registration-list');

        const row = document.createElement('tr');

        row.innerHTML = `
         <td>${person.firstname}</td>
         <td>${person.lastname}</td>
         <td>${person.city}</td>
         <td>${person.postalcode}</td>
         <td><a href="#" class= "btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deletePerson(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#registration-form');
        container.insertBefore(div, form);

        // Vanish in 2 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);

    }

    static clearFields() {
        document.querySelector('#firstname').value = '';
        document.querySelector('#lastname').value = '';
        document.querySelector('#city').value = '';
        document.querySelector('#postalcode').value = '';
    }
}
// Store class: Handle storage
class Store {
    static getPeople() {
        let people;
        if(localStorage.getItem('people') === null) {
            people = [];
        } else{
            people = JSON.parse(localStorage.getItem('people'));
        }

        return people;
    }

    static addPerson(person) {
        const people = Store.getPeople();
        people.push(person);
        localStorage.setItem('people', JSON.stringify(people));
    }

    static removePerson(postalcode) {
        const people = Store.getPeople();

        people.forEach((person, index) => {
            if(person.postalcode === postalcode) {
                people.splice(index, 1);
            }
        });

        localStorage.setItem('people', JSON.stringify(people));

    }
}

// Event: Display a Person
document.addEventListener('DOMContentLoaded', UI.displayPeople);

// Event: Add a Person
document.querySelector('#registration-form').addEventListener('submit', (e) =>{

    // Prevent actual submit

   e.preventDefault();
    // Get form value
    const firstname = document.querySelector('#firstname').value;
    const lastname = document.querySelector('#lastname').value;
    const city = document.querySelector('#city').value;
    const postalcode = document.querySelector('#postalcode').value;

     // Validate
     if (firstname === '' || lastname === '' || city === '' || postalcode === '') {
         UI.showAlert('Please fill in all fields', 'danger');
     } else {
         // Instatiate
        const person = new Person(firstname, lastname, city, postalcode);

         // Add Person to UI
         UI.addPersonToList(person);

         // Add Person to store
         Store.addPerson(person);

         // Show success message
         UI.showAlert('Person Added', 'success');

         // Clear fields
         UI.clearFields();
     }
});


// Event: Remove a Person
document.querySelector('#registration-list').addEventListener('click', (e) => {

    // Remove person from UI
    UI.deletePerson(e.target);

    // Remove person from store
    Store.removePerson(e.target.parentElement.previousElementSibling.textContent);

    // Show success message remove
      UI.showAlert('Person removed', 'success');


});