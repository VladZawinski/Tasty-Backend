const UiModel = require('../models/UiModel');

exports.changeHomeUiModel = async (req,res) => {
     try {
         
          await UiModel.deleteMany({});
          await UiModel.create(req.body)

          res.send({
               success: true,
               message: "Changed successfully!"
          })
     } catch (error) {
          res.status(500).send({
               success: false,
               message: error.message
          })
     }
}