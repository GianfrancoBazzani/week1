const fs = require("fs");

let solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/
let verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.4');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

// bumping Multiplier 3 groth16 construction
content = fs.readFileSync("./contracts/Multiplier3-groth16.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.4');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3_groth16');

fs.writeFileSync("./contracts/Multiplier3-groth16.sol", bumped);

// bumping Multiplier 3 plonk construction
solidityRegex = /pragma solidity \>=\d+\.\d+\.\d+ \<\d+\.\d+\.\d+/ 
verifierRegex = /contract PlonkVerifier/

content = fs.readFileSync("./contracts/Multiplier3-plonk.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.4');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3_plonk');

fs.writeFileSync("./contracts/Multiplier3-plonk.sol", bumped);