function appendToList() {
    const existingData = JSON.parse(localStorage.getItem('count'));
    if (existingData.length == 0) {return};
    
    const lastItem = existingData[existingData.length - 1];
    ul = document.getElementById('list');
    var li = document.createElement('li');
    ul.appendChild(li);
    li.innerHTML += lastItem;
};

function saveData() {
    const input = document.getElementById('count');
    var existingData = JSON.parse(localStorage.getItem('count'));

    // if there is no object in local storage
    if (existingData == null) {
        var existingData = [];
    }

    existingData.push(input.value);
    localStorage.setItem('count', JSON.stringify(existingData));

    appendToList()
};

function makeList() {
    const existingData = JSON.parse(localStorage.getItem('count'));
    if (existingData.length == 0) {return};
    
    var ul = document.getElementById('list');
    
    existingData.forEach(element => {
        var li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += element
    });
}

function resetCounter() {
    localStorage.removeItem('count');
    var ul = document.getElementById('list');
    ul.innerHTML = '';
    
}

window.addEventListener('load', makeList())