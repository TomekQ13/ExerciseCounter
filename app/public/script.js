'user strict';

function getAllExercisesFromLS() {
    return JSON.parse(localStorage.getItem('exercises'))
}

function saveAllExercisesToLS(allExercises) {
    localStorage.setItem('exercises', JSON.stringify(allExercises))
}

function getExerciseFromLS(exerciseName) {
    const allExercises = getAllExercisesFromLS()
    const exercise = allExercises.find(ex => ex.name === exerciseName)
    return new Exercise(exercise.name, exercise['tags'], exercise['reps'])
}

class Exercise {
    constructor(name, tags=undefined, reps=undefined) {
        this.name = name
        this.reps = reps
        this.tags = tags

    }
    // the two below setter will save the object to local storage every time there is a change on reps or tags
    set reps(newValue) {
        this.reps = value
        this.saveToLS()
    }

    set tags(value) {
        this.tags = newValue
        this.saveToLS()
    }

    getFromLS() {
        // const exercises = getAllExercisesFromLS()
        const exercise = exercises.find(ex => ex.name === exName)
        this.reps = exercise['reps']
        this.tags = exercise['tags']
        this._loaded = true
    }

    saveToLS() {
        // read all exercises from Local Storage
        let allExercises = getAllExercisesFromLS()

        //find and replace the object for the currently active exercise
        allExercises.find((ex, i) => {
            if (ex.name === this.name) {
                allExercises[i] = {name: this.name, tags: this.tags, reps: this.reps}
                return true
            };
        })

        // save all to Local Storage
        saveAllExercisesToLS(allExercises)
    }

    addRep(repValue) {
        // add rep to the class
        this.reps.push(repValue)

        // add the rep to 
        addRepToHTML(repValue)
    }

    addRepToHTML(repValue) {
        const repList = document.getElementById('list-' + exName);
        repHTML = `
            <p class="list-item">${repValue}</p>
            <div class="icons">
                <i class="arrow arrow-up" onclick="moveEx('abcd', 2, true)"></i>
                <i class="arrow arrow-down" onclick="moveEx('abcd', 2)"></i>
                <span class="close remove-rep" onclick="deleteRepetition('abcd', 2)">×</span>
            </div>      
        `
        let li = document.createElement('li')
        li.innerHTML = repHTML
        repList.appendChild(li)
    }

    deleteRep(repIndex) {
        this.reps[i].splice(repIndex, 1);
        // remove list from HTML
        deleteRepFromHTML(repIndex)
    }

    deleteRepFromHTML(repIndex) {
        const repList = document.getElementById('list-' + exName)
        repList.removeChild(repList.childNodes[repIndex])
    }


}


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
                <form class="add-repetitions-form">
                    <input type="text" class="input-text" id="count-${exName}" name="count-${exName}">
                    <input type="button" class="btn btn-primary ms-2" value="Dodaj" onclick="saveData('${exName}')">
                </form>
            </div>
            <div id="stored-list" class="stored-list">
                <ol id="list-${exName}"></ol>
            </div>
                <button id='delete-exercise-${exName}' class='btn btn-outline-danger' onclick="deleteExercise('${exName}')">Usuń ćwiczenie</button> 
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
    // li.innerHTML += element;
    var p = document.createElement('p')
    p.className = 'list-item'
    li.appendChild(p)
    p.innerHTML=element

    const rep_index = ol.children.length - 1
    var icons = document.createElement('div')
    icons.className = 'icons'    

    var arrow_up = document.createElement('i');
    arrow_up.className = 'arrow arrow-up';
    arrow_up.setAttribute('onclick', `moveEx('${exName}', ${rep_index}, true)`);
    icons.appendChild(arrow_up);

    var arrow_down = document.createElement('i');
    arrow_down.className = 'arrow arrow-down';
    arrow_down.setAttribute('onclick', `moveEx('${exName}', ${rep_index})`);
    icons.appendChild(arrow_down);

    var span = document.createElement('span');
    span.innerHTML = '&times;';
    span.className = 'close remove-rep';
    span.setAttribute('onclick', `deleteRepetition('${exName}', ${rep_index})`);
    // span.onclick = `deleteRepetition('${exName}', ${rep_index})`;
    icons.appendChild(span);
    li.appendChild(icons)
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
        document.getElementById('newTrainingName').value = new Date().toLocaleString('pl-PL', {
            weekday: 'long',
            day: 'numeric', 
            year: 'numeric', 
            month: 'numeric'
        } )
    });
};
try {
    spanSaveTrainingClose.addEventListener('click', () => {
        modalSaveTraining.style.display = "none";
    });

    modalBtnSaveTraining.addEventListener('click', async () => {
        const resp = await saveTraining();        
        modalSaveTraining.style.display = "none";  
        if (resp.redirected == false) {
            window.location.reload(); 
            localStorage.setItem('exercises', JSON.stringify([]));
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

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function moveEx(exName, exIndex, up) {
    var existingData = JSON.parse(localStorage.getItem('exercises'));
    const index = existingData.findIndex(el => el.name === exName);
    if (up && exIndex > 0) {
        arraymove(existingData[index].count, exIndex, exIndex - 1);     
    } else if (!up && index < existingData[index].count.length) {
        arraymove(existingData[index].count, exIndex, exIndex + 1); 
    }    

    localStorage.setItem('exercises', JSON.stringify(existingData));
    window.location.reload();
}

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

var cookieConsent = new CookieConsent({privacyPolicyUrl: "/privacy-policy.html"})



/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }