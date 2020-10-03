const jwt = require('jsonwebtoken');

function restrict(level){
  const roles =['basic','admin','romeo']
    return async (req,res,next)=>{
  const authError = {
      message:'invalid creentials'
  }
  try{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json(authError)
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    if(err){return res.status(401).json(authError)}
    if(level && roles.indexOf(decoded.userRole) < roles.indexOf(level)){
      return res.status(403).json({
        message:'your level is not enough to get info'
      })
    }
    req.token = decoded
    next()
    })
    

  }catch(err){
      next(err)
  }
    }

}
module.exports = {restrict};