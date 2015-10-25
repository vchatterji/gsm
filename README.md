gsm
===

A node module to calculate the number of SMSes required to send a specified text over a GSM network

Installation
============
```
npm install gsm
```

Usage
=====
```
var gsm = require('gsm');

var parts = gsm("Your complex message");

console.log("Number of SMSes needed:" + parts.sms_count);
console.log("Remaining characters till next message:" + parts.chars_left);
console.log("Character set:" + parts.char_set);
console.log("Parts:");
console.log(parts.parts);
```
