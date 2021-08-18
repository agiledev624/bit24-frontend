const NUMBER_FORMAT_MAP = {};
const DEFAULT_DECIMAL = 8;

export const sliceTo = (
  number: number | string,
  decimal: number = DEFAULT_DECIMAL
): string => {
  if (!number) number = 0;

  let strNumber = number.toString();

  if (strNumber.includes("e-")) {
    // exponent, Ex: 3e-8 -> 0.00000003
    const [n, exponent] = strNumber.split("e-");
    strNumber = `0.${"0".repeat(+exponent - 1)}${n}`;
  }

  let [significand, exponent = ""] = strNumber.split(".");

  if (exponent.length < decimal) {
    exponent = exponent.concat("0".repeat(DEFAULT_DECIMAL - exponent.length));
  }

  exponent = exponent.slice(0, decimal);

  let result = `${significand}`;

  if (decimal) {
    result += `.${exponent}`;
  }

  return result;
};

interface FormatNumberParams {
  number: number | string;
  decimals?: number;
  significantFigures?: number;
  useGrouping?: boolean;
}

/**
 *
 * @param {Object} args
 * number: string | number,
 * decimals: number
 * significantFigures
 * useGrouping
 *
 * @return {string}
 */
export function formatNumber({
  number,
  decimals = 8,
  significantFigures,
  useGrouping = true,
}: FormatNumberParams): string {
  if (decimals > 10) decimals = 10;

  number = sliceTo(number, decimals);

  const options: Intl.NumberFormatOptions = {
    useGrouping,
    // 20 is the max. value supported by "maximumFractionDigits" field
    // it will be overridden below if "decimals" is set
    maximumFractionDigits: 20,
  };
  if (isFinite(decimals) && decimals >= 0) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  } else if (isFinite(significantFigures as number)) {
    options.minimumSignificantDigits = +number !== 0 ? significantFigures : 3;
    options.maximumSignificantDigits = significantFigures;
  }

  const key =
    `${options.useGrouping}-${options.minimumFractionDigits}-` +
    `${options.maximumFractionDigits}-${options.minimumSignificantDigits}-` +
    `${options.maximumSignificantDigits}`;

  let numberFormatter = NUMBER_FORMAT_MAP[key];

  if (!numberFormatter) {
    numberFormatter = new Intl.NumberFormat("EN-US", options);
    NUMBER_FORMAT_MAP[key] = numberFormatter;
  }

  return numberFormatter.format(number);
}
