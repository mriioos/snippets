/**
 * Inline tools for JavaScript and TypeScript.
 * 
 * This file contains a set of functions that try to improve basic JavaScript code blocks by wrapping or mimicking its behaviour and making them more readable or usable.
 * 
 * The focus is on making these blocks usable in a more inline fashion, allowing them to be used directly inside arguments or on the return of a function, or simply used in a single line of code.
 * 
 * @author Miguel <miguel12105marcos@gmail.com>
 * @version 1.0.0
 * @license MIT License
 * 
 * @repository https://github.com/mriioos/snippets/tree/main/libs/wrappedjs
 * 
 * @note Feel free to use, modify, and distribute it under the terms of the MIT License.
 */

/** 
 * MIT License
 * 
 * Copyright (c) 2024 Miguel Ríos Marcos
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following condition:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Wrapper function for a try-catch block.
 * Helps you escape the 5 lines minimum size of a try-catch hell with Promises.
 * Simplifies handling both async functions and promises by returning the result or error in a tuple.
 * 
 * @param func_or_promise A function returning a promise or a direct promise to be awaited for.
 * @returns Array containing both:
 * - The error of the catch (first element).
 * - The result of a successful try (second element) 
 * 
 * Note: Even with all of this boilerplate code solved, I still can't debug those errors for you, sorry. As the prophecy tells: "One day, all errors will be autodebugged". So cheer up, have a good coding!
 */
export async function try_catch<T>(func_or_promise : (() => Promise<T>) | Promise<T>) : Promise<[any, null] | [null, T]>{
    try{
        const promise = typeof func_or_promise === 'function' ? func_or_promise() : func_or_promise;
        const result : T = await promise;
        return [null, result];
    }
    catch(err : any){
        return [err, null];
    }
}

/**
 * A type representing a valid switcher object.
 * 
 * The object can have:
 * - A 'default' property (explicit key) with any value.
 * - Any other properties (cases) with keys of type string, number, or symbol, and values of any type.
 * 
 * @example
 * {
 *      case1 : 'value1',
 *      case2 : 'value2',
 *      case3 : 'value3',
 *      default : 'default_value'
 * }
 * 
 * @example
 * {
 *      1 : someFunction,
 *      2 : someOtherFunction,  
 *      3 : aThirdFunction,
 *      default : defaultFunction
 * }
 */
export type Switcher<T = any> = { 
    [_case : string | number | symbol] : T | undefined,
    'default'? : T
};

/**
 * Function that acts as a switch-case statement, but with a more flexible approach.
 * It can be used inline, simmilar to a ternary operator.
 * 
 * It allows you to use a separator to define multiple keys for a single case. 
 * But note that this behaviour could be slightly less efficient than using a direct key or multiple cases in a switch.
 * @example
 * // Using a separator:
 * select('case1', {
 *    'case1:case2' : 'value1',
 * });
 * 
 * // Is less efficient than:
 * switch(key){
 *      case 'case1':
 *      case 'case2':
 *          return 'value1';
 *      break;
 * }
 * 
 * // To keep efficiency in this case, you can use multiple keys for the same value:
 * select('case1', {
 *      'case1' : 'value1',
 *      'case2' : 'value1',
 * });
 * 
 * // Also, if switcher object is null, a 'from' function is returned to allow the switcher to be passed as a parameter. 
 * @example
 * select('case1')
 * .from({
 *     'case1' : 'value1',
 *    'case2' : 'value2',
 * });
 * 
 * // or
 * select('case1')
 * .from({
 *    'case1:case2' : 'value1',
 *    'case3' : 'value2',
 * }, ':'); // <- Separator defined
 * 
 * @param key Value to be searched for in the switcher.
 * @param switcher Object that maps the value to be searched with the return value (optional).
 * @param separator String that separates multiple keys in a single case (optional).
 * @returns 
 * 
 * Note : Admits a 'default' key in the switcher object to return a default value when no case is found.
 */
export function select<T>(key: any, switcher: Switcher<T>, separator?: string): T;
export function select<T>(key: any): { from: (switcher: Switcher<T>, separator?: string) => T };

export function select<T = any>(key : any, switcher? : Switcher<T>, separator? : string){

    // Return a function called 'from' (to select-from) that accepts the switcher if it is not defined
    if(!switcher) return { from : (switcher : Switcher<T>, separator? : string) => select<T>(key, switcher, separator) as T }; // T can be casted because switcher is defined

    // Get value directly if separator is not defined
    if(!separator) return switcher[key] ?? switcher['default'];

    // Find first key in switcher that includes the search-by key if separator is defined
    const found_key : any = switcher[key] ?? Object.keys(switcher).find((switcher_key : string | number | symbol)=> {

        // Only split key by separator if it is a string
        if(typeof switcher_key === 'string'){

            // Check if case key is included in switcher_key
            return switcher_key.split(separator).includes(key);   
        }

        // Manage non-string keys by comparing them directly
        return switcher_key === key;
    });

    return switcher[found_key ?? 'default'];
}