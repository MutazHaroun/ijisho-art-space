const bcrypt = require("bcryptjs");

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// التصدير الصحيح لـ Node.js
module.exports = hashPassword;