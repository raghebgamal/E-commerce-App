
class ApiFeature {
    constructor(buildQueryMongoose, queryObj) {
        this.queryObj = queryObj;
        this.buildQueryMongoose = buildQueryMongoose;

        
    }
    filtering() {
        const reqQuery = { ...this.queryObj }
        const excludeFields = ["limit", "sort", "page", "fields","keyword"]
        excludeFields.forEach((el) => {
            delete reqQuery[el]
        });
        const reqQueryObj = JSON
            .parse(JSON
                .stringify(reqQuery)
                .replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`));
        this.buildQueryMongoose = this.buildQueryMongoose
            .find(reqQueryObj)
           // .populate({ path: "category", select: "name -_id" })
        return this;
        
    }
    sorting() {
        console.log(this.queryObj.sort)
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(",").join(" ");
     this.buildQueryMongoose =   this.buildQueryMongoose.sort(sortBy)

        } else {
    this.buildQueryMongoose = this.buildQueryMongoose.sort("-createdAt");
        
        }
        return this;

    }

    paginate(numberOfDoc) {
        
        const page = this.queryObj.page * 1 || 1;
       const limit = this.queryObj.limit * 1 || 10;
       const skip = (page - 1) * limit;
      this.buildQueryMongoose =   this.buildQueryMongoose
                .skip(skip)
            .limit(limit)
      const  pagination = {}
        pagination.currentPage = page
            pagination.limit = limit
            pagination.numberOfPage =Math.ceil(numberOfDoc / limit)
            if (page * limit < numberOfDoc) {
            pagination.next = page + 1
        }
        if (skip > 0) {
            pagination.previous = page - 1
        }
        this.paginationResult = pagination;
            return this
    }
    fields() {
        if (this.queryObj.fields) {
            const selectFields = this.queryObj.fields.split(",").join(" ")
                    console.log(selectFields)

    this.buildQueryMongoose =   this.buildQueryMongoose.select(selectFields)
        } else { 
   this.buildQueryMongoose =   this.buildQueryMongoose.select("-__v")

        }
        return this
    }
    search(modelName) {
        if (this.queryObj.keyword) {

            this.buildQueryMongoose = this.buildQueryMongoose.find({ $text: { $search: this.queryObj.keyword } });


            // let query = {}
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

    };

module.exports = ApiFeature;