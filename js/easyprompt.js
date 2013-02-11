preview_text = {
	'option-username': 'user',
	'option-hostname': 'host',
	'option-fqdn': 'host.domain.com',
	'option-absolutepath': '/home/user/dir',
	'option-abbreviatedpath': '~/dir',
	'option-currentdirectory': 'dir'
}

function add_prompt_element ()
{
	// get the id
	selected_option = $("#elements-options")
	.children('div[aria-expanded="true"]')
	.children('ul')
	.children(".single-selected").attr("id");

	//append a copy to the list
	$("#"+selected_option)
	.clone()
	.removeClass("single-selected")
	.appendTo("#elements-list");

	//Make sure we actually have something to add
	if(!selected_option)
	{
		return;
	}

	//$("#elements").children("ul").append(generate_element(selected_option));
	make_list_sortable();
	refresh_preview();
}

function change_option_selection(option_id)
{
	$(".prompt-option-selected").removeClass("prompt-option-selected");
	$("#" + option_id).addClass("prompt-option-selected");
}

function generate_element(option_name)
{
	if(!preview_text.hasOwnProperty(option_name))
	{
		console.log("Option " + option_name + " not found.");
		return false;
	}

	console.log(option_name);
	
	return '<li class="element-preview" element_id="' + option_name + '">' +
		'<span class="preview-text">' + preview_text[option_name] + '</span></li>';

}

function make_list_sortable()
{
	//FIXME: probably a more effecient way to do this
	try{
		$("#elements-list")
		.sortable("destroy")
	}catch(err){}

	$("#elements-list")
	.sortable({delay: 300, update: function(){refresh_preview()}})
	.children("li")
	.off("click.single-select")
	.on("click.single-select", function(){
		if ($(this).hasClass("single-selected"))
		{
			$(this).removeClass('single-selected').siblings().removeClass('single-selected');
		}
		else
		{
			$(this).addClass('single-selected').siblings().removeClass('single-selected');
		}
	});
}

//make the available prompt opttions selectable one at a time.
//also use tabs to divide the sections.
function make_available_selectable()
{
	$("#elements-options").tabs();

	$("li.prompt-option").click(function(){
		$(this).addClass('single-selected').siblings().removeClass('single-selected');
	});
}

function change_prompt_fg(hex_color, attribute)
{
	try
	{
		if (attribute == 'fg')
		{
			$("#elements")
			.children(".ui-sortable")
			.children(".single-selected")
			.css("color", hex_color);
		}
		else
		{
			$("#elements")
			.children(".ui-sortable")
			.children(".single-selected")
			.children("span")
			.css("background-color", hex_color);
		}
	} catch (e){}
}

function refresh_preview()
{
	$("#preview-list").empty();
	$("#elements-list").children("li").each(function(index) {
		$("#preview-list").append(generate_element($(this).attr("id")));
	});
}

function make_spectrum(element_id) {
	$(element_id).spectrum({
		color: "#F00",
	});
}

function reset_page()
{
	alert("DERP");
}

$(document).ready(function()
{
	make_list_sortable();
	make_available_selectable();

	make_spectrum("#input-spectrum-fg");
	make_spectrum("#input-spectrum-bg");
});
