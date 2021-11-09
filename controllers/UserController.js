var User = require("../models/User");

class UserController{
    async index(req, res){}

    async create(req, res){
        
        var {email, name, password, repassword} = req.body;

        if(email == undefined){
            res.status(400);
            res.json({err: "email invalido"});
            return;
        }

        if(name == undefined || name.length < 3){
            res.status(400);
            res.json({err: "Nome invalido"});
            return;
        }

        if(password == undefined || password != repassword || repassword != password){
            res.status(400);
            res.json({err: "Senha invalido"});
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
        res.send("Pegando corpo da requisição");
    }
}

module.exports = new UserController();