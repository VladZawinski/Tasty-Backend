let Recipe = require('../models/Recipe');
let UiModel = require('../models/UiModel');
let {UiTypes} = require('../utils/constants')

exports.fetchForHomePage = async (req,res) => {
     try {
          let homeModel = await UiModel.find({screen: 'home'});
          let sections = [];

          for(let i = 0; i < homeModel[0].sections.length; i++){
               let model = homeModel[0].sections[i];

               switch(model.name){

                    case UiTypes.CAROUSEL: {

                         let randomFiveRecords = await findRandomRecipes([
                              "stats",
                              "ingredients",
                              "methods",
                              "overview",
                              "contents",
                              "updatedAt",
                              "tags"
                         ]);

                         sections.push({
                              type: model.type,
                              name: model.name,
                              item: randomFiveRecords
                         })
                         break;
                    }

                    case 'Latest': {
                         let latestRecipes = await findRecipes({
                              query: {},
                              limit: 10,
                              select: "_id title heroImage createdAt",
                              sort: "-createdAt"
                         });

                         sections.push({
                              type: model.type,
                              name: model.name,
                              item: latestRecipes
                         })

                         break;
                    }

                    default: {
                         // let specificRecipes = await findRecipes({
                         //      query: {tags: model.name, tags: model.name.toLowerCase()},
                         //      limit: 10,
                         //      select: "_id title heroImage createdAt",
                         //      sort: "-createdAt"
                         // });

                         let specificRecipes = await Recipe.find({
                              $text: { $search: model.name, $caseSensitive: false}
                         }).limit(10).sort('createdAt').select("_id title heroImage createdAt")

                         sections.push({
                              type: model.type,
                              name: model.name,
                              item: specificRecipes
                         });

                         break;
                    }
               }
          }
          
          res.send({
               success: true,
               sections,
               screen: "home"
          });

     } catch (error) {
          console.log(error);
     }
}

exports.getDetail = async (req,res) => {
     try {
          let {id} = req.query;
          let result = await Recipe.find({_id: id});
          
          let detail = result[0];

          let uiFriendlyResult = {
               type: 'detail',
               sections: [
                    {
                         type: UiTypes.CAROUSEL,
                         item: detail.heroImage
                    },
                    {
                         type: UiTypes.TITLE,
                         item: detail.title
                    },
                    {
                         type: UiTypes.OVERVIEW,
                         item: detail.overview
                    },
                    {
                         type: UiTypes.STATS,
                         item: detail.stats
                    },
                    {
                         type: UiTypes.CONTENT,
                         item: detail.contents
                    },
                    {
                         type: UiTypes.INGREDIENTS,
                         item: detail.ingredients
                    },
                    {
                         type: UiTypes.METHODS,
                         item: detail.methods
                    }
               ]
          }

          res.send(uiFriendlyResult)
     } catch (error) {
          console.log(error);
     }
}

exports.search = async (req,res) => {
     try {
          let {q} = req.query;
          
          let result = await Recipe.find({ $text: { $search: q, $caseSensitive: false }});
          res.send(result);
     } catch (error) {
          res.send({
               success: false,
               message: error.message
          })
     }
}

async function findRecipes(options) {
     let {query,sort,limit,select} = options;

     let results = await Recipe.find(query).sort(sort).limit(limit).select(select)

     return results;
}

async function findRandomRecipes(select){
     let results = await Recipe.aggregate([
          { $sample: {size: 5} },
          { $unset: select }
     ])
     return results
}

