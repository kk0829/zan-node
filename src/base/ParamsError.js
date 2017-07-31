class ParamsError extends Error {
    constructor(code, msg) {
        super();
        this.errorContent = {
            type: 'paramsError',
            code,
            msg
        };
    }
}

export default ParamsError;
