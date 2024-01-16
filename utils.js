function SessionIDGenerator(){

    var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

    let output = ""

    var i = 0

    while(i != 20){

        const l = letters.charAt(Math.floor(Math.random() * letters.length))

        output += l
        i++

    }

    return output

}

module.exports = SessionIDGenerator
