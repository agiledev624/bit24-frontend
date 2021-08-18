import Binding from './Ioc.Binding';
import Meta, { Data } from './Ioc.Meta'
import { invariant } from '@/exports/invariant';
import { ConcreteTarget } from './Ioc.types';

/**
 * Prefix key for referencies that need to be resolved by the Container
 * 
 * @see Container.defineDependencies()
 * @see Container.getDependencies()
 * 
 * @type {string}
 */
export const REFERENCE_KEY = '@ref:'
/**
     * IOC Service Container
     */
class Container {
	public bindings:Map<string | Symbol, Binding> = new Map<string, Binding>();
	public aliases: Map<string | Symbol, string> = new Map<string, string>();
	public instances: Map<string | Symbol, ConcreteTarget> = new Map<string, ConcreteTarget>();


	/**
	 * Register a binding in this container, with a callback method
	 */
	bind(abstract: string | Symbol, callback: Function|null = null, isShared: boolean = false) {
		this._bind(abstract, callback, isShared, true)
	}

	/**
	* Register a binding in this container, with a class reference.
	*
	* Class will be initialised via the "new" operator, whenever instance is resolved.
	*
	* @see defineDependencies()
	*/
	bindInstance(abstract: string, instance: Function|null = null, isShared: boolean = false, dependencies: any[] = []) {
		this._bind(abstract, instance, isShared, false)

		if (dependencies.length > 0) {
			this.defineDependencies(instance, dependencies)
		}
	}

	/**
	 * Define dependencies for the given instance 
	 * 
	 * If the given dependencies are supposed to be references to `abstracts` or `aliases`,
	 * then prefix each reference with the `REFERENCE_KEY`
	 * 
	 * @see REFERENCE_KEY
	 * 
	 */
	defineDependencies(instance: Function | null, dependencies: any[] = [], isClass: boolean = true): Data | undefined{
		invariant(!!instance, 'Do not accept adding dependencies for null!')

		if(instance) {
			let meta = Meta.add(instance)
			meta.dependencies = dependencies;
			return meta
		}

		return undefined
	}

	/**
	 * Check if binding exsits for abstract
	 * 
	 * @returns {boolean}
	 */
	bound(abstract: string | Symbol): boolean {
		return this.bindings.has(abstract) || this.instances.has(abstract) || this.aliases.has(abstract)
	}

	/**
	 * Assign an alias for the abstract
	 */
	alias(abstract: string, alias: string) {
		invariant(this.bound(abstract), `Cannot assign alias for abstract "${abstract}". Abstract has no binding.`)

		this.aliases.set(alias, abstract)
	}

	/**
	 * Register a singleton (shared) binding
	 */
	singleton(abstract: string, callback?: Function) {
		this.bind(abstract, callback, true)
	}

	/**
	 * Register a singleton (shared) binding to the given instance
	 * 
	 * @see Container.bindInstance()
	 */
	singletonInstance(abstract: string, instance: Function | null, dependencies: any[] = []) {
		this.bindInstance(abstract, instance, true, dependencies)
	}

	/**
	 * Resolve the registered abstract from the container
	 * 
	 * @param {string} abstract 
	 * @param {Object|Array} parameters 
	 */
	make(abstract: string, parameters: Object | any[] = {}) {
		// If an alias was given, find it's corresponding abstract
		// identifier and return it. If not, the given abstract is used
		abstract = this.getAbstract(abstract)

		// if the requested abstract has a shared (singleton) instance registered
		// and was previously instantiated, then we must return that instance
		if (this.instances.has(abstract))
			return this.instances.get(abstract)

		// Obtain the matching binding
		let binding = this.getBinding(abstract)

		// Build the concrete instance, if concrete is buildable. Otherwise, we must assume that the concrete
		// is some kind of object that we can return.
		//@ts-ignore
		let object = this.build(binding, parameters)

		// If binding was registered to be a shared instance (singleton),
		// then we must store the object reference, so that it can be returned when it is required again
		if (binding && binding.isShared) {
			this.instances.set(abstract, object)
		}

		return object
	}

	/**
	 * Build and return the concrete instance of given type
	 * 
	 * @param {Object | Array} parameters 
	 * 
	 * @returns {Object}
	 * 
	 * @throws {Error}
	 */
	build(concrete: ConcreteTarget | null, parameters = {}): any {
		// if the given 'concrete' is a Binding instance and it's declared as having a callback, then
		// invoke the callback with this contain and given parameters.
		if (concrete instanceof Binding && concrete.isCallback) {
			//@ts-ignore
			return concrete.concrete(this, parameters)
		}

		// If the concrete is a Binding, but not a callback, then obtain the binding's concrete
		if (concrete instanceof Binding) {
			//@ts-ignore
			concrete = concrete.concrete
		}

		// If null was bound or given, then just return null
		if (concrete === null)
			return concrete

		if (!Array.isArray(parameters)) {
			//@ts-ignore
			parameters = Object.keys(parameters).map((key) => parameters[key])
		}

		//@ts-ignore
		if (Meta.has(concrete) && parameters.length === 0) {
			parameters = this.getDependencies(concrete as Function)
		}

		//@ts-ignore
		return new concrete(...parameters)
	}

	/**
	 * Resolves and returns a list of dependencies
	 * 
	 * Method assumes that given concrete has associated "meta data" in which
	 * one or several dependencies are defined
	 * 
	 * @see Meta.add()
	 * 
	 * @param {Function} concrete 
	 * @returns {Array}
	 * 
	 * @throws {Error}
	 */
	getDependencies(concrete: Function): any[] {
		let args: any[] = []

		// Fetch the dependencies from the concrete's associated meta class
		// (or method) data. If none is avaiable, then return empty dependencies.
		if (!(Meta.has(concrete))) {
			return args
		}

		//@ts-ignore
		let dependencies = Meta.get(concrete).dependencies

		if (dependencies.length === 0) {
			return args
		}

		// Resolve each dependency
		let depLength = dependencies.length
		for (let i = 0; i < depLength; i++) {
			let elem = dependencies[i]
			let resolved = this.resolveDependencyType(elem)

			invariant(resolved, `Unable to resolve "${elem.toString()}" dependency for "${concrete.toString()}"`)

			args[args.length] = resolved
		}

		return args
	}

	/**
	 * Resolves the element based on its type
	 * 
	 * @return {any | null} Null if unable to resolve dependency
	 * 
	 * @throws {Error}
	 */
	resolveDependencyType(elem?: any): any | null {
		switch (typeof elem) {
			case 'string': {
				// If string is actually an abstract or alias reference
				// Then we must resolve it.
				let resolved = elem
				if (this.containsReference(elem)) {
					resolved = this.resolveReference(elem)
				}
				return resolved
			}
			// Object, boolean or number ...
			case 'object':
			case 'boolean':
			case 'number':
			case 'function':
			case 'symbol': {
				return elem
			}
			// Unknown
			default: {
				return null
			}
		}
	}

	/**
	 * Check if string contains a reference to an "abstract" or "alias"
	 */
	containsReference(elem: string): boolean {
		return elem.startsWith(REFERENCE_KEY)
	}

	/**
	 * Resolves a string reference to an "abstract" or "alias"
	 * 
	 * @param {string} elem 
	 * 
	 * @throws {Error}
	 */
	resolveReference(elem: string): any {
		return this.make(elem.replace(REFERENCE_KEY, ''))
	}

	getBinding(abstract: string | Symbol): Binding | undefined {
		invariant(this.bindings.has(abstract), `No binding found for abstract "${abstract.toString()}"`)

		return this.bindings.get(abstract)
	}

	/**
	 * Forget the given binding
	 * 
	 * @param {string|Function} abstractOrInstance 
	 */
	forget(abstractOrInstance: any) {
		this.bindings.delete(abstractOrInstance)
		this.aliases.delete(abstractOrInstance)
		this.instances.delete(abstractOrInstance)
		Meta.delete(abstractOrInstance)
	}

	/**
	 * Flush the container
	 */
	flush() {
		this.bindings.clear()
		this.aliases.clear()

		this.instances.forEach(function (value) {
			Meta.delete(value)
		})

		this.instances.clear()
	}

	getAbstract(alias: string): string {
		// return the abstract identifier, if it's not an actual alias
		if (!this.aliases.has(alias)) {
			return alias
		}

		//@ts-ignore
		return this.aliases.get(alias)
	}

	_bind(abstract: string | Symbol, concrete: Function | null = null, isShared: boolean = false, isConcreteCallback: boolean = false) {
		let binding = new Binding(abstract, concrete, isShared, isConcreteCallback)

		this.bindings.set(binding.abstract, binding);
	}
}

const instance = new Container()
Object.freeze(instance)

export default instance