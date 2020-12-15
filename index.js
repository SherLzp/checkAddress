"use strict";
exports.__esModule = true;
var c32check = require("c32check");
var fs = require("fs");
var readline = require("readline");
function isValidAddress(btcAddress, stxAddress) {
    try {
        var convertBtcAddr = c32check.c32ToB58(stxAddress);
        console.log('conv:', convertBtcAddr);
        if (btcAddress === convertBtcAddr) {
            return true;
        }
    }
    catch (error) {
        console.log('invalid address:', stxAddress);
        return false;
    }
    return false;
}
function checkAddress(filename, outputFile) {
    var fRead = fs.createReadStream(filename, 'utf8');
    var lines = readline.createInterface({ input: fRead });
    var index = 2;
    var errUsers = [];
    var title = "Email	Name	BTC	STX	requestid	Date/Time Registered	referer\r\n";
    lines.on('line', function (line) {
        if (line !== '\u0000' && index !== 2) {
            line = line.trim();
            var words = line.split('\t');
            if (words.length !== 7) {
                errUsers.push(line);
                index++;
                return;
            }
            var btcAddress = words[2];
            var stxAddress = words[3];
            var isValid = isValidAddress(btcAddress, stxAddress);
            if (!isValid) {
                errUsers.push(line);
            }
        }
        index++;
    });
    lines.on('close', function () {
        console.log('arr:', errUsers.length);
        console.log('readline close...');
        var file = fs.createWriteStream(outputFile, 'utf8');
        file.on('error', function (err) { console.log(err); });
        file.write(title);
        errUsers.forEach(function (row) {
            file.write(row + "\r\n");
        });
        file.end();
    });
}
// checkAddress('Daemon Mining Challenge Registrants.txt', 'invalidUsers.txt');
isValidAddress('msNgMDVpgGYJqx12SZYeWzRGNDK36z5k7o', 'ST1M3Y9S4CQVXP7Y2EANDDXGTWVG86AETCX1AKP21');
