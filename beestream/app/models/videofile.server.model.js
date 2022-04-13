const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('VideoFile', new Schema({
  HiveName: {
    type: String
  },
  TimeStamp: {
    type: Date
  },
  FilePath: {
    type: String
  },
  ArrivalsTriangle: {
    type: Number
  },
  DeparturesTriangle: {
    type: Number
  },
  FileSize: {
    type: Number
  }
}), 'VideoFiles');
