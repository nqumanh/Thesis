const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1)

const GetDateDMY = (dateString) => {
    var date = new Date(dateString);
    var day = date.getDate();
    var month = date.getMonth() + 1; //January is 0!
    var year = date.getFullYear();

    if (day < 10) {
        day = `0${day}`
    }

    if (month < 10) {
        month = `0${month}`
    }

    return `${day}/${month}/${year}`;
}

export {
    capitalizeFirstLetter,
    GetDateDMY,
} 