const db = global.db;
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

module.exports =  (router) => {

    router.get('/', async (req, res) => {
        try {
            //console.log(db);
            const roles = await db.Roles.findAll({});
            res.json({success: true, data: roles});
        } catch (error) {
            res.json({error: error.toString()});
        }
    });

  router.post('/new', async (req, res) => {
    //req.body.userId = req.user.id;
    //const post = await db.Roles.create(req.body);

    try {
        //finding existing Role
        const role = await db.Roles.findOne({ where: {
            name: req.body.name,
        }});

        if(!role){
            //Creating Role now
            const role = await db.Roles.create(req.body);

            res.json({success: true, message: "Role Created successfully", data: role});
        }
        else{
            res.json({success: false, message: "Role already exists", data: role});
        }

    } catch (error) {
        res.json({error: error.toString()});
    }
  });

  router.delete('/delete/:id', async (req, res) => {
      try {
          
        const role = await db.Roles.findOne({ where: {
            id: req.params.id,
        }});

        if(role){
            await role.destroy();
            res.json({success: true, message: "Role Deleted successfully", data: role});
        }
        else{
            res.json({success: false, message: "Role not found"});
        }

      } catch (error) {
        res.json({error: error.toString()});
      }
  });

};
