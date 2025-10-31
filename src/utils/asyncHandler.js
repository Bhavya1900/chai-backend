
const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}



export {asyncHandler}

//higher order functions which take functions as parameter

// const asyncHandler=()=>{}
    //const asyncHandler=(func)=>async()=>{}

// we are just wrapping all afunctions with async and tr catch


/*const asyncHandler= (fn)=> ()=> async(req,res,next)=>{

    try {
        await fn(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
        
    }
}*/