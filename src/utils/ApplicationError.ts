export class ApplicationError extends Error {
    public statusCode: number;
    public details?: any;

    constructor(statusCode = 500, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;

        // Ensure the prototype chain is correctly set
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }
}  