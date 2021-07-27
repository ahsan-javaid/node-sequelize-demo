const db = global.db;
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = (router) => {
  router.get("/", async (req, res) => {
    const roles = await db.Roles.findAll({});
    res.json({ roles: roles });
  });

  router.post("/", async (req, res) => {
    const role = await db.Roles.create(req.body);
    res.json({ role: role });
  });

  router.put("/", async (req, res) => {
    const role = await db.Roles.update(
      {
        role: req.body.updatedRole,
      },
      {
        where: {
          role: req.body.role,
        },
      }
    );
    if (role) {
      res.status(400).json({ msg: "Role updated" });
    } else {
      res.status(400).json({ msg: "Role not found" });
    }
  });

  router.delete("/", async (req, res) => {
    const role = await db.Roles.destroy({
      where: {
        role: req.body.role,
      },
    });
    if (role) {
      res.status(200).json({ msg: "Role is deleted" });
    } else {
      res.status(400).json({ msg: "Role not found" });
    }
  });

  router.post("/me/assign", async (req, res) => {
    const role = await db.Roles.findAll({
      where: {
        role: req.body.role,
      },
    }).then(async (data) => {
      const userId = req.user.id;
      const role = data[0].dataValues;

      const userRole = await db.UserRoles.create({
        userId: userId,
        roleId: role.id,
      });
      if (role) {
        res.status(200).json({ msg: "User is assigned the role" });
      } else {
        res.status(400).json({ msg: "Something went wrong" });
      }
    });
  });

  router.get("/me", async (req, res) => {
    const roles = await db.Roles.findAll({
      include: [
        {
          model: db.Users,
        },
      ],
    });
    res.json({ roles: roles });
  });

  router.delete("/me/remove", async (req, res) => {
    const role = await db.Roles.findAll({
      where: {
        role: req.body.role,
      },
    }).then(async (data) => {
      const userId = req.user.id;
      const role = data[0].dataValues;

      const roleToDelete = await db.UserRoles.destroy({
        where: {
          userId: userId,
          roleId: role.id,
        },
      });
      if (role) {
        res.status(200).json({ msg: "Role is deleted" });
      } else {
        res.status(400).json({ msg: "Role not found" });
      }
    });
  });
};
