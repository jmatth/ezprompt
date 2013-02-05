function add_prompt_element ()
{
	selected_option = $("#elements_available").children(".ui-selected").text().trim();
	$("#elements").children("ul").append(generate_element(selected_option));
	make_list_selectable();
}

function change_option_selection(option_id)
{
	$(".prompt_option_selected").removeClass("prompt_option_selected");
	$("#" + option_id).addClass("prompt_option_selected");
}

function generate_element(option_name)
{
	return "<li class=\"ui-state-default\">" + option_name + "</li>";
}

function make_list_selectable()
{
	//FIXME: probably a more effecient way to do this
	try{
		$("#elements_list")
		.sortable("destroy")
		.selectable("destroy")
		.children("li")
		.children(".handle")
		.remove();
	}catch(err){}

	$("#elements_list")
	.sortable({ handle: ".handle" })
	.selectable()
	.find("li")
	.addClass("ui-corner-all")
	.prepend("<div class='handle'><span class='ui-icon ui-icon-carat-2-e-w'></span></div>");
}

function make_available_selectable()
{
	$("#elements_available")
	.selectable()
}

function reset_page()
{
	alert("DERP");
}

$(document).ready(function()
{
	make_list_selectable();
	make_available_selectable();
});
