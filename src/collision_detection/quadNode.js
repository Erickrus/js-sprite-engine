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
