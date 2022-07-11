pragma circom 2.0.0;

include "LessThan10.circom";

template LessThan10test() {
    signal input in;
    signal output out;
    component lt = LessThan10(); 

    lt.in <== in;
    out <== lt.out;
}

component main = LessThan10test();
