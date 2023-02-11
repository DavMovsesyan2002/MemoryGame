const deck = document.querySelector('.deck'),
  everyCard = document.getElementsByClassName('card'),
  starNum = document.querySelector('.stars'),
  moveNum = document.querySelector('.moves');

let timeCounter = document.getElementById('time-counter'),
  s = 0, m = 0, h = 0;
move = 0,
  open = [], // array list for the cards that are turned (`.open`)
  match = [], // array list for the pairs of cards that have the same symbol (`.match`)
  everyStar = document.getElementsByClassName('fa-star'),
  b = "";

arrays = [
  "fa-diamond",
  "fa-diamond",
  "fa-paper-plane-o",
  "fa-paper-plane-o",
  "fa-anchor",
  "fa-anchor",
  "fa-bolt",
  "fa-bolt",
  "fa-cube",
  "fa-cube",
  "fa-leaf",
  "fa-leaf",
  "fa-bicycle",
  "fa-bicycle",
  "fa-bomb",
  "fa-bomb"
];

/*
Shuffle function from http://stackoverflow.com/a/2450976
Fisher-Yates Algoritm (Udacity's FEND version)
*/
function shuffle() {
  let currentIndex = arrays.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = arrays[currentIndex];
    arrays[currentIndex] = arrays[randomIndex];
    arrays[randomIndex] = temporaryValue;
  }
  return arrays;
}

// Creates a shuffled deck (`.deck`)
const generate = function () {
  let shuffledArrays = shuffle(arrays);
  let fragment = document.createDocumentFragment();
  arrays.forEach(function createCard(array) {
    let li = document.createElement('li');
    li.classList = "card";
    li.innerHTML = `<i class="fa ${array}"><i/>`;
    fragment.appendChild(li);
  });
  deck.appendChild(fragment);
}

// Logic for timer, located on top-right corner
let timer = function myTimer() {
  s++;
  if (s >= 60) {
    s = 0;
    m++;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }

  timeCounter.textContent = `${h > 9 ? h : "0" + h} : ${m > 9 ? m : "0" + m} : ${s > 9 ? s : "0" + s}`;
// set to run on 1sec intervals, each time the function iterates over itself, until the game is through
  setTimeout(myTimer, 1000);
}

// display the number of moves on the move counter (.moves)
const moveCounter = function () {
  move++;
  moveNum.innerHTML = move <= 1 ? move + " Move" : move + " Moves";
}

// If move >= 13, removes 1 star; >= 17, removes another; >= 21, another
const starCounter = function () {
  if (move === 14) {
    starNum.firstElementChild.outerHTML = "";
  }
  if (move === 19) {
    starNum.firstElementChild.outerHTML = "";
  }
  if (move === 24) {
    starNum.innerHTML = "<li><i><small>No star for you...</small></i></li>";
  }
}

let blinking = function () {
  if (move >= 14 && move < 19){
    b = starNum.classList.toggle('blink-1');
    b++;
    return b;
  }
}

let blinking2 = function () {
  if (move >= 19 && move < 24){
    starNum.classList.remove('blink-1');
    b = starNum.classList.toggle('blink-2');
    b++;
    return b;
  }
  if (move === 24){
    starNum.classList.remove('blink-3');
    b = starNum.classList.toggle('blink-3');
    b++;
    return b;
  }
}

// display victory message after the 16 cards are matched, with a wait of 800 milliseconds
const victory = function () {
  if (document.getElementsByClassName('match').length === 16) {
    let gameEnd = Date.now();
    //function totalGameTime () {
    let gameTime = gameEnd - gameStart;
    //totalGameTime();
    let gameTimeTemp = gameTime /1000;
    gameTimeTemp >= 60 ? totalTime = (gameTimeTemp / 60).toFixed(2) + " minutes" : totalTime = gameTimeTemp.toFixed(0) + " seconds";

    setTimeout(function() {
      window.alert("Congratulations! You took " + totalTime + " to finish the game! And Your rating was " + everyStar.length + (everyStar.length === 1 ? " star" : " stars") + "!\n\nPlay again?");
    }, 800);

    // if 16 cards are matching - which means the game is over - restarts game automatically, after waiting 2 seconds
    setTimeout(function() {
      restart();
    }, 2000);
  };
}

//Restart Button's function
const restart = function () {

  //erases previouslly generated deck's ul (`.deck`), star counter (`.stars`) and moves counter(`.moves`)
  s = 0;
  m = 0;
  h = 0;
  move = 0;
  deck.innerHTML = "";
  starNum.innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
  moveNum.innerHTML = "0 Moves";

  //erases previouslly generated array list for open cards (`.open`) and for matching card pairs (`.match`)
  open.splice(0, open.length);
  match.splice(0, match.length);
  starNum.classList.remove('blink-1', 'blink-2', 'blink-3');

  //generate new shuffled array and restarts game
  generate();
  game();
}

const game = function() {
  for (let i = 0; i < everyCard.length; i++) {
    everyCard.item(i).addEventListener('click', function () {

      // Prevents matching the same card upon double click: checks if the open array item of index `i`, to be added in this iteration, holds the same symbol as the one provided in the previous iteration (`i - 1`). If it doesn't, then the code proceds to check if a pair of clicked cards matches the same symbol.
      if (!open.includes(everyCard.item(i))) {

        // Reveals each card on click, adding them to the `open` array list
        open.splice(0, 0, everyCard.item(i));
        open[0].classList.add("open", "show");

        if (open.length === 2) {

          // updates move counters each time a pair of cards is turned
          moveCounter();
          starCounter();
          /*moveCounter();*/

          // checks if pair of cards have the same symbol and, if they do, adds them to the `match` array list
          if ((open[0].firstChild.outerHTML === open[1].firstChild.outerHTML)) {
            match = open.slice();
            match[0].classList.add("match");
            match[1].classList.add("match");
            open[0].classList.remove("open", "show");
            open[1].classList.remove("open", "show");
            match[0].classList.remove("open", "show");
            match[1].classList.remove("open", "show");
            open.splice(0, 2);

            // if 16 cards are matching its symbols, displays victory alert box
            victory();
          }

          /*
                  When a pair of cards is turned up, but their symbols are not the same, the cards are held up until the window is clicked again.
                  Also, if a single card is turned up at this point, it is turned down too, so the `game()` function iterates over and turns another card up, to see if it forms a pair of cards with the same symbol
          */
          window.addEventListener('click', function () {
            if (open.length > 2) {
              open[0].classList.remove("open", "show");
              open[1].classList.remove("open", "show");
              open[2].classList.remove("open", "show");
              open.splice(0, 3);
            }});
        }
      }
    });
  }
}

// stores the time the game started
let gameStart = Date.now();

// calls function to create deck of shuffled cards
generate();

// runs timer function after 1 second
setTimeout(timer, 1000);

// if 2 or 1 stars, blinks red, if 0, stays red
setInterval (blinking, 1900);

setInterval (blinking2, 600);

// starts the game's logic
game();

// makes the restart button work when clicked (`.restart`)
document.querySelector('.restart').addEventListener('click', restart);
