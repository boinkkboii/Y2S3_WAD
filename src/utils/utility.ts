export const formatted = ( inputDate : Date) => {
    let day = inputDate.getDay();
    let date = inputDate.getDate();
    let month = inputDate.getMonth();
    let year = inputDate.getFullYear();
    let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let monthsText = [
        'Jan','Feb','Mar','Apr','May','Jun',
        'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    return `${daysText[day]} ${date}-${monthsText[month]}`;
}

export const formatTime = (timeInt : number): string => {
    if (typeof timeInt !== 'number' || isNaN(timeInt)) {
        return 'Invalid time';
    }
            
    const hours = Math.floor(timeInt / 100);
    const minutes = timeInt % 100;
            
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
            
    return `${paddedHours}:${paddedMinutes}`;
};