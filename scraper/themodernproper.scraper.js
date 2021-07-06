const axios = require('axios');
const cheerio = require('cheerio');
const {UiTypes} = require('../utils/constants')

fetchDetail = async (url, category) => {
     let response = await axios.get(url);
     let $ = cheerio.load(response.data);
    
     let title = $('.post-hero__title').text()
     let tags = title.split(' ')
     tags.push(category)
     let statContainer = $('.post-hero__stats-list li')
     let prepTime = $(statContainer[1]).find('.post-hero__stat--value').text().trim()
     let cookTime = $(statContainer[2]).find('.post-hero__stat--value').text().trim()
     let calories =  $(statContainer[3]).find('.post-hero__stat--value').text().trim()
     let overview = $('.post-lede__text').text()
     
     let contents = []
     let ingredients = []
     let methods = []

     let postBody = $('.post-body').find('.post-text , .post-photos')
     let heroImage = $('.post-hero__image-wrapper picture source').first().attr('data-srcset').split(',')[0].split(' ')[0]
     
     // Content
     postBody.each((index,e) => {
          let node = $(e);
          let isTextContainer = node.hasClass('post-text')
          
          // Text 
          if(isTextContainer) {
               let headline = node.find('.post-text h2').text().trim()
               let content = node.find('.post-text p').text().trim()
               
               contents.push({
                    headline,
                    content,
                    type: headline ? UiTypes.CONTENT_HEADLINE : UiTypes.CONTENT_TEXT
               })

               let unorderedList = node.find('ul li')
               
               if(unorderedList){
                    let list = [];

                    unorderedList.each((index,e) => {
                         let li = $(e).text()
                         list.push(li)
                    });

                    if(list.length){
                         contents.push({
                              list,
                              type: UiTypes.UNORDER_LIST
                         })
                    }
               }

          // Images
          }else {
               let imageContainer = node.find('.post-photos .post-photos__inner-wrapper .post-photos__image-wrapper')
               let images = [];
               imageContainer.each((index,e) => {
                    let firstHQImageNode = $(e).find('picture source').first()
                    let image = $(firstHQImageNode).attr('data-srcset').split(',')[0].split(' ')[0].trim()
                    images.push(image)
               })
               
               if(images.length <= 1){
                    contents.push({
                         images,
                         type: UiTypes.CONTNET_IMAGE
                    })
               }else {
                    contents.push({
                         images,
                         type: UiTypes.CONTENT_IMAGE_GRID
                    })
               }
          }
     });

     let ingredientContainers = $('#recipe-ingredients .recipe-ingredients').find('h3 ,h4 ,ul')

     // Ingredient
     for(let i = 0; i < ingredientContainers.length; i++){
          let item = $(ingredientContainers[i])
          let isItemH3 = item.hasClass('recipe-ingredients__title')
          let isItemH4 = item.hasClass('recipe-ingredients__list-title')
          let list = [];

          if(isItemH4 || isItemH3){
               let lists = $(ingredientContainers[i+1]).find('li')
               
               lists.each((index,e) => {
                    let amount = $(e).find('.recipe-ingredients__item--amount').text().trim()
                    let name = $(e).find('.recipe-ingredients__item--ingredient').text().trim()
                    list.push({
                         amount,
                         name
                    })
               });

               ingredients.push({
                    name: item.text(),
                    list
               })
          }

          
     }

     // Methods
     let methodContainers = $('.recipe-method__text-wrapper ol li')

     methodContainers.each((index,e) => {
          let method = $(e).text().trim()
          methods.push({
               step: (index + 1),
               method,
               type: UiTypes.METHODS
          })
     });

     return {
          title,
          stats: {
               prepTime,
               cookTime,
               calories,
          },
          overview,
          heroImage,
          contents,
          ingredients,
          methods,
          tags
     }
}

fetchSearchResultGetEachDetail = async (url,category) => {
     let response = await axios.get(url);
     let $ = cheerio.load(response.data);

     let resultContainers = $('.search-results__list .search-results__item');
     let recipes = [];

     for(let i = 0; i < resultContainers.length; i++){
          let result = $(resultContainers[i]);
          let link = result.find('a').attr('href')
          let detail = await fetchDetail(link,category)
          recipes.push(detail);
     }

    return recipes;
}



module.exports = {
     fetchDetail,
     fetchSearchResultGetEachDetail
}