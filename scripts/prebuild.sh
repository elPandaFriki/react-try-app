#!/bin/bash

own_path=$(pwd)/scripts

source $own_path/formatters.sh
source $own_path/paths.sh

echo -e "${TXT_CYAN}Updating production folder at $production_path${TXT_DEFAULT}"
echo -e "${TXT_CYAN}Moving to $production_path${TXT_DEFAULT}"
if ! cd $production_path; then
    echo -e "${TXT_CYAN}Could not move to $production_path.. Auto-Creating folder at $production_path${TXT_DEFAULT}"
    mkdir $production_path
fi
cd $production_path

# NEED TO CHECK IF CONNECTED TO HOST
#git checkout .
#git pull origin master

