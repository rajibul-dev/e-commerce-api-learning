const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermission
} = require("../middleware/authentication");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
} = require("../controllers/productController");
const { route } = require("./userRoutes");

router
  .route("/")
  .post([authenticateUser, authorizePermission("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermission("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission("admin")], updateProduct)
  .delete([authenticateUser, authorizePermission("admin")], deleteProduct);

module.exports = router;
