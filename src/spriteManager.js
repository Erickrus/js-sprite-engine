function SpriteManager(canvasId, bgCanvasId, fps) {
   this.sprites        = {};
   this.spriteNames = [];
   this.intervalId     = 0;
   this.canvasId       = canvasId;
   this.bgCanvasId     = bgCanvasId;
   this.fps            = fps;
   this.quadTree       = null;
   
   this.register = function(spriteName, spriteObj) {
	  spriteObj.register();
	  if (spriteObj.zIndex ==0 ) {
		  spriteObj.zIndex = this.getDefaultZIndex();
	  }
      this.sprites[spriteName] = spriteObj;
	  this.spriteNames.push(spriteName);
	  this.move(spriteObj.x, spriteObj.y, spriteName);
   };
   this.get = function(spriteName) {
     return this.sprites[spriteName];
   };
   this.drawSprite = function(spriteName){
      var spriteObj = this.get(spriteName);
	  
      if (spriteObj.visible) {
         var ctx = document.getElementById(this.canvasId).getContext('2d');
         var spritePosition = spriteObj.getNextFrame();

         var sx = spritePosition[0], sy = spritePosition[1];

         if (spriteObj.spriteIm != null) {
             ctx.drawImage(
               spriteObj.spriteIm,
               sx,          // 可选。开始剪切的 x 坐标位置。
               sy,          // 可选。开始剪切的 y 坐标位置。
               spriteObj.sWidth, // 可选。被剪切图像的宽度。
               spriteObj.sHeight,// 可选。被剪切图像的高度。
               spriteObj.x,      // 在画布上放置图像的 x 坐标位置。
               spriteObj.y,      // 在画布上放置图像的 y 坐标位置。
               spriteObj.sWidth, // 可选。要使用的图像的宽度。（伸展或缩小图像）
               spriteObj.sHeight // 可选。要使用的图像的高度。（伸展或缩小图像）
            );
         }
      }
      spriteObj.spriteId += 1;
   };
   this.getDefaultZIndex = function() {
	   if (this.spriteNames.length == 0) {
		   return 0;
	   } else {
		   return this.get(this.spriteNames[this.spriteNames.length-1]).zIndex + 1;
	   }
   };
   
   this.sortSpritesByZIndex = function() {
	   var tempList = [];
	   for (var i=0;i<this.spriteNames.length;i++) {
		   tempList.push(this.get(this.spriteNames[i]));
	   }
	   tempList.sort(function(a,b){return a.zIndex - b.zIndex;});
	   this.spriteNames = [];
	   for (var i=0;i<tempList.length;i++) {
		   this.spriteNames.push(tempList[i].spriteName);
	   }
   };
   
   this.iterate = function() {
	  // Draw Background at first
      var ctx = document.getElementById(this.canvasId).getContext('2d');
      var bgCanvas = document.getElementById(this.bgCanvasId);
      ctx.drawImage( bgCanvas, 0, 0 );
	  
	  // Draw sprite one by one
      for (var i=0;i<this.spriteNames.length;i++) {
         this.drawSprite(this.spriteNames[i]);
      }
   };
   
   this.move = function(x, y, spriteName) {
	   var sprite = this.sprites[spriteName];
	   this.quadTree.removeSprite(sprite);
	   sprite.x = x;
	   sprite.y = y;
	   this.quadTree.putSprite(sprite);
   };
   
   this.update = function(sprite, spriteName) {
	   var prevSprite = this.sprites[spriteName];
	   this.quadTree.removeSprite(prevSprite);
	   sprite.x = prevSprite.x;
	   sprite.y = prevSprite.y;
	   sprite.spriteId = 0;
	   sprite.visible = prevSprite.visible;
	   sprite.register();
	   
	   sprite.zIndex = prevSprite.zIndex;
	   this.sprites[spriteName] = sprite;
	   this.quadTree.putSprite(sprite);
   };
   
   this.init = function(initSpritesFunc){
	   
	  var fgCanvas = document.getElementById(this.canvasId);
	  this.quadTree = new QuadTree(fgCanvas.width, fgCanvas.height, 2);
	  this.quadTree.init();
	  
	  initSpritesFunc();

	  this.sortSpritesByZIndex();
      var bgCanvas = document.getElementById(this.bgCanvasId);
      var bgCtx = bgCanvas.getContext("2d");
      bgCtx.fillStyle = "#39b54a"; 
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height); 
	  
	  
	  fgCanvas.onmousedown = this.onMouseDown;
	  fgCanvas.onmousemove = this.onMouseMove;
	  fgCanvas.onmouseup   = this.onMouseUp;
	  //start the interation to paint the canvas
      this.start();
   };
   this.start = function() {
	  if (this.intervalId==0) {
         this.intervalId = setInterval("spriteManager.iterate()", Math.floor(1000/this.fps));
	  }
   };
   this.stop = function() {
	  if (this.intervalId!=0) {
	     clearInterval(this.intervalId);
	  }
	  this.intervalId = 0;
   };
   
   this.getTopSprite = function(offsetX, offsetY) {
	   var hashCode = this.quadTree.getNodeHashCode(offsetX, offsetY);
	   var currZIndex = -99999;
	   var currSprite = null;
	   if (hashCode != null) {
		   var currNode = this.quadTree.tree[hashCode];
		   for (var i=0;i<currNode.objects.length;i++) {
			   var sprite = currNode.objects[i];
			   if (sprite.inside(offsetX, offsetY) && sprite.zIndex>currZIndex) {
				   currSprite = sprite;
				   currZIndex = sprite.zIndex;
			   }
		   }
	   }
	   return currSprite;
   };
   
   this.onMouseDown = function(e) {
	   var currSprite = spriteManager.getTopSprite(e.offsetX, e.offsetY);
	   if (currSprite != null) {
		   currSprite.onMouseDown(e);
	   }
   };
   this.onMouseMove = function(e) {
	   var currSprite = spriteManager.getTopSprite(e.offsetX, e.offsetY);
	   if (currSprite != null) {
		   currSprite.onMouseMove(e);
	   }
   };
   this.onMouseUp = function(e) {
	   var currSprite = spriteManager.getTopSprite(e.offsetX, e.offsetY);
	   if (currSprite != null) {
		   currSprite.onMouseUp(e);
	   }
   };
}
var spriteManager = new SpriteManager("canvas", "bgCanvas", 8);

