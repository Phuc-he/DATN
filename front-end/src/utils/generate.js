export const generateRandomString = (length) => {
    const character = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz0123456789";
    let res = "";
    for (let i = 0; i < length; i++) {
        res += character.charAt(Math.floor(Math.random() * character.length));
    }
    return res;
}

export const generateRandomNumber = (length) => {
    const character = "0123456789";
    let res = "";
    for (let i = 0; i < length; i++) {
        res += character.charAt(Math.floor(Math.random() * character.length));
    }
    return res;
}