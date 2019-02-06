module.exports = {
    dev: {
        
    },
  
    build: {
      // Template for index.html
      index: path.resolve(path.join(__dirname, 'views'), '../index.html'),  //之前是 '../dist/index.html'
  
      // Paths
      assetsRoot: path.resolve(path.join(__dirname,'public'), '../'),  // 之前是 '../dist'
      assetsSubDirectory: 'static',
      assetsPublicPath: './',    // 之前是 '/'
      
    }
  }