//change to a class ? 
function startTimer(turnLength, container, oncomplete)
{
    var startTime, timer, obj, turnLengthMS = turnLength * 1000,
        display = document.getElementById(container);
    obj = {};
    obj.resume = function ()
    {
        startTime = new Date().getTime();
        timer = setInterval(obj.step, 250); // adjust this number to affect granularity
        // lower numbers are more accurate, but more CPU-expensive
    };
    obj.pause = function ()
    {
        turnLengthMS = obj.step();
        clearInterval(timer);
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
        display.innerHTML = `${h}:${m}:${s}`;
        if (delta == 0)
        {
            clearInterval(timer);
            obj.resume = function () { };
            if (oncomplete) oncomplete();
        }
        return delta;
    };
    obj.resume();
    return obj;
}

var timer = startTimer(turnLength, "timer", function () { alert("Done!"); });

// pause:
timer.pause();
// resume:
timer.resume();