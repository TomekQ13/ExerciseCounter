function saveData() {
    const input = document.getElementById('count');
    var existingData = JSON.parse(localStorage.getItem('count'));

    // if there is no object in local storage
    if (existingData == null) {
        var existingData = [];
    }

    existingData.push(input.value);
    localStorage.setItem('count', JSON.stringify(existingData));
}