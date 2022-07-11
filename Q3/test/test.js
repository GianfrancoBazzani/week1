const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { groth16 } = require("snarkjs");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

describe("LessThan10test", function () {
    this.timeout(100000000);

    it("Circuit should output 0 with input > 10", async function () {
        const circuit = await wasm_tester("contracts/circuits/LessThan10test.circom");
        
        const INPUT = {
            "in": 12
        }

        const proof = await circuit.calculateWitness(INPUT, true); 
        
        console.log("input = ", INPUT.in, "output =", proof[1]);

        assert(Fr.eq(Fr.e(proof[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(proof[1]),Fr.e(0))); 

    });

    it("Circuit should output 1 with input < 10", async function () {
        const circuit = await wasm_tester("contracts/circuits/LessThan10test.circom");
        
        const INPUT = {
            "in": 9
        }

        const proof = await circuit.calculateWitness(INPUT, true); 
        
        console.log("input = ", INPUT.in, "output =", proof[1]);

        assert(Fr.eq(Fr.e(proof[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(proof[1]),Fr.e(1))); 

    });
});

describe("RangeProoftest", function () {
    this.timeout(100000000);

    it("Circuit should output 0 with input > 10", async function () {
        const circuit = await wasm_tester("contracts/circuits/RangeProoftest.circom");
        
        const INPUT = {
            "in": 12
        }

        const proof = await circuit.calculateWitness(INPUT, true); 
        
        console.log("input = ", INPUT.in, "output =", proof[1]);

        assert(Fr.eq(Fr.e(proof[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(proof[1]),Fr.e(0))); 

    });

    it("Circuit should output 1 with input = 10", async function () {
        const circuit = await wasm_tester("contracts/circuits/RangeProoftest.circom");
        
        const INPUT = {
            "in": 10
        }

        const proof = await circuit.calculateWitness(INPUT, true); 
        
        console.log("input = ", INPUT.in, "output =", proof[1]);

        assert(Fr.eq(Fr.e(proof[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(proof[1]),Fr.e(1))); 

    });

    it("Circuit should output 1 with 10 > input > 5", async function () {
        const circuit = await wasm_tester("contracts/circuits/RangeProoftest.circom");
        
        const INPUT = {
            "in": 7
        }

        const proof = await circuit.calculateWitness(INPUT, true); 
        
        console.log("input = ", INPUT.in, "output =", proof[1]);

        assert(Fr.eq(Fr.e(proof[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(proof[1]),Fr.e(1))); 

    });


    it("Circuit should output 0 with input < 5", async function () {
        const circuit = await wasm_tester("contracts/circuits/RangeProoftest.circom");
        
        const INPUT = {
            "in": 3
        }

        const proof = await circuit.calculateWitness(INPUT, true); 
        
        console.log("input = ", INPUT.in, "output =", proof[1]);

        assert(Fr.eq(Fr.e(proof[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(proof[1]),Fr.e(0))); 

    });
});
