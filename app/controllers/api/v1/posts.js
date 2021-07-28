const db = global.db;
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;

module.exports =  (router) => {

  //Old get and post
  router.post('/', async (req, res) => {
    req.body.userId = req.user.id;
    const post = await db.Posts.create(req.body);
    res.json({post: post});
  });

  router.get('/', async (req, res) => {
    const posts = await db.Posts.findAll({
      include: [{
        model: db.Users
      }]
    });
    res.json({posts: posts});
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

        post.save();
        res.statusCode = 200;
        res.json({success: true, message: "Post updated", data: post});
      }
    } catch (error) {
      res.statusCode = 500;
      res.json({success: false, message: error});
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
