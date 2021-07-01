function newExHTML(exName) {
    if (exName === undefined) {return};
    const main = document.getElementsByTagName("main")[0];
    exBox = document.createElement('div');
    main.appendChild(exBox);
    exBox.className = 'exercise-box';
    exBox.innerHTML = `
        <div class="inside-box">
            <header>
                <h2 class="box-title">${exName}</h2>
            </header>
            <div class='adding-menu'>
                <form class="add-repetitions-form">
                    <input type="text" class="input-text" id="count-${exName}" name="count-${exName}">
                    <input type="button" class="btn btn-add-ex" value="Dodaj" onclick="saveData('${exName}')">
                </form>
            </div>
            <div id="stored-list" class="stored-list">
                <ol id="list-${exName}"></ol>
            </div>
                <button id='delete-exercise-${exName}' class='btn btn-delete' onclick="deleteExercise('${exName}')">Usuń ćwiczenie</button>
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
    
    exName.value = '';
};

function saveData(exName) {
    var input = document.getElementById('count-' + exName);
    if (input.value.length == 0) {return};    

    appendToCounter(exName, input.value);
    appendToListHTML(input.value, exName);
};

function appendToListHTML(element, exName) {
    if (element.length == 0) {return};

    var ol = document.getElementById('list-' + exName);
    var li = document.createElement('li');
    ol.appendChild(li);
    li.innerHTML += element;

    const rep_index = getExercise(exName).count.length - 1;
    var span = document.createElement('span');
    span.innerHTML = '&times;';
    span.className = 'close remove-rep';
    span.setAttribute('onclick', `deleteRepetition('${exName}', ${rep_index})`);
    // span.onclick = `deleteRepetition('${exName}', ${rep_index})`;
    li.appendChild(span);
};

function makeList(exName) {
    const existingData = getExercise(exName).count;
    if (existingData == null ) {return};
    if (existingData.length == 0 ) {return};

    var ol = document.getElementById('list-' + exName);
    
    existingData.forEach(element => {
        appendToListHTML(element, exName);
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

function deleteExercise(exName) {
    var existingData = JSON.parse(localStorage.getItem('exercises'));
    // the callback function can get two additional parameters - index and the full array
    var newData = existingData.filter((value) => {
        return value.name !== exName;
    });
    localStorage.setItem('exercises', JSON.stringify(newData));  
    window.location.reload();
};

function deleteRepetition(exName, repIndex) {
    var existingData = JSON.parse(localStorage.getItem('exercises'));
    for (var i = 0; i < existingData.length; i++) {
        if (existingData[i].name === exName) {
            existingData[i].count.splice(repIndex, 1);
            break;
        };
    };
    localStorage.setItem('exercises', JSON.stringify(existingData));  
    window.location.reload();
};

if (localStorage.getItem('exercises') == undefined) {
    localStorage.setItem('exercises', JSON.stringify([]));
};

async function saveTraining() {
    const saveTrainingName = document.getElementById("newTrainingName");
    if (saveTrainingName.value.length == 0 ) {return};

    const exercises = JSON.parse(localStorage.getItem('exercises'));
    const resp = await fetch(url='/training', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            name: saveTrainingName.value,
            exercises: exercises
        })
    })
    
    if (resp.redirected) {
            window.location.href = resp.url;
    };  

    return resp

};

var modalNewExercise = document.getElementById("modalNewExercise");
var btnAddExercise = document.getElementById("btnAddExercise");
var spanCloseModal = document.getElementById("modalAddExClose");
var modalBtnAddExercise = document.getElementById("modalBtnAddExercise");
try {
    btnAddExercise.addEventListener('click', () => {
        modalNewExercise.style.display = "flex";
    });

    spanCloseModal.addEventListener('click', () => {
        modalNewExercise.style.display = "none";
    });

    modalBtnAddExercise.addEventListener('click', () => {
        newEx();
        modalNewExercise.style.display = "none";
    })
} catch (err) {
    console.log(err)
};
var modalSaveTraining = document.getElementById("modalSaveTraining");
var btnSaveTraining = document.getElementById("btnSaveTraining");
var spanSaveTrainingClose = document.getElementById("modalSaveTrainingClose");
const modalBtnSaveTraining = document.getElementById("modalBtnSaveTraining");

if (btnSaveTraining != null) {
    btnSaveTraining.addEventListener('click', () => {
        modalSaveTraining.style.display = "flex";
    });
};
try {
    spanSaveTrainingClose.addEventListener('click', () => {
        modalSaveTraining.style.display = "none";
    });

    modalBtnSaveTraining.addEventListener('click', async () => {
        const resp = await saveTraining();
        localStorage.setItem('exercises', JSON.stringify([]));
        modalSaveTraining.style.display = "none";  
        if (resp.redirected == false) {
            window.location.reload(); 
        };
              
    });
    window.addEventListener('load', makeLists);
} catch (err) {
    console.log(err)
};

// remove messages after time with fade
setTimeout(() => {
    let messages = document.getElementsByClassName("message")
    for (let i=0; i< messages.length; i++) {
        messages[i].classList.add('hide');
        setTimeout(() => {messages[i].remove();}, 400)
    }
}
, 3000);

const trainingListBoxes = document.getElementsByClassName("trainingList");
for (let i = 0; i < trainingListBoxes.length; i++) {
    let trainingLink = trainingListBoxes[i].children[0].href;
    trainingListBoxes[i].addEventListener('click', () => {
        window.location.href = trainingLink;        
    });
    // trainingListBoxes[i].addEventListener('mouseover', () => {
    //     trainingListBoxes[i].style.color = 'black';
    // }); Here maybe it makes sense to add nice mouseover and mouseout event listeners
};

