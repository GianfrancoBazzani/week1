#!/bin/bash

cd contracts/circuits

mkdir RangeProoftest

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling RangeProoftest.circom..."

# compile circuit

circom RangeProoftest.circom --r1cs --wasm --sym -o RangeProoftest
 snarkjs r1cs info RangeProoftest/RangeProoftest.r1cs

# Start a new zkey and make a contribution

 snarkjs groth16 setup RangeProoftest/RangeProoftest.r1cs powersOfTau28_hez_final_10.ptau RangeProoftest/circuit_0000.zkey
 snarkjs zkey contribute RangeProoftest/circuit_0000.zkey RangeProoftest/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
 snarkjs zkey export verificationkey RangeProoftest/circuit_final.zkey RangeProoftest/verification_key.json

# generate solidity contract
# snarkjs zkey export solidityverifier RangeProoftest/circuit_final.zkey ../RangeProoftestVerifier.sol

cd ../..