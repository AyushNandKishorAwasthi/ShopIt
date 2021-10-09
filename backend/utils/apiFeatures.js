class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i', //for case insensitve
          },
        }
      : {};
    // console.log(keyword);
    this.query = this.query.find(keyword);
    return this;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['keyword', 'sort', 'limit', 'page'];
    excludedFields.forEach((field) => delete queryObj[field]);
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\bgte|lte|gt|lt\b/g, (match) => `$${match}`);
    // console.log(queryStr);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resPerPage) {
    const currentPage = this.queryString.page * 1 || 1;
    // const limit = this.queryString.limit * 1 || 100;
    const limit = resPerPage * 1 || 100;
    const skip = currentPage * limit - limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = ApiFeatures;
