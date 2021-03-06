var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var secret = "kdesfjasçklgfjasçkgjasç";

class UserController{
    async index(req, res){
        var users = await User.findAll();
        res.json(users);
    }

    async findUsers(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res){
        
        var {email, name, password, repassword} = req.body;

        if(email == undefined || email == '' || email == ' '){
            res.status(400);
            res.json({err: "email invalido"});
            return;
        }

        if(name == undefined || name.length < 3 || name == '' || name == ' '){
            res.status(400);
            res.json({err: "Nome invalido"});
            return;
        }

        if(password == undefined || password != repassword || repassword != password || password == '' || password == ' '){
            res.status(400);
            res.json({err: "Senha invalido"});
            return;
        }

        var nameExists = await User.findNome(name);
        if(nameExists){
            res.status(406);
            res.json({err: "ja existe cadastro com esse nome"})
            return;
        }

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "ja existe cadastro com esse email"})
            return;
        }

        

        await User.new(email, password, name);

        res.status(200);
        res.send("Usuario cadastrado");
    }

        async edit(req, res){
            var {id, name, role, email} = req.body;
            var result = await User.update(id, email, name, role);

            if(result != undefined){
                if(result.status){
                    res.status(200);
                    res.send("Tudo okay");
                }else{
                    res.status(406);
                    res.send(result.err);
                }
            }else{
                res.status(406);
                res.send("Ocorreu um erro no servidor");
            }
        }

        async remove(req, res){
            var id = req.params.id;

            var result = await User.delete(id);

            if(result.status){
                res.status(200);
                res.send("Tudo ok")
            }else{
                res.status(406);
                res.send(result.err);
            }
        }

        async recoverPassword(req, res){
            var email = req.body.email;

            var result = await PasswordToken.create(email);

            if(result.status){
                res.status(200);
                res.send("" + result.token);

            }else{
                res.status(406);
                res.send(result.err);
            }
        }

        async changePassword(req, res){
            var token = req.body.token;
            var password = req.body.password;

            var isTokenValid = await PasswordToken.validate(token)
        

            if(isTokenValid.status){

                await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
                res.status(200);
                res.send("Senha alterada");

            }else{
                res.status(406);
                res.send("token invalido")
            }
        
        
        }

        async login(req, res){
            var{email, password} = req.body;

            var user = await User.findByEmail(email);

            if(user != undefined){

                var result = await bcrypt.compare(password, user.password);

                if(result){

                    
                    var token = jwt.sign({email: user.email, role: user.role}, secret)

                    res.status(200);
                    res.json({token: token});

                }else{
                    res.status(406);
                    res.send("Senha incorreta");
                }

            }else{
                res.json({status: false});
            }
        }


}

module.exports = new UserController();