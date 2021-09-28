











var timeoutFirstPlayer =0;
var secFirstPlayer = 30;
var timeoutSecondPlayer =0;
var secSecondPlayer = 30;
var timeoutThirdPlayer =0;
var secThirdPlayer = 30;
var timeoutFourthPlayer =0;
var secFourthPlayer = 30;

/*---------------------------------

		Turn duration setting

-----------------------------------*/

function setTurnDuration() {

	//prompt the user for the required turn duration
	turnLength = parseInt(window.prompt("Enter the turn duration in seconds: "));
	
	clearTimeout(timeoutFirstPlayer)
	clearTimeout(timeoutSecondPlayer)
	firstPlayerTimerDiv.innerHTML = turnLength;
	secondPlayerTimerDiv.innerHTML = turnLength;
}

/*---------------------------------

		Set number of players

-----------------------------------*/


function setNumberOfPlayers() {
	
	numberOfPlayers = parseInt(window.prompt("Enter the number of players: ")); //prompt the user for the number of players
	if (numberOfPlayers == 3 || numberOfPlayers == 4) {
		var thirdPlayerDiv = document.getElementById('thirdPlayerDiv');
		thirdPlayerDiv.innerHTML = '<button onclick="startThirdPlayerTimer()" class="btn btn-warning" id="startThirdPlayerTimerButton"><h3>Third player</h3> <br><br> Time left:<h2><div id="thirdPlayerTimerDiv"> 30 </div></h2></button>';
	}
	if (numberOfPlayers == 4) {
		var fourthPlayerDiv = document.getElementById('fourthPlayerDiv');
		fourthPlayerDiv.innerHTML = '<button onclick="startfourthPlayerTimer()" class="btn btn-danger" id="startFourthPlayerTimerButton"><h3>Fourth player</h3> <br><br> Time left:<h2><div id="fourthPlayerTimerDiv"> 30 </div></h2></button>';
	}

	if (numberOfPlayers >4) {
		alert("this app cannot deal with more than 4 players for now.");
	}
}



/*---------------------------------

		First PLAYER

-----------------------------------*/

//fetch the corresponding HTML div
var firstPlayerTimerDiv = document.getElementById('firstPlayerTimerDiv');

//Called by a click on the corresponding player's timer button
function startFirstPlayerTimer() {
	
	//register if it is the first click to start total play time calculation
	if (gameStart == false) {
		gameStart = true;
		gameDuration();
	}

	//initialize the font to black (as it has been turned to red at the end of the previous round/turn)
	firstPlayerTimerDiv.classList.remove('text-danger');

	//reset the other player's timer and writes it 
	clearTimeout(timeoutSecondPlayer);
	secondPlayerTimerDiv.innerHTML = turnLength;
	secondPlayerTimerDiv.classList.remove('text-danger');


	//for each turn, base your turn duration on the latest duration inputed by the user
	secFirstPlayer = parseInt(turnLength);
	clearTimeout(timeoutFirstPlayer);
	firstPlayerTurnDuration();
}

//create a function that checks if there still is time and writes the time left in the HMTL document
function firstPlayerTurnDuration() {

	//decrement the player's time 
	secFirstPlayer = secFirstPlayer - 1;

	//alert the user at 10 seconds to the end and in the last 3 seconds
		if (secFirstPlayer == 10 || secFirstPlayer<= 3) {
			audio.play();
			firstPlayerTimerDiv.classList.add('text-danger');
		}
	//write the player's remaining time	
	firstPlayerTimerDiv.innerHTML = secFirstPlayer;

	//start the actual counting function....by calling itself every second (recursive function)
	timeoutFirstPlayer = setTimeout("firstPlayerTurnDuration()", 1000);

	//halt the counting function if time is out. this is the halting condition required in any recursive function
	if (secFirstPlayer == 0) {
		clearTimeout(timeoutFirstPlayer);
		secFirstPlayer = parseInt(turnLength);
	}
}

/*---------------------------------

		Second PLAYER

-----------------------------------*/

//fetch the corresponding HTML div
var secondPlayerTimerDiv = document.getElementById('secondPlayerTimerDiv');

//Called by a click on the corresponding player's timer button
function startSecondPlayerTimer() {
	
	//register if it is the first click to start total play time calculation
	if (gameStart == false) {
		gameStart = true;
		gameDuration();
	}

	//initialize the font to black (as it has been turn to red at the end of the previous round/turn)
	secondPlayerTimerDiv.classList.remove('text-danger');

	//reset the other player's timer and writes it 
	clearTimeout(timeoutFirstPlayer);
	firstPlayerTimerDiv.innerHTML = turnLength;
	firstPlayerTimerDiv.classList.remove('text-danger');

	//for each turn, base your turn duration on the latest duration inputed by the user
	secSecondPlayer = parseInt(turnLength);
	clearTimeout(timeoutSecondPlayer);
	secondPlayerTurnDuration();
}

//create a function that checks if there still is time and writes the time left in the HMTL document
function secondPlayerTurnDuration() {

	//decrement the player's time 
	secSecondPlayer = secSecondPlayer - 1;

	
	//alert the user at 10 seconds to the end and in the last 3 seconds
	if (secSecondPlayer == 10 || secSecondPlayer<= 3) {
		audio.play();
		secondPlayerTimerDiv.classList.add('text-danger');
	}

	//write the player's remaining time	
	secondPlayerTimerDiv.innerHTML = secSecondPlayer;

	//start the actual counting function
	timeoutSecondPlayer = setTimeout("secondPlayerTurnDuration()", 1000);
	
	//halt the counting function if time is out
	if (secSecondPlayer == 0) {
		clearTimeout(timeoutSecondPlayer);
		secSecondPlayer = parseInt(turnLength);
	}
}



/*---------------------------------

		TOTAL PLAY TIME

-----------------------------------*/

var totalPlayTimeDisplayDiv = document.getElementById('totalPlayTimeDisplayDiv');
var hr = 0 ;
var sec = 0;
var min = 0;
var stopTime = true;

//reset all variables and timers.
function resetTimers() {
    clearTimeout(timeoutFirstPlayer);
    clearTimeout(timeoutSecondPlayer);
    firstPlayerTimerDiv.innerHTML = parseInt(turnLength);
    secondPlayerTimerDiv.innerHTML = parseInt(turnLength);
    firstPlayerTimerDiv.classList.remove('text-danger');
    secondPlayerTimerDiv.classList.remove('text-danger');

}

//is called on any of the player's button.
function gameDuration() {
    if (stopTime == true) {
        stopTime = false;
        timerCycle();
    }
}

function timerCycle() {
	if (stopTime == false) {
	    sec = parseInt(sec);
	    min = parseInt(min);
	    hr = parseInt(hr);

	    sec = sec + 1;

	    if (sec == 60) {
	      min = min + 1;
	      sec = 0;
	    }
	    if (min == 60) {
	      hr = hr + 1;
	      min = 0;
	      sec = 0;
	    }

	    // de manière à ajouter un 0 manuellement devant le chiffre des heures/minutes/secondes lorsqu'elles sont inférieurs à 10.
	    if (sec < 10 || sec == 0) {
	      sec = '0' + sec;
	    }
	    if (min < 10 || min == 0) {
	      min = '0' + min;
	    }
	    if (hr < 10 || hr == 0) {
	      hr = '0' + hr;
	    }

	    totalPlayTimeDisplayDiv.innerHTML = hr + ':' + min + ':' + sec;

	    setTimeout("timerCycle()", 1000);
	}
}


//called on click of the totalPlayTime button.
function resetTotalPlayTimerButton (){
	if (stopTime == false) {
    stopTime = true;
    gameStart = false;
    totalPlayTimeDisplayDiv.innerHTML = "00:00:00";
    hr = 0;
    sec = 0;
    min = 0;

    //reset all variables and timers.
    resetTimers();
  }
}

