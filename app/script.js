function newExHTML(exName) {
    if (exName === undefined) {return};
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
            <button id='reset-counter-${exName}' class='btn' onclick="appendToCounter('${exName}', undefined, true)">Reset</button>            
        </div>   
    `;
    // makeList is called to fill out the content if some exists
    // called to enable to use this also on load of the site
    makeList(exName);
};

function appendToStorage(key, value) {
    var existingData = JSON.parse(localStorage.getItem(key));
    existingData.push(value);
    localStorage.setItem(key, JSON.stringify(existingData));
};

function getExercise(exName) {
    const exercises = JSON.parse(localStorage.getItem('exercises'));
    const exercise = exercises.find(ex => ex.name === exName);
    return exercise;
};

function appendToCounter(exName, value=undefined, reset=false) {
    // replaces an exercise in the local storage
    if (value == undefined && reset == false) {
        throw 'appendToCounter function requires either value to be specified or reset true.'
    };

    var existingData = getExercise(exName).count; 
    existingData.push(value);
    if (reset) {
        existingData = [];
    };

    var exercises = JSON.parse(localStorage.exercises);

    exercises.find((ex, i) => {
        if (ex.name === exName) {
            exercises[i] = {name: exName, count: existingData};
            return true;
        };
    });

    localStorage.setItem('exercises', JSON.stringify(exercises));
    if (reset) {
        resetListHTML(exName);
    };
};

function newEx() {
    const exName = document.getElementById("newExName");
    if (exName.value.length == 0) {return};

    exercise = {
        name: exName.value,
        count: []
    };
    appendToStorage('exercises', exercise)

    newExHTML(exName.value);
    
    closeModalNewExercise();
};

function saveData(exName) {
    var input = document.getElementById('count-' + exName);
    if (input.value.length == 0) {return};    

    appendToCounter(exName, input.value);
    appendToList(input.value, 'list-' + exName);

    input.value = '';
};

function appendToList(element, listId) {
    if (element.length == 0) {return};

    var ol = document.getElementById(listId);
    var li = document.createElement('li');
    ol.appendChild(li);
    li.innerHTML += element;
};

function makeList(exName) {
    const existingData = getExercise(exName).count;
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
    const  exercises = JSON.parse(localStorage.exercises);
    for (var i in exercises) {
        newExHTML(exercises[i].name);
    };
};

function resetListHTML(exName) {
    var ul = document.getElementById('list-' + exName);
    ul.innerHTML = '';    
};

function closeModalNewExercise() {
    modalNewExercise.style.display = "none";
};

if (localStorage.getItem('exercises') == undefined) {
    localStorage.setItem('exercises', JSON.stringify([]));
};

var modalNewExercise = document.getElementById("modalNewExercise");
var btnAddExercise = document.getElementById("btnAddExercise");
var spanCloseModal = document.getElementById("modalAddExClose");

btnAddExercise.addEventListener('click', () => {
    modalNewExercise.style.display = "block";
});
spanCloseModal.addEventListener('click', closeModalNewExercise);
window.addEventListener('load', makeLists);


