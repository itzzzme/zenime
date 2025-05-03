export default function autoSkip(option) {
  function validateRanges(ranges) {
    if (!Array.isArray(ranges)) {
      throw new TypeError("Option must be an array of time ranges");
    }

    ranges.forEach((range, index) => {
      if (!Array.isArray(range) || range.length !== 2) {
        throw new TypeError(
          `Range at index ${index} must be an array of two numbers`
        );
      }

      const [start, end] = range;
      if (
        typeof start !== "number" ||
        (typeof end !== "number" && end !== Infinity)
      ) {
        throw new TypeError(
          `Range at index ${index} must contain valid numbers or Infinity`
        );
      }

      if (start > end && end !== Infinity) {
        throw new RangeError(
          `In range at index ${index}, start time must be less than end time`
        );
      }

      if (index > 0) {
        const prevEnd = ranges[index - 1][1];
        if (prevEnd !== Infinity && start <= prevEnd) {
          throw new RangeError(
            `Range at index ${index} overlaps with the previous range`
          );
        }
      }
    });
  }
  validateRanges(option);
  return (art) => {
    let skipRanges = option;

    function updateRanges() {
      const duration = art.duration;
      skipRanges = skipRanges.map(([start, end]) => [
        start,
        end === Infinity ? duration : end,
      ]);
    }

    function checkAndSkip() {
      const currentTime = art.currentTime;
      for (const [start, end] of skipRanges) {
        if (currentTime >= start && currentTime < end) {
          art.seek = end;
          break;
        }
      }
    }

    art.on("video:timeupdate", checkAndSkip);
    art.on("video:loadedmetadata", updateRanges);

    return {
      name: "autoSkip",
      update(newOption = []) {
        validateRanges(newOption);
        skipRanges = newOption;
        updateRanges();
      },
    };
  };
}
