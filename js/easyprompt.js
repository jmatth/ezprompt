preview_text = {
	'element-username': 'user',
	'element-hostname': 'host',
	'element-fqdn': 'host.domain.com',
	'element-abbreviatedpath': '~/dir',
	'element-currentdirectory': 'dir',
	'element-atsymbol': '@',
	'element-colon': ':',
	'element-promptchar': '$',
	'element-space': ' '
}

code_output_text = {
	'element-username': '\\u',
	'element-hostname': '\\h',
	'element-fqdn': '\\H',
	'element-abbreviatedpath': '\\w',
	'element-currentdirectory': '\\W',
	'element-atsymbol': '@',
	'element-colon': ':',
	'element-promptchar': '\\\\$',
	'element-space': ' '
}

term_fg_color_codes = {
	'#000':    '30',
	'#f00':    '31',
	'#008000': '32',
	'#ff0':    '33',
	'#00f':    '34',
	'#f0f':    '35',
	'#0ff':    '36',
	'#fff':    '37'
}

term_bg_color_codes = {
	'#000':    '40',
	'#f00':    '41',
	'#008000': '42',
	'#ff0':    '43',
	'#00f':    '44',
	'#f0f':    '45',
	'#0ff':    '46',
	'#fff':    '47'
}

//Keep track of the sortable elements to assign unique ids
//FIXME: place this somewhere nicer
element_counter = 0;

function add_prompt_element (source_id)
{
	//Make sure we actually have something to add
	if(!source_id)
	{
		return;
	}

	//append a copy to the list
	$("#"+source_id)
	.clone()
	.attr("id", "element-number-" + String(element_counter++))
	.attr("element-identifier", "element-" + source_id.split("-")[1])
	.addClass("single-selected")
	.on("click.single-select", function(){
		if ($(this).hasClass("single-selected"))
		{
			$(this).removeClass('single-selected').siblings().removeClass('single-selected');
		}
		else
		{
			$(this).addClass('single-selected').siblings().removeClass('single-selected');
		}

		match_spectrums($(this).attr("id"));
	})
	.appendTo("#elements-list")
	.siblings().removeClass('single-selected');

	update_spectrums();
	make_list_sortable();
	refresh_page();
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
	.sortable({delay: 300, update: function(){refresh_page()}})
}

//make the available prompt opttions selectable one at a time.
//also use tabs to divide the sections.
function make_available_selectable()
{
	$("#elements-options").tabs();

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

//generate the preview list
function refresh_preview()
{
	$("#preview-list").empty();
	$("#elements-list").children("li").each(function(index) {
		$("#preview-list").append(generate_element(
				$(this).attr("element-identifier"),
				$(this).attr("option-fg"),
				$(this).attr("option-bg")));
	});
}

//generate the code for bashrc
function refresh_code()
{
	$("#code-output-text").text('PS1="');

	$("#elements-list").children("li").each(function(index) {
		$("#code-output-text").text($("#code-output-text").text() +
			generate_code(
				$(this).attr("element-identifier"),
				$(this).attr("option-fg"),
				$(this).attr("option-bg")
				)
			);
	});

	$("#code-output-text").text($("#code-output-text").text() + '"');

	function generate_code(element_id, fg_code, bg_code)
	{
		var output_text = code_output_text[element_id];

		var color_before = '', color_after = '';

		if (fg_code || bg_code)
		{
			color_before = "\\[\\e[";
			color_after = "\\[\\e[m\\]"
			if (fg_code && bg_code)
			{
				color_before = color_before +
					term_fg_color_codes[fg_code] + ";" +
					term_bg_color_codes[bg_code] + "m\\]";
			}
			else if(fg_code)
			{
				color_before = color_before +
					term_fg_color_codes[fg_code] + "m\\]";
			}
			else if(bg_code)
			{
				color_before = color_before +
					term_bg_color_codes[bg_code] + "m\\]";
			}
		}
		
		if(output_text)
		{
			return color_before + output_text + color_after;
		}
		else
		{
			console.log("output_text for " + element_id + " not found.");
			return '';
		}
	}
}

function make_spectrum(element_id) {

	var element_suffix = element_id.split("-");
	element_suffix = element_suffix[element_suffix.length-1];

	$(element_id).spectrum({
		showPaletteOnly: true,
		showPalette: true,
		color: element_suffix === "fg" ? "white" : "black",
		palette: [
			['red', 'green', 'blue', 'yellow'],	
			['cyan', 'magenta', 'black', 'white']
		],
		move: function(color) {
			update_element_color(color.toHexString(), element_suffix);
			refresh_page();
		}
	});
}

//update the spectrum colors to match the selected element
function match_spectrums(element_id)
{
	var fg_value = $("#" + element_id).attr("option-fg");
	var bg_value = $("#" + element_id).attr("option-bg");

	if(fg_value)
	{
		$("#input-spectrum-fg").spectrum("set", fg_value);
	}
	else
	{
		$("#input-spectrum-fg").spectrum("set", "white");
	}

	if(bg_value)
	{
		$("#input-spectrum-bg").spectrum("set", bg_value);
	}
	else
	{
		$("#input-spectrum-bg").spectrum("set", "black");
	}

}

//Wrapper to match the spectrums to the currently selected element
function update_spectrums(){
	match_spectrums($("#elements-list").children("li.single-selected").attr("id"));
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

//attach event listeners to available options.
function activate_element_options()
{
	$("li.prompt-option").click(function(){
		add_prompt_element($(this).attr("id"));
	});
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
			match_spectrums(null);
			refresh_page();
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
			match_spectrums(null);
			refresh_page();
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
			match_spectrums(null);
			refresh_page();
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
			match_spectrums(null);
			refresh_page();
		}
	});
}

function refresh_page() {
	refresh_preview();
	refresh_code();
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

	activate_element_options();
	activate_buttons();

	refresh_page();
});
