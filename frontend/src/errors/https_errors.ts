// Class instead of interface because Errro already exists as a class and we want to extend it by adding our own fields.
class HttpError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = this.constructor.name;
    }
}


/** 
 *   Status Code 401
 */
export class UnauthorizedError extends HttpError {}


/** 
 *   Status Code 409, already exists
 */
export class ConflictError extends HttpError {}