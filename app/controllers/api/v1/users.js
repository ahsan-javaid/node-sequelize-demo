const db = global.db;
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

module.exports =  (router) => {

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         email:
 *           type: string
 *           description: User's email/username
 *         password:
 *           type: string
 *           description: User's account password
 *       example:
 *         id: 1
 *         email: hamd@gmail.com
 *         password: 1234
 */

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: The users managing API
  */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Returns the list of all the users (Can also add page query for pagintaion)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: int
 *         required: false
 *         description: Optional query parameter for pagination
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

  router.get('/', async (req, res) => {
    try {
      const page = req.query.page;
      let users;

      if(!page){
        console.log("Getting All Users!");
        users = await db.Users.findAll({ include: [
          {
            model: db.Roles,
          },
        ],});
      } else{
        console.log("Page : " + page);
        const offset = (page == 0)? 0 : (page - 1) * 10;
        console.log("Getting Users from " + offset);
        users = await db.Users.findAll({ include: [
          {
            model: db.Roles,
          },
        ],
        offset: offset,
        limit: 10 });
      }
      res.json({users});
    } catch (error) {
      return res.status(400).json({error: error.json()});
    }
  });

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Username/email of a user
 *               password:
 *                 type: string
 *                 description: password of a user  
 *             example:
 *               email: hamd@gmail.com
 *               password: 1234
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Object of logged in User
 *                 token:
 *                   type: string
 *                   description: BEarer token for JWT authentication
 *       400:
 *         description: The user could not log in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Invalid email or password
 */

  router.post('/login', async (req, res) => {
    try {
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
    } catch (error) {
      res.status(400).json({error: error.toString()});
    }
  });

  router.get('/me', async (req, res) => {
    try {
      
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

    } catch (error) {
      res.status(400).json({error: error.toString()});
    }
  });

  router.post('/signup', async (req, res) => {
    try {
      
      const isAlreadyExist = await db.Users.count({
        where: { email: req.body.email}
      });
      if (isAlreadyExist) {
        return res.status(400).json({msg: 'Email already exists'});
      }
  
      req.body.password = db.Users.getHashedPassword(req.body.password);
      const user = await db.Users.create(req.body);
  
      res.json({user: user, token: user.createAPIToken()});
    } catch (error) {
      res.status(400).json({error: error.toString()});
    }
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
