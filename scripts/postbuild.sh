#!/bin/bash

own_path=$(pwd)/scripts

source $own_path/formatters.sh
source $own_path/paths.sh

version=$(jq -r '.version' './src/constants/constants.json')

echo -e "${TXT_CYAN}Updating production with version $version${TXT_DEFAULT}"

# Remove files of production folder
echo -e "${TXT_CYAN}Removing production files from $production_path${TXT_DEFAULT}"
rm -v -r -f $production_path/*

# Copy files from 'build' folder to 'production' submodule
echo -e "${TXT_CYAN}Copying files from $build_path to $production_path${TXT_DEFAULT}"
cp -v -r $build_path/* $production_path
echo -e "${TXT_CYAN}Finished moving files to $production_path${TXT_DEFAULT}"

echo -e "${TXT_CYAN}Moving to $production_path${TXT_DEFAULT}"
cd $production_path

#git add .
#git commit -m "$version"
#git push origin master