const fs = require("fs");

let solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/
let verifierRegex = /contract Verifier/

// bumping Multiplier 3 groth16 construction
content = fs.readFileSync("./contracts/LessThan10testVerifier.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.4');
bumped = bumped.replace(verifierRegex, 'contract LessThan10testVerifier');

fs.writeFileSync("./contracts/LessThan10testVerifier.sol", bumped);

/*
// bumping Multiplier 3 plonk construction
solidityRegex = /pragma solidity \>=\d+\.\d+\.\d+ \<\d+\.\d+\.\d+/ 
verifierRegex = /contract PlonkVerifier/

content = fs.readFileSync("./contracts/Multiplier3-plonk.sol", { encoding: 'utf-8' });
bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.4');
bumped = bumped.replace(verifierRegex, 'contract Multiplier3_plonk');

fs.writeFileSync("./contracts/Multiplier3-plonk.sol", bumped);
*/