const cardsArray = ['🍎', '🍌', '🍇', '🍒', '🍋', '🍉', '🍍', '🥝'];
let cards = [...cardsArray, ...cardsArray]; 
const board = document.getElementById('game-board');
const refreshBtn = document.getElementById('refresh-btn');
const timerSpan = document.getElementById('timer');
const flipCounterSpan = document.getElementById('flip-counter');
const clickSound = new Audio('sounds/click.mp3');
const endSound = new Audio('sounds/end.mp3');
let flippedCards = [];
let lockBoard = false;
let matchedPairs = 0;
const totalPairs = cardsArray.length;
let timer;
let seconds = 0;
let flipCount = 0;
let hasGameStarted = false;

function shuffleCards() { 
  cards = cards.sort(() => 0.5 - Math.random());
}

function startTimer() {
  seconds = 0;
  timerSpan.textContent = `Time: 0s`;
  timer = setInterval(() => {
    seconds++;
    timerSpan.textContent = `Time: ${seconds}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function createBoard() {
  board.innerHTML = '';
  shuffleCards();
  matchedPairs = 0;
  flippedCards = [];
  lockBoard = false;
  flipCount = 0;
  hasGameStarted = false; // ✅ Reset flag
  flipCounterSpan.textContent = `Flips: 0`;

  cards.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.dataset.emoji = emoji;
    card.innerHTML = `
      <div class="front"></div>
      <div class="back">${emoji}</div>
    `;
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  refreshBtn.disabled = false;
}

function flipCard() {
  if (!hasGameStarted) {
    startTimer();         
    hasGameStarted = true;
  }

  if (lockBoard) return;
  if (this.classList.contains('flip')) return;

  this.classList.add('flip');
  flippedCards.push(this);

  clickSound.currentTime = 0;
  clickSound.play();

  flipCount++;
  flipCounterSpan.textContent = `Flips: ${flipCount}`;

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.dataset.emoji === card2.dataset.emoji;

  if (isMatch) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    matchedPairs++;

    if (matchedPairs === totalPairs) {
      stopTimer();

      endSound.currentTime = 0;
      endSound.play();

      setTimeout(() => {
        alert(`🎉 Congratulations! You finished in ${seconds} seconds with ${flipCount} flips.`);
      }, 300);
    }

    flippedCards = [];
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
      lockBoard = false;
      flippedCards = [];
    }, 1000);
  }
}

refreshBtn.addEventListener('click', () => {
  stopTimer();
  timerSpan.textContent = `Time: 0s`; // Fix: Reset the timer display
  createBoard();
});

createBoard();



