let properController = require('../controllers/themodernproper.controller');
let uiModelController = require('../controllers/uimodel.controller');
let recipeController = require('../controllers/recipe.controller');

module.exports = function (app) {
     app.post('/scraper/modernproper/many', properController.fetchManyAndInsertDetail)

     app.post('/api/home/changesection', uiModelController.changeHomeUiModel)

     app.get('/api/detail',recipeController.getDetail)

     app.get('/api/home',recipeController.fetchForHomePage)

     app.get('/api/search',recipeController.search)
}