/*Begin output objects*/

var preview_text = {
	'element-username': 'user',
	'element-hostname': 'host',
	'element-fqdn': 'host.domain.com',
	'element-shell': 'bash',
	'element-shellversion': '4.2',
	'element-shellrelease': '4.2.42',
	'element-pathtocurrentdirectory': '~/dir',
	'element-currentdirectory': 'dir',
	'element-date': generate_date(),
	'element-fulltimeseconds': generate_time(false, true),
	'element-halftimeseconds': generate_time(true, true),
	'element-fulltime': generate_time(false, false),
	'element-halftime': generate_time(true, false),
	'element-promptchar': '$',
	'element-atsymbol': '@',
	'element-colon': ':',
	'element-openbracket': '[',
	'element-closebracket': ']',
	'element-space': ' ',
	'element-returncode': '1',
	'element-gitstatus': '[master]'
};

var code_output_text = {
	'element-username': '\\u',
	'element-hostname': '\\h',
	'element-fqdn': '\\H',
	'element-shell': '\\s',
	'element-shellversion': '\\v',
	'element-shellrelease': '\\V',
	'element-pathtocurrentdirectory': '\\w',
	'element-currentdirectory': '\\W',
	'element-date': '\\d',
	'element-fulltimeseconds': '\\t',
	'element-halftimeseconds': '\\T',
	'element-fulltime': '\\A',
	'element-halftime': '\\@',
	'element-promptchar': '\\\\$',
	'element-returncode': '\\`nonzero_return\\`',
	'element-gitstatus': '\\`parse_git_branch\\`'
};

var code_output_pre = {
	'element-returncode': "function nonzero_return() {\n\tRETVAL=$?\n\t[ $RETVAL -ne 0 ] && echo \"$RETVAL\"\n}\n",
	'element-gitstatus': "# get current branch in git repo\n"+
		"function parse_git_branch() {\n"+
		"\tBRANCH=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \\(.*\\)/\\1/'`\n"+
		"\tif [ ! \"${BRANCH}\" == \"\" ]\n"+
		"\tthen\n"+
        "\t\tSTAT=`parse_git_dirty`\n"+
        "\t\techo \"[${BRANCH}${STAT}]\"\n"+
		"\telse\n"+
        "\t\techo \"\"\n"+
		"\tfi\n"+
		"}\n\n"+
		"# get current status of git repo\n"+
		"function parse_git_dirty {\n"+
		"\tstatus=`git status 2>&1 | tee`\n"+
        "\tdirty=`echo -n \"${status}\" 2> /dev/null | grep \"modified:\" &> /dev/null; echo \"$?\"`\n"+
        "\tuntracked=`echo -n \"${status}\" 2> /dev/null | grep \"Untracked files\" &> /dev/null; echo \"$?\"`\n"+
        "\tahead=`echo -n \"${status}\" 2> /dev/null | grep \"Your branch is ahead of\" &> /dev/null; echo \"$?\"`\n"+
        "\tnewfile=`echo -n \"${status}\" 2> /dev/null | grep \"new file:\" &> /dev/null; echo \"$?\"`\n"+
        "\trenamed=`echo -n \"${status}\" 2> /dev/null | grep \"renamed:\" &> /dev/null; echo \"$?\"`\n"+
		"\tdeleted=`echo -n \"${status}\" 2> /dev/null | grep \"deleted:\" &> /dev/null; echo \"$?\"`\n"+
        "\tbits=''\n"+
        "\tif [ \"${renamed}\" == \"0\" ]; then\n"+
		"\t\tbits=\">${bits}\"\n"+
        "\tfi\n"+
        "\tif [ \"${ahead}\" == \"0\" ]; then\n"+
		"\t\tbits=\"*${bits}\"\n"+
        "\tfi\n"+
        "\tif [ \"${newfile}\" == \"0\" ]; then\n"+
		"\t\tbits=\"+${bits}\"\n"+
        "\tfi\n"+
        "\tif [ \"${untracked}\" == \"0\" ]; then\n"+
		"\t\tbits=\"?${bits}\"\n"+
        "\tfi\n"+
		"\tif [ \"${deleted}\" == \"0\" ]; then\n"+
		"\t\tbits=\"x${bits}\"\n"+
		"\tfi\n"+
        "\tif [ \"${dirty}\" == \"0\" ]; then\n"+
		"\t\tbits=\"!${bits}\"\n"+
        "\tfi\n"+
		"\tif [ ! \"${bits}\" == \"\" ]; then\n"+
        "\t\techo \" ${bits}\"\n"+
		"\telse\n"+
        "\t\techo \"\"\n"+
        "\tfi\n"+
		"}\n"
};

var term_color_codes = {
	'#000':    '0',
	'#f00':    '1',
	'#008000': '2',
	'#ff0':    '3',
	'#00f':    '4',
	'#f0f':    '5',
	'#0ff':    '6',
	'#fff':    '7'
};

/*End output objects*/

//Keep track of the sortable elements to assign unique ids
//FIXME: place this somewhere nicer
var element_counter = 0;

/*Begin interactive calls*/

function add_prompt_element (source_object)
{
	//Make sure we actually have something to add
	if(!source_object)
	{
		return;
	}

	var source_id = source_object.attr("id");

	//append a copy to the list
	source_object
	.clone()
	.attr("id", "element-number-" + String(element_counter++))
	.attr("element-identifier", "element-" + source_id.split("-")[1])
	.addClass("ui-selected")
	.on("click.quickselect", function() {
		var current_element = $(this);
		if(!current_element.hasClass("ui-selected"))
		{
			current_element
			.addClass("ui-selected");
		}
		current_element
		.siblings()
		.removeClass("ui-selected");
		
		match_spectrums();
	})
	.prepend('<div class="ui-state-default ui-icon prompt-option handle"></div>')
	.appendTo("#elements-list")
	.siblings().removeClass('ui-selected');

	match_spectrums();
	refresh_page();
}

//toggle the preview background color, as well as
//the default text color to match.
function toggle_bg()
{
	var preview = $("#preview");

	if (preview.hasClass("preview-light"))
	{
		preview
		.removeClass("preview-light")
		.addClass("preview-dark");
	}
	else
	{
		preview
		.removeClass("preview-dark")
		.addClass("preview-light");
	}

	match_spectrums();
}

/*End interactive calls*/

/*Begin helper functions.*/

//generate the current time in ddd MMM dd format (ex. Thu Feb 14)
function generate_date()
{
		var date = Date().split(" ").slice(0,3);
		var return_date = date[0];
		for (var i = 1; i < date.length; i += 1)
		{
			return_date += " " + date[i];
		}
		return return_date;
}

//generate the time in multiple formats.
function generate_time(half_hours, show_seconds)
{
	var today = new Date();

	//get the time values
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var seconds = show_seconds ? today.getSeconds() : undefined;

	var hours_suffix = half_hours && !show_seconds ? hours >= 12 ? " PM" : " AM" : "";

	hours = hours >= 12 && half_hours ? hours - 12 : hours;
	hours = hours < 10 ? "0" + String(hours) : String(hours);

	minutes = ":" + (minutes < 10 ? "0" + String(minutes) : String(minutes));

	seconds = seconds < 10 ? ":0" + String(seconds) : seconds ? ":" + String(seconds) : "";

	return hours + minutes + seconds + hours_suffix;
}

//generate the preview list
function refresh_preview()
{
	var preview_list = $("#preview-list");
	preview_list.empty();
	$("#elements-list").children("li").each(function(index) {
		preview_list.append(generate_element($(this)));
	});

	//Generate a span to append to the preview list
	function generate_element(option_element)
	{
		var option_name = option_element.attr("element-identifier");
		var color_fg = option_element.attr("option-fg");
		var color_bg = option_element.attr("option-bg");

		var preview_output;
		if (option_name === "element-custom")
		{
			preview_output = option_element.text();
		}
		else if(preview_text[option_name])
		{
			preview_output = preview_text[option_name];
		}
		else
		{
			return false;
		}

		return '<li class="element-preview" element_id="' +
			option_name + '">' + '<span class="preview-text" style="' +
			(typeof(color_fg) === 'undefined' ? '' : 'color:' + color_fg + ';') + 
			(typeof(color_bg) === 'undefined' ? '' : 'background-color:' + color_bg + ';') + 
			'">' +
			preview_output + '</span></li>';

	}
}

//generate the code for bashrc
function refresh_code()
{
	var functions_added = [];

	var code_output = $("#code-output-text");
	code_output.text('export PS1="');

	$("#elements-list").children("li").each(function(index) {
		append_code($(this));
	});

	code_output.text(code_output.text() + ' "');

	function append_code(option_element)
	{
		var element_identifier = option_element.attr("element-identifier");
		var fg_code = option_element.attr("option-fg");
		var bg_code = option_element.attr("option-bg");

		//insert any helper functions needed
		if(code_output_pre[element_identifier] && functions_added.indexOf(element_identifier) == -1)
		{
			functions_added.push(element_identifier);

			code_output
			.text(code_output_pre[element_identifier] + "\n" + code_output.text());
		}

		//output the escape sequence, or the same text as in the preview
		//if that does not exist. if custom text, used what was entered.
		var output_text;
		if (element_identifier === "element-custom")
		{
			output_text = option_element.text();
		}
		else if (code_output_text[element_identifier])
		{
			output_text = code_output_text[element_identifier];
		}
		else
		{
			output_text = preview_text[element_identifier];
		}

		var color_before = '', color_after = '';

		if (fg_code || bg_code)
		{
			color_before = "\\[\\e[";
			color_after = "\\[\\e[m\\]";
			if (fg_code && bg_code)
			{
				color_before = color_before +
					"3" + term_color_codes[fg_code] + ";" +
					"4" + term_color_codes[bg_code] + "m\\]";
			}
			else if(fg_code)
			{
				color_before = color_before +
					"3" + term_color_codes[fg_code] + "m\\]";
			}
			else if(bg_code)
			{
				color_before = color_before +
					"4" + term_color_codes[bg_code] + "m\\]";
			}
		}
		
		if(output_text)
		{
			code_output
			.text(code_output.text() + color_before + output_text + color_after);
		}
	}
}

//update the spectrum colors to match the selected element
function match_spectrums()
{
	var source_element = $(".ui-selected");
	var fg_value = source_element ? source_element.attr("option-fg") : null;
	var bg_value = source_element ? source_element.attr("option-bg") : null;

	if (source_element && source_element.length > 1)
	{
		var previous_fg = $(source_element[0]).attr('option-fg');
		var previous_bg = $(source_element[0]).attr('option-bg');
		var current_fg, current_bg;
		var check_fg = true, check_bg = true;
		for (var i = 1; i < source_element.length; i += 1)
		{
			current_fg = $(source_element[i]).attr("option-fg") || null;
			current_bg = $(source_element[i]).attr("option-bg") || null;

			if (check_fg && current_fg != previous_fg)
			{
				fg_value = null;
				check_fg = false;
			}
			if (check_bg && current_bg != previous_bg)
			{
				bg_value = null;
				check_bg = false;
			}

			if (!check_fg && !check_bg)
			{
				break;
			}

			preview_fg = current_fg;
			preview_bg = current_bg;
		}
	}

	var preview_bg = $("#preview").hasClass("preview-light") ? "light" : "dark";

	if(fg_value)
	{
		$("#input-spectrum-fg").spectrum("set", fg_value);
	}
	else
	{
		if(preview_bg === "dark")
		{
			$("#input-spectrum-fg").spectrum("set", "white");
		}
		else
		{
			$("#input-spectrum-fg").spectrum("set", "black");
		}
	}

	if(bg_value)
	{
		$("#input-spectrum-bg").spectrum("set", bg_value);
	}
	else
	{
		if(preview_bg === "dark")
		{
			$("#input-spectrum-bg").spectrum("set", "black");
		}
		else
		{
			$("#input-spectrum-bg").spectrum("set", "white");
		}
	}
}

/*End helper functions*/

/*Begin page setup functions.*/

//attach event listeners to the buttons.
function activate_buttons()
{
	$("#button-element-reset-selected").on("click", function() {
		var succ_fist=true, succ_second=true;
		try{
			$("#elements-list").children("li.ui-selected").removeAttr("option-fg");
		}catch(e){succ_fist = false;}
		try{
			$("#elements-list").children("li.ui-selected").removeAttr("option-bg");
		}catch(e){succ_second = false;}

		if (succ_fist || succ_second)
		{
			match_spectrums();
			refresh_page();
		}
	});

	$("#button-element-delete-selected").on("click", function() {
		var succ = true;
		try
		{
			$("#elements-list").children("li.ui-selected").remove();
			$("#elements-list").children(":last").addClass("ui-selected");
		}catch(e){succ=false;}

		if(succ)
		{
			match_spectrums();
			refresh_page();
		}
	});

	$("#button-element-reset-all").on("click", function() {
		var succ_fist=true, succ_second=true;
		try{
			$("#elements-list").children("li").removeAttr("option-fg");
		}catch(e){succ_fist = false;}
		try{
			$("#elements-list").children("li").removeAttr("option-bg");
		}catch(e){succ_second = false;}

		if (succ_fist || succ_second)
		{
			match_spectrums();
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
			match_spectrums();
			refresh_page();
		}
	});
}

//create a spectrum color picker on the specified element.
function make_spectrum(element_id) {

	var element_suffix = element_id.split("-");
	element_suffix = element_suffix[element_suffix.length-1];

	var color;
	//is the preview background white or black?
	if($("#preview").hasClass("preview-light"))
	{
		color = element_suffix === "fg" ? "black" : "white";
	}
	else
	{
		color = element_suffix === "fg" ? "white" : "black";
	}

	$(element_id).spectrum({
		showPaletteOnly: true,
		showPalette: true,
		color: color,
		palette: [
			['red', 'green', 'blue', 'yellow'],	
			['cyan', 'magenta', 'black', 'white']
		],
		move: function(color) {
			try{
				$("#elements-list")
				.children("li.ui-selected")
				.attr(element_suffix == "fg" ? "option-fg" : "option-bg", color.toHexString());
			}catch(e){}
			refresh_page();
		}
	});
}

//attach event listeners to available options.
function activate_element_options()
{
	//add the predefined elements on click.
	$("li.prompt-option").click(function(){
		add_prompt_element($(this));
	});

	//add custom text on button click
	$("button#custom-text-button")
	.tooltip()
	.click(function(){
		var input_box = $("#custom-text-input");
		var custom_text = remove_evil_chars(input_box.val());

		//if we had to remove bad characters, just change the
		//text in the box and return.
		if (custom_text !== input_box.val())
		{
			input_box.val(custom_text);
			return;
		}

		//don't do anything if it's blank
		if (!custom_text)
		{
			return;
		}

		input_box.val("");

		$('<li class="ui-state-default prompt-option ui-selected" id="element-number-' +
			String(element_counter++) +
			'" element-identifier="element-custom">' +
			custom_text +
			'</li>')
		.on("click.single-select", function(){
			if (!$(this).hasClass("ui-selected"))
			{
				$(this).addClass('ui-selected').siblings().removeClass('ui-selected');
			}

			match_spectrums();
		})
		.appendTo("#elements-list")
		.siblings().removeClass('ui-selected');
		refresh_page();

		//remove characters that could break the prompt
		function remove_evil_chars(raw_str)
		{
			var evil_regex = /[\\\(\){}\$]/g;
			return raw_str.replace(evil_regex, "");
		}

	});
}

/*End page setup functions.*/

//wrapper to regenerate the preview and output.
function refresh_page() {
	refresh_preview();
	refresh_code();
}

$(document).ready(function()
{
	//make the list of added elements sortable
	$("#elements-list")
	.sortable({
		handle: ".handle",
		tolerance: "pointer", 
		update: function(){refresh_page();}
		
	})
	.selectable({
		distance: 50,
		selected: function(){
			match_spectrums();

			$("#elements-list")
			.children("li.prompt-option")
			.children("div.handle")
			.css("display", "");
		},
		start: function(){
			$("#elements-list")
			.children("li.prompt-option")
			.children("div.handle")
			.css("display", "none");
		}
	});

	//separate the available sections into tabs.
	$("#elements-options").tabs();

	//add tooltips to the available options
	$("#elements-options").children("div.elements-tab").children("ul").children("li").tooltip();

	//add tooltips to the delete and reset buttons.
	$("#elements-control-buttons").children("button").tooltip();

	make_spectrum("#input-spectrum-bg");
	make_spectrum("#input-spectrum-fg");

	activate_element_options();
	activate_buttons();

	refresh_page();
});
