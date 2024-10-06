const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    if (!token) return res.status(401).json({ error: "Unquthorized" })
    
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
        req.userPaylod = decode
        
        next()
    } catch (error) {
         return res.status(405).json({error:"Invalid token"})
    }
}
module.exports ={authMiddleware}
