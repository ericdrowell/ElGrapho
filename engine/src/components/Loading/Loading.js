const Dom = require('../../Dom');

const Loading = function(config) {
  this.container = config.container;
  this.wrapper = Dom.create('el-grapho-loading-component'); 

  //http://tobiasahlin.com/spinkit/
  let markup = `
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
  `;

  this.wrapper.innerHTML = markup;
  this.container.appendChild(this.wrapper);


};

Loading.prototype = {

};

module.exports = Loading;