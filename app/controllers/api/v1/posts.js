const db = global.db;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = (router) => {
  //get all posts
  router.get("/", async (req, res) => {
    req.query.limit
      ? (req.query.limit = Math.abs(parseInt(req.query.limit)))
      : (req.query.limit = 10);
    req.query.offset
      ? (req.query.offset = Math.abs(parseInt(req.query.offset)))
      : (req.query.offset = 0);

    try {
      const posts = await db.Posts.findAll({
        include: [
          {
            model: db.Users,
          },
        ],
        limit: req.query.limit,
        offset: req.query.offset,
      });

      if (posts) {
        res.json({ posts });
      } else {
        res.status(400).json({ msg: "No posts found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //create a new post
  router.post("/", async (req, res) => {
    try {
      req.body.userId = req.user.id;
      const post = await db.Posts.create(req.body);
      res.json({ post });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //get logged-in user's posts
  router.get("/me", async (req, res) => {
    try {
      req.query.limit
        ? (req.query.limit = Math.abs(parseInt(req.query.limit)))
        : (req.query.limit = 10);
      req.query.offset
        ? (req.query.offset = Math.abs(parseInt(req.query.offset)))
        : (req.query.offset = 0);
      const posts = await db.Posts.findAll({
        where: {
          user_id: req.user.id,
        },
        include: [
          {
            model: db.Users,
          },
        ],
        limit: req.query.limit,
        offset: req.query.offset,
      });
      res.json({ posts });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //update post
  router.put("/:id", async (req, res) => {
    try {
      const post = await db.Posts.update(
        {
          title: req.body.title,
          body: req.body.body,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.user.id,
          },
        }
      );

      if (post[0] === 1) {
        res.status(200).json({ msg: "Post updated" });
      } else {
        res.status(400).json({ msg: "Post not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //delete a post
  router.delete("/:id", async (req, res) => {
    try {
      const posts = await db.Posts.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      const post = posts.find((post) => post.id == req.params.id);

      if (post) {
        await post.destroy();
        res.status(200).json({ msg: "Post is deleted" });
      } else {
        res.status(400).json({
          msg: "Post not found",
        });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });
};
