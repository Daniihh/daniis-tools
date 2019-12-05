/**!
 * Danii's Tools
 * 
 * Copyright (c) 2019 Daniel Conley
 * Licensed under the GNU General Public License Version 3.
 * https://www.gnu.org/licenses/gpl-3.0.txt
 */

/*
  TTTTT Y   Y PPPP  EEEEE  SSSS
    T    Y Y  P   P E     S    
    T     Y   PPPP  EEE    SSS 
    T     Y   P     E         S
    T     Y   P     EEEEE SSSS 
*/

/*
  Excluded Types.
*/

/**
 * Object property getter function.
 * 
 * Exclusion Reason: Isn't necessary.
 */
type Getter = () => any;

/**
 * Object property setter function.
 * 
 * Exclusion Reason: Isn't necessary.
 */
type Setter = (v: any) => void;

/**
 * Entry type for `Object.entries` and `Object.fromEntries`.
 * 
 * Exclusion Reason: See
 *   [this pull request](https://github.com/microsoft/TypeScript/pull/26797).
 */
type Entry<T> = Pair<string, T>;

/**
 * Any type that can be used as an object key.
 * 
 * Exclusion Reason: See
 *   [this pull request](https://github.com/microsoft/TypeScript/pull/26797).
 */
type Key = string | number | symbol;

/**
 * Represents any primitive value's prototype. Using
 * `typeof` on primitive's prototypes reveal that they are
 * objects and`instanceof` reveals that they are not
 * instances of their constructor properties.
 * 
 * Exclusion Reason: Exporting is not necessary at this point in time.
 */
type PsuedoObject<T extends Primitive> =
  T extends string ? {[P in keyof string]: string[P]} & {constructor: Constructor<string>} :
  T extends number ? {[P in keyof number]: number[P]} & {constructor: Constructor<number>} :
  T extends bigint ? {[P in keyof bigint]: bigint[P]} & {constructor: Constructor<bigint>} :
  T extends boolean ? {[P in keyof boolean]: boolean[P]} & {constructor: Constructor<boolean>} :
  T extends symbol ? {[P in keyof symbol]: symbol[P]} & {constructor: Constructor<symbol>} :
  {[P in keyof T]: T[P]} & {constructor: Constructor<T>};

/**
 * A union of all JavaScript primitives.
 * 
 * Exclusion Reason: Exporting is not necessary at this point in time.
 */
type Primitive = string | number | bigint | boolean | symbol;

/*
  Quick Definitions
*/

/**
 * A key-value tuple. `K` is the key, `V` is the value.
 * Although stating this type definition is longer than
 * writing `[K, V]`, it is a more elegant way of writing a
 * key-value tuple.
 */
export type Pair<K, V> = [K, V];

//BELOW TYPE DOES NOT WORK: https://github.com/microsoft/TypeScript/pull/26797
//incomplete docs too
/**
 * An object that is a map of key-value pairs. The key must
 * be a type passable to an object's key.
 * 
 * The name comes from the sentence "**A** map of key-value
 * pairs".
 */
//export type A<K extends string | number, V> = {[key: string | number]: V};

/**
 * An object in which each value is of type `T`.
 * 
 * The name comes from the sentence "An object **of** *T*".
 */
export type Of<T> = {[key: string]: T}; //A<string | number, T>;

/*
  Array Modifiers
*/

/**
 * A function which takes in values under `current` from the
 * object `object`, and returns a new value based off the
 * input.
 * 
 * @param current The value to be operated upon.
 * @param index The index of the `current` value within
 *   `object`.
 * @param object The object the values are originating from.
 * 
 * @template V The type of the values being passed into
 *   `current`.
 * @template R The type of the new values being returned.
 * @template F The type of the object the values are
 *   originating from. Defaults to `Array<V>`.
 * @template T The type of object this function is ran on.
 */
export type Mapper<V, R, F = V[], T = any> =
  (this: T, current: V, index?: number, object?: F) => R;

/**
 * A function which takes in values under `current` from the
 * object `object`, and the return value from the last time
 * of this function's execution, `accumulator`.
 * 
 * If this is the first time executing this function upon
 * object, the accumulator value may be the first value
 * within object, while current takes in the next value, or
 * the accumulator value may be an explicit initial value.
 * 
 * @param accumulator The return value of the last execution
 *   of this function. If this is the first time executing
 *   this function, may be the first value within `object`
 *   or an explicit initial value.
 * @param current The value to be operated on.
 * @param index The index of the `current` value within
 *   `object`.
 * @param object The object the values are originating from.
 * 
 * @template V The type of the values being passed into
 *   `current`.
 * @template R The return value type, the accumulator.
 * @template F The type of the object the values are
 *   originating from. Defaults to `Array<V>`.
 * @template I The initial value type. Defaults to `V`.
 * @template T The type of object this function is ran on.
 */
export type Reducer<V, R, F = V[], I = V, T = any> =
  (this: T, accumulator: R | I, current: V, index?: number, object?: F) => R;

/**
 * A function which takes in values under `current` from the
 * object `object`, and preforms some action upon it.
 * 
 * This is a shorthand for `Mapper<V, void, F, T>`.
 * 
 * @param current The value to be operated upon.
 * @param index The index of the `current` value within
 *   `object`.
 * @param object The object the values are originating from.
 * 
 * @template V The type of the values being passed into
 *   `current`.
 * @template F The type of the object the values are
 *   originating from. Defaults to `Array<V>`.
 * @template T The type of object this function is ran on.
 */
export type Consumer<V, F = V[], T = any> = Mapper<V, void, F, T>;

/*
  Miscellaneous
*/

/**
 * The timeout ids used within this environment's timeout
 * functions. This type automagically changes to the type
 * `NodeJS.Timer` under a node environment, and changes to
 * `number` under a browser environment.
 * 
 * Typing is better than `any`.
 */
export type Timeout = ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>;

/**
 * A constructor function, such as a class.
 */
export type Constructor<T> =
  {prototype: T, name?: string} &
  T extends Primitive ? {(...args: any[]): T} : {new(...args: any[]): T};

/**
 * A stack frame object.
 */
type StackFrame = {
  name?: string,
  file?: string,
  isConstructor?: boolean,
  isNative?: boolean,
  evaluater?: StackFrame,
  line?: number,
  column?: number
}



/*
   AAA  DDDD  DDDD  IIIII TTTTT IIIII  OOO  N   N  SSSS
  A   A D   D D   D   I     T     I   O   O NN  N S    
  AAAAA D   D D   D   I     T     I   O   O N N N  SSS 
  A   A D   D D   D   I     T     I   O   O N  NN     S
  A   A DDDD  DDDD  IIIII   T   IIIII  OOO  N   N SSSS 
*/

/**
 * Internal function for defining a large amount of
 * properties, `values`, to an object, `target`.
 * 
 * @param target The object to assign the `values` to.
 * @param values The values to be assigned.
 * 
 * @template T The type of the target.
 */
let defineProperties = <T>(target: T, values: Partial<T>) => {
  let reducer = (map: PropertyDescriptorMap, key: string):
      PropertyDescriptorMap => ({
    ...map,
    [key]: {
      ...Object.getOwnPropertyDescriptor(values, key),
      "enumerable": false
    }
  });

  Object.defineProperties(target, Object.keys(values).reduce(reducer, {}));
}

/*
  Updated Definitions
*/
//TODO: Fit code within 80 characters width.

declare global {
  interface Array<T> {
    /*
      New Getters / Setters
    */
    last: T;
  
    /*
      New Functions
    */

    /**
     * Executes .flat and .crumble all in one go.
     * 
     * @see Array.prototype.flat
     * @see Array.prototype.crumble
     * @param depth The maximum recusrion depth.
     * @returns Null, one element or the array with sub
     *   arrays concatinated.
     */
    crumbleFlat(depth?: number): null | T | T[];
  
    /**
     * Returns null if nothing is in the array, or the one
     * element in an array if the array only contains one
     * value, otherwise the array itself if more than one
     * elements are stored.
     * 
     * Can be thought of as trying to remove an array's
     * brackets.
     * 
     * @returns Null, one element or the array itself.
     */
    crumble(): null | T | T[];
  
    //TODO: Gimmie docs!
    reduceSkip<R = T>(callback: (previous: T | R, current: T, skip: symbol, index?: number, array?: T[]) => R | symbol): (T | R)[];
    reduceSkip<R = T, I = T>(callback: (previous: R | I, current: T, skip: symbol, index?: number, array?: T[]) => R | symbol, initial?: I): (R | I)[];
  
    /**
     * Reverses the elements in an array without changing
     * itself.
     * 
     * @returns A new array with the values reversed.
     */
    softReverse(): T[];
  
    /*
      Better Typed Functions
    */
    every<TH = any>(callback: Mapper<T, boolean, this, TH>, thisArg?: TH): boolean;
    filter<TH = any>(callback: Mapper<T, boolean, this, TH>, thisArg?: TH): T[];
    find<TH = any>(callback: Mapper<T, boolean, this, TH>, thisArg?: TH): T;
    findIndex<TH = any>(callback: Mapper<T, boolean, this, TH>, thisArg?: TH): number;
    forEach<TH = any>(callback: Consumer<T, this, TH>, thisArg?: TH): void;
    map<R = void, TH = any>(callback: Mapper<T, R, this, TH>, thisArg?: TH): R[];
    reduce<R = T>(callback: Reducer<T, R, this>): T | R;
    reduce<R = T, I = T>(callback: Reducer<T, R, this, I>, initial: I): R | I;
    reduceRight<R = T>(callback: Reducer<T, R, this>): T | R;
    reduceRight<R = T, I = T>(callback: Reducer<T, R, this, I>, initial: I): R | T;
    some<TH = any>(callback: Mapper<T, boolean, this, TH>, thisArg?: TH): boolean;
  }

  interface ObjectConstructor {
    /*
      New Functions
    */
    clone<T extends Object>(item: T): T;
  
    every<T, V, TH = any>(object: Of<V> & T, callback: Mapper<Entry<V>, boolean, T, TH>, thisArg?: TH): boolean;
    filter<T, V, TH = any>(object: Of<V> & T, callback: Mapper<Entry<V>, boolean, T, TH>, thisArg?: TH): Of<V>;
  
    getType(item: any): string;
    objectHasOwnProperty(object: any, property: Key): boolean;
    objectHasProperty(object: any, property: Key): boolean;
    
    /*
      Better Typed Functions
    */
    entries<T>(object: Of<T>): Entry<T>[];
    fromEntries<T>(entries: Entry<T>[]): Of<T>;
    getPrototypeOf<T extends Primitive>(instance: T): PsuedoObject<T>;
    getPrototypeOf<T>(instance: T): T;
  }

  interface String {
    /*
      New Functions
    */
    capitalize(): string;
    escape(nonSpecials?: boolean): string;
    toTitleCase(): string;

    /**
     * Interpolates a string as if it was a template.
     * It should be noted that templates execute code, and that has
     * been emulated by this function.
     * 
     * @param str String to interpolate with.
     * @param values The variables supplied.
     */
    interpolate(values: Of<any>);
  }

  interface SymbolConstructor {
    readonly skip: symbol;
  }
}

/*
  Appended Properties
*/
//TODO: Fit code within 80 characters width.

defineProperties(Array.prototype, {
  get last(this: any[]) {
    return this[Math.max(0, this.length - 1)];
  },

  set last(this: any[], item: any) {
    this[Math.max(0, this.length - 1)] = item;
  },

  crumble(this: any[]) {
    let switchObj = {
      "0": null,
      "1": this[0],
      "default": this,
    };

    return this.length > 1 ? switchObj.default : switchObj[this.length];
  },
  
  crumbleFlat(this: any[], depth?: number) {
    return this.flat(depth).crumble();
  },

  //TODO: Attempting to use Type Paramaters here is a nightmare, so any is used instead.
  reduceSkip<Type>(this: Type[], callback: (previous: any, current: Type,
      skip: symbol, index: number, array: Type[]) => any, initial: any): any[] {
    let previousExists = false;
    let skip = Symbol.skip;
    let previous;
    let out = [];

    for (let index = 0; index < this.length; index++) {
      let value = this[index];
      if (!previousExists) {
        previousExists = true;
        if (arguments.length > 1) previous = Object.clone(initial);
        else {previous = value; continue;}
      }

      let result = callback(previous, value, skip, index, this);
      if (result == skip) {
        out.push(previous);
        previousExists = false;
        index--;
      } else {
        previous = result;
      }
    }
    if (previousExists) out.push(previous);
    return out;
  },

  softReverse(this: any[]) {
    let ret = [];
    for (let entry of Array.from(this.entries())) ret[entry[0] * -1 + this.length - 1] = entry[1];
    return ret;
  }
} as Partial<any[]>);

defineProperties(Object, {
  clone<T>(item: T): T {
    if (typeof item != "object") return item;

    let Construct = item.constructor as Constructor<T extends Primitive ? never : T>;
    //@ts-ignore: Construct WILL always have a construct
    //signature because we already handled all primitives.
    return Object.assign(new Construct(), item);
  },

  every<Type, Values, This = any>(this: ObjectConstructor, object: Of<Values> & Type, callback: Mapper<Entry<Values>, boolean, Type, This>, thisArg?: This): boolean {
    return this.entries(object).every((a, i) => callback.call(thisArg, a, i, object));
  },

  filter<Type, Values, This = any>(this: ObjectConstructor, object: Of<Values> & Type, callback: Mapper<Entry<Values>, boolean, Type, This>, thisArg?: This): Of<Values> {
    return this.fromEntries(this.entries(object).filter((a, i) => callback.call(thisArg, a, i, object)));
  },

  getType(item: any) {
    return Object.getPrototypeOf(item).constructor.name;
  },

  objectHasOwnProperty(object: any, property: Key) {
    return [].hasOwnProperty.call(object, property);
  },

  objectHasProperty(this: ObjectConstructor, object: any, property: Key) {
    let protoChain: Object[] = [object];
    while (this.getPrototypeOf(protoChain.last) !== null) protoChain.push(this.getPrototypeOf(protoChain.last));
    return protoChain.some((proto) => this.objectHasOwnProperty(proto, property));
  }
});

defineProperties(String.prototype, {
  capitalize() {
    return this.substr(0, 1).toUpperCase() + this.substr(1);
  },

  escape(nonSpecials: boolean = true) {
    let charArray = this.split("");
    if (nonSpecials) charArray = charArray.map((char) => ['"', "'", "\\"].includes(char) ? "\\" + char : char)
    charArray = charArray.map((char) => ["\n", "\r", "\t"].includes(char) ? "\\" + {"\n": "n", "\r": "r", "\t": "t"}[char] : char);
    return charArray.join("");
  },

  toTitleCase() {
    return this.split(" ").map((word) => word.toLowerCase().capitalize()).join(" ");
  },

  interpolate(this: string, values: Of<any>) {
    let from = 0;
    let data: {content: string, type: "string" | "code"}[] = [];
    let asString = (obj) =>
      obj === null ? "null" : obj === undefined ? "undefined" :
      typeof obj.toString == "function" ? obj.toString() :
      Object.prototype.toString.call(obj);
    let push = (content: string, code?: boolean) =>
      data.push({content, "type": code ? "code" : "string"});
    [...this.matchAll(/\\?\$/g), null].forEach(val => {
      if (val && val[0].startsWith("\\")) return;
      let str = this.substring(from, val ? val.index : this.length);
      if (str) push(str);
      if (val) {
        let pos = findPairs(this, {"{": num => ++num, "}": num => ++num});
        let code = this.substring(val.index + 2, pos);
        if (code) push(code, true);
        from = pos + 1;
      }
    });
    return data.reduce((acc, val) => acc + (val.type == "code" ?
      asString(evaluate(val.content, values)) :
      val.content), "");
  }
} as Partial<String>);

defineProperties(Symbol, {
  "skip": Symbol("skip")
});



/*
  FFFFF U   U N   N  CCCC TTTTT IIIII  OOO  N   N  SSSS
  F     U   U NN  N C       T     I   O   O NN  N S    
  FFF   U   U N N N C       T     I   O   O N N N  SSS 
  F     U   U N  NN C       T     I   O   O N  NN     S
  F      UUU  N   N  CCCC   T   IIIII  OOO  N   N SSSS 
*/

const keywords = ["arguments", "in", "of", "for", "if", "else", "throw", "while", "do", "with", "function", "let", "const", "var", "new", "return", "delete"];

/**
 * Ensures that the mentioned method's this value will
 * always be that of the object it belongs to.
 * 
 * @param proto Prototype of the object.
 * @param key Name of the function.
 * @param descriptor Function's descriptor.
 */
export function bound<Type extends (...a: any[]) => any>(proto: Object,
    key: string, descriptor: TypedPropertyDescriptor<Type>) {
  if (proto.constructor == Object) descriptor = proto; //BABEL Fix

  let value = descriptor.value;
  delete descriptor.writable;
  delete descriptor.value;

  descriptor.get = function() {return value.bind(this) as Type;}
  return descriptor;
}

/**
 * Exclusion Reason:
 * This decorator currently doesn't work in TypeScript due
 * to TypeScript not allowing decorators to change the
 * signature of the underlying function.
 * 
 * @param proto 
 * @param key 
 * @param descriptor 
 * @deprecated This function doesn't work in TypeScript.
 */
function withSelf(proto, key, descriptor) {
  let value = descriptor.value;
  delete descriptor.writable;
  delete descriptor.value;

  descriptor.get = function() {
    let thisHere = this;
    return function(...items) {
      return value.call(thisHere, this, ...items);
    }
  }
  return descriptor;
}

/**
 * Works like the `eval` function, except it's evaluated
 * within a function, so it's safer. You can set the name
 * and values of the arguments to be used with the args
 * object, and it'll return a value with or without a
 * return statement in the provided code.
 * 
 * Exclusion reason: Uhhh it's new so yeah?
 * 
 * @param code The code to be executed.
 * @param args The arguments to be used.
 */
function evaluate(code: string, args: Of<any> = {}) {
  let specialArgNames = ["this"];
  let specialArgs: Of<any> = {};
  args = Object.filter(args, ([key, value]) => {
    if (specialArgNames.includes(key)) {
      specialArgs[key] = value;
      return false;
    } else if (keywords.includes(key)) {
      throw new TypeError("Illegal argument name provided.");
    } else return true;
  });

  let argNames = args ? Object.keys(args) : [];
  let argValues = args ? Object.values(args) : [];
  let finalCode = `try{return eval("${code.escape()}")}catch(a){if(!(a ` +
    'instanceof SyntaxError))throw a;let b=JSON.parse("' +
    JSON.stringify(argNames).escape() + '");return new Function(...b,"' +
    code.escape() + '")(...arguments)}';
  let func = new Function(...argNames, finalCode);
  return func.call(specialArgs.this ? specialArgs.this : this, ...argValues);
}

function findPairs(this: string | void, stringOrOperators: string | string[] |
    Of<(depth: number) => number>, operatorsOrLocation?: number |
    Of<(depth: number) => number>, locationOrDepth?: number,
    depthArg?: number) {
  const [string, operators, location, depth] =
    stringOrOperators instanceof Array || typeof stringOrOperators == "string" ||
    stringOrOperators instanceof String ?
      [
        typeof stringOrOperators == "string" ?
          stringOrOperators.split("") : stringOrOperators as string[],
        operatorsOrLocation as Of<(depth: number) => number>,
        locationOrDepth as number || 0,
        depthArg == null ? -1 : depthArg as number
      ] :
      [
        (this as string).split(""),
        stringOrOperators as Of<(depth: number) => number>,
        operatorsOrLocation as number || 0,
        locationOrDepth == null ? -1 : locationOrDepth as number
      ];
  if (depth == 0) return location;
  const operation = operators[string[location]];
  const newDepth = operation ? operation(depth == -1 ? 0 : depth) : depth;
  return findPairs(string, operators, location + 1, newDepth);
}



/*
   CCCC L      AAA   SSSS  SSSS EEEEE  SSSS
  C     L     A   A S     S     E     S    
  C     L     AAAAA  SSS   SSS  EEE    SSS 
  C     L     A   A     S     S E         S
   CCCC LLLLL A   A SSSS  SSSS  EEEEE SSSS 
*/

export class Exception extends Error {
  private static nodeError = /^(.*?)(?:: (.*?))?\n([\w\W]*)$/;
  private static nodeStackFrame = /^\s*at\s+(.+?)(?:\s+\((.+?)\))?$/; //match 1: nodeFileDescriptor | functionName: string, match 2: nodeFileDescriptor | nodeEvalDescriptor | null
  private static nodeFileDescriptor = /^(\S*?):(\d+):(\d+)$/; //match 1: fileName: string, match 2: line: number, match 3: column: number
  private static nodeEvalDescriptor = /^eval\s+at\s+(.*?)\s+\((.*?)\)(?:, (.*?))?$/; //match 1: evaluateeFunc: string, match 2: nodeFileDescriptor | nodeEvalDescriptor, match 3: nodeFileDescriptor | null

  public static parseError(error: Error) {
    return this.parseNodeError(error.stack);
  }

  @bound
  private static parseNodeError(error: string): {name: string, message?: string,
      stack: StackFrame[]} {
    let output: Partial<{name: string, message?: string, stack: StackFrame[]}> = {};
    let stackMatch = error.match(this.nodeError);
    output.name = stackMatch[1];
    output.message = stackMatch[2];
    output.stack = stackMatch[3].split("\n").map(this.parseNodeStackFrame);
    return output as {name: string, message?: string, stack: StackFrame[]};
  }

  @bound
  private static parseNodeStackFrame(frame: string) {
    let output: Partial<StackFrame> = {};
    let stackFrameMatch = frame.match(this.nodeStackFrame);
    let stackFileMatch: RegExpMatchArray;
    console.log(frame);
    if (stackFrameMatch[2] == null) {
      stackFileMatch = stackFrameMatch[1].match(this.nodeFileDescriptor);
    } else {
      output.name = stackFrameMatch[1];
      if (output.name.startsWith("new ")) {
        output.name = output.name.substr(4);
        output.isConstructor = true;
      }
      stackFileMatch = stackFrameMatch[2].match(this.nodeFileDescriptor);
      if (!stackFileMatch) {
        let stackEvalMatch = stackFrameMatch[2].match(this.nodeEvalDescriptor);
        if (stackEvalMatch)
          return this.parseNodeEvalDescriptor(output.name, stackFrameMatch[2]);
      }
    }
    if (stackFileMatch) {
      output.file = stackFileMatch[1];
      output.line = parseInt(stackFileMatch[2]);
      output.column = parseInt(stackFileMatch[3]);
    } else output.isNative = true;
    return output as StackFrame;
  }

  @bound
  private static parseNodeEvalDescriptor(evaluateeName: string,
      evalDescriptor: string) {
    let output: Partial<StackFrame> = {"name": evaluateeName, "evaluater": {}};
    let stackEvalMatch = evalDescriptor.match(this.nodeEvalDescriptor);
    let stackEvalMatch2 = stackEvalMatch[2].match(this.nodeEvalDescriptor);
    if (stackEvalMatch2) {
      output.evaluater =
        this.parseNodeEvalDescriptor(stackEvalMatch[1], stackEvalMatch[2]);
    } else {
      output.evaluater.name = stackEvalMatch[1];
      if (output.evaluater.name.startsWith("new ")) {
        output.evaluater.name = output.evaluater.name.substr(4);
        output.evaluater.isConstructor = true;
      }
      let stackFileMatch = stackEvalMatch[2].match(this.nodeFileDescriptor);
      output.evaluater.file = stackFileMatch[1];
      output.evaluater.line = parseInt(stackFileMatch[2]);
      output.evaluater.column = parseInt(stackFileMatch[3]);
    }
    if (stackEvalMatch[3]) {
      let stackFileMatch = stackEvalMatch[3].match(this.nodeFileDescriptor);
      output.file = stackFileMatch[1];
      output.line = parseInt(stackFileMatch[2]);
      output.column = parseInt(stackFileMatch[3]);
    }
    return output;
  }

  public static getStack() {
    return new Exception().stackModel;
  }

  public readonly stackModel: StackFrame[];

  public constructor(message?: string) {
    super(message);

    this.name = this.constructor.name;

    try {
      this.stackModel = Exception.parseError(this).stack;
    } catch (ex) {
      this.stackModel = undefined;
    }
  }
}

Error.stackTraceLimit = Infinity;