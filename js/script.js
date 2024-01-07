//////////////////////////// ELEMENTS /////////////////////////////////
const btnNew = document.getElementById('newGame');
const btnFinish = document.getElementById('finGame');
const image = document.getElementById('image');
const errors = document.getElementById('madeErr');
const maxErr = document.getElementById('maxErr');
const wons = document.getElementById('wons');
const loses = document.getElementById('loses');
const btnEasy = document.getElementById('easy');
const btnMedium = document.getElementById('medium');
const btnHard = document.getElementById('hard');
const wordGuess = document.getElementById('wordToGuess');
const hintForWord = document.getElementById('hintForWord');
const buttons = document.querySelectorAll('.row button:not(.no-disp)');
const resultMsg1 = document.querySelector('#res1');
const resultMsg2 = document.querySelector('#res2');
const resultMsg3 = document.querySelector('#res3');

//////////////////////////// VARIABLES /////////////////////////////////
let wordChosen, gameStarted, won;
let difficulty, wordFinal, wordHidden, description, letter;
let countWons = 0, countLoses = 0, countErrs = 0;
let wordStarting = 'WORD', descriptionStarting = "It's a hint";

//////////////////////////// FUNCTIONS /////////////////////////////////
function init() {
  image.setAttribute('src', '../img/hangman-0.png');
  wordGuess.textContent = wordStarting;
  hintForWord.textContent = descriptionStarting;
  errors.textContent = countErrs;
  btnNew.setAttribute('disabled', '');
  wordChosen = false;
  gameStarted = false;
  won = false;
  wons.textContent = countWons;
  loses.textContent = countLoses;
}

function setDifficulty(selectedBtn, level) {
  if (wordChosen) {
    return;
  }

  difficulty = level;

  [btnEasy, btnMedium, btnHard].forEach(btn => {
    btn.classList.remove('clicked');
    btn.removeAttribute('disabled');
  });

  selectedBtn.classList.add('clicked');
  selectedBtn.setAttribute('disabled', '');

  btnNew.removeAttribute('disabled');
}

function chooseWordAndMeaning(difficulty) {
  let wordslist;

  if (difficulty === 0) {
    wordslist = data0;
  } else if (difficulty === 1) {
    wordslist = data1;
  } else if (difficulty === 2) {
    wordslist = data2;
  } else {
    console.error('Invalid difficulty level');
  }

  const randomWordObject = wordslist[Math.floor(Math.random() * wordslist.length)];
  wordFinal = randomWordObject.word.toUpperCase();
  description = randomWordObject.meaning;

  let word_secreted = '';
  for (let i = 0; i < wordFinal.length; i++) {
    word_secreted += '* ';
  }

  wordGuess.textContent = word_secreted;
  hintForWord.textContent = description;
  wordHidden = word_secreted;

  btnNew.setAttribute('disabled', '');
  enableLetterButtons();
}

function disableLetterButtons() {
  buttons.forEach(function(button) {
    button.setAttribute('disabled', '');
    button.classList.add('letter-green');
  });

  wordChosen = false;
  gameStarted = false;
}

function enableLetterButtons() {
  buttons.forEach(function(button) {
    button.removeAttribute('disabled');
    button.classList.remove('letter-green');
  });

  wordChosen = true;
  gameStarted = true;
}

function updateWordDisplay() {
  wordGuess.textContent = wordHidden;
}

function updateHangmanImage() {
  if (won) {
    image.setAttribute('src', '../img/victory.png');
  } else {
    image.setAttribute('src', '../img/hangman-' + countErrs + '.png');
  }
}

function showResultMessage(result) {
  if (result === 'won') {
    resultMsg1.classList.add('hidden');
    resultMsg2.classList.remove('hidden');
    resultMsg3.classList.add('hidden');
  } else if (result === 'lost') {
    resultMsg1.classList.add('hidden');
    resultMsg2.classList.add('hidden');
    resultMsg3.classList.remove('hidden');
  }
}

function disableAndStyleLetterButton(letter) {
  let button;

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent === letter) {
      button = buttons[i];
    }
  }

  if (button) {
    button.setAttribute('disabled', '');
    button.classList.add('letter-green');
  }
}

function checkLetter(letter) {
  let letterFound = false;
  disableAndStyleLetterButton(letter);

  for (let i = 0; i < wordFinal.length; i++) {
    if (wordFinal[i] === letter) {
      letterFound = true;
      wordHidden = wordHidden.substring(0, 2 * i) + letter + ' ' + wordHidden.substring(2 * i + 2);
    }
  }

  if (letterFound) {
    updateWordDisplay();

    if (wordFinal.replace(/ /g, '') === wordHidden.replace(/ /g, '')) {
      showResultMessage('won');
      won = true;
      countWons++;
      wons.textContent = countWons;
      disableLetterButtons();
      updateHangmanImage();
    }
  }


  if (!letterFound) {
    countErrs++;
    errors.textContent = countErrs;
    updateHangmanImage();

    if (countErrs >= maxErr.textContent) {
      showResultMessage('lost');
      countLoses++;
      loses.textContent = countLoses;
      disableLetterButtons();
      updateHangmanImage();
      wordGuess.textContent = wordFinal;
    }
  }
}

function finishGame() {
  buttons.forEach(button => {
    button.classList.remove('letter-green');
    button.removeAttribute('disabled');
  });

  if(gameStarted){
    countLoses++;
    loses.textContent = countLoses;
  }
  
  [btnEasy, btnMedium, btnHard].forEach(btn => {
    btn.classList.remove('clicked');
    btn.removeAttribute('disabled');
  });

  resultMsg1.classList.remove('hidden');
  resultMsg2.classList.add('hidden');
  resultMsg3.classList.add('hidden');

  countErrs = 0;
  init();
}

//////////////////////////// ON-CLICKS /////////////////////////////////
init();

btnEasy.addEventListener('click', function(){
  setDifficulty(btnEasy, 0);
});

btnMedium.addEventListener('click', function(){
  setDifficulty(btnMedium, 1);
});

btnHard.addEventListener('click', function(){
  setDifficulty(btnHard, 2);
});

btnNew.addEventListener('click', function(){
  chooseWordAndMeaning(difficulty);
});

btnFinish.addEventListener('click', function(){
  finishGame();
});

buttons.forEach(function(button) {
  button.addEventListener('click', function() {
    if (!gameStarted) {
      return;
    } else {
      checkLetter(button.textContent);
    }
  });
});


