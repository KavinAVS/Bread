const userList = document.querySelector('#user-list');
const form = document.querySelector('#add-user-form');

function renderList(doc){

    //set up all user components
    let li = document.createElement('li');
    let name = document.createElement('span');
    let email = document.createElement('span');
    let cross = document.createElement('div');

    //extract user data into variables
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    email.textContent = doc.data().email;
    cross.textContent = 'x';

    li.appendChild(name);
    li.appendChild(email);
    li.appendChild(cross);
    
    userList.append(li);

    //deleting users
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('user').doc(id).delete();
    })
}

//gets user data
db.collection('user').get().then( (snapshot) => {
    snapshot.docs.forEach(doc => {
        renderList(doc);
    })
});

//save new user
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('user').add({
        name: form.name.value,
        email: form.email.value
    })
    form.name.value = '';
    form.email.value = '';
})