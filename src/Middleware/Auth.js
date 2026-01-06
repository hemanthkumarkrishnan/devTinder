
const userAuth = (req,res,next)=>{
     const token = "xyz";
  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("unauthorized request");
  }
}
const adminAuth = (req,res,next)=>{
     const token = "xyz";
  if (token === "xyz") {
    next();
  } else {
    res.status(401).send("unauthorized request");
  }
}

module.exports = {
    userAuth,
    adminAuth
}