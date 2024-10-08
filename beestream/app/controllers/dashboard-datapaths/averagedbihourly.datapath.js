const mongoose = require('mongoose');
const AverageTrafficBiHourly = mongoose.model('AverageTrafficBiHourly');
const Audio_AverageBiHourly = mongoose.model('Audio_AverageBiHourly');
const utils = require('./datapath-utils.js');

module.exports = {
  name: 'bihourly',
  aggregateMethod: ' Averaged Bi-Hourly',
  threshold: 6,
  query: async function(viewQuerySelection, hives, startDate, stopDate, callback) {
    utils.queryFromView(AverageTrafficBiHourly, Audio_AverageBiHourly,
        hives, startDate, stopDate, viewQuerySelection, callback, ' Averaged Bi-Hourly');
  }
}
