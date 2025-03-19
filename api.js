const quoteHere = document.getElementById("quote");
const authorHere = document.getElementById("author");
const gameMode = document.getElementById("mode-game");
const answersSelection =  document.querySelector(".answers");
const pageClick = document.querySelector(".app");
const clickPrompt = document.getElementById("clickprompt");

const authors = ['Seneca', 'Marcus Aurelius', 'Epictetus'];

let quote = "";
let author = "";

pageClick.addEventListener("click", (e) => clickhandler(e));
// ###########################################################
// ###########################################################
// ###########################################################

function clickhandler(e){
    if(e.target.nodeName === "SPAN" || e.target.nodeName === "INPUT" ){
        // reach here is user clicks mode buttons or answers 
        // answer --> span
        // generator --> span
        return;
        
    } else{
        clickPrompt.style.display = "none";
        getQuote();
    }
}

function getQuote(){
    fetch("https://stoic-quotes.com/api/quote")
    // body of data is not readable from response object
    // need to call a method to convert response to json (.json() returns another promise)
    .then(result => result.json())
    // use .then again which now contains our actual data
    .then(data => {
        // reset game answer selection to be empty (if applicable)
        quote = data.text;
        author = data.author;
        answersSelection.innerHTML = "";
        authorHere.style.color = "#ffffff";
        authorHere.style.textAlign = "right";

        authorHere.innerHTML = `- ${author}`;
        quoteHere.innerHTML = quote;
        
        if(gameMode.checked){
            shiftToGame();
        }
        // debug
        // console.log(data);
    })
    .catch(error => console.log(`Not very stoic of you... ${error}`))
}

// ###########################################################
// ###########################################################
// ###########################################################


const bind = (e) => winCheck(e);

function shiftToGame(){
    authorHere.innerHTML = "Guess the author of the quote!";
    authorHere.style.color = "#00f7ff";
    authorHere.style.textAlign = "center";
    const prefix = ["A) ","B) ","C) "];

    const choices = [...authors];

    // DOM is manipulated to display the chosen authors as selectable answers 
    for (let i = 0; i< choices.length; i++){
        const p = document.createElement("p");
        const sp = document.createElement("span");
        answersSelection.appendChild(p);
        p.textContent = `${prefix[i]}`;
        p.appendChild(sp);
        sp.textContent =`${choices[i]}`;
        sp.setAttribute("class","answer answerhover");
        sp.addEventListener("click", bind);
    }
    // debug
    // console.log(choices);
}

// ###########################################################
// ###########################################################
// ###########################################################



function winCheck(e){
    if(e.currentTarget.innerHTML === author){
        e.currentTarget.style.color = "lightgreen";
        const victory = new Audio("resources/correct.mp3");
        victory.play(); 
    }else{
        e.currentTarget.style.color = "red";
        const lose = new Audio("resources/wrong.mp3");
        lose.play();   
    }
    
    // will remove event listeners after user selection to prevent further interactions
    // correct answer will be highlighted green alongside potential incorrect answer. redundant if user was correct 
    let removeListeners = document.querySelectorAll(".answer");
    removeListeners.forEach((ans) => {
        if(ans.innerHTML === author){
            ans.style.color = "lightgreen";
        }
        ans.removeEventListener("click", bind);
        ans.classList.remove("answerhover");
    });
}
// ###########################################################
// ###########################################################
// ###########################################################

