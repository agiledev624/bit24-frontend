// helpers function about math
import * as math from 'mathjs';

const precision = 15;
const upperExp = 10;
const lowerExp = -8;

/**
 * @ref: http://mathjs.org/docs/reference/functions/format.html
 */
const DEFAULT_CONFIG: math.FormatOptions = {
    precision,
    upperExp,
    lowerExp
};

export const format = (value: any, config?: Object): string => math.format(value, Object.assign({}, DEFAULT_CONFIG, config));

export const add = (x: math.MathType, y: math.MathType): string => format(math.add(x, y));

export const subtract = (x: math.MathType, y: math.MathType): string => format(math.subtract(x, y));

export const multiply = (x: math.MathType, y: math.MathType): string => format(math.multiply(x, y));

export const divide = (x: math.MathType, y: math.MathType): string => format(math.divide(x, y));

export const round = (x: any, y: number): string => format(math.round(x, y));

export const compare = (x: string | number, y: string | number): number => math.compare(x, y) as number;

export const isGreaterThanOrEquals = (x: string | number, y: string | number): boolean => {
    const result = compare(x, y);
    return result >= 0;
}

export const isLessThanOrEquals = (x: string | number, y: string | number): boolean => {
    const result = compare(x, y);
    return result <= 0;
}

export const isGreaterThan = (x: string | number, y: string | number): boolean => {
    const result = compare(x, y);
    return result > 0;
}

export const isLessThan = (x: string | number, y: string | number): boolean => {
    const result = compare(x, y);
    return result < 0;
}


export const chain = math.chain;

export default {
    format,
    add,
    subtract,
    multiply,
    divide,
    round,
    chain
};
