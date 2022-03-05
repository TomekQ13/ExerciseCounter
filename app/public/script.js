"use strict";

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
        if (allExercises.map(exercise => exercise.name).includes(this.name)) {
            allExercises.find((ex, i) => {
                if (ex.name === this.name) {
                    allExercises[i] = {name: this.name, tags: this.tags, count: this.count}
                    return true
                };
            })
        } else {
                // create a new exercise in LS
                allExercises.push({name: this.name, tags: this.tags, count: []})
        }
        // save all to Local Storage
        saveAllExercisesToLS(allExercises)
    }

    addToHTML() {
        this.addExerciseToHTML()
        this.addEventListenerToAddRep()
        this.addEventListenerToDeleteExercise()
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
        this.saveToLS()

        // add the rep to HTML
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
                    <div class="icon rep-place-change" id="up-arrow-${this.name}-${repIndex}" my-exName="${this.name}" my-repindex="${repIndex}" my-up="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" class="bi bi-arrow-up-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                        </svg>
                    </div>
                    <div class="icon rep-place-change" id="down-arrow-${this.name}-${repIndex}" my-exName="${this.name}" my-repindex="${repIndex}" my-up="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                        </svg>        
                    </div>
                    <div class="icon rep-delete" id="delete-rep-${this.name}-${repIndex}" my-exName="${this.name}" my-repIndex="${repIndex}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="red" class="bi bi-x" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg> 
                    </div>
                </div>  
            </div>      
        `
        this.addEventListenerToArrow(li.childNodes[1].childNodes[3].childNodes[1], true)
        this.addEventListenerToArrow(li.childNodes[1].childNodes[3].childNodes[3], false)
        this.addEventListenerToDeleteRep(li.childNodes[1].childNodes[3].childNodes[5])
        repList.appendChild(li)
    }

    deleteRep(repIndex) {
        this.count.splice(repIndex, 1)
        this.saveToLS()
        window.location.reload()
    }

    addEventListenerToAddRep() {
        const btnAddRep = document.getElementById(`btn-add-rep-${this.name}`)
        btnAddRep.addEventListener('click', () => {
            const repValue = document.getElementById(`rep-value-${this.name}`).value
            this.addRep(repValue)
        })
    }

    moveRep(repIndex, up) {
        if (up && repIndex > 0) {
            arraymove(this.count, repIndex, repIndex - 1)  
        } else if (!up && repIndex < this.count.length) {
            arraymove(this.count, repIndex, repIndex + 1)
        }
        this.saveToLS()
        window.location.reload()
    }

    addEventListenerToArrow(arrowIcon, up) {
        arrowIcon.addEventListener('click', () => {
            this.moveRep(Number(arrowIcon.getAttribute('my-repindex')), up)
        })
    }

    addEventListenerToDeleteRep(deleteRepIcon) {
        deleteRepIcon.addEventListener('click', () => {
            this.deleteRep(Number(deleteRepIcon.getAttribute('my-repindex')))
        })
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

function initializeExercisesFromLocalStorage() {    
    if (localStorage.getItem('exercises') == undefined) {
        localStorage.setItem('exercises', JSON.stringify([]));
    }
    const exercises = getAllExercisesFromLS()
    exercises.forEach((exercise) => {
        const newEx = new Exercise(exercise.name, exercise.tags, exercise.count)
        newEx.addToHTML()
        newEx.count.forEach((rep) => {
            newEx.addRepToHTML(rep)
        }) 
    })
}

async function saveTraining() {
    const saveTrainingName = document.getElementById("newTrainingName");
    if (saveTrainingName.value.length == 0 ) {return};

    const exercises = JSON.parse(localStorage.getItem('exercises'));
    const resp = await fetch('/training', {
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

let modalNewExercise = document.getElementById("modalNewExercise");
let btnAddExercise = document.getElementById("btnAddExercise");
let spanCloseModal = document.getElementById("modalAddExClose");
let modalBtnAddExercise = document.getElementById("modalBtnAddExercise");
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
        newEx.addToHTML()
        newEx.saveToLS()
        modalNewExercise.style.display = "none";
    })
} catch (err) {
    console.log(err)
};
let modalSaveTraining = document.getElementById("modalSaveTraining");
let btnSaveTraining = document.getElementById("btnSaveTraining");
let btnSaveTrainingClose = document.getElementById("modalSaveTrainingClose");
let modalBtnSaveTraining = document.getElementById("modalBtnSaveTraining");

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
        if (resp.redirected == false && resp.status === 201) {
            window.location.reload(); 
            localStorage.setItem('exercises', JSON.stringify([]));
        };
              
    });
    // the main listener for the page load
    window.addEventListener('load', () => {
        initializeExercisesFromLocalStorage()
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

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

const dateInput = document.getElementById('datePicker')
if (dateInput) {
    dateInput.value = new Date().toDateInputValue();
}



// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
            console.log('inside if')
          }
  
          form.classList.add('was-validated')
        }, false)
      })
})();

const ctx = document.getElementById('myChart')
async function makeChart() {
    function getWeights() {
        return fetch('/weight/values', {
            method: "GET", 
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(responseData => {
            return responseData
        })
        .catch(error => console.error(error))
    }
    let resp = await getWeights()
    
    function aggregateValues(objectToAgg, label, value) {
        const uniqueKeys = new Set(objectToAgg.map(element => element[label]))
        let aggs = []
        for (let item of uniqueKeys) {
        let temp = objectToAgg
            .filter(element => element[label] === item)
            .map(element => element[value])
        const sum = temp.reduce((a, b) => a + b, 0)
        const avg = (sum / temp.length) || 0
        aggs.push({
            label: item,
            avgValue: avg
        })
        }
        return aggs
    }

    let aggregatedValues = aggregateValues(resp, 'date', 'weightValue')
    let weights = aggregatedValues.map(element => element.avgValue)
    let dates = aggregatedValues.map(element => element.date.slice(0,10))

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Weight',
                data: weights,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    })    
}
if (ctx) {
    makeChart()
}