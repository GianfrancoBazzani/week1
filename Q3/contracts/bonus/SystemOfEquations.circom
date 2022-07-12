pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib-matrix/circuits/matMul.circom"; // hint: you can use more than one templates in circomlib-matrix to help you
include "../../node_modules/circomlib/circuits/comparators.circom";

template mult(){
    signal input a;
    signal input b;
    signal output out;
    out <== a*b;

}

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    //defining matrix multiplicator an assigning to matMult(n,n,1) circuit
    component multres = matMul(n,n,1);
    //defining mulitplicators components and assigning to mult() circuit
    component mult1 = mult();
    component mult2 = mult();
    //defining comparator component
    component com[n];

    //matrix A(m=n x n) assgined to first operator of the matrix multiplicator
    for(var i = 0; i < n; i ++){
        for(var j = 0; j < n; j++){
            multres.a[i][j] <== A[i][j];
        }
    }
    
    //vector x(n x p=1) assgined to second operator of the matrix multiplicator
    for(var i = 0; i < n; i++){
         multres.b[i][0] <== x[i];
    }
    
    //porque no puedo usar esto y acabar aquí el circuito
    //out <== (b[0] == multres.out[0][0]) && (b[1] == multres.out[1][0]) && (b[2] == multres.out[2][0]);
    //out <== (b[0] == multres.out[0][0]) * (b[1] == multres.out[1][0]) * (b[2] == multres.out[2][0]);

    //assigning comparators components to IsEqual() circuits and assgining b signals and matrix mulitplicator output to input of the comparator
    for(var i = 0; i < n; i++){
        com[i] = IsEqual();
        com[i].in[0] <== b[i];
        com[i].in[1] <== multres.out[i][0];
    }

    //porque no puedo usar esto y acabar aquí el circuito
    //out <== com[0].out && com[1].out && com[2].out;
    
    //assigning comparators outputs to multipicator chain inputs
    mult1.a <== com[0].out;
    mult1.b <== com[1].out;

    mult2.a <== mult1.out;
    mult2.b <== com[2].out;

    //assignin second multiplicator output to template output
    out <== mult2.out;

    

}

component main {public [A, b]} = SystemOfEquations(3);