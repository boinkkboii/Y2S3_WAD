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