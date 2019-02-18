function QuadNode(loc, level, parentNode) {
	this.loc = loc;
	this.level = level;
	this.hashCode = (parentNode == null) ? "00":(parentNode.hashCode + this.loc);


	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 0;
	this.y2 = 0;
	
	switch(loc) {
		case "NW":
			this.x1 = parentNode.x1;
			this.y1 = parentNode.y1;
			this.x2 = Math.floor(parentNode.x1 + (parentNode.x2 - parentNode.x1) / 2);
			this.y2 = Math.floor(parentNode.y1 + (parentNode.y2 - parentNode.y1) / 2);
    		break;
  		case "NE":
			this.x1 = Math.floor(parentNode.x1 + (parentNode.x2 - parentNode.x1) / 2) + 1;
    		this.y1 = parentNode.y1;
			this.x2 = parentNode.x2;
			this.y2 = Math.floor(parentNode.y1 + (parentNode.y2 - parentNode.y1) / 2);
    		break;
  		case "SW":
    		this.x1 = parentNode.x1;
			this.y1 = Math.floor(parentNode.y1 + (parentNode.y2 - parentNode.y1) / 2) + 1;
			this.x2 = Math.floor(parentNode.x1 + (parentNode.x2 - parentNode.x1) / 2);
			this.y2 = parentNode.y2;
    		break;
		case "SE":
			this.x1 = Math.floor(parentNode.x1 + (parentNode.x2 - parentNode.x1) / 2) + 1;
			this.y1 = Math.floor(parentNode.y1 + (parentNode.y2 - parentNode.y1) / 2) + 1;
			this.x2 = parentNode.x2;
			this.y2 = parentNode.y2;
			break;
	}
	
	this.objects = [];
}
function QuadTree(width, height, aLevel) {
   this.level = aLevel;
   this.width = width;
   this.height = height;
   this.tree = {}
   
   this.init = function() {
	   var root = new QuadNode("", 0, null);
	   root.x2 = this.width -1;
	   root.y2 = this.height - 1;
	   var currNodes = [root];
	   var nextNodes = [];
	   var positionMarks = ['NE', 'NW', 'SE', 'SW'];
	   
	   for (var level=0;level<this.level;level++) {
		   nextNodes = [];
		   for (var j=0;j<currNodes.length;j++) {
			   var currNode = currNodes[j];
			   this.tree[currNode.hashCode] = currNode;
			   
			   for (var k=0;k<4;k++) {
				   var aNode = new QuadNode(positionMarks[k], level+1, currNode);
				   nextNodes.push(aNode);
			   }
		   }
		   currNodes = nextNodes;
	   }
   };
   
   //private function
   this.getNodeHashCode = function(x, y) {	   
	   var currNode = this.tree["00"];
	   
	   if (x<currNode.x1 || y<currNode.y1 || x>currNode.x2 || y>currNode.y2) return null;
	   
	   for (var i=0;i<this.level-1;i++) {
		   var mark = (y >= Math.floor(currNode.y1 + (currNode.y2-currNode.y1))+1 )?"S":"N";
		   mark += (x >= Math.floor(currNode.x1 + (currNode.x2-currNode.x1))+1 )?"E":"W";
		   currNode = this.tree[currNode.hashCode + mark];
	   }
	   return currNode.hashCode;
   };
   
   this.getNodes = function(sprite) {
	   var nodesHashCodes = {};
	   
	   var h = this.getNodeHashCode(sprite.x, sprite.y);
	   if (h!=null) nodesHashCodes[h] = 1;
	   
	   var h = this.getNodeHashCode(sprite.x+ sprite.width-1, sprite.y);
	   if (h!=null) nodesHashCodes[h] = 1;

	   var h = this.getNodeHashCode(sprite.x, sprite.y + sprite.height-1);
	   if (h!=null) nodesHashCodes[h] = 1;
	   
	   var h = this.getNodeHashCode(sprite.x+ sprite.width-1,sprite.y + sprite.height-1);
	   if (h!=null) nodesHashCodes[h] = 1;
	   
	   var nodeHashCodes = Object.keys(nodesHashCodes);
	   return nodeHashCodes;
   };
   
   this.putSprite = function(sprite) {
	   var nodeHashCodes = this.getNodes(sprite);
	   for (var i=0;i<nodeHashCodes.length;i++) {
		   var currNode = this.tree[nodeHashCodes[i]];
		   if (!currNode.objects.includes(sprite)) {
			   currNode.objects.push(sprite);
		   }
	   }
   };
   
   this.removeSprite =function(sprite) {
	   var nodeHashCodes = this.getNodes(sprite);
	   for (var i=0;i<nodeHashCodes.length;i++) {
		   var currNode = this.tree[nodeHashCodes[i]];
		   var idx = currNode.objects.indexOf(sprite);
		   if (idx >= 0 ) {
			    currNode.objects.splice(idx,1);
		   }
	   }
   };
}

var quadTree = new QuadTree(128, 128, 2);
