#!/bin/bash

for file in $(find ./ -name '*.ts' ); do 
    cat preamble $file | sponge $file
done