//all object programming based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects


/*---------------------------------

		Variables declaration

-----------------------------------*/

//create a turnDuration variable
var turnLength = 30;

// create a sound variable to "beep"
var audio = new Audio('beep.mp3');

// create a variable to track the number of players (and of timers)
var numberOfPlayers = 2;

//create boolean variable to record whether we have started a new game (new or reseted) or not 
var isGameStarted = false;

//create boolean variables to register the state of buttons (pressed or not) and dropdowns (collapsed or not) 
var isMute = true;
var isDark = false;
var isSettingsCollapsed = true;
var isdropdownCollapsed = true;

//Create a variable containing the DOM element where players will be added
var newPlayerNode = document.getElementById('newPlayerNode');
//create a variable containing the dropdown div where all player's customization dropdown settings form will be implemented
var dropDownForm = document.getElementById('dropDownForm');
//create a variable containing the dropdown group div where each player's customization dropdownGroup in the overall settings dropdown form will be implemented
var dropDownFormGroup = document.getElementById('dropDownFormGroup');

//create the players array in which all players objects will be stored
const players = [];

//create overall player button's color variables
var r = 0;
var g = 0;
var b = 0;

//create overall game timer variables
var gameHr = 0;
var gameSec = 0;
var gameMin = 0;
var isTimeStopped = true;
var gameStart = Date.now();
var turnStart = Date.now();
var isNewTurn = true;
var isGamePaused = false;

//create a variable to store the totalPlayTimeDisplayDiv from the DOM so that it can be accessed and modified easily after
var totalPlayTimeDisplayDiv = document.getElementById('totalPlayTimeDisplayDiv');

//Get all button elements from the DOM and set corresponding even listeners to be able to start certain functions later on click.

var darkButton = document.getElementById('darkButton');
//FYI, you don't put dark() with the () because you don't want to call the function right here right now but only when the event listener detects the event.
darkButton.addEventListener('click', dark);

var muteButton = document.getElementById('muteButton');
muteButton.addEventListener('click', mute);

var settingsButton = document.getElementById('settingsButton');
settingsButton.addEventListener('click', collapse);

var pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pause);

document.querySelector('#setNumberOfPlayersButton').onclick = setNumberOfPlayers;

document.querySelector('#setTurnLengthButton').onclick = setTurnLength;

document.querySelector('#totalPlayTimeButton').onclick = resetTotalPlayTimer;

document.querySelector('#playerSettingsButton').onclick = showDropDown;

document.querySelector('#playersSettingsSubmissionButton').onclick = registerPlayersSettings;


/*------------------------------------------

		Initiate the app with 2 players

-------------------------------------------*/

//TODO : see if waiting for the DOM to be loaded fully helps with the reimplementation of the player object
document.addEventListener('DOMContentLoaded', setNumberOfPlayers);

/*------------------------------------------

		Helper functions 

-------------------------------------------*/
//reset all variables and timers.
function resetTimers()
{
	for (const player of players)
	{
		clearTimeout(player.timeout);
		player.sec = turnLength;
		//register the turn's start time
		turnStart = Date.now();
		document.getElementById('playerTimerDiv' + player.playerNumber).innerHTML = turnLength;
		document.getElementById('playerTimerDiv' + player.playerNumber).classList.remove('text-danger');
		var playerButton = document.getElementById('player' + player.playerNumber + 'Button');
		playerButton.querySelector('.progressButton__progress').style.height = "0%";
		isNewTurn = true;
	}
}

//collapse dropdows and toggles and reset their styles
function collapseSettings()
{
	dropDownForm.classList.remove('show');
	settingsDiv.classList.remove('show');
	isSettingsCollapsed = true;
	settingsButton.classList.remove('btn-secondary');
	settingsButton.classList.add('btn-outline-secondary');
	isdropdownCollapsed = true;
	dropDownForm.classList.remove('show');
}

// de manière à ajouter un 0 manuellement devant le chiffre des heures/minutes/secondes lorsqu'elles sont inférieurs à 10.
function addZero(i)
{
	if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
	return i;
}

//randomly generate a color with rgb values >100 for the player button without it being too light (to nicely see the white font color in secondary buttons)
function randomRGB()
{
	r = Math.floor(Math.random() * 100 + 100)
	g = Math.floor(Math.random() * 100 + 100)
	b = Math.floor(Math.random() * 100 + 100)

	//traduction en hexadecimal pour peupler directement la couleur du joueur par défaut avec la valeur aléatoire.
	return rgb = '#' + parseInt(r).toString(16) + parseInt(g).toString(16) + parseInt(b).toString(16);
}
/*------------------------------------------

		Player definition	
		
-------------------------------------------*/
class Player
{
	constructor(_playerNumber, _sec)
	{
		this.playerNumber = _playerNumber;
		//NOT 0 indexed
		this.playerName = 'Player ' + (this.playerNumber + 1);
		this.rgb = randomRGB();
		this.timeout = 0;
		this.sec = _sec;
		this.playerHr = 0;
		this.playerMin = 0;
		this.playerSec = 0;
		this.totalPlayerSec = 0;
		this.delta = 0;
		this.playerNameFormGroup = document.createElement('div');
		this.div = document.createElement('div');
	}
	//TODO : use a getter or a normal class method ? (by just deleting word getter and adding paranthesis where the function is called newButton()) ?
	//Getters and setters are used to define methods on a class which are then used as if they are properties.
	get newButton()
	{

		/*------------------------------------------
		
		TODO : 
		- Find a way to avoid this way of creating a large button ? is is unusual or "dirty" to create large HTML sections as such in js  ?  
		- simplify the call to new button ? Integrate it as a property instead of as a method ? 
	
		-------------------------------------------*/

		//define and returns the button's HTML with the RGB color as well as many elements from the player (number, name, etc.) in order for things to be easiliy identifiable per player in the DOM
		//TODO : find a way to put this button in a this.button player property without having to use 'return' ?
		var button = {};
		return button = `<br>
		<button type="button" class="progressButton" style="background-color:${this.rgb}" id="player${this.playerNumber}Button">
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
}

/*---------------------------------

		Set number of players

-----------------------------------*/

function setNumberOfPlayers()
{
	//if the function was already called before, ask for a new number of players. Otherwise, use the default value for numberOfPlayers variable
	if (players.length != 0)
	{
		//prompt the user for the number of players
		numberOfPlayers = parseInt(window.prompt('Enter the number of players: '));
		//collapse the settings for faster UX
		collapseSettings();
	}

	//if the user is inputing a number of users inferior to the current number
	if (numberOfPlayers < players.length)
	{
		var playersToRemove = players.length - numberOfPlayers;
		for (var i = 0; i < playersToRemove; i++)
		{
			//remove the last player's HTML div 
			newPlayerNode.removeChild(players[players.length - 1].div);
			//remove its settings section
			dropDownFormGroup.removeChild(players[players.length - 1].playerNameFormGroup)
			//remove the last player in the array
			players.pop();
		}
	}

	// create the appropriate number of players with all their properties. 
	for (let i = players.length; i < numberOfPlayers; i++)
	{
		//instantiate player objects. TODO : using "new()" is supposedly not good...replace ? use classes and the constructor function ? 
		players[i] = new Player(i, turnLength);

		//Id their div with their player numer (0 indexed!!!)
		players[i].div.id = players[i].playerNumber;

		//populate "their div" with the various contents
		players[i].div.innerHTML = players[i].newButton;

		//add the div to the DOM
		newPlayerNode.appendChild(players[i].div);

		//populate their totalPlayerTimeDiv (which can thus easiliy be accessed later...in particular by the reset function)
		players[i].totalPlayerTimeDiv = document.getElementById('totalPlayerTimeDiv' + i);

		//create the settings dropdown group for that specific player
		players[i].playerNameFormGroup.innerHTML = `
			<div class="dropdown-divider"></div>
			<div class="less-big">${players[i].playerName}</div>
			<div class="form-group" id="playerNameFormGroup${players[i].playerNumber}">
				<label for="dropDownFormNameInput${players[i].playerNumber}">Name</label>
				<input type="text" class="form-control" maxlength="12" id="dropDownFormNameInput${players[i].playerNumber}" value="${players[i].playerName}">
				<label for="dropDownFormColorInput${players[i].playerNumber}">Color</label>
				<input type="color" value="${players[i].rgb}" class="form-control" id="dropDownFormColorInput${players[i].playerNumber}">
			</div><br>`;

		//Populate the settings dropdown menu
		dropDownFormGroup.appendChild(players[i].playerNameFormGroup);

		//use let to define i in this "for loop" because with var, it wouldn't work as a new i variable wouldn't be created at each iteration of the loop 
		//and the final version of i (2 for instance) only would be passed in playerTimer when a button is clicked 
		//see strict js execution in loops and variable hoisting for more details
		//Carfeul, this is only true and OK since ES6. So not compatible with old browsers.
		//Closure used on playertimer to not have to store i, id and players[id] later in dowstream functions in different variables declared inside each loop with "let" .
		document.querySelector('#player' + i + 'Button').onclick = function () { playerTimer(i); };
	}
}

/*---------------------------------
	
		Customize players

-----------------------------------*/

function registerPlayersSettings()
{
	for (const player of players)
	{
		//put the elements chosen by the user for each player in the respective player property before updating the DOM (and the player button in particular) withthe value of such properties
		player.playerName = document.getElementById('dropDownFormNameInput' + player.playerNumber).value;
		player.rgb = document.getElementById('dropDownFormColorInput' + player.playerNumber).value;
		document.getElementById('playerNameDiv' + player.playerNumber).innerHTML = player.playerName;
		document.getElementById('player' + player.playerNumber + 'Button').style.backgroundColor = player.rgb;
		//collapse the dropdown for faster UX.
		collapseSettings();
	}
}

/*---------------------------------
	
		UI settings - dark mode, mute, etc.

-----------------------------------*/
//helper function that toggle a button's between secondary (dark) and outline-secondary (light) 
function toggle(button)
{
	if (button.classList.contains('btn-secondary'))
	{
		button.classList.remove('btn-secondary');
		button.classList.add('btn-outline-secondary');
	}
	else
	{
		button.classList.remove('btn-outline-secondary');
		button.classList.add('btn-secondary');
	}
}

//implement the mute button as a toggle
function mute()
{
	if (isMute == false)
	{
		isMute = true;
		toggle(muteButton);
	}
	else
	{
		isMute = false;
		audio.play();
		toggle(muteButton);
	}
}

// implement the dark mode button as a toggle
function dark()
{
	if (isDark == false)
	{
		isDark = true;
		toggle(darkButton);
		document.body.style.backgroundColor = 'black';
	}
	else
	{
		isDark = false;
		toggle(darkButton);
		document.body.style.backgroundColor = 'white';
	}
}

//implement the pause button as a toggle
function pause()
{
	if (isGamePaused == false)
	{
		isGamePaused = true;
		toggle(pauseButton);
	}
	else
	{
		isGamePaused = false;
		toggle(pauseButton);
	}
}

//shows the settings div with all its buttons when clicking on the "gear" button
function collapse()
{
	var settingsDiv = document.getElementById('settingsDiv');

	if (isSettingsCollapsed == true)
	{
		isSettingsCollapsed = false;
		settingsDiv.classList.add('show');
		toggle(settingsButton);
	}
	else
	{
		isSettingsCollapsed = true;
		settingsDiv.classList.remove('show');
		toggle(settingsButton);
	}
}

//shows the dropdown menu when clicking on the "player settings" button
function showDropDown()
{

	if (isdropdownCollapsed == true)
	{
		isdropdownCollapsed = false;
		dropDownForm.classList.add('show');
	}
	else
	{
		isdropdownCollapsed = true;
		dropDownForm.classList.remove('show');
	}
}

/*---------------------------------
	
	Player timer - object programming

-----------------------------------*/

//this is the function directly called by each player's button.	
function playerTimer(id)
{
	//register if it is the first click to start total play time calculation
	if (isGameStarted == false || isGamePaused == true)
	{
		isGameStarted = true;
		isGamePaused = false;
		gameDuration();
	}

	resetTimers();

	playerTurnDuration(id);
}

function playerTurnDuration(id)
{

	var delta = (Date.now() - turnStart) / 1000;
	//decrement player's turn time
	players[id].sec = turnLength - Math.floor(delta);

	//increment player's total time
	playerDuration(id);


	//update progress bar
	var playerButton = document.getElementById('player' + id + 'Button');
	var progress = (1 - (players[id].sec / turnLength)) * 100
	playerButton.querySelector('.progressButton__progress').style.height = `${progress}%`;

	//fetch the playerTimerDiv to change its class 
	var playerTimerDiv = document.getElementById('playerTimerDiv' + id);

	//alert the user at 10 seconds to the end and in the last 3 seconds
	if (isMute == false && (players[id].sec == 10 || players[id].sec <= 3))
	{
		audio.play();
		playerTimerDiv.classList.add('text-danger');
	}

	//updates the countdown's value
	playerTimerDiv.innerHTML = players[id].sec;

	//start the actual counting function....by calling itself every second (recursive function)
	players[id].timeout = setTimeout(playerTurnDuration, 300, id);

	//TODO : comment that function to get turns in the negative...
	//halt the counting function if time is out. this is the halting condition required in any recursive function
	if (players[id].sec <= 0)
	{
		clearTimeout(players[id].timeout);
		players[id].sec = turnLength;
	}
}

/*---------------------------------

		Turn duration setting

-----------------------------------*/
function setTurnLength()
{

	//prompt the user for the required turn duration
	turnLength = parseInt(window.prompt('Enter the turn duration in seconds: '));
	collapseSettings();

	for (const player of players)
	{
		clearTimeout(player.timeout);
		document.getElementById('playerTimerDiv' + player.playerNumber).innerHTML = turnLength;
	}
}

/*---------------------------------

		TOTAL PLAYERS TIME

-----------------------------------*/

//recursive function in order to keep the timer going. Stoped by changing the value of stopPlayerTime
//TODO : Simplify by using players[id].sec (incremented in the previous function and passed to this one) some way instead of having to define a player.delta, player.playerSec, etc. 
function playerDuration(id)
{
	if (isNewTurn == true)
	{
		isNewTurn = false;
		players[id].totalPlayerSec = parseInt(players[id].delta)
	}

	players[id].delta = ((Date.now() - turnStart) / 1000) + players[id].totalPlayerSec;

	players[id].playerSec = addZero(Math.floor(players[id].delta % 60));
	players[id].playerMin = addZero(Math.floor((players[id].delta / 60) % 3600));
	players[id].playerHr = addZero(Math.floor(players[id].delta / 3600));

	players[id].totalPlayerTimeDiv.innerHTML = players[id].playerHr + ':' + players[id].playerMin + ':' + players[id].playerSec;
}

/*---------------------------------

		TOTAL PLAY TIME

-----------------------------------*/

//is called on any of the player's button IF and only IF the game was not started yet or isn't paused.
function gameDuration()
{
	if (isTimeStopped == true || isGamePaused == true)
	{
		isTimeStopped = false;
		isGamePaused = false;
		gameStart = Date.now();
		timerCycle();
	}
}

//recursive function in order to keep the timer going. Stoped by changing the value of isTimeStopped
function timerCycle()
{
	if (isTimeStopped == false && isGamePaused == false)
	{
		var delta = (Date.now() - gameStart) / 1000;
		//TODO : define these variables or directly write into totalPlayTimeDisplayDiv based on delta ? (addZero(Math.floor(delta % 60));, etc.) 
		gameSec = addZero(Math.floor(delta % 60));
		gameMin = addZero(Math.floor((delta / 60) % 3600));
		gameHr = addZero(Math.floor(delta / 3600));

		totalPlayTimeDisplayDiv.innerHTML = gameHr + ':' + gameMin + ':' + gameSec;

		setTimeout('timerCycle()', 300);
	}
}

/*---------------------------------

		reset timers

-----------------------------------*/

//called on click of the totalPlayTime button.
function resetTotalPlayTimer()
{
	if (isTimeStopped == false)
	{
		isTimeStopped = true;
		isGameStarted = false;

		totalPlayTimeDisplayDiv.innerHTML = '00:00:00';

		//also resets players timers
		for (const player of players)
		{
			player.totalPlayerSec = 0;
			player.delta = 0;
			player.totalPlayerTimeDiv.innerHTML = '00:00:00';
		}

		//reset all variables and timers.
		resetTimers();
	}
}


/*---------------------------------
test from windows
		TODO
- Add a "pause game" button in the settings

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


-----------------------------------*/


/*---------------------------------

		Backlog
- Custo :
	- timer duration (per player....to accomodate a child or something)
	- bonus if timer not consumed

-----------------------------------*/
