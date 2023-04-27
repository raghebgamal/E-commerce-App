"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ApiFeature =
/*#__PURE__*/
function () {
  function ApiFeature(buildQueryMongoose, queryObj) {
    _classCallCheck(this, ApiFeature);

    this.queryObj = queryObj;
    this.buildQueryMongoose = buildQueryMongoose;
  }

  _createClass(ApiFeature, [{
    key: "filtering",
    value: function filtering() {
      var reqQuery = _objectSpread({}, this.queryObj);

      var excludeFields = ["limit", "sort", "page", "fields", "keyword"];
      excludeFields.forEach(function (el) {
        delete reqQuery[el];
      });
      var reqQueryObj = JSON.parse(JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte)\b/g, function (match) {
        return "$".concat(match);
      }));
      this.buildQueryMongoose = this.buildQueryMongoose.find(reqQueryObj); // .populate({ path: "category", select: "name -_id" })

      return this;
    }
  }, {
    key: "sorting",
    value: function sorting() {
      console.log(this.queryObj.sort);

      if (this.queryObj.sort) {
        var sortBy = this.queryObj.sort.split(",").join(" ");
        this.buildQueryMongoose = this.buildQueryMongoose.sort(sortBy);
      } else {
        this.buildQueryMongoose = this.buildQueryMongoose.sort("-createdAt");
      }

      return this;
    }
  }, {
    key: "paginate",
    value: function paginate(numberOfDoc) {
      var page = this.queryObj.page * 1 || 1;
      var limit = this.queryObj.limit * 1 || 10;
      var skip = (page - 1) * limit;
      this.buildQueryMongoose = this.buildQueryMongoose.skip(skip).limit(limit);
      var pagination = {};
      pagination.currentPage = page;
      pagination.limit = limit;
      pagination.numberOfPage = Math.ceil(numberOfDoc / limit);

      if (page * limit < numberOfDoc) {
        pagination.next = page + 1;
      }

      if (skip > 0) {
        pagination.previous = page - 1;
      }

      this.paginationResult = pagination;
      return this;
    }
  }, {
    key: "fields",
    value: function fields() {
      if (this.queryObj.fields) {
        var selectFields = this.queryObj.fields.split(",").join(" ");
        console.log(selectFields);
        this.buildQueryMongoose = this.buildQueryMongoose.select(selectFields);
      } else {
        this.buildQueryMongoose = this.buildQueryMongoose.select("-__v");
      }

      return this;
    }
  }, {
    key: "search",
    value: function search(modelName) {
      if (this.queryObj.keyword) {
        this.buildQueryMongoose = this.buildQueryMongoose.find({
          $text: {
            $search: this.queryObj.keyword
          }
        }); // let query = {}
        // if (modelName === "Product") {
        //     query = {
        //         $or: [{ title: { $regex: this.queryObj.keyword , $options:"i"} },
        //         { description: { $regex: this.queryObj.keyword , $options:"i"} }]
        //     }
        // } else {
        //     query = {
        //         $or: [{ name: { $regex: this.queryObj.keyword, $options:"i" } }]
        //     }
        // }
        //     this.buildQueryMongoose = this.buildQueryMongoose.find(query);
      }

      return this;
    }
  }]);

  return ApiFeature;
}();

;
module.exports = ApiFeature;