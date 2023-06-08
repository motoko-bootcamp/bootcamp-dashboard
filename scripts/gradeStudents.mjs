import chalk from 'chalk';
import emoji from 'node-emoji';
import { exec } from 'child_process';

let network='ic';

// Function to get random number of days between 1 and 5
function getRandomDays() {
  return Math.floor(Math.random() * 6) + 1;
}

function executeCommand(command, description, emojiSymbol) {
  console.log(chalk.blue(`\n${emoji.get(emojiSymbol)}  ${description}\n`));

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`\nError: ${error.message}\n`);
      return;
    }
    if (stderr) {
      console.log(`\nWarning: ${stderr}\n`);
    }

    console.log(`${emoji.get(emojiSymbol)}  ${stdout.trim()}\n`);
  });
}

// Switch to the default identity for admin actions
executeCommand(
  `dfx identity use default`,
  `Switching to default identity...`,
  'key'
);

// Get all students
exec(`dfx canister call --network ${network} Verifier getAllStudentsPrincipal`, (error, stdout, stderr) => {
  if (error) {
    console.log(`\nError: ${error.message}\n`);
    return;
  }
  if (stderr) {
    console.log(`\nWarning: ${stderr}\n`);
  }

  // Extract student principals using regex pattern
  const regex = /"([^"]*)"/g;
  let students = [];
  let match;
  while (match = regex.exec(stdout)) {
    students.push(match[1]);
  }

  students.forEach(student => {
    const days = getRandomDays();

    for (let day = 1; day <= days; day++) {
      const command = `dfx canister call  --network ${network} Verifier adminManuallyVerifyStudentDay '(${day},"${student}")'`;
      const description = `Verifying homework for student with principal ${student} on day ${day}...`;
      executeCommand(command, description, 'pencil');
    }
  });
});
