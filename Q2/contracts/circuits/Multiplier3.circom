pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier2(){
   //Declaration of signals.
   signal input in1;
   signal input in2;
   signal output out;

   //Constraints.
   out <== in1*in2;
}

template Multiplier3 () {  
   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output out;

   // Declaration of componets.
   component mul1 = Multiplier2();
   component mul2 = Multiplier2();

   // Statements
   mul1.in1 <== a;
   mul1.in2 <== b;
   mul2.in1 <== mul1.out;
   mul2.in2 <== c;
   out <== mul2.out;
}

component main = Multiplier3();