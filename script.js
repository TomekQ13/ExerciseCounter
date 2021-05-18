function makeList() {
    const existingData = JSON.parse(localStorage.getItem('count'));
    if (existingData.length == 0) {return};
    
    ul = document.createElement('ul');
    document.getElementById('stored-list').appendChild(ul);
    
    existingData.forEach(element => {
        var li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML += element
    });
}

function saveData() {
    const input = document.getElementById('count');
    var existingData = JSON.parse(localStorage.getItem('count'));

    // if there is no object in local storage
    if (existingData == null) {
        var existingData = [];
    }

    existingData.push(input.value);
    localStorage.setItem('count', JSON.stringify(existingData));

    makeList()
};

