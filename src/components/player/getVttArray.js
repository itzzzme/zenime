function padEnd(str, targetLength, padString) {
  if (str.length > targetLength) {
    return String(str);
  } else {
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length);
    }
    return String(str) + padString.slice(0, targetLength);
  }
}

function t2d(time) {
  var arr = time.split(".");
  var left = arr[0].split(":") || [];
  var right = padEnd(arr[1] || "0", 3, "0");
  var ms = Number(right) / 1000;

  var h = Number(left[left.length - 3] || 0) * 3600;
  var m = Number(left[left.length - 2] || 0) * 60;
  var s = Number(left[left.length - 1] || 0);
  return h + m + s + ms;
}

export default async function getVttArray(vttUrl = "") {
  const vttString = await (await fetch(vttUrl)).text();
  let lines = vttString.split(/\r?\n/).filter((item) => item.trim());
  const vttArray = [];

  //checking if the WEBVTT header is present
  const isWebVTTHeader = lines[0].trim().toUpperCase() === "WEBVTT";

  let startIndex = 0;
  let increment = 2;

  // Check if the first line is an index line
  const indexLineReg = /^\d+$/; // Regex to match lines containing only digits

  if (!isWebVTTHeader && indexLineReg.test(lines[0].trim())) {
    // console.log("WEBVTT not present but index line is present");
    increment = 3; // Set increment to 3 if an index line is present
    startIndex = 1; // Start from the second line
  } else if (isWebVTTHeader) {
    // If WEBVTT is present, check the next line
    // console.log("WEBVTT lines is present checking if index line is present...");
    const indexLine = lines[1];
    if (indexLine && indexLineReg.test(indexLine.trim())) {
      // console.log("Index line is present");
      increment = 3; // Set increment to 3 if an index line is present
      startIndex = 2; // Start from the line after the index
    } else {
      // console.log("Index line is not present");
      startIndex = 1; // If no index line, start from the line after WEBVTT
      increment = 2; // Set increment to 2
    }
  }

  for (let i = startIndex; i < lines.length; i += increment) {
    const time = lines[i];
    const text = lines[i + 1];
    if (!text.trim()) continue;

    // console.log(`Processing time line: ${time}`); // Logging processing timestamps

    const timeReg =
      /((?:[0-9]{2}:)?(?:[0-9]{2}:)?[0-9]{2}(?:.[0-9]{3})?)(?: ?--> ?)((?:[0-9]{2}:)?(?:[0-9]{2}:)?[0-9]{2}(?:.[0-9]{3})?)/;
    const timeMatch = time.match(timeReg);

    if (!timeMatch) {
      // console.warn(`Failed to match time: ${time}`); // Log failed matches
      continue; // Skip to the next loop iteration if match fails
    }

    const textReg = /(.*)#(\w{4})=(.*)/i;
    const textMatch = text.match(textReg);
    const start = Math.floor(t2d(timeMatch[1]));
    const end = Math.floor(t2d(timeMatch[2]));

    let url = textMatch[1];
    const isAbsoluteUrl = /^\/|((https?|ftp|file):\/\/)/i.test(url);
    if (!isAbsoluteUrl) {
      const urlArr = vttUrl.split("/");
      urlArr.pop();
      urlArr.push(url);
      url = urlArr.join("/");
    }

    const result = { start, end, url };

    const keys = textMatch[2].split("");
    const values = textMatch[3].split(",");

    for (let j = 0; j < keys.length; j++) {
      result[keys[j]] = values[j];
    }

    vttArray.push(result);
  }

  return vttArray;
}
