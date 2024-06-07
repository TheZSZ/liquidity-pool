// ascii spinner and check box to show the status of the deployment
// uses cli-spinners to show the spinner, dynamically imports the package because es modules
// takes a task and a message as arguments, executes the task and shows the spinner with the message
// if the task is successful, it shows a checkmark and the message
// if the task fails, it shows a cross and the message, then rethrows the error for further handling
const withSpinner = async (task, message) => {
    let frameIndex = 0;
    let spinner;
    let frames;
    let spinnerInterval;

    // function to display spinner
    const showSpinner = () => {
        process.stdout.write(`\r${frames[frameIndex++]} ${message}`);
        frameIndex %= frames.length;
    };

    // dynamically import cli-spinners and start the spinner
    const cliSpinners = await import('cli-spinners');
    spinner = cliSpinners.default.bouncingBall;             // spinner
    frames = spinner.frames;

    // start spinner
    spinnerInterval = setInterval(showSpinner, spinner.interval);

    try {
        await task();                   // execute the task
        clearInterval(spinnerInterval); // stop the spinner after the task is completed
        process.stdout.write(`\r✔   Finished deploying ${message.split(' ')[1]} ${message.split(' ')[2].slice(0, -3)}\n`);     // removes ... from message
    } catch (error) {
        clearInterval(spinnerInterval); // stop the spinner and show an error message if the task fails
        process.stdout.write(`\r✖   ${message} - Task failed: ${error}\n`);
        throw error;                    // rethrow the error for further handling
    }
};

module.exports = { withSpinner };
