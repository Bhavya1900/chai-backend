class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",//something went wrong is just default if sombody does not passes the message who is invoking the contructor
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message;
        this.success=false
        this.errors=errors

        if(stack){  //production level ka code
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }


}

export {ApiError}