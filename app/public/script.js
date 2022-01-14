// "use strict";

function getAllExercisesFromLS() {
    return JSON.parse(localStorage.getItem('exercises'))
}

function saveAllExercisesToLS(allExercises) {
    localStorage.setItem('exercises', JSON.stringify(allExercises))
}

function getExerciseFromLS(exerciseName) {
    const allExercises = getAllExercisesFromLS()
    const exercise = allExercises.find(ex => ex.name === exerciseName)
    if (!exercise) {return undefined}
    return new Exercise(exercise.name, exercise['tags'], exercise['count'])
}

class Exercise {
    constructor(name, tags=undefined, count=undefined) {
        this.name = name
        this.count = count || []
        this.tags = tags
    }

    getFromLS() {
        const exercises = getAllExercisesFromLS()
        const exercise = exercises.find(ex => ex.name === exName)
        this.count = exercise['count']
        this.tags = exercise['tags']
        this._loaded = true
    }

    saveToLS() {
        // read all exercises from Local Storage
        let allExercises = getAllExercisesFromLS()
        // find existing one and update
        allExercises.find((ex, i) => {
            if (ex.name === this.name) {
                allExercises[i] = {name: this.name, tags: this.tags, count: this.count}
                return true
            };
        })
        // create a new exercise in LS
        console.log(allExercises)
        console.log('adding')
        allExercises.push({name: this.name, tags: this.tags, count: []}) 
        // save all to Local Storage
        saveAllExercisesToLS(allExercises)
    }

    deleteExercise() {
        let allExercises = getAllExercisesFromLS()
        allExercises.find((ex, i) => {
            if (ex.name === this.name) {
                allExercises.splice(i, 1)
                return true
            };
        })
        saveAllExercisesToLS(allExercises)
    }

    addEventListenerToDeleteExercise() {
        const btnDeleteExercise = document.getElementById(`btn-delete-exercise-${this.name}`)
        btnDeleteExercise.addEventListener('click', () => {
            this.deleteExercise()
            window.location.reload()
        })        
    }

    addRep(repValue) {
        // add rep to the class
        this.count.push(repValue)

        // add the rep to HTMl
        this.addRepToHTML(repValue)
    }

    addRepToHTML(repValue) {
        const repList = document.getElementById('list-' + this.name);
        let ol = document.getElementById('list-' + this.name)
        let li = document.createElement('li')
        const repIndex = ol.children.length
        li.innerHTML = `
            <div class="d-flex flex-row justify-content-between align-items-center">
                <div class="list-item">
                    ${repValue}
                </div>
                <div class="d-flex flex-row justify-content-center">
                    <div class="icon rep-place-change" my-exName="${this.name}" my-repIndex="${repIndex}" my-up="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                        </svg>
                    </div>
                    <div class="icon rep-place-change" my-exName="${this.name}" my-repIndex="${repIndex}" my-up="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                        </svg>        
                    </div>
                    <div class="icon rep-delete" my-exName="${this.name}" my-repIndex="${repIndex}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> 
                    </div>
                </div>  
            </div>    
        `
        repList.appendChild(li)
    }

    deleteRep(repIndex) {
        this.count[i].splice(repIndex, 1);
        // remove list from HTML
        deleteRepFromHTML(repIndex)
    }

    deleteRepFromHTML(repIndex) {
        const repList = document.getElementById('list-' + this.name)
        repList.removeChild(repList.childNodes[repIndex])
    }

    addEventListenerToAddRep() {
        const btnAddRep = document.getElementById(`btn-add-rep-${this.name}`)
        btnAddRep.addEventListener('click', () => {
            const repValue = document.getElementById(`rep-value-${this.name}`).value
            this.addRep(repValue)
        })
    }

    addEventListenersToDeleteAndMoveReps(){

    }



    addExerciseToHTML() {
        if (this.name === undefined) {return};
        const main = document.getElementsByTagName("main")[0];
        let exBox = document.createElement('div');
        main.appendChild(exBox);
        exBox.className = 'exercise-box';
        exBox.innerHTML = `
            <header class="d-flex flex-row justify-content-between mb-3">
                <h2 class="box-title">${this.name}</h2>
                <button class='btn btn-outline-danger btn-sm' id="btn-delete-exercise-${this.name}" my-exname="${this.name}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> 
                </button> 
            </header>
            <div class='adding-menu mb-2'>
                <form class="add-repetitions-form">
                    <input type="text" class="input-text" id="rep-value-${this.name}" name="count-${this.name}">
                    <input type="button" class="btn btn-primary ms-2" value="Dodaj" id="btn-add-rep-${this.name}">
                </form>
            </div>
            <div id="stored-list" class="stored-list">
                <ol id="list-${this.name}"></ol>
            </div>
        `;
    }
}


function newExHTML(exName) {
    if (exName === undefined) {return};
    const main = document.getElementsByTagName("main")[0];
    exBox = document.createElement('div');
    main.appendChild(exBox);
    exBox.className = 'exercise-box';
    exBox.innerHTML = `
        <header class="d-flex flex-row justify-content-between mb-3">
            <h2 class="box-title">${exName}</h2>
            <button id='delete-exercise-${exName}' class='btn btn-outline-danger btn-sm' onclick="deleteExercise('${exName}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg> 
            </button> 
        </header>
        <div class='adding-menu mb-2'>
            <form class="add-repetitions-form">
                <input type="text" class="input-text" id="count-${exName}" name="count-${exName}">
                <input type="button" class="btn btn-primary ms-2" value="Dodaj" onclick="saveData('${exName}')">
            </form>
        </div>
        <div id="stored-list" class="stored-list">
            <ol id="list-${exName}"></ol>
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
    if (getExercise(exName.value)) {return};

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
    if (element.length == 0) {return}

    var ol = document.getElementById('list-' + exName)
    var li = document.createElement('li')
    const repIndex = ol.children.length
    li.innerHTML =`
        <div class="d-flex flex-row justify-content-between align-items-center">
            <div class="list-item">
                ${element}
            </div>
            <div class="d-flex flex-row justify-content-center">
                <div class="icon rep-place-change" my-exName="${exName}" my-repIndex="${repIndex}" my-up="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                    </svg>
                </div>
                <div class="icon rep-place-change" my-exName="${exName}" my-repIndex="${repIndex}" my-up="false">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>        
                </div>
                <div class="icon rep-delete" my-exName="${exName}" my-repIndex="${repIndex}">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg> 
                </div>
            </div>  
        </div>    
    `
    ol.appendChild(li);

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
        // newEx();
        const exName = document.getElementById("newExName")
        const newEx = new Exercise(exName.value)
        newEx.addExerciseToHTML()
        newEx.addEventListenerToDeleteExercise()
        newEx.addEventListenerToAddRep()
        newEx.saveToLS()
        modalNewExercise.style.display = "none";
    })
} catch (err) {
    console.log(err)
};
var modalSaveTraining = document.getElementById("modalSaveTraining");
var btnSaveTraining = document.getElementById("btnSaveTraining");
var btnSaveTrainingClose = document.getElementById("modalSaveTrainingClose");
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
    btnSaveTrainingClose.addEventListener('click', () => {
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
    // the main listener for the page load
    window.addEventListener('load', () => {
        makeLists()
        addELToArrows()
        addELToDeleteRep()
        mobileScreenAdjustements()

    });
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

function moveEx(exName, repIndex, up) {
    var existingData = JSON.parse(localStorage.getItem('exercises'));
    const exIndex = existingData.findIndex(el => el.name === exName);
    if (up && repIndex > 0) {
        arraymove(existingData[exIndex].count, repIndex, repIndex - 1);     
    } else if (!up && exIndex < existingData[exIndex].count.length) {
        arraymove(existingData[exIndex].count, repIndex, repIndex + 1); 
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
// function myFunction() {
//     var x = document.getElementById("myLinks");
//     if (x.style.display === "block") {
//       x.style.display = "none";
//     } else {
//       x.style.display = "block";
//     }
//   }

function addELToArrows() {
    const arrows = document.getElementsByClassName('rep-place-change')
    for (let i=0; i<arrows.length; i++) {
        arrows[i].addEventListener('click', () => {
            moveEx(arrows[i].getAttribute('my-exname'), Number(arrows[i].getAttribute('my-repindex')), (arrows[i].getAttribute('my-up') === 'true'))
        })
    }
}

function addELToDeleteRep() {
    const deleteRepButton = document.getElementsByClassName('rep-delete')
    for (let i=0; i<deleteRepButton.length; i++) {
        deleteRepButton[i].addEventListener('click', () => {
            deleteRepetition(deleteRepButton[i].getAttribute('my-exname'), Number(deleteRepButton[i].getAttribute('my-repindex')))
        })
    }
}

function mobileScreenAdjustements() {
    let mediaQuery = '(max-width: 991px)'
    let mql = window.matchMedia(mediaQuery).matches
    if (mql) {
        removeButtonContentsOnSmallScreens()
        moveAddExerciseButton()
    }
}

function removeButtonContentsOnSmallScreens() {
    function removeText(elementId) {
        let element = document.getElementById(elementId)
        console.log(element.childNodes)
        element.removeChild(element.childNodes[2])
    }
    removeText("btnAddExercise")
    removeText("btnSaveTraining")
}

function moveAddExerciseButton() {
    let liExistingButton = document.getElementById('liBtnAddExercise')
    liExistingButton.remove()
    document.getElementById('btn-group-right').prepend(liExistingButton.childNodes[1])    
}
