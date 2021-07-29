const db = global.db;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = (router) => {
  //get all users
  router.get("/", async (req, res) => {
    try {
      req.query.limit
        ? (req.query.limit = Math.abs(parseInt(req.query.limit)))
        : (req.query.limit = 10);
      req.query.offset
        ? (req.query.offset = Math.abs(parseInt(req.query.offset)))
        : (req.query.offset = 0);

      const users = await db.Users.findAll({
        include: [
          { model: db.Roles, as: "roles", through: { attributes: [] } },
        ],
        limit: req.query.limit,
        offset: req.query.offset,
      });

      res.json({ users });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //login user
  router.post("/login", async (req, res) => {
    try {
      const user = await db.Users.findOne({
        where: {
          email: req.body.email,
          password: db.Users.getHashedPassword(req.body.password),
        },
      });
      if (user) {
        res.json({ user, token: user.createAPIToken() });
      } else {
        res.status(400).json({ msg: "Invalid email or password" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //signup user
  router.post("/signup", async (req, res) => {
    try {
      const isAlreadyExist = await db.Users.count({
        where: { email: req.body.email },
      });
      if (isAlreadyExist) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      req.body.password = db.Users.getHashedPassword(req.body.password);

      const user = await db.Users.create(req.body);
      res.json({ user: user, token: user.createAPIToken() });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //get logged-in user
  router.get("/me", async (req, res) => {
    try {
      const user = await db.Users.findOne({
        where: {
          id: req.user.id,
        },
        include: [
          { model: db.Roles, as: "roles", through: { attributes: [] } },
        ],
      });
      if (user) {
        res.json({ user, token: user.createAPIToken() });
      } else {
        res.status(400).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //get specific user
  router.get("/:id", async (req, res) => {
    try {
      const user = await db.Users.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          { model: db.Roles, as: "roles", through: { attributes: [] } },
        ],
      });
      if (user) {
        res.json({ user });
      } else {
        res.status(400).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //delete logged-in user
  router.delete("/me", async (req, res) => {
    try {
      const user = await db.Users.destroy({
        where: {
          id: req.user.id,
        },
      });
      if (user === 1) {
        res.status(200).json({ msg: "User is deleted" });
      } else {
        res.status(400).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //update logged-in user
  router.put("/me", async (req, res) => {
    try {
      const user = await db.Users.update(
        {
          email: req.body.email,
          password: db.Users.getHashedPassword(req.body.password),
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
      if (user[0] === 1) {
        res.status(200).json({ msg: "User updated" });
      } else {
        res.status(400).json({ msg: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });
};
