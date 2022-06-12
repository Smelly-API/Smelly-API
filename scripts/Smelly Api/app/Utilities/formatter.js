import { BlockLocation, Location } from "mojang-minecraft";
import { text } from "../../lang/text.js";

/**
 * Turn text into colored text that supports MCBE
 * @param {string} text The text you want to format to rainbow colors.
 * @returns {string}
 * @example rainbowText('This is rainbow text!');
 */
export function rainbowText(text) {
  const rainbowCode = [
    "§4",
    "§c",
    "§6",
    "§e",
    "§g",
    "§2",
    "§a",
    "§b",
    "§3",
    "§9",
    "§5",
    "§d",
  ];
  const letter = text.replace(/§./g, "").split("");
  let newMessage = "",
    rainbowIndex = 0;
  letter.forEach((letter) => {
    if (letter !== " ") {
      newMessage += `${rainbowCode[rainbowIndex]}${letter}`;
      rainbowIndex + 1 >= rainbowCode.length
        ? (rainbowIndex = 0)
        : rainbowIndex++;
    } else newMessage += " ";
  });
  return newMessage;
}
/**
 * This will display in text in thousands, millions and etc... For ex: "1400 -> "1.4k", "1000000" -> "1M", etc...
 * @param {number} number The number you want to convert
 * @returns {string}
 * @example metricNumbers(15000);
 */
export function metricNumbers(value) {
  const types = ["", "k", "M", "G", "T", "P", "E", "Z", "Y"];
  const selectType = (Math.log10(value) / 3) | 0;
  if (selectType == 0) return value;
  let scaled = value / Math.pow(10, selectType * 3);
  return scaled.toFixed(1) + types[selectType];
}
/**
 * Will format your number. For ex: "1400" -> "1,400", "1000000" -> "1,000,000", etc...
 * @param {number} number The number you want to convert
 * @returns {string}
 * @example thousandsSeparator(15000);
 */
export function thousandsSeparator(value) {
  if (typeof value !== "number") return;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/**
 * Convert string to binary
 * @param {String} text you want to trasnslate to binary
 * @returns {String}
 */
export function textToBinary(text) {
  return text
    .split("")
    .map((char) => {
      return char.charCodeAt(0).toString(2);
    })
    .join(" ");
}
/**
 * Convert binary to string
 * @param {String} binary the binary that you want converted
 * @returns {String}
 */
export function binaryToText(binary) {
  return binary
    .split(" ")
    .map((char) => {
      return String.fromCharCode(parseInt(char, 2));
    })
    .join("");
}
/**
 * Convert number to formated with k/m/b
 * @param {number} number The number you want to convert
 * @returns {number}
 */
export function numFormatter(num) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num <= 999) {
    return num; // if value < 1000, nothing to do
  }
}
/**
 * Convert seconds to number like 0:00:00
 * @param {number} seconds The Ammount of seconds to convert
 * @returns {string}
 */
export function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds; // Return is HH : MM : SS
}
/**
 * Convert seconds to number like 0:00:00
 * @param {string} string The string you want to captliaze
 * @returns {string}
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
/**
 * Returns a location of the inputed aguments
 * @param {string} x x agument
 * @param {string} y y agument
 * @param {string} z z agument
 * @param {Array<number>} location player.location used
 * @param {Array<number>} viewVector player.viewVector used
 * @returns {BlockLocation}
 * @example parseLocationAugs(["~1", "3", "^7"], { location: [1,2,3] , viewVector: [1,2,3] })
 */
export function parseLocationAugs([x, y, z], { location, viewVector }) {
  if (!x || !y || !x) return null;
  const a = [x, y, z].map((arg) => {
    const r = parseInt(arg.replace(/\D/g, ""));
    return isNaN(r) ? 0 : r;
  });
  const b = [x, y, z].map((arg, index) => {
    return arg.includes("~")
      ? a[index] + location[index]
      : arg.includes("^")
      ? a[index] + viewVector[index]
      : a[index];
  });
  return new BlockLocation(b[0], b[1], b[2]);
}

export function MS(
  value,
  { compactDuration, fullDuration, avoidDuration } = {}
) {
  try {
    if (typeof value === "string") {
      if (/^\d+$/.test(value)) return Number(value);
      const durations = value.match(
        /-?\d*\.?\d+\s*?(years?|yrs?|weeks?|days?|hours?|hrs?|minutes?|mins?|seconds?|secs?|milliseconds?|msecs?|ms|[smhdwy])/gi
      );
      return durations ? durations.reduce((a, b) => a + toMS(b), 0) : null;
    }
    if (typeof value === "number")
      return toDuration(value, {
        compactDuration,
        fullDuration,
        avoidDuration,
      });
    throw new Error(text["api.utilities.formatter.error.ms"]);
  } catch (err) {
    const message = isError(err)
      ? `${err.message}. Value = ${JSON.stringify(value)}`
      : text["api.error.unknown"];
    throw new Error(message);
  }
}

/**
 * Convert Durations to milliseconds
 */
export function toMS(value) {
  const number = Number(value.replace(/[^-.0-9]+/g, ""));
  value = value.replace(/\s+/g, "");
  if (/\d+(?=y)/i.test(value)) return number * 3.154e10;
  else if (/\d+(?=w)/i.test(value)) return number * 6.048e8;
  else if (/\d+(?=d)/i.test(value)) return number * 8.64e7;
  else if (/\d+(?=h)/i.test(value)) return number * 3.6e6;
  else if (/\d+(?=m)/i.test(value)) return number * 60000;
  else if (/\d+(?=s)/i.test(value)) return number * 1000;
  else if (/\d+(?=ms|milliseconds?)/i.test(value)) return number;
}

/**
 * Convert milliseconds to durations
 */
export function toDuration(
  value,
  { compactDuration, fullDuration, avoidDuration } = {}
) {
  const absMs = Math.abs(value);
  const duration = [
    { short: "w", long: "week", duration: Math.floor(absMs / 6.048e8) },
    { short: "d", long: "day", duration: Math.floor(absMs / 8.64e7) % 7 },
    { short: "h", long: "hour", duration: Math.floor(absMs / 3.6e6) % 24 },
    { short: "m", long: "minute", duration: Math.floor(absMs / 60000) % 60 },
    { short: "s", long: "second", duration: Math.floor(absMs / 1000) % 60 },
    { short: "ms", long: "millisecond", duration: absMs % 1000 },
  ];
  const mappedDuration = duration
    .filter((obj) =>
      obj.duration !== 0 && avoidDuration
        ? fullDuration &&
          !avoidDuration.map((v) => v.toLowerCase()).includes(obj.short)
        : obj.duration
    )
    .map(
      (obj) =>
        `${Math.sign(value) === -1 ? "-" : ""}${
          compactDuration
            ? `${Math.floor(obj.duration)}${obj.short}`
            : `${Math.floor(obj.duration)} ${obj.long}${
                obj.duration === 1 ? "" : "s"
              }`
        }`
    );
  const result = fullDuration
    ? mappedDuration.join(compactDuration ? " " : ", ")
    : mappedDuration[0];
  return result || `${absMs}`;
}

/**
 * A type guard for errors.
 */
export function isError(error) {
  return typeof error === "object" && error !== null && "message" in error;
}
