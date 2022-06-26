import {read, write} from '../utils/model.js'
import { AuthrizationError } from "../utils/errors.js"
import sha256 from 'sha256'
import jwt from '../utils/jwt.js'


const GET = (req, res, next) => {

        let { userId } = req.params

        if(userId){

            let [ user ] = read('users').filter(user => user.user_id == userId)
            if(!user) return res.status(203).send('users not found')
            user.userId = user.user_id
            delete user.password
            delete user.user_id
            return res.status(200).send(user)
        }

        let users = read('users').filter(user => {
            user.userId = user.user_id
            delete user.user_id
            delete user.password
            return true
        })
        res.status(200).send(users)

    } 

const LOGIN = (req, res, next) => {

        let {username, password} = req.body
        let users = read('users')

        let user = users.find(user => user.username == username && user.password == sha256(password))

        if(!user){
            return next( new AuthrizationError(401, 'invalid username or password') )
        }

        delete user.password

        res.status(200).json({
            status: 200,
            message: 'success',
            token: jwt.sign({userId: user.userId}),
            data: user  
        })

    }


const REGISTER = (req, res, next) => {
        let users = read('users')
        
        req.body.user_id = users.length ? users.at(-1).user_id + 1 : 1
        req.body.password = sha256(req.body.password)

        let user = users.find(user => user.username == req.body.username)

        if(user){
            return next( new AuthrizationError(401, 'this username exists') )
        }

        users.push(req.body)
        write('users', users)

        delete req.body.password

        res.status(201).json({
            status: 201,
            message: 'success',
            token: jwt.sign({userId: req.body.userId}),
            data: req.body  
        })
    }

export default {
    LOGIN, REGISTER,GET
}