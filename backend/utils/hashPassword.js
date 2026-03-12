const bcrypt = require("bcryptjs")


 const HashPassowrd = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

//  const ComparePasswords = async (password, db_password) =>{
//     const ComparedPassowrd = await bcrypt.compare(password, db_password)
//     return ComparedPassowrd;
// }
module.exports =  HashPassowrd /*ComparePasswords*/;