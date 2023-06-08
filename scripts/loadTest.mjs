import chalk from 'chalk';
import emoji from 'node-emoji';
import { exec } from 'child_process';

let loadTestCommands = [];
let network='ic';

for (let i = 1; i <= 30; i++) {
  loadTestCommands.push({
    command: `dfx identity use default`,
    description: `Switching to default identity...`,
    emoji: emoji.get('key'),
  });

  loadTestCommands.push({
    command: `dfx canister call --network ${network} Verifier adminCreateTeam '( "test team ${i}", false )'`,
    description: `Creating Team ${i}...`,
    emoji: emoji.get('triangular_flag_on_post'),
  });

  for (let j = 1; j <= 30; j++) {
    const identityName = `student${j}ofTeam${i}`;

    loadTestCommands.push({
      command: `dfx identity use ${identityName}`,
      description: `Using Identity ${identityName}...`,
      emoji: emoji.get('key'),
    });

    loadTestCommands.push({
      command: `dfx identity get-principal`,
      description: `Getting Principal for Identity ${identityName}...`,
      emoji: emoji.get('id'),
      identity: identityName,
    });
  }
}

function executeLoadTestCommands(index = 0) {
  if (index >= loadTestCommands.length) return;

  const command = loadTestCommands[index];

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

    if (command.description.includes("Getting Principal for Identity")) {
      const principal = stdout.trim();
      const identityName = command.identity;

      const registerStudentCommand = `dfx canister call --network ${network} Verifier registerStudent '(  "${identityName}","${principal}", false)'`;
      console.log(chalk.blue(`\n${emoji.get('student')}  Registering ${identityName} for Team ${Math.floor(index / 30) + 1}...\n`));

      exec(registerStudentCommand, (registerError, registerStdout, registerStderr) => {
        if (registerError) {
          console.log(`\nError: ${registerError.message}\n`);
          return;
        }
        if (registerStderr) {
          console.log(`\nWarning: ${registerStderr}\n`);
        }

        console.log(`${emoji.get('student')}  ${registerStdout.trim()}\n`);
        executeLoadTestCommands(index + 1);
      });
    } else {
      executeLoadTestCommands(index + 1);
    }
  });
}

executeLoadTestCommands();
