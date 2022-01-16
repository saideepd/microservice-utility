'use strict'

function timestamp(input) {
    // Default or Blank route
    // Example: /api/ or /api
    if (input === undefined) {
        return new Date();
    }
    // Human readable date input
    // Example: /api/2022-01-15
    else if (isNaN(input)) {
        return new Date(input);
    }
    // UNIX datetime input
    // Example: /api/1642204800000
    else if (!isNaN(input)) {
        let newDate = new Date(input * 1000);
        return new Date(newDate.getTime() / 1000);
    }
    // Fallback if none of above conditions are satisfied
    return new Date();
}


module.exports = timestamp;