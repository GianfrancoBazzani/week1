#!/bin/bash

cd contracts/circuits

mkdir LessThan10test

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling LessThan10test.circom..."

# compile circuit

circom LessThan10test.circom --r1cs --wasm --sym -o LessThan10test
 snarkjs r1cs info LessThan10test/LessThan10test.r1cs

# Start a new zkey and make a contribution

 snarkjs groth16 setup LessThan10test/LessThan10test.r1cs powersOfTau28_hez_final_10.ptau LessThan10test/circuit_0000.zkey
 snarkjs zkey contribute LessThan10test/circuit_0000.zkey LessThan10test/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
 snarkjs zkey export verificationkey LessThan10test/circuit_final.zkey LessThan10test/verification_key.json

# generate solidity contract
# snarkjs zkey export solidityverifier LessThan10test/circuit_final.zkey ../LessThan10testVerifier.sol

cd ../..