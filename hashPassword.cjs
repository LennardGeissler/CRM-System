const readline = require('readline');
const bcrypt = require('bcrypt');
const {read} = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(' Passwort: ', async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Gehashtes Passwort:', hashedPassword);
    } catch (err) {
        console.error('Fehler beim Hashen :', err);
    }
    rl.close();
});
