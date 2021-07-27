const db = global.db;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = (router) => {
  router.post("/", async (req, res) => {
    req.body.userId = req.user.id;
    const post = await db.Posts.create(req.body);
    res.json({ post: post });
  });

  router.get("/", async (req, res) => {
    const posts = await db.Posts.findAll({
      include: [
        {
          model: db.Users,
        },
      ],
    });
    res.json({ posts: posts });
  });

  router.get("/me", async (req, res) => {
    const posts = await db.Posts.findAll({
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: db.Users,
        },
      ],
    });
    res.json({ posts: posts });
  });

  router.put("/", async (req, res) => {
    const post = await db.Posts.update(
      {
        title: req.body.title,
        body: req.body.body,
      },
      {
        where: {
          id: req.body.id,
          user_id: req.user.id,
        },
      }
    );
    if (post) {
      res.status(400).json({ msg: "Post updated" });
    } else {
      res
        .status(400)
        .json({ msg: "Post not found / You do not have access to this post" });
    }
  });

  router.delete("/", async (req, res) => {
    const post = await db.Posts.destroy({
      where: {
        id: req.body.id,
        user_id: req.user.id,
      },
    });
    if (post) {
      res.status(200).json({ msg: "Post is deleted" });
    } else {
      res
        .status(400)
        .json({ msg: "Post not found / You do not have access to this post" });
    }
  });
};
