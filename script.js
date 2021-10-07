//all object programming based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects


/*---------------------------------

		Variables declaration

-----------------------------------*/

var turnLength = 30; //create a turnDuration variable

var audio = new Audio('beep.mp3'); // create a sound variable to "beep"

var isMute = true;
var isDark = false;
var isSettingsCollapsed = true;
var isdropdownCollapsed = true;

var numberOfPlayers = 2; // create a variable to track the number of players (and of timers)

var gameStart = false;

var newPlayerNode = document.getElementById('newPlayerNode');
var dropDownForm = document.getElementById('dropDownForm');
var dropDownFormGroup = document.getElementById('dropDownFormGroup');


const players = [];

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

var settingsButton = document.getElementById("settingsButton");
settingsButton.addEventListener('click', collapse);

var playerSettingsButton = document.getElementById("playerSettingsButton");
playerSettingsButton.addEventListener('click', showDropDown);

var playersSettingsSubmissionButton = document.getElementById("playersSettingsSubmissionButton");
playersSettingsSubmissionButton.addEventListener('click', registerPlayersSettings);



/*------------------------------------------

		Initiate the app with 2 players

-------------------------------------------*/

setNumberOfPlayers();


/*------------------------------------------

		Helper functions 

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

function collapseSettings() {
		//collapse dropdows and toggles and reset their styles
		dropDownForm.classList.remove('show');
		settingsDiv.classList.remove('show');
		isSettingsCollapsed = true;
		settingsButton.classList.remove('btn-secondary');
		settingsButton.classList.add('btn-outline-secondary');
		isdropdownCollapsed = true;
		dropDownForm.classList.remove('show');
}

/*------------------------------------------

		Player definition	
		
-------------------------------------------*/

function newButton() {
	
	r = Math.floor(Math.random() * 100 + 100)
	g = Math.floor(Math.random() * 100 + 100)
	b = Math.floor(Math.random() * 100 + 100)
	//traduction en haxadecimal pour peupler directement la couleur du joueur par défaut avec la valeur aléatoire. 
	this.rgb = "#"+parseInt(r).toString(16)+parseInt(g).toString(16)+parseInt(b).toString(16);
	

/*------------------------------------------
TODO : find a way to avoid this dirty way of creating a large button ? ask Karine... 
with an event listener for the click on a div, it could be easier...and it works with following code...but i am not sure that it's something "usual"...ask Karine.
or with a "class" cf. answer to my question on stackexchange

TEST
var test = document.getElementById("test");
test.addEventListener('click', function() {
	test.style.backgroundColor = 'black';
});
-------------------------------------------*/

	return button = `<br>
		<button onclick="playerTimer(${this.playerNumber})" type="button" class="progressButton" style="background-color:${this.rgb}" id="player${this.playerNumber}Button">
			<div class="progressButton__progress">
				<span class="progressButton__text">
					<div class="big" id="playerNameDiv${this.playerNumber}">${this.playerName}</div>
					Total time played:
					<div id="totalPlayerTimeDiv${this.playerNumber}">
						00:00:00
					</div>
					<br>
					Time left:
					<div id="playerTimerDiv${this.playerNumber}" class="big">
						30 
					</div>
				</span>
			</div>
		</button>`;
}


function Player(playerNumber, timeout, sec) {
  //0 indexed !
  this.playerNumber = playerNumber;
  //NOT 0 indexed
  this.playerName = "Player " + (this.playerNumber+1);
  this.rgb = "";
  this.timeout = timeout;
  this.sec = sec;
  this.stopPlayerTime = true;
  this.playerHr = 0;
  this.playerMin = 0;
  this.playerSec = 0;
  this.playerNameFormGroup = document.createElement("div");
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
		collapseSettings();
	}
	
	//if the user is inputing a number of users inferior to the current number
	if (numberOfPlayers < players.length) {
		var playersToRemove = players.length - numberOfPlayers;
		for (var i = 0; i < (playersToRemove); i++) {
			//remove the last player's HTML div 
			newPlayerNode.removeChild(players[players.length-1].div);
			//remove its settings section
			dropDownFormGroup.removeChild(players[players.length-1].playerNameFormGroup)
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

		//Populate the settings dropdown menu
		players[i].playerNameFormGroup.innerHTML = `
			<div class="dropdown-divider"></div>
			<div class="less-big">${players[i].playerName}</div>
			<div class="form-group" id="playerNameFormGroup${players[i].playerNumber}">
				<label for="dropDownFormNameInput${players[i].playerNumber}">Name</label>
				<input type="text" class="form-control" maxlength="12" id="dropDownFormNameInput${players[i].playerNumber}" value="${players[i].playerName}">
				<label for="dropDownFormColorInput${players[i].playerNumber}">Color</label>
				<input type="color" value="${players[i].rgb}" class="form-control" id="dropDownFormColorInput${players[i].playerNumber}">
			</div><br>`;

		dropDownFormGroup.appendChild(players[i].playerNameFormGroup)

	}
}

/*---------------------------------
	
		Customize players

-----------------------------------*/

function registerPlayersSettings() {
	for (player of players) {
		player.playerName = document.getElementById("dropDownFormNameInput"+player.playerNumber).value;
		player.rgb = document.getElementById("dropDownFormColorInput"+player.playerNumber).value;
		document.getElementById("playerNameDiv"+player.playerNumber).innerHTML = player.playerName;
		document.getElementById("player"+player.playerNumber+"Button").style.backgroundColor = player.rgb
		collapseSettings();
	}
}

/*---------------------------------
	
		Miscellanous settings - dark mode, mute, etc.

-----------------------------------*/

//implement the mute button as a sort of toggle
function mute() {
	if (isMute == false){
		isMute = true;
		muteButton.classList.remove('btn-outline-secondary');
		muteButton.classList.add('btn-secondary');
	}
	else {
		isMute = false;
		audio.play();
		muteButton.classList.remove('btn-secondary');
		muteButton.classList.add('btn-outline-secondary');
	}	
}

// implement the dark mode button as a toggle
function dark() {
	if (isDark == false){
		isDark = true;
		darkButton.classList.remove('btn-outline-secondary');
		darkButton.classList.add('btn-secondary');
		document.body.style.backgroundColor = 'black';
	}
	else {
		isDark = false;
		darkButton.classList.remove('btn-secondary');
		darkButton.classList.add('btn-outline-secondary');
		document.body.style.backgroundColor = 'white';
	}	
}

//shows the settings div with all its buttons when clicking on the "gear" button
function collapse() {
	var settingsDiv = document.getElementById("settingsDiv");
	
	if (isSettingsCollapsed == true) {
		isSettingsCollapsed = false;
		settingsDiv.classList.add('show');
		settingsButton.classList.remove('btn-outline-secondary');
		settingsButton.classList.add('btn-secondary');
	}
	else {
		isSettingsCollapsed = true;
		settingsDiv.classList.remove('show');
		settingsButton.classList.add('btn-outline-secondary');
		settingsButton.classList.remove('btn-secondary');
	}
}

//shows the dropdown menu when clicking on the "player settings" button
function showDropDown() {

	if (isdropdownCollapsed == true) {
		isdropdownCollapsed = false;
		dropDownForm.classList.add('show');
	}
	else {
		isdropdownCollapsed = true;
		dropDownForm.classList.remove('show');
	}	
}

/*---------------------------------
	
	Player timer - object programming

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

	//update progress bar
	var playerButton = document.getElementById("player"+id+"Button");
	var progress = (1-(players[id].sec/parseInt(turnLength)))*100
	playerButton.querySelector(".progressButton__progress").style.height = `${progress}%`;
	
	//alert the user at 10 seconds to the end and in the last 3 seconds
	if (isMute == false && (players[id].sec == 10 || players[id].sec<= 3)) {
		audio.play();
		playerTimerDiv.classList.add('text-danger');
	}

	//could be deleted if not used...
	playerTimerDiv.innerHTML = players[id].sec;
	
	//start the actual counting function....by calling itself every second (recursive function)
	players[id].timeout = setTimeout(playerTurnDuration, 1000, id);

	//comment that function to get turns in the negative...
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
	collapseSettings();
	
	for (const player of players) {
		clearTimeout(player.timeout);
		document.getElementById("playerTimerDiv"+player.playerNumber).innerHTML = turnLength;
	}
}

/*---------------------------------

		TOTAL PLAYERS TIME

-----------------------------------*/


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
- créer un settings button "game settings" qui ouvre un dropdown avec 
  - un premier "checkbox" appelé "total player duration" qui 
      - dans les settings : 
      	- affiche un toggle bouton timer/stopwatch qui permet de changer le mode ascendant ou descendants sur le total time per player
      	- affiche un player duration button pour regler ce critère
      - sur le playerButton : affiche/masque le total play time par player et réduit la taille du playerButton à 100px (et vice versa)
  - un second checkbox appelé "turn duration"  qui affiche/masque la turn duration par player et réduit la taille du playerButton à 100px (et vice versa)
  	- dans les settings : 
      	- affiche un toggle bouton timer/stopwatch qui permet de changer le mode ascendant ou descendants sur le turn duration
      	- affiche le turn duration button pour regler ce critère (bouton qui existe déjà)
      - sur le playerButton : affiche/masque le total play time par player et réduit la taille du playerButton à 100px (et vice versa)

- créer une version française du site

- Add a "pause game" button in the settings

-----------------------------------*/


/*---------------------------------

		Backlog
- Custo : 
	- timer duration (per player....to accomodate a child or something)
	- bonus if timer not consumed

-----------------------------------*/
