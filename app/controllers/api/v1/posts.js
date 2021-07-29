const db = global.db;
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

module.exports =  (router) => {

  //Old get and post
  router.post('/', async (req, res) => {
    try {
      req.body.userId = req.user.id;

      const post = await db.Posts.create(req.body);

      res.json({post: post});
    } catch (error) {
      return res.status(400).json({error: error.json()});
    }
  });

  router.get('/', async (req, res) => {
    try {
      const page = req.query.page;
      let users;

      if(!page){
        console.log("Getting All Posts!");
        users = await db.Posts.findAll({ });
      }
      else{
        console.log("Page : " + page);
        const offset = (page == 0)? 0 : (page - 1) * 10;
        console.log("Getting Posts from " + offset);
        users = await db.Posts.findAll({ offset: offset, limit: 10 });
      }
      res.json({users});
    } catch (error) {
      return res.status(400).json({error: error.json()});
    }
  });

  //Update and Delete of CRUD by Hamd Zulfiqar
  router.put('/:id', async (req, res) => {
    //console.log(req.params.id);
    try {
      const post = await db.Posts.findOne({where: {id: req.params.id}});
      //console.log(post);

      if(!post){
        res.statusCode = 404;
        res.json({ success: false, message: "Post not found!" });
      }
      else{
        const {title, body} = req.body;
        post.title = title;
        post.body = body;

        await post.save();

        res.json({success: true, message: "Post updated", data: post});
      }
    } catch (error) {
      res.status(400).json({error: error.toString()});
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const post = await db.Posts.findOne({where: {id: req.params.id}});

      if(!post){
        res.statusCode = 404;
        res.json({ success: false, message: "Post not found!" });
      }
      else{
        await post.destroy();
        res.statusCode = 200;
        res.json({success: true, message: "Post deleted!"});
      }
    } catch (error) {
      res.statusCode = 500;
      res.json({success: false, message: error});
    }
  });
};
