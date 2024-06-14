// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount=0;
let equationsArray = [];
let playerGuessArray=[];
let bestScoreArray=[];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

let timer;
let timePlayed=0;
let baseTime=0;
let penaltyTime=0;
let finalTime=0;
let finalTimeDisplay='0.0';
let correctAnswers=0;

// Scroll
let valueY=0;

//Refresh splash page best score
function bestScoresToDOM(){
  bestScores.forEach((bestScore, index)=>{
    bestScore.innerText=`${bestScoreArray[index].bestScore}s`;
  })
}

//Get Best Score from local Storage
function getSavedBestScores(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray=JSON.parse(localStorage.getItem("bestScores"))
  }else{
    bestScoreArray=[
      {questions:10, bestScore:finalTimeDisplay},
      {questions:25, bestScore:finalTimeDisplay},
      {questions:50, bestScore:finalTimeDisplay},
      {questions:99, bestScore:finalTimeDisplay},
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

//functio updateBestScores
function updateBestScore(){
  bestScoreArray.forEach((score, index)=>{
    if(score.questions==questionAmount){
      const savedBestScore=Number(bestScoreArray[index].bestScore);
      if((savedBestScore>finalTime)||(savedBestScore==0)){

        bestScoreArray[index].bestScore=finalTimeDisplay;
      }
    }
  })
  bestScoresToDOM();
  localStorage.setItem("bestScores",JSON.stringify(bestScoreArray));
}

function clearAll(){
  
  gamePage.addEventListener('click',startTimer);
  correctAnswers=0;
  timePlayed=0;
  penaltyTime=0;
  finalTime=0;
  finalTimeDisplay='0.0s';
  valueY=0;
  questionAmount=0;
  equationsArray=[];
  equationObject={};
  playerGuessArray=[];
}

function showSplashPage(){
  clearAll();    
  scorePage.hidden=true;
  splashPage.hidden=false;
  playAgainBtn.hidden=true;
}

function showScorePage(){
  setTimeout(()=>{
    playAgainBtn.hidden=false;
  },1000);
  gamePage.hidden=true;
  scorePage.hidden=false;
}

function scoresToDOM(){
  finalTimeDisplay=finalTime.toFixed(1);
  baseTime=timePlayed.toFixed(1);
  penaltyTime=penaltyTime.toFixed(1);
  baseTimeEl.textContent=`Base Time:${baseTime}s`;
  penaltyTimeEl.textContent=`Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent=`${finalTimeDisplay}s`;
  updateBestScore();
  //Scroll to top, go to score page
  itemContainer.scrollTo({top:0, behavior:'instant'});
  showScorePage();
}

//function to checkTime if number of quetions=no of items in playerguess array
function checkTime(){
  // console.log(questionAmount, playerGuessArray.length)
  if(questionAmount==playerGuessArray.length){
    clearInterval(timer);
    for(let i=0;i<questionAmount;i++){
      if(equationsArray[i].evaluated==playerGuessArray[i]){
        correctAnswers++;
      }
    }
    penaltyTime=(questionAmount-correctAnswers)*0.5;
    finalTime=timePlayed+penaltyTime;
    // console.log("played Time", timePlayed);
    // console.log('pentalty time', penaltyTime);
    // console.log("finalTimeDisplay", finalTimeDisplay);
    scoresToDOM();
  }
  
}


//function to call for running evenry .1s
function addTime(){
  timePlayed+=0.1;
  checkTime();
}

//Start timer when game page is clicked
function startTimer(){
  //Reset Times
  timePlayed=0;
  penaltyTime=0;
  finalTime=0;
  timer=setInterval(addTime,100);
  gamePage.removeEventListener('click', startTimer);

}

//Scroll, store user selection
function select(guessedTrue){
  // console.log(playerGuessArray);
  valueY+=80;
  itemContainer.scroll(0, valueY);
  playerGuessArray.push(guessedTrue);
  // return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
  return;
}

//Function to get randomInteger
function getRndInteger(max) {
  const random=Math.floor(Math.random() * (max + 1));
  // console.log('Random', random);
  return random;
}




// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRndInteger(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount-correctEquations;
  // console.log(questionAmount, correctEquations, wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRndInteger(9);
    secondNumber = getRndInteger(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    // console.log(equation);
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRndInteger(9);
    secondNumber = getRndInteger(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRndInteger(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
 
  shuffle(equationsArray);
  
}

//Function add equationstoDOM
function addEquationsToDOM(){
  equationsArray.forEach((equation)=>{
    const item=document.createElement("div");
    item.classList.add("item");
    const h1=document.createElement("h1");
    h1.textContent=equation.value;
    item.appendChild(h1);
    itemContainer.appendChild(item);
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  addEquationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

//show the countdown 3, 2, 1 Go
function startCountdown(){
  let count=5;
  countdown.innerText=count;
  const countDownTimer=setInterval(()=>{    
    count--;
    if(count==0){
      countdown.textContent='Go!';
    }else if(count==-1){
      showGamePage();
      clearInterval(countDownTimer);
    }else{
      countdown.textContent=count;
    }
  },1000);
  // countdown.innerText="3";
  // setTimeout(()=>{
  //   countdown.innerText="2";
  //   setTimeout(()=>{
  //     countdown.innerText="1";
  //     setTimeout(()=>{
  //       countdown.innerText="GO!";
  //       setTimeout(()=>{
  //         countdownPage.hidden=true;
  //         gamePage.hidden=false;
  //       },1000);
  //     },1000);
  //   },1000);
  // },1000);
}

//Function to show countdown page
function showCountdown(){
  splashPage.hidden=true;
  countdownPage.hidden=false;
  populateGamePage();  
  startCountdown();  
  // setTimeout(showGamePage,4000);
  
}

//Function to show game page
function showGamePage(){
  countdownPage.hidden=true;
  gamePage.hidden=false;
}

//function to get Radio Value
function getRadioValue(){
  let radioValue;
  radioInputs.forEach((radioInput)=>{
    if(radioInput.checked){
      radioValue=radioInput.value;
    }
  })
  return Number(radioValue);
}

//function to select question amount
function selectQuestionAmount(e){
  e.preventDefault();
  questionAmount=getRadioValue();
  // console.log(typeof questionAmount);
  if(questionAmount){
    showCountdown();
  }
}



//Event listeners

startForm.addEventListener('click',()=>{
  radioContainers.forEach((radioEl)=>{
    //remove the selected class from each of them
    radioEl.classList.remove("selected-label");
    //Add it back if this is the radio element clicked by the user
    if(radioEl.children[1].checked){
      radioEl.classList.add("selected-label");
    }
  })
})

startForm.addEventListener("submit",selectQuestionAmount);
gamePage.addEventListener('click', startTimer);
playAgainBtn.addEventListener('click',showSplashPage);

//onload
getSavedBestScores(); 