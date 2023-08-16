export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    if (!val) {
        throw Error("Expexted 'val' to be defined, but receieved " + val)
    }
}