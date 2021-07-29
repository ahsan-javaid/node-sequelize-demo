const db = global.db;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = (router) => {
  //get all roles
  router.get("/", async (req, res) => {
    try {
      req.query.limit
        ? (req.query.limit = Math.abs(parseInt(req.query.limit)))
        : (req.query.limit = 10);
      req.query.offset
        ? (req.query.offset = Math.abs(parseInt(req.query.offset)))
        : (req.query.offset = 0);

      const roles = await db.Roles.findAll({});
      res.json({ roles });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //create a new role
  router.post("/", async (req, res) => {
    try {
      const role = await db.Roles.create(req.body);
      res.json({ role });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //update a role
  router.put("/:id", async (req, res) => {
    try {
      const role = await db.Roles.update(
        {
          role: req.body.role,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      if (role[0] === 1) {
        res.status(200).json({ msg: "Role updated" });
      } else {
        res.status(400).json({ msg: "Role not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //delete a role
  router.delete("/:id", async (req, res) => {
    try {
      const role = await db.Roles.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (role === 1) {
        res.status(200).json({ msg: "Role is deleted" });
      } else {
        res.status(400).json({ msg: "Role not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  //get user's roles
  router.get("/me", async (req, res) => {
    try {
      const roles = await db.Users.findOne({
        include: [
          {
            model: db.Roles,
            attributes: ["id", "role"],
            through: {
              attributes: [],
            },
          },
        ],
        where: {
          id: req.user.id,
        },
      });
      res.json({ roles });
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  router.post("/assign/:role", async (req, res) => {
    try {
      const user = await db.Users.findOne({ where: { id: req.user.id } });
      const role = await db.Roles.findOne({ where: { role: req.params.role } });

      if (!user) {
        return res.status(400).json({ msg: "User not logged in" });
      }

      if (!role) {
        return res.status(400).json({ msg: "Role not found" });
      }

      const userRole = await db.UserRoles.create({
        userId: user.id,
        roleId: role.id,
      });
      if (userRole) {
        res.status(200).json({ msg: "User is assigned the role" });
      } else {
        res.status(400).json({ msg: "Something went wrong" });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  router.delete("/revoke/:role", async (req, res) => {
    try {
      const user = await db.Users.findOne({ where: { id: req.user.id } });
      const role = await db.Roles.findOne({ where: { role: req.params.role } });

      if (!user) {
        return res.status(400).json({ msg: "User not logged in" });
      }

      if (!role) {
        return res.status(400).json({ msg: "Role not found" });
      }

      console.log(db.UserRoles);

      const userRole = await db.UserRoles.destroy({
        where: {
          userId: user.id,
          roleId: role.id,
        },
      });

      if (userRole === 1) {
        res.status(200).json({ msg: "User is role revoked" });
      } else {
        res
          .status(400)
          .json({ msg: "User is not assigned this role", x: userRole });
      }
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });
};
