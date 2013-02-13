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

function generate_element(option_name, color_fg, color_bg)
{
	if(!preview_text.hasOwnProperty(option_name))
	{
		console.log("Option " + option_name + " not found.");
		return false;
	}

	return '<li class="element-preview" element_id="' +
		option_name + '">' + '<span class="preview-text" style="' +
		(typeof(color_fg) === 'undefined' ? '' : 'color:' + color_fg + ';') + 
		(typeof(color_bg) === 'undefined' ? '' : 'background-color:' + color_bg + ';') + 
		'">' +
		preview_text[option_name] + '</span></li>';

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
		$("#preview-list").append(generate_element(
				$(this).attr("id"),
				$(this).attr("option-fg"),
				$(this).attr("option-bg")));
	});
}

function make_spectrum(element_id) {

	var element_suffix = element_id.split("-");
	element_suffix = element_suffix[element_suffix.length-1];

	$(element_id).spectrum({
		showPaletteOnly: true,
		showPalette: true,
		palette: [
			['red', 'green', 'blue', 'yellow'],	
			['cyan', 'magenta', 'black', 'white']
		],
		move: function(color) {
			update_element_color(color.toHexString(), element_suffix);
			refresh_preview();
		}
	});
}

function update_element_color(color, spectrum_id)
{
	//selected_element = $("#elements-list").children("li.single-selected");
	try{
		$("#elements-list")
		.children("li.single-selected")
		.attr(spectrum_id == "fg" ? "option-fg" : "option-bg", color);
	}catch(e){}
}

//attach event listeners to the buttons.
function activate_buttons()
{
	$("#button-element-reset-selected").on("click", function() {
		var succ_fist=true, succ_second=true;
		try{
			$("#elements-list").children("li.single-selected").removeAttr("option-fg");
		}catch(e){succ_fist = false}
		try{
			$("#elements-list").children("li.single-selected").removeAttr("option-bg");
		}catch(e){succ_second = false}

		if (succ_fist || succ_second)
		{
			refresh_preview();
		}
	});

	$("#button-element-delete-selected").on("click", function() {
		var succ = true;
		try
		{
			$("#elements-list").children("li.single-selected").remove();
		}catch(e){succ=false;}

		if(succ)
		{
			refresh_preview();
		}
	});

	$("#button-element-reset-all").on("click", function() {
		var succ_fist=true, succ_second=true;
		try{
			$("#elements-list").children("li").removeAttr("option-fg");
		}catch(e){succ_fist = false}
		try{
			$("#elements-list").children("li").removeAttr("option-bg");
		}catch(e){succ_second = false}

		if (succ_fist || succ_second)
		{
			refresh_preview();
		}
	});
	$("#button-element-delete-all").on("click", function() {
		var succ = true;
		try
		{
			$("#elements-list").children("li").remove();
		}catch(e){succ=false;}

		if(succ)
		{
			refresh_preview();
		}
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

	make_spectrum("#input-spectrum-bg");
	make_spectrum("#input-spectrum-fg");

	activate_buttons();
});
