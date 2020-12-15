import * as c32check from 'c32check';
import * as fs from 'fs';
import * as readline from 'readline';

function isValidAddress(btcAddress: string, stxAddress: string) {
    try {
        const convertBtcAddr = c32check.c32ToB58(stxAddress);
        console.log('conv:', convertBtcAddr)
        if (btcAddress === convertBtcAddr) {
            return true;
        }
    } catch (error) {
        console.log('invalid address:', stxAddress);
        return false;
    }
    return false;
}

function checkAddress(filename: string, outputFile: string) {
    const fRead = fs.createReadStream(filename, 'utf8');
    const lines = readline.createInterface({ input: fRead });
    var index = 2;
    let errUsers = [];
    let title = "Email	Name	BTC	STX	requestid	Date/Time Registered	referer\r\n";
    lines.on('line', (line: string) => {
        if (line !== '\u0000' && index !== 2) {
            line = line.trim()
            const words = line.split('\t');
            if (words.length !== 7) {
                errUsers.push(line);
                index++;
                return;
            }
            const btcAddress = words[2];
            const stxAddress = words[3];
            const isValid = isValidAddress(btcAddress, stxAddress);
            if (!isValid) {
                errUsers.push(line);
            }
        }
        index++;
    })
    lines.on('close', () => {
        console.log('arr:', errUsers.length);
        console.log('readline close...');
        var file = fs.createWriteStream(outputFile, 'utf8');
        file.on('error', function (err) { console.log(err); });
        file.write(title);
        errUsers.forEach(
            row => {
                file.write(`${row}\r\n`);
            }
        );
        file.end();
    });
}

checkAddress('Daemon Mining Challenge Registrants.txt', 'invalidUsers.txt');
// isValidAddress('msNgMDVpgGYJqx12SZYeWzRGNDK36z5k7o', 'ST1M3Y9S4CQVXP7Y2EANDDXGTWVG86AETCX1AKP21')