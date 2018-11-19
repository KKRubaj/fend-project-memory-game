/*
 * Create a list that holds all of your cards
 */
const icons = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

let openCards = [];
let matchedCards = [];

// get the element with all cards
const deck = document.querySelector('.deck');
let shuffledCards;

let canGet = true; //I set the ability to click on the time of matching cards


// get the element with moves
const elMoves = document.querySelector('.moves');
let moveCounter = 0; // number of Moves

// get the element with timer
const timer = document.querySelector('.timer');
let second = 0;
let minute = 0;
let hour = 0;
let clickedCard = 0;

let intervalId;

// get the stars
const stars = document.querySelectorAll('.stars li');
let visibleStars;

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
let shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

// displaying a mixed list of cards on the page
let startGame = () => {
    // clearing variables
    canGet = true;
    openCards = [];
    matchedCards = [];
    moveCounter = 0;
    second = 0;
    minute = 0;
    hour = 0;
    clickedCard = 0;

    // clearing previous cards
    deck.innerHTML = '';
    // claering spaces for dynamic variables
    elMoves.textContent = 0;
    timer.textContent = minute+' mins ' +second+' secs';
    visibleStars = stars.length;
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
};


let clickCard = (e) => {
    clickedCard++;
    if ( clickedCard === 1) {
        startTimer();
    }
    displaySymbol(e);
};

// displaying and matching cards
let displaySymbol = (e) => {

    if (canGet) {
        //check if one card is flipped or if the index is not the same as the other one
        if (!openCards[0] || (openCards[0].dataset.index !== e.target.dataset.index) &&
           (!openCards[0].classList.contains('open') || !e.target.classList.contains('open')) &&
           (!openCards[0].classList.contains('match') || !e.target.classList.contains('match'))) {
            if ( e.target.nodeName === 'LI') {
                e.target.classList.add('open', 'show');
                openCards.push(e.target);
            }
        }
    }
    // check if the two discovered cards have the same data-title attribute and if the two cards match
    if (openCards.length === 2 && (e.target === openCards[1])) {
        canGet = false; // user doen't have the ability to click on the time of matching cards

        if (openCards[0].dataset.title === openCards[1].dataset.title) {
            setTimeout(flippOver(), 5000); // if the condition has been met, the cards remain flipped over
        } else {
            flippFaceDown(); //the cards do not match, both cards are flipped face down
        }


    }
    // remove the possibility of clicking again on the card already discovered
    if (e.target.nodeName === 'LI' && e.target.classList.contains('match')) {
        e.target.removeEventListener('click', clickCard);
    }
};

// count player moves and set the star display condition
let countMoves = () => {
    moveCounter++;
    elMoves.textContent = moveCounter;

    if (moveCounter >= 16 && moveCounter < 23) {
        stars[2].style.visibility = "hidden";
        visibleStars = 2;
    } else if (moveCounter >= 23) {
        stars[1].style.visibility = "hidden";
        visibleStars = 1;
    }
};

// set the timer
let startTimer = () => {

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
    }, 1000);

};

//the cards match, both cards stay flipped over
let flippOver = (e) => {

    for (let i = 0; i < 2; i++) {
        openCards[i].classList.remove('open', 'show');
        openCards[i].classList.add('match');

        if ( matchedCards.indexOf(openCards[i]) === -1) {
            matchedCards.push(openCards[i]);
        }
    }

    countMoves();
    canGet = true;
    openCards = [];

    gameOver();
};

//the cards do not match, both cards are flipped face down
let flippFaceDown = (e) => {
    setTimeout(function() {
        for ( let i = 0; i < 2; i++) {
            if ( openCards[i].classList.contains('open')) {
                openCards[i].classList.remove('open', 'show');
            }
        }

        countMoves();

        openCards = [];
        canGet = true;
    }, 800);
};

//the game ends once all cards have been correctly matched
let gameOver = () => {
    setTimeout(function() {
        if (matchedCards.length === icons.length) {
            clearInterval(intervalId);

            openModal();
        }
    }, 1000);
};

//if all cards have matched, display a message with the final score
let openModal = () => {
    modal.style.display = "block";

    document.querySelector('.modal-moves').textContent = elMoves.textContent;

    document.querySelector('.modal-stars').textContent = visibleStars;

    document.querySelector('.modal-time').textContent = timer.textContent;

    // When the user clicks on <span> (x), close the modal
    modalSpan.addEventListener('click', function() {
        modal.style.display = "none";
        deck.removeEventListener('click', clickCard);
    });

    // When the user clicks on button (Play again), close the modal and restart game
    modalBtn.addEventListener('click', function() {
        modal.style.display = "none";
        startGame();
    });

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            startGame();
        }
    });
};

// set up the event listener for a card's container with Delegation
deck.addEventListener('click', clickCard);

// restart the game when user click the restart icon
restart.addEventListener('click', function() {
    startGame();
    deck.addEventListener('click', clickCard);
});

// game start when DOM Content is loaded
document.addEventListener('DOMContentLoaded', function() {
    startGame();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./js/sw.js')
    .then(() => {
      console.log('serviceWorker registered')
    })
    .catch((err) => {
      console.log(`There was an error with the serviceWorker: ${err}`);

    });
  });
}
