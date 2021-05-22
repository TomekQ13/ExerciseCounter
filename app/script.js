function newExHTML(exName) {
    const main = document.getElementsByTagName("main")[0];
    exBox = document.createElement('div');
    main.appendChild(exBox);
    exBox.className = 'exercise-box';
    exBox.innerHTML = `
        <header>
            <h2 class="box-title">${exName}</h2>
        </header>
        <div class='adding-menu'>
            <form>
                <input type="text" class="btn" id="count-${exName}" name="count-${exName}">
                <input type="button" class="btn" value="Dodaj" onclick="saveData('${exName}')">
            </form>
        </div>
        <div id="stored-list" class="stored-list">
            <ol id="list-${exName}"></ol>
        </div>
        <div class="reset-button">
            <button id='reset-counter-${exName}' class='btn' onclick="resetCounter('${exName}')">Reset</button>            
        </div>   
    `;
    // makeList is called to fill out the content if some exists
    // called to enable to use this also on load of the site
    makeList(exName);
};

function newEx() {
    const exName = document.getElementById("newExName");
    if (exName.value.length == 0) {return};

    localStorage.setItem(exName.value, JSON.stringify([]));

    newExHTML(exName.value);
    
    closeModalNewExercise();
};

function saveData(exName) {
    const input = document.getElementById('count-' + exName);
    if (input.value.length == 0) {return};

    var existingData = JSON.parse(localStorage.getItem(exName));
    existingData.push(input.value);
    localStorage.setItem(exName, JSON.stringify(existingData));

    appendToList(input.value, 'list-' + exName)
};

function appendToList(element, listId) {
    if (element.length == 0) {return};

    var ol = document.getElementById(listId);
    var li = document.createElement('li');
    ol.appendChild(li);
    li.innerHTML += element;
};

function makeList(exName) {
    const existingData = JSON.parse(localStorage.getItem(exName));
    if (existingData == null ) {return};
    if (existingData.length == 0 ) {return};

    var ol = document.getElementById('list-' + exName);
    
    existingData.forEach(element => {
        var li = document.createElement('li');
        ol.appendChild(li);
        li.innerHTML += element
    });
};

function makeLists() {
    for (var i in Object.keys(localStorage)) {
        newExHTML(localStorage.key(i));
    };
};

function resetCounter(exName) {
    localStorage.setItem(exName, JSON.stringify([]));
    var ul = document.getElementById('list-' + exName);
    ul.innerHTML = '';    
};

function closeModalNewExercise() {
    modalNewExercise.style.display = "none";
};

var modalNewExercise = document.getElementById("modalNewExercise");
var btnAddExercise = document.getElementById("btnAddExercise");
var spanCloseModal = document.getElementById("modalAddExClose");

btnAddExercise.onclick = () => {
    modalNewExercise.style.display = "block";
};

spanCloseModal.onclick = closeModalNewExercise();
window.addEventListener('load', makeLists());

localStorage.setItem('exercises', JSON.stringify([]));