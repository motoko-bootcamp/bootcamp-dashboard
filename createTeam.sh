#!/bin/bash

# Define the team names and their corresponding second arguments
teams=(
  "🐧pathetic-pinguin,false"
  "🐹nuzzling-numbats,false"
  "🐿squeeky-squirrels,false"
  "🦖rowdy-raptors,false"
  "🐨cozy-koalas,false"
  "🐲douchbag-dragons,true"
  "🐒crispy-chimpanzees,true"
  "🦜poppy-parrots,true"
  "🐬sassy-dolphins,true"
  "🦫bitchy-beavers,true"
)

# Create the teams
for team_info in "${teams[@]}"; do
  # Extract the team name and second argument
  IFS=',' read -ra info <<< "$team_info"
  team_name="${info[0]}"
  second_arg="${info[1]}"

  # Run the dfx command to create the team with the given name and second argument
  dfx canister --network ic call Verifier adminCreateTeam "(\"$team_name\", $second_arg)"
  echo "Created team: $team_name"
done
