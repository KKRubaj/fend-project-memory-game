/*
 * Create a list that holds all of your cards
 */
const icons = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

let openCards = [];

// get the element with all cards
const deck = document.querySelector('.deck');
let shuffledCards;

let canGet = true; //I set the ability to click on the time of matching cards


// get the element with moves
const elMoves = document.querySelector('.moves');
let moveCounter = 0; // number of Moves

let cardPairs = 0; // number of matched cards

// get the element with timer
const timer = document.querySelector('.timer');

let intervalId;

// get the stars
const stars = document.querySelectorAll('.stars li');
let visibleStars = stars.length;

// get the restart icon that user can play again
const restart = document.querySelector('.restart');

// Get the modal
const modal = document.getElementById('myModal');

// Get the button that user can play again
const modalBtn = document.getElementById("modalBtn");

// Get the <span> element that closes the modal
const modalSpan = document.getElementsByClassName("close")[0];


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// displaying a mixed list of cards on the page
function startGame() {
    // clearing variables
    canGet = true;
    openCards = [];
    moveCounter = 0;
    cardPairs = 0;
    second = 0;
    minute = 0;
    hour = 0;
    // clearing previous cards
    deck.innerHTML = '';
    // claering spaces for dynamic variables
    elMoves.textContent = 0;
    timer.textContent = minute+' mins ' +second+' secs';
    // all stars are visible
    for ( let i = 0; i < stars.length; i++) {
        stars[i].style.visibility = "visible";
    }

    // create a temporary container, fill it with shuffled cards
    const fragment = document.createDocumentFragment();
    shuffledCards = shuffle(icons);

    for( let i = 0; i < shuffledCards.length; i++){
        const newCard = document.createElement('li');
        newCard.className = 'card';
        newCard.dataset.title = shuffledCards[i];
        newCard.dataset.index = i;
        newCard.innerHTML = '<i class="fa '+ shuffledCards[i]+'"></i>';

        fragment.appendChild(newCard);
    }
    deck.appendChild(fragment);
    clearInterval(intervalId);
  }


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

function clickCard(e) {
    displaySymbol(e);
}

// displaying and matching cards
function displaySymbol(e) {

    if (canGet) {
        //check if one card is flipped or if the index is not the same as the other one
        if (!openCards[0] || (openCards[0].dataset.index !== e.target.dataset.index)
            && !e.target.classList.contains('open')) {
                e.target.classList.add('open', 'show');
                openCards.push(e.target);
        }
    }
    // check if the two discovered cards have the same data-title attribute and if the two cards match
    if (openCards.length === 2) {
        canGet = false; // user doen't have the ability to click on the time of matching cards
        countMoves();

        if (openCards[0].dataset.title === openCards[1].dataset.title) {
            setTimeout(flippOver(), 5000); // if the condition has been met, the cards remain flipped over
        } else {
            flippFaceDown(); //the cards do not match, both cards are flipped face down
        }
    }
    // remove the possibility of clicking again on the card already discovered
    if (e.target.nodeName === 'LI' && e.target.classList.contains('show')) {
        e.target.removeEventListener('click', clickCard);
    }
}

// count player moves and set the star display condition
function countMoves() {
    moveCounter++;
    elMoves.textContent = moveCounter;

    if (moveCounter <= 1) {
        startTimer();
    }

    if (moveCounter > 15 && moveCounter < 22) {
        stars[2].style.visibility = "hidden";
        visibleStars = 2;
    } else if (moveCounter >= 22) {
        stars[1].style.visibility = "hidden";
        visibleStars = 1;
    }
}
// set the timer
function startTimer() {
    let second = 0;
    let minute = 0;
    let hour = 0;

    intervalId = setInterval(function(){
        second++;
        if (second === 60) {
            minute++;
            second = 0;
        }
        if (minute === 60) {
            hour++;
            minute = 0;
        }
        timer.textContent = minute+' mins ' +second+' secs';
    }, 1000)
}

//the cards match, both cards stay flipped over
function flippOver(e) {
    openCards[0].classList.remove('open', 'show');
    openCards[1].classList.remove('open', 'show');
    openCards[0].classList.add('match');
    openCards[1].classList.add('match');

    canGet = true;
    openCards = [];

    cardPairs++;
    gameOver();
}

//the cards do not match, both cards are flipped face down
function flippFaceDown(e) {
    setTimeout(function() {
        openCards[0].classList.remove('open', 'show');
        openCards[1].classList.remove('open', 'show');

        openCards = [];
        canGet = true;
    }, 800)
}

//the game ends once all cards have been correctly matched
function gameOver() {
    setTimeout(function() {
        if (cardPairs >= (icons.length / 2)) {
            clearInterval(intervalId);

            openModal();
        }
    }, 1000)
}

//if all cards have matched, display a message with the final score
function openModal() {
    modal.style.display = "block";

    document.querySelector('.modal-moves').textContent = elMoves.textContent;

    document.querySelector('.modal-stars').textContent = visibleStars;

    document.querySelector('.modal-time').textContent = timer.textContent;

    // When the user clicks on <span> (x), close the modal
    modalSpan.addEventListener('click', function() {
        modal.style.display = "none";
    })

    // When the user clicks on button (Play again), close the modal and restart game
    modalBtn.addEventListener('click', function() {
        modal.style.display = "none";
        startGame();
    })

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            startGame();
        }
    })
}

// set up the event listener for a card's container with Delegation
deck.addEventListener('click', clickCard);

// restart the game when user click the restart icon
restart.addEventListener('click', function() {
    startGame();
})

// game start when DOM Content is loaded
document.addEventListener('DOMContentLoaded', function() {
    startGame();
})
