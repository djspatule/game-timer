/*---------------------------------

		Variables declaration

-----------------------------------*/

var turnLength = ""; //create a turnDuration variable
var turnDuration = ""; //create a turnDuration variable

var audio = new Audio('beep.mp3'); // create a sound variable to "beep"

var numberOfPlayers = 0; // create a variable to track the number of players (and of timers)

var firstPlayerTimerDiv = document.getElementById('firstPlayerTimerDiv');

var gameStart = false;

/*---------------------------------

		Turn duration setting

-----------------------------------*/
function setTurnDuration() {
turnLength = window.prompt("Enter the turn duration in seconds: "); //prompt the user for the required turn duration
}

/*---------------------------------

		First PLAYER

-----------------------------------*/

//call the printTime function every second.
function startFirstPlayerTimer() {
	
	//register if it is the first click to start total play time calculation
	if (gameStart == false) {
		gameStart = true;
		gameDuration();
	}
	//for each turn, base your turn duration on the latest duration inputed by the user
	turnDuration = turnLength;

	//initialize the font to black (as it has been turn to red at the end of the previous round/turn)
	firstPlayerTimerDiv.classList.remove('text-danger');

	//create a function that checks if ther still is time and rights the time left in the HMTL document (and the console)
	function printTime() {
		
		//alert the user in the last 3 seconds
		if (turnDuration > 0 && turnDuration <= 3) {
			audio.play();
			firstPlayerTimerDiv.classList.add('text-danger');
		}
		
		//Stop the timer at 0 seconds left
		else if (turnDuration <= 0) {
			clearInterval(interval);
		}
		firstPlayerTimerDiv.innerHTML = turnDuration;
		turnDuration -= 1;
		console.log("turnDuration is :" + turnDuration);
		console.log("interval is: " + interval);
	}

	//actually do the timing second by second
	var interval = setInterval(printTime, 1000);
}


/*---------------------------------

		Second PLAYER

-----------------------------------*/

//call the printTime function every second.
function startSecondPlayerTimer() {

	//register if it is the first click to start total play time calculation
	if (gameStart == false) {
		gameStart = true;
		gameDuration();
	}
	
	//for each turn, base your turn duration on the latest duration inputed by the user
	turnDuration = turnLength;

	//initialize the font to black (as it has been turn to red at the end of the previous round/turn)
	secondPlayerTimerDiv.classList.remove('text-danger');

	//create a function that checks if ther still is time and rights the time left in the HMTL document (and the console)
	function printTime() {
		
		//alert the user in the last 3 seconds
		if (turnDuration > 0 && turnDuration <= 3) {
			audio.play();
			secondPlayerTimerDiv.classList.add('text-danger');
		}

		//Stop the timer at 0 seconds left
		else if (turnDuration <= 0) {
			clearInterval(interval);
		}

		secondPlayerTimerDiv.innerHTML = turnDuration;
		turnDuration -= 1;
		console.log("turnDuration is :" + turnDuration);
		console.log("interval is: " + interval);
	}

	//actually do the timing second by second
	var interval = setInterval(printTime, 1000);
}


/*---------------------------------

		TOTAL PLAY TIME

-----------------------------------*/

var totalPlayTimeDisplayDiv = document.getElementById('totalPlayTimeDisplayDiv');
var hr = 0 ;
var sec = 0;
var min = 0;
var stopTime = true;

function gameDuration() {
    if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}

function timerCycle() {
	if (stoptime == false) {
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
  
function resetTotalPlayTimerButton (){
	if (stoptime == false) {
    stoptime = true;
    totalPlayTimeDisplayDiv.innerHTML = "00:00:00";
    stoptime = true;
    hr = 0;
    sec = 0;
    min = 0;
  }
}