import { loginSchema, registerSchema } from "../utils/validations.js";
import { ValidationError } from "../utils/errors.js";

export default (req, res, next) => {
        if(req.url == '/login'){
            let {error} = loginSchema.validate(req.body)
            if(error) throw error
        }

        if(req.url == '/register'){
            let {error} = registerSchema.validate(req.body)
            if(error) throw error
        }

        return next()
}