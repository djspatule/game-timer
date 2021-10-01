//all object programming based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects


/*---------------------------------

		Variables declaration

-----------------------------------*/

var turnLength = 30; //create a turnDuration variable

var audio = new Audio('beep.mp3'); // create a sound variable to "beep"

var isMute = false;
var isDark = false;

var numberOfPlayers = 2; // create a variable to track the number of players (and of timers)

var gameStart = false;

var newPlayerNode = document.getElementById('newPlayerNode');

var players = [];

var totalPlayTimeDisplayDiv = document.getElementById('totalPlayTimeDisplayDiv');

var r = 0;
var g = 0;
var b = 0;

var gameHr = 0;
var gameSec = 0;
var gameMin = 0;

var stopTime = true;

var setNumberOfPlayersButton = document.getElementById("setNumberOfPlayersButton");
setNumberOfPlayersButton.addEventListener('click', setNumberOfPlayers);

var setTurnLengthButton = document.getElementById("setTurnLengthButton");
setTurnLengthButton.addEventListener('click', setTurnLength);

var totalPlayTimeButton = document.getElementById("totalPlayTimeButton");
totalPlayTimeButton.addEventListener('click', resetTotalPlayTimer);

var darkButton = document.getElementById("darkButton");
darkButton.addEventListener('click', dark);

var muteButton = document.getElementById("muteButton");
muteButton.addEventListener('click', mute);

/*------------------------------------------

		Initiate the app with 2 players

-------------------------------------------*/

setNumberOfPlayers();


/*------------------------------------------

		Helper function to reset timers

-------------------------------------------*/
//reset all variables and timers.
function resetTimers() {
    for (const player of players) {
		clearTimeout(player.timeout);
		player.sec = parseInt(turnLength);
		document.getElementById("playerTimerDiv"+player.playerNumber).innerHTML = turnLength;
		document.getElementById("playerTimerDiv"+player.playerNumber).classList.remove('text-danger');
	}
}

/*------------------------------------------

		Player definition	
		
-------------------------------------------*/

function newButton() {
	
	r = Math.floor(Math.random() * 100 + 100)
	g = Math.floor(Math.random() * 100 + 100)
	b = Math.floor(Math.random() * 100 + 100)
	this.rgb = "rgb(" + r + ","  + g + "," + b + ")";
	
	return button = `<button onclick="playerTimer(${this.playerNumber})" class="btn" style="background-color:${this.rgb}" id="player${this.playerNumber}Button"><h3>Player ${this.playerNumber+1} </h3> Total time played :<div id="totalPlayerTimeDiv${this.playerNumber}"></div>   <br><br> Time left:<h2><div id="playerTimerDiv${this.playerNumber}"> 30 </div></h2></button>`;
}


function Player(playerNumber, timeout, sec) {
  this.playerNumber = playerNumber;
  this.rgb
  this.timeout = timeout;
  this.sec = sec;
  this.stopPlayerTime = true;
  this.playerHr = 0;
  this.playerMin = 0;
  this.playerSec = 0;
  this.div = document.createElement("div");
  this.newButton = newButton;
}

/*---------------------------------

		Set number of players

-----------------------------------*/

	function setNumberOfPlayers() {
	
	//if the function was already called before, ask for a new number of players. Ohterwise, use 2 as default value for numberOfPlayers variable
	if (players.length != 0) {
		//prompt the user for the number of players
		numberOfPlayers = parseInt(window.prompt("Enter the number of players: "));
	}
	
	//if the user is inputing a number of users inferior to the current number
	if (numberOfPlayers < players.length) {
		var playersToRemove = players.length - numberOfPlayers;
		for (var i = 0; i < (playersToRemove); i++) {
			//remove the last player's HTML div 
			newPlayerNode.removeChild(players[players.length-1].div);
			//remove the last player in the array
			players.pop();	
		}
	}

	// create the appropriate number of players with all their properties
	for (var i = players.length; i < numberOfPlayers; i++) {
		//instantiate player objects
		players[i] = new Player(i,0,parseInt(turnLength));

		//Id their div with their player numer (0 indexed!!!)
		players[i].div.id = players[i].playerNumber;

		//populate "their div" with the various contents
		players[i].div.innerHTML = players[i].newButton();

		//add the div to the DOM
		newPlayerNode.appendChild(players[i].div);

		// tentative progress bar 
		//var progressBar = <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:40%">40%</div>
		//
	}
}

/*---------------------------------
	
		Miscellanous settings - dark mode, mute, etc.

-----------------------------------*/

//implement the mute button as a sort of toggle
function mute() {
	if (isMute == false){
		isMute = true;
		muteButton.style.backgroundColor = 'grey';
	}
	else {
		isMute = false;
		muteButton.style.backgroundColor = 'white';
	}	
}

// implement the dark mode button as a toggle
function dark() {
	if (isDark == false){
		isDark = true;
		darkButton.style.backgroundColor = 'grey';
		document.body.style.backgroundColor = 'black';
	}
	else {
		isDark = false;
		darkButton.style.backgroundColor = 'white';
		document.body.style.backgroundColor = 'white';
	}	
}

/*---------------------------------
	
		Player timer - object programming try

-----------------------------------*/

function playerTimer(id) {
	
	//register if it is the first click to start total play time calculation
	if (gameStart == false) {
		gameStart = true;
		gameDuration();
	}

	resetTimers();

	//players[id].sec = parseInt(turnLength);
	playerTurnDuration(id);
}

function playerTurnDuration(id) {
	
	//decrement player's turn time
	players[id].sec -= 1;
	//increment player's total time
	playerDuration(id);

	var playerTimerDiv = document.getElementById("playerTimerDiv"+id);
	
	//alert the user at 10 seconds to the end and in the last 3 seconds
	if (isMute == false && (players[id].sec == 10 || players[id].sec<= 3)) {
		audio.play();
		playerTimerDiv.classList.add('text-danger');
	}

	//could be deleted if not used...
	playerTimerDiv.innerHTML = players[id].sec;
	
	//start the actual counting function....by calling itself every second (recursive function)
	players[id].timeout = setTimeout(playerTurnDuration, 1000, id);

	//halt the counting function if time is out. this is the halting condition required in any recursive function
	if (players[id].sec == 0) {
		clearTimeout(players[id].timeout);
		players[id].sec = parseInt(turnLength);
	}
}

/*---------------------------------

		Turn duration setting

-----------------------------------*/
function setTurnLength() {

	//prompt the user for the required turn duration
	turnLength = parseInt(window.prompt("Enter the turn duration in seconds: "));
	
	for (const player of players) {
		clearTimeout(player.timeout);
		document.getElementById("playerTimerDiv"+player.playerNumber).innerHTML = turnLength;
	}
}

/*---------------------------------

		TOTAL PLAYERS TIME

-----------------------------------*/

//AAAAAHHHHHHHHHHH, completely redo and just add to the player timer the seconds that you take from it in the playerTurnDuration function ....

//recursive function in order to keep the timer going. Stoped by changing the value of stopPlayerTime
function playerDuration(id) {
    players[id].playerSec = parseInt(players[id].playerSec);
    players[id].playerMin = parseInt(players[id].playerMin);
    players[id].playerHr = parseInt(players[id].playerHr);

    players[id].playerSec += 1;

    if (players[id].playerSec == 60) {
      players[id].playerMin = players[id].playerMin + 1;
      players[id].playerSec = 0;
    }
    if (players[id].gameMin == 60) {
      players[id].playerHr = players[id].playerHr + 1;
      players[id].playerMin = 0;
      players[id].playerSec = 0;
    }

    // de manière à ajouter un 0 manuellement devant le chiffre des heures/minutes/secondes lorsqu'elles sont inférieurs à 10.
    if (players[id].playerSec < 10 || players[id].playerSec == 0) {
      players[id].playerSec = '0' + players[id].playerSec;
    }
    if (players[id].playerMin < 10 || players[id].playerMin == 0) {
      players[id].playerMin = '0' + players[id].playerMin;
    }
    if (players[id].playerHr < 10 || players[id].playerHr == 0) {
      players[id].playerHr = '0' + players[id].playerHr;
    }

    players[id].totalPlayerTimeDiv = document.getElementById("totalPlayerTimeDiv" + id);
    players[id].totalPlayerTimeDiv.innerHTML = players[id].playerHr + ':' + players[id].playerMin + ':' + players[id].playerSec;

}

/*---------------------------------

		TOTAL PLAY TIME

-----------------------------------*/

//is called on any of the player's button.
function gameDuration() {
    if (stopTime == true) {
        stopTime = false;
        timerCycle();
    }
}

//recursive function in order to keep the timer going. Stoped by changing the value of stopTime
function timerCycle() {
	if (stopTime == false) {
	    gameSec = parseInt(gameSec);
	    gameMin = parseInt(gameMin);
	    gameHr = parseInt(gameHr);

	    gameSec += 1;

	    if (gameSec == 60) {
	      gameMin = gameMin + 1;
	      gameSec = 0;
	    }
	    if (gameMin == 60) {
	      gameHr = gameHr + 1;
	      gameMin = 0;
	      gameSec = 0;
	    }

	    // de manière à ajouter un 0 manuellement devant le chiffre des heures/minutes/secondes lorsqu'elles sont inférieurs à 10.
	    if (gameSec < 10 || gameSec == 0) {
	      gameSec = '0' + gameSec;
	    }
	    if (gameMin < 10 || gameMin == 0) {
	      gameMin = '0' + gameMin;
	    }
	    if (gameHr < 10 || gameHr == 0) {
	      gameHr = '0' + gameHr;
	    }

	    totalPlayTimeDisplayDiv.innerHTML = gameHr + ':' + gameMin + ':' + gameSec;

	    setTimeout("timerCycle()", 1000);
	}
}

/*---------------------------------

		reset timers

-----------------------------------*/

//called on click of the totalPlayTime button.
function resetTotalPlayTimer (){
	if (stopTime == false) {
	    stopTime = true;
	    gameStart = false;
	    for (player of players) {
	    	player.stopPlayerTime = true;
	    }
	    totalPlayTimeDisplayDiv.innerHTML = "00:00:00";
	    gameHr = 0;
	    gameMin = 0;
	    gameSec = 0;
	    
	    //also resets players timers
	    for (player of players) {
	    	player.playerSec = 0;
	    	player.playerMin = 0;
	    	player.playerHr = 0;
	    }

	    //reset all variables and timers.
	    resetTimers();
  	}
}

/*---------------------------------

		ToDo

- créer VF du logiciel
- calculer le temps total par joueur
- set une limite de temps par joueur
- put currently playing player in bold ? 
- google analytics !
- add a progress bar that changes color in order to visualize the time passing by ? ideally slowly empty the button of its color...
- add to the player button his stat info on how long he has played total (since reset)...


-----------------------------------*/


/*---------------------------------

		Backlog
- dark mode to reduce battery usage on OLEDs during long games.
- Custo : 
	- timer color
	- name on the timer 
	- timer duration (per player....to accomodate a child or something)
	- bonus if timer not consumed
- add count up mode....or simply let timer go below 0
- offer a "reserve" option like in chess to add to your next timer each time you didn't use you round's time completely ? attention pour MTG à la diff entre interruption et round, etc.


-----------------------------------*/
