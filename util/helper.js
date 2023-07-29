function findDesiredTime(time, times) {
    for(let i = times.length-1; i > -1; i--) {
        if(times[i] == time) {
            return i;
        }
    }
}

modules.export = findDesiredTime;