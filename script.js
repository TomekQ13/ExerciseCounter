function appendToList(element) {
    if (element.length == 0) {return};

    var ol = document.getElementById('list');
    var li = document.createElement('li');
    ol.appendChild(li);
    li.innerHTML += element;
};

function saveData() {
    const input = document.getElementById('count');
    if (input.value.length == 0) {return};

    var existingData = JSON.parse(localStorage.getItem('count'));
    // if there is no object in local storage
    if (existingData == null) {
        var existingData = [];
    }

    existingData.push(input.value);
    localStorage.setItem('count', JSON.stringify(existingData));

    appendToList(input.value)
};

function makeList() {
    const existingData = JSON.parse(localStorage.getItem('count'));
    if (existingData.length == 0) {return};
    
    var ol = document.getElementById('list');
    
    existingData.forEach(element => {
        var li = document.createElement('li');
        ol.appendChild(li);
        li.innerHTML += element
    });
}

function resetCounter() {
    localStorage.removeItem('count');
    var ul = document.getElementById('list');
    ul.innerHTML = '';
    
}

window.addEventListener('load', makeList())