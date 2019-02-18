
function Sprite(width, height, spriteSheetId, spriteName, sWidth, sHeight) {
   this.spriteSheetId  = spriteSheetId;
   this.spriteName     = spriteName;
   this.spriteIm       = null;
   this.visible        = false;

   this.x              = 0;
   this.y              = 0;
   this.zIndex         = 0; // if zIndex == 0, means assign a default zIndex to it
   this.width          = width;
   this.height         = height;
   this.sWidth         = sWidth;
   this.sHeight        = sHeight;
   this.spriteId       = 0;
   
   this.getNextFrame = function() {
      var totalSize = (this.width / this.sWidth) * (this.height / this.sHeight);
      this.spriteId = this.spriteId % totalSize;
      var xPos = this.spriteId % (this.width / this.sWidth);
      var yPos = (this.spriteId - xPos) / (this.height / this.sHeight);

      return [xPos* this.sWidth, yPos*this.sHeight];
   };

   this.register = function() {
      this.spriteIm  = document.getElementById(this.spriteSheetId);
   };
   
   this.onMouseDown = function(e) {
   };
   
   this.onMouseUp = function(e) {
   };
   
   this.onMouseMove = function(e) {
   };
   
   
   this.inside = function(x, y) {
	   if (this.x <= x && x <= this.x + this.sWidth -1 &&
	       this.y <= y && y <= this.y + this.sHeight - 1) {
		   return true;
	   } else {
		   return false;
	   }
   };
}
