export interface BindingType {
    abstract: string;
    concrete: Function | Object;
    isShared: boolean;
    isCallback: boolean;
};

export type ConcreteTarget = Function | BindingType;