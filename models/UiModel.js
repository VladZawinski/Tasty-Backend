const mongoose = require('mongoose');
const { Schema } = mongoose;

const uiModelSchema = new Schema({
     sections: [
          {
               name: {
                    type: String,
                    default: ""
               },
               type: {
                    type: String,
                    default: ""
               }
          }
     ],
     screen: String
}, { versionKey: false });

module.exports = mongoose.model('UiModel',uiModelSchema);