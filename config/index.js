module.exports = {
    dev: {
        
    },
  
    build: {
      // Template for index.html
      index: path.resolve(__dirname, '../views/index.html'),  //之前是 '../dist/index.html'
  
      // Paths
      assetsRoot: path.resolve(__dirname, '../'),  // 之前是 '../dist'
      assetsSubDirectory: 'static',
      assetsPublicPath: './',    // 之前是 '/'
      
    }
  }