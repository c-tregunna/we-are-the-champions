import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://ctendoresments-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")


const inputFieldEl = document.getElementById("input-field")
const fromEl = document.getElementById("from-el")
const toEl = document.getElementById("to-el")
const publishBtn = document.getElementById("publish-btn")
const endorsementContainer = document.getElementById("endorsement-container")

publishBtn.addEventListener('click', function() {
    let endorsementValue = inputFieldEl.value
    let fromValue = fromEl.value
    let toValue = toEl.value
    let fullEndorsementObject = {
        endorsement: endorsementValue,
        from: fromValue,
        to: toValue,
        likes: 0
    }
    if(inputFieldEl.value == 0) {
        alert("Please add your endorsement")
    } else {
        push(endorsementsInDB, fullEndorsementObject)
        clearInputFieldEl()
    }

})


function clearEndorsements() {
    endorsementContainer.innerHTML = "";
}

onValue(endorsementsInDB, function(snapshot){
    if (snapshot.exists()) {
        let endorsementsArray = Object.entries(snapshot.val()) //turns the content into an array
        clearEndorsements()
        for (let i = 0; i < endorsementsArray.length; i ++) {
            appendEndorsement(endorsementsArray[i])
            // console.log(endorsementsArray[i])
        }
    }
    else {
        endorsementContainer.innerHTML = "There are no endorsements yet, feel free to add one"
    }
})

function clearInputFieldEl() {
    inputFieldEl.value= ""
    toEl.value = ""
    fromEl.value = ""
}

// function to create the div containing the endorsment
function appendEndorsement(theEndorsement) {
    const endorsementID = theEndorsement[0]
    const myEndorsement = theEndorsement[1]
    // console.log(myEndorsement)
    let newEndorsement = document.createElement("div")
    newEndorsement.className = "end-div"
    let endorsementText = myEndorsement.endorsement
    let fromValue = myEndorsement.from
    let toValue = myEndorsement.to
    let likes = myEndorsement.likes
    newEndorsement.innerHTML = `
        <div class="end-div-inner-wrap">
            <h4>To: ${toValue}</h4>
            <p id="remove">Remove<span class="tooltiptext">Double click to remove</span></p>
        </div>
        <p>${endorsementText}</p>
        <div class="end-div-inner-wrap">
            <h4>From: ${fromValue}</h4>
        </div>
        `
    newEndorsement.addEventListener('dblclick', function() {
        let exactLocationOfEndorsementInDB = ref(database, `endorsements/${endorsementID}`)
        remove(exactLocationOfEndorsementInDB)
    })
    endorsementContainer.appendChild(newEndorsement)
    // likeEndorsement(newEndorsement, likes, endorsementID)
    // console.log(likes)
}

// function likeEndorsement(element, likes, id) {
//     element.addEventListener("click", function(){
//         likes += 1
//         set(ref(database,`endorsements/${id}/likes`),likes)
//     })
// }


