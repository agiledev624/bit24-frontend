import { invariant } from '@/exports/invariant';
import _isFunction from 'lodash/isFunction';

class Binding {
	public abstract: string | Symbol;
	public concrete: Function | null;
	public isShared: boolean = false;
	public isCallback: boolean = true;

	/**
	 * 
	 * @param {string | Symbol} abstract: Identifier string
	 * @param {Function|null} concrete: The concrete instance of the binding
	 * @param {boolean} isShared: State of the binding, either shared or not 
	 * @param {boolean} isConcreteCallback: true if concrete is a callback, false if it's an instance
	 * 
	 * @throws {Error} If invalid concrete
	 */
	constructor(abstract: string | Symbol, concrete: Function | null = null, isShared: boolean = false, isConcreteCallback: boolean = true) {
		invariant(_isFunction(concrete) || !concrete, 'Concrete must be a callback, Function or null')
		this.abstract = abstract
		this.concrete = concrete
		this.isShared = isShared
		this.isCallback = isConcreteCallback
	}
}

export default Binding