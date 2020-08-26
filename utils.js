// @ts-check

/**
 * Validates that email address has the right format
 * @param {string} email email address
 * @returns {boolean} True if valid
 */
module.exports.validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

/**
 * validates that phone number confirms to Saudi format
 * @param {string} phone phone number
 * @param {boolean} acceptLandLine is landline is acceptable phone number
 * @returns {boolean} True if valid
 */
module.exports.validatePhone = (phone, acceptLandLine) => {
    if (acceptLandLine) {
        return /(05[0-9]{8}|01[1-7][0-9]{7})/.test(phone);
    } else {
        return /05[0-9]{8}/.test(phone);
    }
}