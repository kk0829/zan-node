class BusinessError extends Error {
    constructor(type, code, msg) {
        super(type);
        this.errorContent = {
            type,
            code,
            msg
        };
    }
}

export default BusinessError;
