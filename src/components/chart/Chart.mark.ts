import sanitize from "sanitize-html";
import _isString from "lodash/isString";
import _isNumber from "lodash/isNumber";

const CLEAR_ALL_MARKS = "marker_clear";
const ADD_MARK = "marker_creater";

const COLOR_REGEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const MIN_SIZE_MIN = 1;
const MIN_SIZE_MAX = 30;

const SANITIZE_SETTINGS = {
  allowedTags: [
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "code",
    "hr",
    "br",
    "div",
    "table",
    "thead",
    "caption",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "name", "target"],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    img: ["src", "height", "width"],
  },
};

function validateMark(mark) {
  let error = null;

  const {
    id,
    ts,
    symbol,
    content,
    color_bg,
    color_border,
    color_text,
    label,
    size_min,
  } = mark;

  if (!_isString(id)) {
    error = `"id" must be string`;
  } else if (!_isNumber(ts) || ts <= 0) {
    error = `"ts" must be positive number`;
  } else if (symbol !== undefined && !_isString(symbol)) {
    error = `"symbol" must be string`;
  } else if (content !== undefined && !_isString(content)) {
    error = `"content" must be string`;
  } else if (color_bg !== undefined && !COLOR_REGEX.test(color_bg)) {
    error = `"color_bg" must match regex ${COLOR_REGEX}`;
  } else if (color_border !== undefined && !COLOR_REGEX.test(color_border)) {
    error = `"color_border" must match regex ${COLOR_REGEX}`;
  } else if (color_text !== undefined && !COLOR_REGEX.test(color_text)) {
    error = `"color_text" must match regex ${COLOR_REGEX}`;
  } else if (label !== undefined && (!_isString(label) || label.length !== 1)) {
    error = '"label" must be a string of one character';
  } else if (
    size_min !== undefined &&
    (!_isNumber(size_min) || size_min < MIN_SIZE_MIN || size_min > MIN_SIZE_MAX)
  ) {
    error = `"size_min" must be a number between ${MIN_SIZE_MIN} and ${MIN_SIZE_MAX}`;
  }

  return {
    error,
    isValid: error === null,
  };
}

export function isMarksMessage(message) {
  const { type } = message;
  return type === ADD_MARK || type === CLEAR_ALL_MARKS;
}

export function updateMarks(currentMarks, message) {
  const { type } = message;
  if (type === CLEAR_ALL_MARKS) {
    return {};
  }

  if (type === ADD_MARK) {
    const mark = message;

    const { isValid, error } = validateMark(mark);

    if (!isValid) {
      console.warn("[Chart.mark] invalid chart mark:", error);
      return currentMarks;
    }

    const { id } = mark;
    if (currentMarks[id] === undefined) {
      return {
        ...currentMarks,
        [id]: mark,
      };
    }

    // intentionally return the same marks object as was passed
    return currentMarks;
  }

  console.warn(`[Chart.mark] Unexpected chart UCM type: ${type}`);
  return currentMarks;
}

export function sanitizeHtml(html) {
  return sanitize(html, SANITIZE_SETTINGS);
}
