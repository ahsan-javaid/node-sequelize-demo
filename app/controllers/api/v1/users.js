const db = global.db;
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

module.exports =  (router) => {
  router.get('/', async (req, res) => {
    const users = await db.Users.findAll({
      include: [
        {
          model: db.Roles,
        },
      ],
    });
    res.json({users: users});
  });


  router.post('/login', async (req, res) => {
    const user = await db.Users.findOne({
      where: {
        email: req.body.email,
        password: db.Users.getHashedPassword(req.body.password),
      }
    });
    if (user) {
      res.json({user: user, token: user.createAPIToken()});
    } else {
      res.status(400).json({msg: 'Invalid email or password'});
    }
  });

  router.get('/me', async (req, res) => {
    const user = await db.Users.findOne({
      where: {
        id: req.user.id
      }
    });
    if (user) {
      res.json({user: user, token: user.createAPIToken()});
    } else {
      res.status(400).json({msg: 'User not found'});
    }
  });

  router.post('/signup', async (req, res) => {
    const isAlreadyExist = await db.Users.count({
      where: { email: req.body.email}
    });
    if (isAlreadyExist) {
      return res.status(400).json({msg: 'Email already exists'});
    }

    req.body.password = db.Users.getHashedPassword(req.body.password);
    const user = await db.Users.create(req.body);

    res.json({user: user, token: user.createAPIToken()});
  });

  //Custom API for Assigning a Role to a User
  router.post('/assign/:name', async (req, res) => {
    try {
      
      const user = await db.Users.findOne({where: {
        id: req.user.id,
      }});

      const role = await db.Roles.findOne({ where: {
        name: req.params.name,
      }});

      if(!role){
        res.json({success: false, message: "Role does not exist!"});
      }
      else{
        await user.addRole(role);
        //console.log(user.toJSON());

        res.json({success: true, message: "Role assigned!", data: user});
      }

    } catch (error) {
      res.json({error: error.toString()});
    }
  });

  //API for deleting a User role
  router.delete('/remove/:name', async (req, res) => {
    try {
      
      const user = await db.Users.findOne({
        where: {id: req.user.id},
        include: [
          {
            model: db.Roles,
          },
        ]
      });
      
      const role = await db.Roles.findOne({ where: {
        name: req.params.name,
      }});

      if(await user.hasRole(role)){
        await user.removeRole(role);
        //console.log(user.toJSON());
        res.json({success: true, message: "Role revoked!"});
      }
      else{
        console.log("ROLE NOT FOUND!");
        res.json({success: false, message: "User does not have the specified Role!"});
      }

    } catch (error) {
      res.json({error: error.toString()});
    }
  });
};
