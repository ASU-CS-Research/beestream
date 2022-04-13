module.exports = {
  // Development Configuration Options
  //our database address
  db : 'mongodb://localhost:27017/beeDB',
  //Path to the directory containing hive folders
  videoPath: '/usr/local/bee/appmais',
  //Path to the ffmpeg installation
  // ffmpegPath: '/usr/local/apache2/htdocs/cs/bee/ffmpeg-3.4.2/',
  ffmpegPath: '/usr/bin/ffmpeg',
  //Port to run the server on
  port: 8082,
  //The avaliable datasets to view on the dashboard
  dataSets: {
    video: [
      "AverageArrivals",
      "AverageDepartures",
      "AverageFileSize",
      "MinimumArrivals",
      "MinimumDepartures",
      "MinimumFileSize",
      "MaximumArrivals",
      "MaximumDepartures",
      "MaximumFileSize",
      "UTCStartDate",
      "UTCEndDate"
    ],
    audio: [
      "AverageRMSLinear",
      "MinimumRMSLinear",
      "MaximumRMSLinear",
      "UTCStartDate",
      "UTCEndDate"
    ]
  }
};
