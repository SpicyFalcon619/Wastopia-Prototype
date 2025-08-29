// get all the input fields
const inputs = document.querySelectorAll(".security-code input");

inputs.forEach((input, index) => {
  // add an event listener for the input event
  input.addEventListener("input", (event) => {
    // get the value entered by the user
    let value = event.target.value;

    // limit the input to one digit only
    if (value.length > 1) {
      value = value[0]; // set the value to be the first character only
      event.target.value = value; // update the input field value
    }

    // move focus to the next input field if a single digit is entered
    if (value.length === 1) {
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });

  // add an event listener for the keydown event
  input.addEventListener("keydown", (event) => {
    // move focus to the previous input field if Backspace key is pressed and current input field is empty
    if (event.key === "Backspace") {
      if (input.value === "") {
        if (index > 0) {
          inputs[index - 1].focus();
        }
      }
    }

    // move focus to the next input field if Delete key is pressed and current input field is empty
    if (event.key === "Delete") {
      if (input.value === "") {
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    }
  });
});
