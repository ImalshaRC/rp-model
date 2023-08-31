const { spawn } = require("child_process");
const path = require("path");

// Replace with the actual path to your Python script
const pythonScriptPath = path.join(__dirname, "./model/test.py");

// Function to trigger object detection
function performObjectDetection(imagePath, callback) {
  const pythonProcess = spawn("python", [pythonScriptPath, imagePath]);

  let result = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      callback(null, result);
    } else {
      callback(new Error(`Python script exited with code ${code}`));
    }
  });

  return result;
}

module.exports = performObjectDetection;
