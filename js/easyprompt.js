function add_prompt_element ()
{
	selected_option = $("#elements-options")
	.children('div[aria-expanded="true"]')
	.children('ul')
	.children(".ui-selected").attr("id");

	//Make sure we actually have something to add
	if(!selected_option)
	{
		return;
	}

	$("#elements").children("ul").append(generate_element(selected_option));
	toggle_list_selectable($("#reorderable").is(":checked"));
}

function change_option_selection(option_id)
{
	$(".prompt-option-selected").removeClass("prompt-option-selected");
	$("#" + option_id).addClass("prompt-option-selected");
}

function toggle_reorderable(toggle)
{
		toggle_list_selectable(toggle);
}

function generate_element(option_name)
{
	preview_text = {
		'option-username': 'user',
		'option-hostname': 'host',
		'option-fqdn': 'host.domain.com',
		'option-absolutepath': '/home/user/dir',
		'option-abbreviatedpath': '~/dir',
		'option-currentdirectory': 'dir'
	}

	if(!preview_text.hasOwnProperty(option_name))
	{
		console.log("Option " + option_name + " not found.");
		return;
	}
	
	return "<li class=\"ui-state-default border-hidden\" element_id=\"" + option_name + "\">" + preview_text[option_name] + "</li>";

}

function toggle_list_selectable(selectable)
{
	//FIXME: probably a more effecient way to do this
	try{
		$("#elements-list")
		.sortable("destroy")
		.selectable("destroy")
		.children("li")
		.addClass("border-hidden")
		.children(".handle")
		.remove();
	}catch(err){}

	if (selectable)
	{
		$("#elements-list")
		.sortable({ handle: ".handle" })
		.selectable()
		.find("li")
		.addClass("ui-corner-all")
		.removeClass("border-hidden")
		.prepend("<div class='handle'><span class='ui-icon ui-icon-carat-2-e-w'></span></div>");
	}
}

function make_available_selectable()
{
	$("#elements-options")
	.tabs();
	$("#elements-basic")
	.selectable()
	$("#elements-advanced")
	.selectable()
}

function reset_page()
{
	alert("DERP");
}

$(document).ready(function()
{
	toggle_list_selectable(false);
	make_available_selectable();
});
