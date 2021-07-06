const mongoose = require('mongoose');
const {Schema} = mongoose;

let recipeSchema = new Schema({
     title: String,
     stats: {
          prepTime: {
               type: String,
               default: ""
          },
          cookTime: {
               type: String,
               default: ""
          },
          calories: {
               type: String,
               default: ""
          }
     },
     overview: String,
     heroImage: String,
     contents: [
          {
               headline: {
                    type: String,
                    default: undefined
               },
               content: {
                    type: String,
                    default: undefined
               },
               type: {
                    type: String,
                    default: ""
               },
               list: {
                    type: [String],
                    default: undefined
               },
               images: {
                    type: [String],
                    default: undefined
               }
          }
     ],
     ingredients: [
          {
               name: String,
               list: [
                    {
                         amount: String,
                         name: String
                    }
               ]
          }
     ],
     methods: [
          {
               step: {
                    type: Number,
                    default: 1
               },
               method: {
                    type: String,
                    default: null
               },
               type: {
                    type: String,
                    default: null
               }
          }
     ],
     viewCount: {
          type: Number,
          default: 1
     },
     tags: [String]
}, {versionKey: false, timestamps: {createdAt: 'createdAt'}});

recipeSchema.index({title: 'text'});

module.exports = mongoose.model('Recipe',recipeSchema)