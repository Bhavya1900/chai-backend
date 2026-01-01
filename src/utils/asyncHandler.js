const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
            next(err)
        })
    }
}


//higher order functions which accept fn as parameters
export {asyncHandler}

//const asyncHandler=(func)=>{()=>{}}

// const asyncHandler=(func)=>async(req,res,next)=>{
//     try {
//         await func(req,res,next)
//     } catch (error) {
//         res.status(error.code ||5000).json({
//             success: false,
//             message: error.message
//         })
//     }
// }
