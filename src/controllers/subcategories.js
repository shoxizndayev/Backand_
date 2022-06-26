import {
    NotFoundError,
    AlredExistsError,
  } from "../utils/errors.js";
  import { read, write } from "../utils/model.js";
  
  function GET(req, res, next) {
      let subCategories = read("subCategories");
      let products = read("products");
  
      let { subcategoriesId } = req.params;
  
      if (subcategoriesId) {
        let findscategory = subCategories.find(
          (sub) => sub.sub_category_id == subcategoriesId
        );
        findscategory.subCategoryId = findscategory.sub_category_id;
        findscategory.subCategoryName = findscategory.sub_category_name;
        if (!findscategory)
          return next(new NotFoundError(404, "category not found"));
        findscategory.products = products
          .filter(
            (product) =>
              product.sub_category_id == findscategory.sub_category_id
          )
          .map((product) => {
            return {
              productId: product.product_id,
              productName: product.product_name,
              model: product.model,
              color: product.color,
              price: product.price,
            };
          });
        delete findscategory.sub_category_id;
        delete findscategory.sub_category_name;
        delete findscategory.category_id;
        return res.status(201).json({
          status: 201,
          message: "",
          data: [findscategory],
        });
      }
  
      subCategories.forEach((sub) => {
        sub.subCategoryId = sub.sub_category_id;
        sub.subCategoryName = sub.sub_category_name;
        sub.products = products
          .filter((product) => product.sub_category_id == sub.sub_category_id)
          .map((product) => {
            return {
              productId: product.product_id,
              productName: product.product_name,
              model: product.model,
              color: product.color,
              price: product.price,
            };
          });
        delete sub.sub_category_id;
        delete sub.sub_category_name;
        delete sub.category_id;
      });
      return res.status(201).json({
        status: 201,
        message: "",
        data: subCategories,
      });
    } 
  function POST(req, res, next) {
      let subCategories = read("subCategories");
      let { categoryId, subCategoryName } = req.body;
      let findSubcategories = subCategories.find(
        (subCategory) => subCategory.sub_category_name == subCategoryName
      );
      if (findSubcategories)
        return next(new AlredExistsError(403, "Already exists"));
      let newSubCategory = {
        sub_category_id: subCategories.length
          ? subCategories[subCategories.length - 1].sub_category_id + 1
          : 1,
        category_id: +categoryId,
        sub_category_name: subCategoryName,
      };
      subCategories.push(newSubCategory);
      write("subCategories", subCategories);
      return res.status(200).json({
        status: 200,
        message: "Added",
        data: [
          {
            subCategoryId: newSubCategory.sub_category_id,
            subCategoryName,
            categoryId,
          },
        ],
      });
    } 
  function DELETE(req, res, next) {
      let { subcategoriesId } = req.params;
      let subCategories = read("subCategories");
      let findscategory = subCategories.find(
        (sub) => sub.sub_category_id == subcategoriesId
      );
      if (!findscategory)
        return next(new NotFoundError(404, "Not found"));
      subCategories = subCategories.filter(
        (sub) => sub.sub_category_id != subcategoriesId
      );
      write("subCategories", subCategories);
      res.status(200).json({
          status: 200,
          message: "Delete successfully",
          data: [
            {
              subCategoryId: findscategory.sub_category_id,
              subCategoryName: findscategory.sub_category_name,
              categoryId: findscategory.category_id
            },
          ],
        });
    } 
  function PUT(req, res, next){
          let { subcategoriesId } = req.params;
          let subCategories = read("subCategories");
          let {subCategoryName, categoryId} = req.body
          let findscategory = subCategories.find(
            (sub) => sub.sub_category_id == subcategoriesId
          );
          if (!findscategory)
            return next(new NotFoundError(404, "Not found"));
          findscategory.sub_category_name = subCategoryName ? subCategoryName: findscategory.sub_category_name
          findscategory.category_id = categoryId ? categoryId: findscategory.category_id
          write("subCategories", subCategories);
          res.status(200).json({
              status: 200,
              message: "Successfully",
              data: [
                {
                  subCategoryId: findscategory.sub_category_id,
                  subCategoryName: findscategory.sub_category_name,
                  categoryId: findscategory.category_id
                },
              ],
            });
        } 
  export default {
    GET,
    POST,
    DELETE,PUT
  };