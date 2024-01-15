

let shouldContinue = true; 

function asyncOperation(input, callback) {
  // Simulate an asynchronous operation
  setTimeout(() => {
    const result = input * 2;
    callback(null, result); // Pass the result to the callback
  }, 6000); // Simulating a delay of 1 second
}

// Function to perform async operation until stopped
function performAsyncOperation(input) {
  if (!shouldContinue) {
    console.log('Async operations stopped.');
    return;
  }

  asyncOperation(input, (error, result) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Result:', result);
      performAsyncOperation(result); // Recursively call for the next operation
    }
  });
}

// Start performing async operations
performAsyncOperation(3);

// To stop the async operations, set shouldContinue to false
// shouldContinue = false;
