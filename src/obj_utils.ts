export namespace objUtils {

  declare type Dict<T> = {
    [key: string]: T
  }

  /**
   * Converts the values of an object into another form.
   *
   * @param obj An object with values to remap
   * @param valueMapper A mapping function to convert each value found in the supplied dictionary.
   * @param keyMapper A mapping function to convert keys.
   */
  export function map<V1, V2, T1 extends Dict<V1>, T2 extends Dict<V2>>(obj: T1, valueMapper: (value: V1) => V2, keyMapper?: (key: string) => string) {
    keyMapper ||= (a) => a;
    const result = {} as any;
    for (const key of Object.keys(obj)) {
      const newkey = keyMapper(key);
      result[newkey] = valueMapper(obj[key]);
    }
    return result as T2;
  }

  /**
   * Copies all of the members from one object to another.
   *
   * @param {object} to The object to copy into
   * @param {object} from The object to copy from
   * @return {object} to
   */
  export function copy<T, U>(to: T, from: U) {
    return Object.assign(to, from);
  }

  /**
   * Creates a shallow duplicate of the given object.
   *
   * @param {object} from The object to clone
   * @return {object} The newly cloned object with the same key-value mappings as the input.
   */
  export function clone<T>(from: T) {
    return Object.assign({} as T, from);
  }

  /**
   * Extracts a subset of an object.
   *
   * @param obj The object with one or more key-value mappings.
   * @param keys An array of keys for properties to extract.
   * @return A new object only containing the permitted mappings.
   */
  export function subset<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      result[key as K] = obj[key as K];
    });
    return result;
  }

  /**
   * Returns the first value that is not null or undefined.
   *
   * @param vals The values to pick from
   * @return The first value that is not null or undefined.
   */
  export function first<T>(...vals: T[]) {
    return vals.find(v => v !== null && v !== undefined);
  }
}
