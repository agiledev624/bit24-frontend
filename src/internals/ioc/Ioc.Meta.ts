import { invariant } from "@/exports/invariant";
import { ConcreteTarget } from "./Ioc.types";
import _isFunction from 'lodash/isFunction';

function _isObject(anyVar: any): boolean {
	return typeof anyVar === 'object' && anyVar instanceof Object && !(anyVar instanceof Array);
}

export class Data {
	public target: ConcreteTarget;
	public data: Object;
	public dependencies: any[] = [];

	/**
	 * @constructor
	 *
	 * @throws {Error}
	 */
	constructor(target: ConcreteTarget, data: Object = {}) {
		this.target = target
		this.data = data
		this.dependencies = []
	}
}

class Meta {
	private _map: WeakMap<ConcreteTarget, Data> = new WeakMap<ConcreteTarget, Data>();

	/**
	 * Set meta data for target
	 * 
	 * Method will overwrite any existing meta data for target
	 * 
	 * @throws {Error} if target or given data is invalid
	 */
	set(target: ConcreteTarget, data: Data): Data {
		this._isValidTarget(target)
		let classData = data || ({} as Data);

		if (!(classData instanceof Data))
			classData = new Data(target, data)

		this._map.set(target, classData)

		return classData
	}

	/**
	 * Add meta data for target
	 * 
	 * Fails if there already exists meta data for target
	 * 
	 * @throws {Error} if target or given data is invalid
	 * 
	 */
	add(target: ConcreteTarget, data: Data = {} as Data): Data {
		this._assertTargetDoesNotExist(target)

		return this.set(target, data)
	}

	/**
	 * Returns meta data for the given target
	 * 
	 */
	get(target: ConcreteTarget): Data | undefined {
		return this._map.get(target)
	}

	// Check if target has meta data
	has(target: ConcreteTarget): boolean {
		return this._map.has(target);
	}

	delete(target: ConcreteTarget): boolean {
		return this._map.delete(target)
	}

	/**
	* Alias for delete
	*
	* @see Meta.delete()
	*/
	forget(target: ConcreteTarget): boolean {
		return this.delete(target);
	}

	_isValidTarget(target: ConcreteTarget): boolean {
		invariant(
			_isFunction(target) || _isObject(target),
			`Target must be Function or Object, ${typeof target} given`
		)

		return true
	}

	/**
	 * Assert that given target does not already exist in Meta
	 */
	private _assertTargetDoesNotExist(target: ConcreteTarget) {
		invariant(!this.has(target), `Assert for target '(${target})' is exist`)
	}
}

const instance = new Meta()
Object.freeze(instance)

export default instance