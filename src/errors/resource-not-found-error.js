// error por defecto si existe un 404
export class ResourceNotFound extends Error {
    status;
    constructor(message) {
        super(message);
        this.status = 404;
    };
};