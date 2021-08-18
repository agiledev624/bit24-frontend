import _isFunction from 'lodash/isFunction';

/**
 * 
 * @param {string} temp 
 * @param {Object} data 
 * @param {*} interceptor Object function
 * {
 *  key1: (value) => value > 0 ? 123 : 345;
 * }
 * 
 * @example
 * template('test <number> of <amount>', {
 *  number: 13
 *  amount: -10
 * }); // test 13 of -10
 * 
 * template('test <number> of <amount>', {
 *  number: 13,
 *  amount: -10
 * }, {
 *   amount: (value) => value < 0 ? "ooops" : value;
 * }) // test 13 of ooops
 */
export function strTemplate(temp: string, data: Object = {}, interceptor?: Object): string {
	if (!data)
		data = {};

	return temp.replace(
		new RegExp(`<(${Object.keys(data).join('|')})>`, "g"),
		function (_, key: string) {
			return data.hasOwnProperty(key) ? (interceptor && interceptor[key] && _isFunction(interceptor[key])) ? interceptor[key](data[key]) : data[key] : "";
		}
	);
};