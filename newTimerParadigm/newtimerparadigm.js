//from https://stackoverflow.com/questions/16134997/how-to-pause-and-resume-a-javascript-timer
class Player
{
    constructor(_playerNumber, _sec)
    {
        this.playerNumber = _playerNumber;
        //NOT 0 indexed
        this.playerName = 'Player ' + (this.playerNumber + 1);
        this.timeout = 0;
        this.sec = _sec;
        this.playerHr = 0;
        this.playerMin = 0;
        this.playerSec = 0;
        this.totalPlayerSec = 0;
        this.delta = 0;
        this.playerNameFormGroup = document.createElement('div');
        this.div = document.createElement('div');
        this.timer = 0;
    }
}


function startTimer(turnLength, container, oncomplete)
{
    var startTime, interval, obj, turnLengthMS = turnLength * 1000,
        display = document.getElementById(container);
    obj = {};
    obj.resume = function ()
    {
        startTime = new Date().getTime();
        interval = setInterval(obj.step, 250); // adjust this number to affect granularity
        // lower numbers are more accurate, but more CPU-expensive
    };
    obj.pause = function ()
    {
        turnLengthMS = obj.step();
        clearInterval(interval);
    };
    obj.reset = function () 
    {
        clearInterval(interval);
        turnLengthMS = turnLength * 1000
        display.innerHTML = `00:00:${turnLength}`;
    }
    obj.step = function ()
    {
        var delta = Math.max(0, turnLengthMS - (new Date().getTime() - startTime)),
            h = Math.floor(delta / 3600000),
            m = Math.floor(delta / 60000) % 60,
            s = Math.floor(delta / 1000) % 60;
        s = (s < 10 ? "0" : "") + s;
        m = (m < 10 ? "0" : "") + m;
        h = (h < 10 ? "0" : "") + h;
        display.innerHTML = `${h}:${m}:${s}`;
        if (delta == 0)
        {
            clearInterval(interval);
            obj.resume = function () { };
            if (oncomplete) oncomplete();
        }
        return delta;
    };
    obj.resume();
    return obj;
}

player = new Player(0, 30);

document.getElementById("startButton").onclick = function ()
{ 
    if (player.timer != 0){player.timer.reset();} 
    player.timer = startTimer(30, "test"); 
};
document.getElementById("pauseButton").onclick = function(){player.timer.pause();};
document.getElementById("resumeButton").onclick = function(){player.timer.resume();};
document.getElementById("resetButton").onclick = function(){player.timer.reset();};
// pause:
//timer.pause();
// resume:
//timer.resume();