// add remove method to Array's prototype
Array.prototype.remove = function(val) {
	// body...
	var idx = this.indexOf(val);

	if (idx > -1) {
		this.splice(idx, 1);
	}
};