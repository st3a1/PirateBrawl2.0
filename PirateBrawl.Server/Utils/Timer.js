function timerMath(timer_start_date, timer_end_date) {
    const timer_start = new Date(
        timer_start_date[0], timer_start_date[1] - 1, timer_start_date[2], 
        timer_start_date[3], timer_start_date[4], timer_start_date[5]
    )
    const timer_end = new Date(
        timer_end_date[0], timer_end_date[1] - 1, timer_end_date[2], 
        timer_end_date[3], timer_end_date[4], timer_end_date[5]
    )
    const timer_now = new Date()

    let time_sec;

    if (timer_now > timer_start) {
        if (timer_now < timer_end) {
            time_sec = (timer_end - timer_now) / 1000
        } else {
            time_sec = -1
        }
    } else {
        time_sec = -1
    }

    return Math.floor(time_sec)
}
