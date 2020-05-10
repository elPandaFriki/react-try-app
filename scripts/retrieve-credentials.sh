#!/bin/bash

own_path=$(pwd)/scripts

source $own_path/formatters.sh

echo -e "${TXT_BLUE}Retrieving your credentials${TXT_DEFAULT}"

# Create temporal file
tmp=$(mktemp)

# Read credentials from cache or set them for the first time
echo "" | cat | git credential fill > $tmp
# Read username
username=$(cat $tmp | grep username)
# Read password
password=$(cat $tmp | grep password)
# Read host
host=$(cat $tmp | grep host)

# Write to temporal file
echo "protocol=https" > $tmp      # add protocol (overwrite if any content in the file)
echo "host=$host" >> $tmp         # append host
echo "$username" >> $tmp          # append username
echo "$password" >> $tmp          # append password

# Configure git credential helper
#git config --global credential.helper cache

# Send credentials to helper and remove temporal file
#git credential approve < $tmp && rm $tmp

# Exit
exit $?