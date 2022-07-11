pragma circom 2.0.0;

include "RangeProof.circom";

template RangeProoftest() {
    signal input in;
    signal output out;

    component r = RangeProof(32);
    
    r.in <== in;
    r.range[0] <== 5;
    r.range[1] <== 10;

    out <== r.out;
}

component main = RangeProoftest();