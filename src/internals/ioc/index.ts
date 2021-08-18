/**
 * An IoC is that you "bind" a resource to the container
 * It means you are able to resolve (or fetch) it at some later point in your application
 * 
 * @usage
 * import IoC ;
 * 
 * -------- Simple usage (simple binding) ------- 
    // We have a class
    class Demo {}

    // Bind "demo" to a callback
    IoC.bind('demo', () => {
        return new Demo();
    });

    // At somewhere in your application, you can resolve "demo"
    let binded = IoC.make('demo'); // Resolved
 * -------- Simple usage (binding with arguments) ------- 
    //... as aforementioned
    IoC.bind('demo', (ioc, params) => {
        return new Demo(params.title);
    });
    let binded = IoC.make('demo', {title: 'demo title'}); // Resolved
 * -------- Simple usage (binding to an instance) -------
    // In this context, an instance is an object that can be "newed up" 
    // eg: a class that will be initialised.

    IoC.bind('demo', Demo); //
    let binded = IoC.make('demo'); // Resolved

    // we are also able to pass in the arguments for the constructer
    let bindedWithParams = IoC.make('demo', {title: 'title'}); // Resolved
 * -------- Simple usage (binding singletons) -------
    // Bind as a singleton
    IoC.singleton('demo', (ioc, params)=>{
        return new Demo();
    });

    // Later in your application...
    let demo1 = IoC.make('demo1');
    let demo2 = IoC.make('demo1');

    console.log(demo1 === demo2); // true
 * -------- Simple usage (Set instance directly) -------
    let demo = new Demo();
    IoC.instances.set('demo', Demo);

    // Later ...
    let binded = IoC.make('demo');
 *
 *
 * -------- Aliases -------
    IoC.alias('demo', 'demoAlias');

    let binded = IoC.make('demoAlias');
 * 
 */
/**
 * Resolving nested dependencies
 * @see Ioc.Meta
 * 
 * // Class A
    class classA {}

    // Class B
    class classB {
        @param {classA} a
        constructor(a){
            this.a = a;
        }
        
        // ... remaining not shown ... //
    }

    // Bind the "a" via callback (just as an example)
    IoC.bind('a', (ioc, params) => {
        return new A();
    });

    // Bind the B class - specify it's expected dependencies
    IoC.bindInstance('b', B, false, [
        '@ref:a'       // '@ref:' prefix MUST be present
    ]);

    // Later...
    let b = IoC.make('b');

    console.log(b.a); // classA{}
 */
export {default as Ioc} from './Ioc.Container'
