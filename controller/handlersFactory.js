
const asyncHandler = require("express-async-handler"); //catch error from async then pass to express error hendler
const apiError = require("./../utils/apiError");
const ApiFeature=require("./../utils/apiFeature");

//@desc create product
//@route post/api/v1/categories
//@access private
exports.createModel = (Model) => asyncHandler(async (req, res, next) => {
 const model = await Model.create(req.body);
  res.status(201).json({ status: "success", data: model });
});

// @desc get list categories
// @route  get/api/v1/categories
// @access public
exports.getAllModels = (Model)=>asyncHandler(async (req, res) => {
  let filter={}
  if (req.filterObj) {
    filter = req.filterObj; 
}
  const apiFeatures = new ApiFeature(Model.find(filter), req.query)
    .filtering()
    .paginate(await Model.countDocuments())
    .sorting()
    .fields()
    .search(Model.modelName);
  const { buildQueryMongoose, paginationResult } = apiFeatures;
  const models = await buildQueryMongoose;
  res.status(200).json({
    status: "success",
    results: models.length,
    paginationResult,
    data: models,
  });
});

// // @desc get Specific categories
// // @route  get/api/v1/categories/:id
// // @access public

exports.getModelById = (Model, populateOption) => asyncHandler(async (req, res, next) => {
  const { id ,productId} = req.params;
  let query = Model.findById(id)
  if (populateOption) {
  query=query.populate(populateOption)
  }
  if (productId) {
    query=Model.findOne({_id:id,product:productId})
  }

    const model = await query

  if (!model) {
    return next(new apiError(`no ${Model.modelName} for this id : ${id}`, 404));
  }
  res.status(200).json({ status: "success", data: model });
});

// // @desc update Specific categories
// // @route  update/api/v1/categories/:id
// // @access private

exports.updateModel =(Model)=> asyncHandler(async (req, res, next) => {
  const { id } = req.params;
   
  
  const model = await Model.findByIdAndUpdate( id , req.body, {
    new: true,
    runValidators: true,
  });
  if (!model) {
    return next(new apiError(`no ${Model.modelName} for this id : ${id} to update`, 404));
  }
  res.status(200).json({ status: "success", data: model });
});
// // @desc delete Specific categories
// // @route  delete/api/v1/categories/:id
// // @access private
exports.deleteModel =(Model)=> asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const model = await Model.findByIdAndDelete(id);
  if (!model) {
    return next(new apiError(`no ${Model.modelName} for this id : ${id} to delete`, 404));
  }

  res.status(204).json({ status: "success", message:  "deleted" });
});
