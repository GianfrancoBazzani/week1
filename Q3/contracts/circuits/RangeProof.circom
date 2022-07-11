pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; 
    signal input range[2]; 
    signal output out;

    component lt = LessEqThan(n);
    component gt = GreaterEqThan(n);
    
    lt.in[0] <== in;
    lt.in[1] <== range[1];

    gt.in[0] <== in;
    gt.in[1] <== range[0];

    out <== lt.out * gt.out;
}