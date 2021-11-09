class UserController{
    async index(req, res){}

    async create(req, res){
        
        var {email, name, password, repassword} = req.body;

        if(email == undefined){
            res.status(400);
            res.json({err: "email invalido"});
        }

        if(name == undefined || name.length < 3){
            res.status(400);
            res.json({err: "Nome invalido"});
        }

        if(password == undefined || password != repassword || repassword != password){
            res.status(400);
            res.json({err: "Senha invalido"});
        }

        res.status(200);
        res.send("Pegando corpo da requisição");
    }
}

module.exports = new UserController();