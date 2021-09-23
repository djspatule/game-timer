var turnLength = ""; //create a turnDuration variable
var turnDuration = ""; //create a turnDuration variable

var audio = new Audio('beep.mp3'); // create a sound variable to "beep"

function setTurnDuration() {
turnLength = window.prompt("Enter the turn duration in seconds: "); //prompt the user for the required turn duration
}

var numberOfPlayers = 0; // create a variable to track the number of players (and of timers)

var firstPlayerTimerDiv = document.getElementById('firstPlayerTimerDiv');

/*---------------------------------

		First PLAYER

-----------------------------------*/

//call the printTime function every second.
function startFirstPlayerTimer() {
	turnDuration = turnLength;
	firstPlayerTimerDiv.classList.remove('text-danger');
	//create a function that checks if ther still is time and rights the time left in the HMTL document (and the console)
	function printTime() {
		if (turnDuration > 0 && turnDuration <= 3) {
			audio.play();
		}
		else if (turnDuration <= 0) {
			firstPlayerTimerDiv.classList.add('text-danger');
			clearInterval(interval);
		}
		firstPlayerTimerDiv.innerHTML = turnDuration;
		turnDuration -= 1;
		console.log("turnDuration is :" + turnDuration);
		console.log("interval is: " + interval);
	}


	var interval = setInterval(printTime, 1000);
}


/*---------------------------------

		Second PLAYER

-----------------------------------*/

//call the printTime function every second.
function startSecondPlayerTimer() {
	turnDuration = turnLength;
	secondPlayerTimerDiv.classList.remove('text-danger');
	//create a function that checks if ther still is time and rights the time left in the HMTL document (and the console)
	function printTime() {
		if (turnDuration > 0 && turnDuration <= 3) {
			audio.play();
		}
		else if (turnDuration <= 0) {
			secondPlayerTimerDiv.classList.add('text-danger');
			clearInterval(interval);
		}
		secondPlayerTimerDiv.innerHTML = turnDuration;
		turnDuration -= 1;
		console.log("turnDuration is :" + turnDuration);
		console.log("interval is: " + interval);
	}


	var interval = setInterval(printTime, 1000);
}