require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());


// ==================================================
// DATABASE CONNECTION
// ==================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


// ==================================================
// IMPORT MODELS
// ==================================================

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Review = require("./models/Review");


// ==================================================
// IMPORT CONTROLLERS
// ==================================================

const methodsController = require("./controllers/mongoose.operators");
const operatorsController = require("./controllers/operators.controller");
const pipelineController = require("./controllers/mongoose.operators");
const aggregationController = require("./controllers/aggregation.controller");


// ==================================================
// MONGOOSE METHODS ROUTES
// ==================================================

app.get("/create-user", methodsController.createUser);

app.get("/find-users", methodsController.findUsers);

app.get("/find-one-user", methodsController.findOneUser);

app.get("/find-user/:id", methodsController.findUserById);

app.put("/update-one-user", methodsController.updateOneUser);

app.put("/update-many-users", methodsController.updateManyUsers);

app.delete("/delete-one-user", methodsController.deleteOneUser);

app.delete("/delete-many-users", methodsController.deleteManyUsers);

app.put(
  "/findbyid-update/:id",
  methodsController.findByIdAndUpdateUser
);

app.delete(
  "/findbyid-delete/:id",
  methodsController.findByIdAndDeleteUser
);

app.get("/count-users", methodsController.countUsers);

app.get(
  "/distinct-departments",
  methodsController.distinctDepartments
);


// ==================================================
// QUERY OPERATORS ROUTES
// ==================================================

app.get("/eq-users", operatorsController.eqUsers);

app.get("/ne-users", operatorsController.neUsers);

app.get("/gt-users", operatorsController.gtUsers);

app.get("/gte-users", operatorsController.gteUsers);

app.get("/lt-users", operatorsController.ltUsers);

app.get("/lte-users", operatorsController.lteUsers);

app.get("/in-users", operatorsController.inUsers);

app.get("/nin-users", operatorsController.ninUsers);

app.get("/and-users", operatorsController.andUsers);

app.get("/or-users", operatorsController.orUsers);

app.get("/not-users", operatorsController.notUsers);

app.get("/exists-users", operatorsController.existsUsers);

app.get("/regex-users", operatorsController.regexUsers);

app.get("/elem-match-users", operatorsController.elemMatchUsers);

app.get("/size-users", operatorsController.sizeUsers);


// ==================================================
// UPDATE OPERATORS ROUTES
// ==================================================

app.put("/set-user", operatorsController.setUser);

app.put("/unset-user", operatorsController.unsetUser);

app.put("/inc-user", operatorsController.incUser);

app.put("/push-skill", operatorsController.pushSkill);

app.put("/pull-skill", operatorsController.pullSkill);

app.put("/addtoset-skill", operatorsController.addToSetSkill);


// ==================================================
// AGGREGATION PIPELINE ROUTES
// ==================================================

app.get("/match-users", pipelineController.matchUsers);

app.get("/project-users", pipelineController.projectUsers);

app.get("/addfields-users", pipelineController.addFieldsUsers);

app.get("/unset-users", pipelineController.unsetUsers);

app.get("/limit-users", pipelineController.limitUsers);

app.get("/skip-users", pipelineController.skipUsers);

app.get("/sort-users", pipelineController.sortUsers);

app.get("/group-users", pipelineController.groupUsers);

app.get("/unwind-users", pipelineController.unwindUsers);

app.get("/lookup-orders", pipelineController.lookupOrders);

app.get(
  "/lookup-pipeline-orders",
  pipelineController.lookupPipelineOrders
);

app.get("/count-aggregation", pipelineController.countUsers);

app.get("/facet-users", pipelineController.facetUsers);

app.get("/bucket-users", pipelineController.bucketUsers);

app.get("/bucket-auto-users", pipelineController.bucketAutoUsers);

app.get("/sample-products", pipelineController.sampleProducts);

app.get(
  "/replace-root-orders",
  pipelineController.replaceRootOrders
);

app.get(
  "/union-users-reviews",
  pipelineController.unionUsersReviews
);

app.get("/merge-users", pipelineController.mergeUsers);

app.get("/out-users", pipelineController.outUsers);


// ==================================================
// ACCUMULATORS / EXPRESSIONS ROUTES
// ==================================================

app.get("/sum-salary", aggregationController.sumSalary);

app.get("/avg-salary", aggregationController.avgSalary);

app.get("/max-salary", aggregationController.maxSalary);

app.get("/min-salary", aggregationController.minSalary);

app.get("/first-user", aggregationController.firstUser);

app.get("/last-user", aggregationController.lastUser);

app.get(
  "/unique-departments",
  aggregationController.uniqueDepartments
);

app.get("/push-skills", aggregationController.pushSkills);


// ==================================================
// SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});