// @ts-check

module.exports.validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

module.exports.validatePhone = (phone, acceptLandLine) => {
    if (acceptLandLine) {
        return /(05[0-9]{8}|01[1-7][0-9]{7})/.test(phone);
    } else {
        return /05[0-9]{8}/.test(phone);
    }
}