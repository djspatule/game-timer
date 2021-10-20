//from https://stackoverflow.com/questions/16134997/how-to-pause-and-resume-a-javascript-timer
//change to a class ?


// WORKS !!!


class Timer
{
    constructor(turnLength, container)
    {
        this.display = document.getElementById(container)
        this.turnLength = turnLength;
    }

    startTimer(oncomplete)
    {
        var timer = this; // necessary because otherwise you can't pass "this" to the step function since the scope of "this" becomse different
        var startTime, interval, obj, turnLengthMS = timer.turnLength * 1000;
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
        obj.step = function ()
        {
            var delta = Math.max(0, turnLengthMS - (new Date().getTime() - startTime)),
                h = Math.floor(delta / 3600000),
                m = Math.floor(delta / 60000) % 60,
                s = Math.floor(delta / 1000) % 60;
            s = (s < 10 ? "0" : "") + s;
            m = (m < 10 ? "0" : "") + m;
            h = (h < 10 ? "0" : "") + h;
            timer.display.innerHTML = `${h}:${m}:${s}`;
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
    
}


var newTimer = new Timer (30, "test");
var start = newTimer.startTimer();

document.getElementById("pauseButton").onclick = start.pause;
// pause:
//timer.pause();
// resume:
//timer.resume();