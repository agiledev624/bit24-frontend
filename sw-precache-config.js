module.exports = {
  //ignoreUrlParametersMatching: []
  root: "build",
  filename: "service-worker.js",
  staticFileGlobs: [
    "build/charting_library/**/**.*",
    "build/datafeeds/**/**.*",
    "build/resources/**/**.*",
    "build/static/**/**.*",
    "build/*.{ico,html}",
  ],
  maximumFileSizeToCacheInBytes: 2500000,
};
