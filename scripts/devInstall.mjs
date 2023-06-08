import chalk from 'chalk';
import emoji from 'node-emoji';
import { exec } from 'child_process';

const commands = [
  {
    command: 'npm i',
    description: 'Installing NPM packages...',
    emoji: emoji.get('package'),
  },
  {
    command: 'dfx canister stop Verifier',
    description: 'Stopping the Verifier canister...',
    emoji: emoji.get('zzz'),
  },
  {
    command: 'dfx canister uninstall-code Verifier',
    description: 'Uninstalling the Verifier canister code...',
    emoji: emoji.get('wastebasket'),
  },
  {
    command: 'dfx canister start Verifier',
    description: 'Starting the Verifier canister...',
    emoji: emoji.get('rocket'),
  },
  {
    command: 'dfx generate',
    description: 'Generating declarations...',
    emoji: emoji.get('gear'),
  },
  {
    command: 'dfx deploy',
    description: 'Deploying the canisters...',
    emoji: emoji.get('airplane_departure'),
  },
  // {
  //   command: 'dfx canister call Verifier adminCreateTeam "team 1"',
  //   description: 'Creating Team 1...',
  //   emoji: emoji.get('one'),
  // },
  // {
  //   command: 'dfx canister call Verifier adminCreateTeam "team 2"',
  //   description: 'Creating Team 2...',
  //   emoji: emoji.get('two'),
  // },
];

function executeCommands(index = 0) {
  if (index >= commands.length) return;

  const command = commands[index];

  console.log(chalk.blue(`\n${command.emoji}  ${command.description}\n`));

  exec(command.command, (error, stdout, stderr) => {
    if (error) {
      console.log(`\nError: ${error.message}\n`);
      return;
    }
    if (stderr) {
      console.log(`\nWarning: ${stderr}\n`);
    }

    console.log(`${command.emoji}  ${stdout.trim()}\n`);

    // Execute the next command in the sequence
    executeCommands(index + 1);
  });
}

executeCommands();
