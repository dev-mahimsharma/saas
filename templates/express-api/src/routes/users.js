const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Ada" },
    { id: 2, name: "Linus" },
  ]);
});

router.get("/:id", (req, res) => {
  res.json({ id: Number(req.params.id), name: "User" });
});

module.exports = router;
