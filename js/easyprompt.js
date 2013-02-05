function add_prompt_element ()
{
	selected_option = $(".prompt_option_selected").text().trim();
	alert(selected_option);
	$("#elements").append(generate_element(selected_option));
}

function change_option_selection(option_id)
{
	$(".prompt_option_selected").removeClass("prompt_option_selected");
	$("#" + option_id).addClass("prompt_option_selected");
}

function generate_element(option_name)
{
	return "<span class=\"prompt_element\">x <span class=\"element_internal\">"+
		option_name + "</span>";
}

function reset_page()
{
	alert("DERP");
}

//Create sortable handles on load.
$(function() {
	$("#elements_list")
	.sortable({ handle: ".handle" })
	.selectable()
	.find("li")
	.addClass("ui-corner-all")
	.prepend("<div class='handle'><span class='ui-icon ui-icon-carat-2-e-w'></span></div>");
});

//Make the element options selectable
$(function() {
	$("#controls")
	.selectable()
});
