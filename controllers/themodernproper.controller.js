let Recipe = require('../models/Recipe');
const recipe = require('../scraper/themodernproper.scraper');

exports.fetchManyAndInsertDetail = async (req, res) => {
     try {
          let { url,category } = req.query;
          let recipes = await recipe.fetchSearchResultGetEachDetail(url,category);
               
          await Recipe.insertMany(recipes);

          res.json({
               success: true,
               message: "Inserted Successfully"
          });
     } catch (error) {
          res.json({
               success: true,
               message: error.message
          });
     }
}