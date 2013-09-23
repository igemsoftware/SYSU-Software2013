// add remove method to Array's prototype
Array.prototype.remove = function(val) {
	// body...
	var idx = this.indexOf(val);

	if (idx > -1) {
		this.splice(idx, 1);
	}
};


function resetConfig() {
	$("input[name=part_id]").attr({
        'value': ""
    });
    $("input[name=part_name]").attr({
        'value': ""
    });
    $("input[name=part_short_name]").attr({
        'value': ""
    });
    $("input[name=part_short_desc]").attr({
        'value': ""
    });
    $("input[name=part_type]").attr({
        'value': ""
    });
    $("input[name=part_status]").attr({
        'value': ""
    });
    $("input[name=part_results]").attr({
        'value': ""
    });
    $("input[name=part_nickname]").attr({
        'value': ""
    });
    $("input[name=part_rating]").attr({
        'value': ""
    });
    $("input[name=part_author]").attr({
        'value': ""
    });
    $("input[name=part_entered]").attr({
        'value': ""
    });
    $("input[name=part_quality]").attr({
        'value': ""
    });
}