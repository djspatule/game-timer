//all object programming based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects


/*---------------------------------

		Variables declaration

-----------------------------------*/

let turnLength = 30;

const audio = new Audio('beep.mp3');

let numberOfPlayers = 2;

let isGameStarted = false;

let isMute = true;
let isDark = false;
let isSettingsCollapsed = true;
let isdropdownCollapsed = true;

const newPlayerNode = document.getElementById('newPlayerNode');
const dropDownForm = document.getElementById('dropDownForm');
const dropDownFormGroup = document.getElementById('dropDownFormGroup');

const players = [];

let r = 0;
let g = 0;
let b = 0;

let gameHr = 0;
let gameSec = 0;
let gameMin = 0;
let isTimeStopped = true;
let gameStart = Date.now();
let turnStart = Date.now();
let isNewTurn = true;
let isGamePaused = false;

const totalPlayTimeDisplayDiv = document.getElementById('totalPlayTimeDisplayDiv');

const darkButton = document.getElementById('darkButton');
darkButton.addEventListener('click', dark);

const muteButton = document.getElementById('muteButton');
muteButton.addEventListener('click', mute);

const settingsButton = document.getElementById('settingsButton');
settingsButton.addEventListener('click', collapse);

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pause);

document.querySelector('#setNumberOfPlayersButton').addEventListener('click', setNumberOfPlayers);

document.querySelector('#setTurnLengthButton').addEventListener('click', setTurnLength);

document.querySelector('#totalPlayTimeButton').addEventListener('click', resetTotalPlayTimer);

document.querySelector('#playerSettingsButton').addEventListener('click', showDropDown);

document.querySelector('#playersSettingsSubmissionButton').addEventListener('click', registerPlayersSettings);


/*------------------------------------------

		Initiate the app with 2 players

-------------------------------------------*/

//TODO : see if waiting for the DOM to be loaded fully helps with the reimplementation of the player object
document.addEventListener('DOMContentLoaded', setNumberOfPlayers);

/*------------------------------------------

		Helper functions 

-------------------------------------------*/
function resetTimers()
{
	for (const player of players)
	{
		clearTimeout(player.timeout);
		player.sec = turnLength;
		turnStart = Date.now();
		document.getElementById('playerTimerDiv' + player.playerNumber).innerHTML = turnLength;
		document.getElementById('playerTimerDiv' + player.playerNumber).classList.remove('text-danger');
		const playerButton = document.getElementById('player' + player.playerNumber + 'Button');
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

	getNewButton()
	{
		return `<br>
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
	if (players.length !== 0)
	{
		numberOfPlayers = parseInt(window.prompt('Enter the number of players: '));
		collapseSettings();
	}

	if (numberOfPlayers < players.length)
	{
		const playersToRemove = players.length - numberOfPlayers;
		for (let i = 0; i < playersToRemove; i++)
		{
			newPlayerNode.removeChild(players[players.length - 1].div);
			dropDownFormGroup.removeChild(players[players.length - 1].playerNameFormGroup)
			players.pop();
		}
	}

	for (let i = players.length; i < numberOfPlayers; i++)
	{
		players[i] = new Player(i, turnLength);

		players[i].div.id = players[i].playerNumber;

		players[i].div.innerHTML = players[i].getNewButton();

		newPlayerNode.appendChild(players[i].div);

		players[i].totalPlayerTimeDiv = document.getElementById('totalPlayerTimeDiv' + i);

		players[i].playerNameFormGroup.innerHTML = `
			<div class="dropdown-divider"></div>
			<div class="less-big">${players[i].playerName}</div>
			<div class="form-group" id="playerNameFormGroup${players[i].playerNumber}">
				<label for="dropDownFormNameInput${players[i].playerNumber}">Name</label>
				<input type="text" class="form-control" maxlength="12" id="dropDownFormNameInput${players[i].playerNumber}" value="${players[i].playerName}">
				<label for="dropDownFormColorInput${players[i].playerNumber}">Color</label>
				<input type="color" value="${players[i].rgb}" class="form-control" id="dropDownFormColorInput${players[i].playerNumber}">
			</div><br>`;

		dropDownFormGroup.appendChild(players[i].playerNameFormGroup);

		document.querySelector('#player' + i + 'Button').addEventListener('click', () => { playerTimer(i); });
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

function mute()
{
	if (isMute === false)
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

function dark()
{
	if (isDark === false)
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

function pause()
{
	if (isGamePaused === false)
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

function collapse()
{
	const settingsDiv = document.getElementById('settingsDiv');

	if (isSettingsCollapsed === true)
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

function showDropDown()
{

	if (isdropdownCollapsed === true)
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

function playerTimer(id)
{
	if (isGameStarted === false || isGamePaused === true)
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

	const delta = (Date.now() - turnStart) / 1000;
	players[id].sec = turnLength - Math.floor(delta);

	playerDuration(id);

	const playerButton = document.getElementById('player' + id + 'Button');
	const progress = (1 - (players[id].sec / turnLength)) * 100
	playerButton.querySelector('.progressButton__progress').style.height = `${progress}%`;

	const playerTimerDiv = document.getElementById('playerTimerDiv' + id);

	if (isMute === false && (players[id].sec === 10 || players[id].sec <= 3))
	{
		audio.play();
		playerTimerDiv.classList.add('text-danger');
	}

	playerTimerDiv.innerHTML = players[id].sec;

	players[id].timeout = setTimeout(() => playerTurnDuration(id), 300);

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

function gameDuration()
{
	if (isTimeStopped === true || isGamePaused === true)
	{
		isTimeStopped = false;
		isGamePaused = false;
		gameStart = Date.now();
		timerCycle();
	}
}

function timerCycle()
{
	if (isTimeStopped === false && isGamePaused === false)
	{
		const delta = (Date.now() - gameStart) / 1000;
		gameSec = addZero(Math.floor(delta % 60));
		gameMin = addZero(Math.floor((delta / 60) % 3600));
		gameHr = addZero(Math.floor(delta / 3600));

		totalPlayTimeDisplayDiv.innerHTML = gameHr + ':' + gameMin + ':' + gameSec;

		setTimeout(timerCycle, 300);
	}
}

/*---------------------------------

		reset timers

-----------------------------------*/

function resetTotalPlayTimer()
{
	if (isTimeStopped === false)
	{
		isTimeStopped = true;
		isGameStarted = false;

		totalPlayTimeDisplayDiv.innerHTML = '00:00:00';

		for (const player of players)
		{
			player.totalPlayerSec = 0;
			player.delta = 0;
			player.totalPlayerTimeDiv.innerHTML = '00:00:00';
		}

		resetTimers();
	}
}

/*---------------------------------
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
