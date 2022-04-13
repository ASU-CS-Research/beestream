const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('Hives', new Schema({
  HiveName: {
    type: String
  },
}), 'Hives');
