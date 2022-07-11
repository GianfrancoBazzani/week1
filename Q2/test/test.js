const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { groth16 , plonk } = require("snarkjs");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

describe("HelloWorld", function () {
    this.timeout(100000000);
    let Verifier;
    let verifier;

    beforeEach(async function () {
        // Verifier contract deployment
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Circuit should multiply two numbers correctly", async function () {
         // Loads wasam tester object of the HelloWorld circuit to circuit variable
        const circuit = await wasm_tester("contracts/circuits/HelloWorld.circom");
        
        const INPUT = {
            "a": 2,
            "b": 3
        }

        // Simulates the computation of the circuit and saves the proof array
        const witness = await circuit.calculateWitness(INPUT, true); 

        // Asserting that the arithmetic operation is done in a correct way 2*3=6, and the dumie signal 1
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(6))); 

    });

    it("Should return true for correct proof", async function () {
        // Computes the circuit HelloWorld using the specific generated key and saves de proof and the output value
        const { proof, publicSignals } = await groth16.fullProve({"a":"2","b":"3"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");
        
        // Prints 2x3 = "circuit output value"
        console.log('2x3 =',publicSignals[0]); 
        
        // Generates the calldata that we have to include in the tx to verify the computation of the circuit onchain
        const calldata = await groth16.exportSolidityCallData(proof, publicSignals); 
        
        // Takes the calldata string, erases all the chars in the list -> ([,",'space',]);
        // Splits the char in arrays using as divider the ',' charracter
        // converts all items of the aray to a character representation of BigInt
        const argv = calldata.replace(/[[\]"\s]/g, "").split(',')//.map(x => BigInt(x).toString()); 

        // Building R1CS vectors
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];

        // Computation result
        const Input = argv.slice(8);
        
        // Sends the proof to verifier smart contract to evalate it
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    
    it("Should return false for invalid proof", async function () {
        // Test if returns a false with a invalid proof
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});

describe("Multiplier3 circuit", function () {
    it("Circuit should multiply three numbers correctly", async function () {

        // Verifier contract deployment
        Verifier = await ethers.getContractFactory("Multiplier3_groth16");
        verifier = await Verifier.deploy();
        await verifier.deployed();

        // Loads wasam tester object of the Multiplier3 circuit to circuit variable
        const circuit = await wasm_tester("contracts/circuits/Multiplier3.circom");
      
        const INPUT = {
            "a": 6,
            "b": 4,
            "c": 2
        }

        // Simulates the computation of the circuit and saves the proof  array
        const witness = await circuit.calculateWitness(INPUT, true); 
  
        // Asserting that the arithmetic operation is done in a correct way 6*4*2=48, and the dumie signal 1
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(48))); 
  });

});

describe("Multiplier3 with Groth16", function () {

    beforeEach(async function () {
        // Verifier contract deployment
        Verifier = await ethers.getContractFactory("Multiplier3_groth16");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        // Computes the circuit Multiplier3 using the specific generated key and saves de proof and the output value
        const { proof, publicSignals } = await groth16.fullProve({"a":"6","b":"4","c":"2"}, "contracts/circuits/Multiplier3-groth16/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3-groth16/circuit_final.zkey");
        
        // Prints 6x4x2 = "circuit output value"
        console.log('6x4x2 =',publicSignals[0]); 
        
        // Generates the calldata that we have to include in the tx to verify the computation of the circuit onchain
        // this calldata represents the proof
        const calldata = await groth16.exportSolidityCallData(proof, publicSignals); 
        
        // Takes the calldata string, erases all the chars in the list -> ([,",'space',]);
        // Splits the char in arrays using as divider the ',' charracter 
        const argv = calldata.replace(/[[\]"\s]/g, "").split(',');

        // Building R1CS vectors
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];

        // Computation result
        const Input = argv.slice(8);
        
        // Sends the poof to verifier smart contract to evalate it
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });

    it("Should return false for invalid proof", async function () {
        // Test if returns a false with a invalid proof
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        // Verifier contract deployment
        Verifier = await ethers.getContractFactory("Multiplier3_plonk");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        // Computes the circuit Multiplier3 using the specific generated key and saves de proof and the output value
        const { proof, publicSignals } = await plonk.fullProve({"a":"6","b":"4","c":"2"}, "contracts/circuits/Multiplier3-plonk/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3-plonk/circuit_final.zkey");
        
        // Prints 6x4x2 = "circuit output value"
        console.log('6x4x2 =',publicSignals[0]); 

        // Generates the calldata that we have to include in the tx to verify the computation of the circuit onchain
        // this calldata represents the proof
        const calldata = await plonk.exportSolidityCallData(proof, publicSignals); 

        // Takes the calldata string, erases all the chars in the list -> ([,",'space',]);
        // Splits the char in arrays using as divider the ',' charracter
        const argv = calldata.replace(/[[\]"\s]/g, "").split(',')

        let _proof = argv[0];
        let _publicSignals = [argv[1]];

        // Sends the proof to verifier smart contract to evalate it
        expect(await verifier.verifyProof(_proof, _publicSignals)).to.be.true;
    });
    
    it("Should return false for invalid proof", async function () {
        // Test if returns a false with a invalid proof
        let _proof = "0x0f7309ec6095857a09cadf61415f8106c578d6293a9ea96283c31fe3d7aaf37c2f2b1afbab62f9ac57e8267fd27c506454bc292d6bc66e8908f3b5e76e27829b15f8008217673c7c07f3fa10542d545e64fbd060fccd387edf70206bcf61ddf42833cc3e40f95fa07eb8f4f8b4712017d99763495c7809826870dc48d3a27f5204d818ccd7e5754ac8f4d5f1cdb5794c6fd100c578f6a4033399d358891424a4304196a7c35b18fc9b4201631233a74f503e596f8d855fcf23ed746230c9c3af0e19d52eb4a1cb33e858c778082e3217b0dd5bbecdcaa052b3d14bf401b3723c119a01320e9211104cc0a253bc177c345a2c23d693ecd8d9a29697e9eb061929029d88ac5c6f25156382ba8ff50faabe70937e025e8d308009c20bb3fd55895d018fb34303b5e0c75f46e8b365f154187333981d2f2b3815f821f627ceb7d07a0c6f7dd4d6866e7dea1b9f82d0ee3642e8e771befc9ea20477fa444f1aaade0827deb94845ed7db16c0accc2afb223754b6abc620b4b0a1f4c5b9d3d7b9eb7e227824bb182018a6baec763dce96c5b9d78a43f6f166ae0fc639fce68d91083712189b8bdbc771557182f6bf2fcd72c7e8c4573e1135d6649dd81c6228f9855b7303411cb9482fe7e2a2b7e3d9d2e37c26971a9cf99d235919776a9e33dc4069f0c8807d004e940afada38eb00fd4d66ee0a113f7cf095fafa131bd2f4eebaed21f4b6ebe9eb2a87f92bd9dc81a2e55990740cfb72b6fa4d2d4f77c6c1f502ab60030ff6f168fb34abef0654fdf3b1c462fe3b955029e1b996b2523cae9e2caed03a63db9848489618a2008d4d9b242ed1f11f3f017e95c491e8b41dec029b404186c01322b749252adfdaa364239ee820f5f5e18ba3c9cc7fb94aa5051354b1e175976be726d02fb504ef88ac9eda5987bcff0aac2c2d8bd086cb365f495f7110543b544f307b144687af55ad9aff860bffbc5b4b589f5cc0f64cdf1eb9e36a50838d5882978e91c25257346db301e3c55801b143c8a164f2d38d8942eb2086015428c808cc63bd7b2377346656ba7e0582eb2fbb3e6229cdaf215abe89cd19b252829a24063fe86a294431c76b3fd63ce416218e59099b1e5e60c2705052891";
        let _publicSignals = [2];

        // Sends the proof to verifier smart contract to evalate it
        expect(await verifier.verifyProof(_proof, _publicSignals)).to.be.false;
    });
});