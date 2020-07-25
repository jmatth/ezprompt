/*Begin output objects*/
var preview_types = [
    "tc",
    "extended",
    "base"
];


//nearestColor = require("./nearest-color/nearestColor");
var bash_vars = [
    "BASH",
    "BASH_ENV",
    "BASH_SUBSHELL",
    "BASHPID",
    "BASH_VERSION",
    "CDPATH",
    "DIRSTACK",
    "EDITOR",
    "EUID",
    "GROUPS",
    "HOME",
    "HOSTNAME",
    "HOSTTYPE",
    "IGNOREEOF",
    "MACHTYPE",
    "OLDPWD",
    "OSTYPE",
    "PATH",
    "PIPESTATUS",
    "PPID",
    "PWD",
    "REPLY",
    "SHELLOPTS",
    "SHLVL",
    "TMOUT",
    "UID"
];

var pyprompt_vars = [
    "PP_UPTIME",
    "PP_GIT_CWD",
    "PP_CWD",
    "PP_PWD"
];

var autocomplete = {
    variable: [],
    text: [],
    command: [],
    raw: []
};
autocomplete.variable = bash_vars.concat(pyprompt_vars);

var custom_element_items = [
    {
        name: "text",
        text: "Custom text:",
        tooltip: "Create custom text element. Cannot contain \$(){}.",
        regex: new RegExp("^[^\\\(\){}\$]*$")
    },
    {
        name: "variable",
        text: "Variable value:",
        tooltip: "Create custom variable element. Must start with a-z, A-Z or _.  Valid character are a-z, A-Z, 0-9, and _",
        regex: new RegExp("^([a-zA-Z_][a-zA-Z0-9_]*)?$"),
        prependText: "${",
        appendText: "}"
    },
    {
        name: "command",
        text: "Command output:",
        tooltip: "Create custom command element. Use with caution, there is no validation and running time of the command affects prompt speed.",
        prependText: "$(",
        appendText: ")"
    },
    {
        name: "raw",
        text: "Raw text:",
        tooltip: "Create custom text element. Use with caution, there is no validation and you must escape everything yourself.  May not display properly"
    }
];
var ascii = [

];
var elements = {
    custom_variable: {
        beforeOutput: "\\"
    },
    custom_command: {
        beforeOutput: "\\"
    },
    currentdirectory: {
        output: "\\W",
        preview: "dir"
    },
    date: {
        output: "\\d",
        preview: generate_date()
    },
    fqdn: {
        output: "\\H",
        preview: "host.domain.com"
    },
    fulltime: {
        output: "\\A",
        preview: generate_time(false, false)
    },
    fulltimeseconds: {
        output: "\\t",
        preview: generate_time(false, true)
    },
    halftime: {
        output: "\\@",
        preview: generate_time(true, false)
    },
    halftimeseconds: {
        output: "\\T",
        preview: generate_time(true, true)
    },
    hostname: {
        output: "\\h",
        preview: "host"
    },
    pathtocurrentdirectory: {
        output: "\\w",
        preview: "~/dir"
    },
    promptchar: {
        output: "\\\\$",
        preview: "$"
    },
    returncode: {
        output: "\\?",
        preview: "1"
    },
    shell: {
        output: "\\s",
        preview: "bash"
    },
    shellrelease: {
        output: "\\V",
        preview: "4.2.42"
    },
    shellversion: {
        output: "\\v",
        preview: "4.2"
    },
    username: {
        output: "\\u",
        preview: "user"
    },
    pyprompt_gitcwd: {
        output: "\\\${PP_gitcwd}",
        preview: "  Master 1 12"
    },
    pyprompt_uptime: {
        output: "\\\${PP_uptime}",
        preview: " 1.9 Weeks"
    },
    pyprompt_path: {
        output: "\\\${PP_path}",
        preview: " .steamsteam...commonPortal 2bin"
    },
    pyprompt_user: {
        output: "\\\${PP_user}",
        preview: " user  Machine"
    },
    gitstatus: {
        output: "\\\$(parse_git_branch)",
        preview: "[master]",
        pre: ["# This code needs to be replaced",
            "# get current branch in git repo",
            "function parse_git_branch() {",
            "\tBRANCH=`git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \\(.*\\)/\\1/'`",
            "\tif [ ! \"${BRANCH}\" == \"\" ]",
            "\tthen",
            "\t\tSTAT=`parse_git_dirty`",
            "\t\techo \"[${BRANCH}${STAT}]\"",
            "\telse",
            "\t\techo \"\"",
            "\tfi",
            "}",
            "",
            "# get current status of git repo",
            "function parse_git_dirty {",
            "\tstatus=`git status 2>&1 | tee`",
            "\tdirty=`echo -n \"${status}\" 2> /dev/null | grep \"modified:\" &> /dev/null; echo \"$?\"`",
            "\tuntracked=`echo -n \"${status}\" 2> /dev/null | grep \"Untracked files\" &> /dev/null; echo \"$?\"`",
            "\tahead=`echo -n \"${status}\" 2> /dev/null | grep \"Your branch is ahead of\" &> /dev/null; echo \"$?\"`",
            "\tnewfile=`echo -n \"${status}\" 2> /dev/null | grep \"new file:\" &> /dev/null; echo \"$?\"`",
            "\trenamed=`echo -n \"${status}\" 2> /dev/null | grep \"renamed:\" &> /dev/null; echo \"$?\"`",
            "\tdeleted=`echo -n \"${status}\" 2> /dev/null | grep \"deleted:\" &> /dev/null; echo \"$?\"`",
            "\tbits=''",
            "\tif [ \"${renamed}\" == \"0\" ]; then",
            "\t\tbits=\">${bits}\"",
            "\tfi",
            "\tif [ \"${ahead}\" == \"0\" ]; then",
            "\t\tbits=\"*${bits}\"",
            "\tfi",
            "\tif [ \"${newfile}\" == \"0\" ]; then",
            "\t\tbits=\"+${bits}\"",
            "\tfi",
            "\tif [ \"${untracked}\" == \"0\" ]; then",
            "\t\tbits=\"?${bits}\"",
            "\tfi",
            "\tif [ \"${deleted}\" == \"0\" ]; then",
            "\t\tbits=\"x${bits}\"",
            "\tfi",
            "\tif [ \"${dirty}\" == \"0\" ]; then",
            "\t\tbits=\"!${bits}\"",
            "\tfi",
            "\tif [ ! \"${bits}\" == \"\" ]; then",
            "\t\techo \" ${bits}\"",
            "\telse",
            "\t\techo \"\"",
            "\tfi",
            "}"].join("\n")
    },
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getValueFromIndex(index) {
    id = Math.trunc(index) % 6;
    if (0 == id)
        return 0;
    return 55 + 40 * id;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();
}

function colorIdToHex(color_id) {
    if (color_id < 16) {
        switch (color_id) {
            case 0:
                return "#000000";
            case 1:
                return "#AA0000";
            case 2:
                return "#00AA00";
            case 3:
                return "#AA5500";
            case 4:
                return "#0000AA";
            case 5:
                return "#AA00AA";
            case 6:
                return "#00AAAA";
            case 7:
                return "#AAAAAA";
            case 8:
                return "#555555";
            case 9:
                return "#FF5555";
            case 10:
                return "#55FF55";
            case 11:
                return "#FFFF55";
            case 12:
                return "#5555FF";
            case 13:
                return "#FF55FF";
            case 14:
                return "#55FFFF";
            case 15:
                return "#FFFFFF";
            default:
                break;
        }
    }
    else if (color_id < 232) {
        color_id -= 16;
        return rgbToHex(getValueFromIndex(color_id / 36),
            getValueFromIndex(color_id / 6),
            getValueFromIndex(color_id));
    }
    else {
        var value = (10 * (color_id - 232)) + 8;
        return rgbToHex(value, value, value);
    }
}

var base_colors = [];
var term_color_codes = {};
var palette = [];

function populatePalettes() {
    var colorArray = [];
    for (i = 0; i < 256; i++) {
        color = colorIdToHex(i).toUpperCase();
        colorArray.push(color);
    }
    palette.push(colorArray.slice(0, 16));
    for (i = 0; i < 6; i++) {
        palette.push(colorArray.slice(i * 36 + 16, i * 36 + 36 + 16));
    }
    palette.push(colorArray.slice(232, 256));
    base_colors = colorArray.slice(0, 16);
    for (i = 0; i < 256; i++) {
        color = colorIdToHex(i).toUpperCase();
        if ((term_color_codes.hasOwnProperty(color)))
            continue;
        term_color_codes[color] = i;
    }
}

/*Begin interactive calls*/

function add_prompt_element(source_object) {
    //Make sure we actually have something to add
    if (!source_object) {
        return;
    }

    var source_id = source_object.attr("id");

    //append a copy to the list
    source_object
        .clone()
        .removeAttr("id")
        .uniqueId()
        .attr("element-identifier", source_id.split("-")[1])
        .addClass("ui-selected")
        .hover(function () {
            //FIXME: there may be a better way to find if there is a select operation currently going on
            //this is currently searching the DOM to see if the div for the "lasso" exists.
            if (!$("div.ui-selectable-helper").length) {
                $(this).addClass("prompt-option-hover");
            }
        },
            function () {
                $(this).removeClass("prompt-option-hover");
            })
        .prepend('<div class="ui-state-default ui-icon prompt-option handle"></div>')
        .appendTo("#elements-list")
        .siblings().removeClass('ui-selected');

    match_spectrums();
    refresh_page();
}

//toggle the preview background color, as well as
//the default text color to match.
function toggle_bg() {

    preview_types.forEach(function (id) {
        var preview = $("#preview-" + id);
        var bg_switch = $("#switch-toggle-bg-" + id);

        if (preview.hasClass("preview-light")) {
            preview
                .removeClass("preview-light")
                .addClass("preview-dark");

            bg_switch
                .removeClass("switch-toggle-bg-light")
                .addClass("switch-toggle-bg-dark");
        } else {
            preview
                .removeClass("preview-dark")
                .addClass("preview-light");

            bg_switch
                .removeClass("switch-toggle-bg-dark")
                .addClass("switch-toggle-bg-light");
        }
    });
    match_spectrums();
}

/*End interactive calls*/

/*Begin helper functions.*/

//generate the current time in ddd MMM dd format (ex. Thu Feb 14)
function generate_date() {
    var date = Date().split(" ").slice(0, 3);
    var return_date = date[0];
    for (var i = 1; i < date.length; i += 1) {
        return_date += " " + date[i];
    }
    return return_date;
}

//generate the time in multiple formats.
function generate_time(half_hours, show_seconds) {
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

function generateColorData(color) {
    var result = {
        base: null,
        extended: null,
        true_color: null
    };
    if (color) {
        var baseColor = nearestColor.from(base_colors);
        var color_base = baseColor(color).toUpperCase();
        result.base = term_color_codes[color_base];
        if (color_base == color)
            return result;
        var extendColor = nearestColor.from(Object.keys(term_color_codes));
        var color_extended = extendColor(color).toUpperCase();
        result.extended = term_color_codes[color_extended];
        if (color_extended == color)
            return result;
        result.true_color = hexToRgb(color);
    }
    return result;
}

//generate the preview list
function refresh_preview(id) {
    var preview_list = $("#preview-list-" + id);
    preview_list.empty();
    $("#elements-list").children("li").each(function (index) {
        preview_list.append(generate_element($(this)));
    });

    //Generate a span to append to the preview list
    function generate_element(option_element) {
        var option_name = option_element.attr("element-identifier");
        var color_fg = option_element.attr("option-fg");
        var color_bg = option_element.attr("option-bg");
        if (id !== "tc") {
            var fg_colorData = generateColorData(color_fg);
            var bg_colorData = generateColorData(color_bg);
            color_fg = (fg_colorData.base != null ? colorIdToHex(fg_colorData.base) : null);
            color_bg = (bg_colorData.base != null ? colorIdToHex(bg_colorData.base) : null);
            if (id === "extended") {
                color_fg = (fg_colorData.extended != null ? colorIdToHex(fg_colorData.extended) : color_fg);
                color_bg = (bg_colorData.extended != null ? colorIdToHex(bg_colorData.extended) : color_bg);
            }
        }

        var preview_output = elements[option_name] && elements[option_name].preview ?
            elements[option_name].preview :
            option_element.text();

        return '<li class="element-preview" element_id="' +
            option_name + '">' + '<span class="preview-text" style="' +
            (color_fg ? 'color:' + color_fg + ';' : '') +
            (color_bg ? 'background-color:' + color_bg + ';' : '') +
            '">' +
            preview_output + '</span></li>';

    }
}


function buildColorString(baseID, boldBaseID, color_data) {
    var result = "";
    if (color_data.base < 8)
        result += baseID.toString() + color_data.base.toString();
    else
        result += boldBaseID.toString() + (color_data.base - 8).toString();
    if (color_data.extended)
        result += ";" + baseID + "8;5;" + color_data.extended.toString();
    if (color_data.true_color)
        result += ";" + baseID + "8;2" + ";" + color_data.true_color.r.toString() + ";" + color_data.true_color.g.toString() + ";" + color_data.true_color.b.toString();
    return result;
}


//generate the code for bashrc
function refresh_code() {
    var functions_added = [];

    var code_output = $("#code-output-text");
    code_output.text('export PS1="');

    $("#elements-list").children("li").each(function (index) {
        append_code($(this), $(this).prev(), $(this).next());
    });

    code_output.text(code_output.text() + '\\[\\033[m\\] "');

    function append_code(option_element, previous, next) {
        var element_identifier = option_element.attr("element-identifier");
        var fg_code = option_element.attr("option-fg");
        var bg_code = option_element.attr("option-bg");
        var element = elements[element_identifier];

        //insert any helper functions needed
        if (element && element.pre && functions_added.indexOf(element_identifier) == -1) {
            functions_added.push(element_identifier);

            code_output.text(element.pre + "\n" + code_output.text());
        }

        var color_before = '',
            color_after = '';
        if (previous) {
            var prev_fg = previous.attr("option-fg");
            var prev_bg = previous.attr("option-bg");
            if (prev_fg === fg_code) {
                fg_code = null;
            }
            else if (!fg_code) {
                color_before = "\\[\\033[39m\\]";
            }
            if (prev_bg === bg_code) {
                bg_code = null;
            }
            else if (!bg_code) {
                if (color_before !== "")
                    color_before = "\\[\\033[m\\]";
                else
                    color_before = "\\[\\033[49m\\]";
            }
        }

        //output the escape sequence, or the same text as in the preview
        //if that does not exist. if custom text, used what was entered.
        var output_text;
        if (element) {
            if (element.output) {
                output_text = element.output;
            } else if (element.preview) {
                output_text = element.preview;
            } else if (element.beforeOutput) {
                output_text = element.beforeOutput + option_element.text();
            } else {
                console.log("ERROR: empty element (" + element_identifier + ")");
                return;
            }
        } else {
            output_text = option_element.text();
        }



        if (fg_code || bg_code) {
            color_before += "\\[\\033[";
            if (fg_code) {
                color_before += buildColorString("3", "9", generateColorData(fg_code));
                if (bg_code)
                    color_before += ";";
            }
            if (bg_code) {
                color_before += buildColorString("4", "10", generateColorData(bg_code));
            }
            color_before += "m\\]";
        }

        if (output_text) {
            code_output
                .text(code_output.text() + color_before + output_text + color_after);
        }
    }
}

//update the spectrum colors to match the selected element
function match_spectrums() {
    var source_element = $("#elements-list").children("li.ui-selected");
    var fg_value = source_element ? source_element.attr("option-fg") : null;
    var bg_value = source_element ? source_element.attr("option-bg") : null;

    if (source_element && source_element.length > 1) {
        var previous_fg = $(source_element[0]).attr('option-fg');
        var previous_bg = $(source_element[0]).attr('option-bg');
        var current_fg, current_bg;
        var check_fg = true,
            check_bg = true;
        for (var i = 1; i < source_element.length; i += 1) {
            current_fg = $(source_element[i]).attr("option-fg") || null;
            current_bg = $(source_element[i]).attr("option-bg") || null;

            if (check_fg && current_fg != previous_fg) {
                fg_value = null;
                check_fg = false;
            }
            if (check_bg && current_bg != previous_bg) {
                bg_value = null;
                check_bg = false;
            }

            if (!check_fg && !check_bg) {
                break;
            }

            preview_fg = current_fg;
            preview_bg = current_bg;
        }
    }

    var preview_bg = $("#preview-tc").hasClass("preview-light") ? "light" : "dark";

    if (fg_value) {
        $("#input-spectrum-fg").spectrum("set", fg_value);
    } else {
        if (preview_bg === "dark") {
            $("#input-spectrum-fg").spectrum("set", "white");
        } else {
            $("#input-spectrum-fg").spectrum("set", "black");
        }
    }

    if (bg_value) {
        $("#input-spectrum-bg").spectrum("set", bg_value);
    } else {
        if (preview_bg === "dark") {
            $("#input-spectrum-bg").spectrum("set", "black");
        } else {
            $("#input-spectrum-bg").spectrum("set", "white");
        }
    }
}

/*End helper functions*/

/*Begin page setup functions.*/

//attach event listeners to the buttons.
function activate_buttons() {
    $("#button-element-reset-selected").on("click", function () {
        var succ_fist = true,
            succ_second = true;
        try {
            $("#elements-list").children("li.ui-selected").removeAttr("option-fg");
        } catch (e) {
            succ_fist = false;
        }
        try {
            $("#elements-list").children("li.ui-selected").removeAttr("option-bg");
        } catch (e) {
            succ_second = false;
        }

        if (succ_fist || succ_second) {
            match_spectrums();
            refresh_page();
        }
    });

    $("#button-element-delete-selected").on("click", function () {
        var succ = true;
        try {
            $("#elements-list").children("li.ui-selected").remove();
            $("#elements-list").children(":last").addClass("ui-selected");
        } catch (e) {
            succ = false;
        }

        if (succ) {
            match_spectrums();
            refresh_page();
        }
    });

    $("#button-element-reset-all").on("click", function () {
        var succ_fist = true,
            succ_second = true;
        try {
            $("#elements-list").children("li").removeAttr("option-fg");
        } catch (e) {
            succ_fist = false;
        }
        try {
            $("#elements-list").children("li").removeAttr("option-bg");
        } catch (e) {
            succ_second = false;
        }

        if (succ_fist || succ_second) {
            match_spectrums();
            refresh_page();
        }
    });
    $("#button-element-delete-all").on("click", function () {
        var succ = true;
        try {
            $("#elements-list").children("li").remove();
        } catch (e) {
            succ = false;
        }

        if (succ) {
            match_spectrums();
            refresh_page();
        }
    });
}

//create a spectrum color picker on the specified element.
function make_spectrum(element_id) {

    var element_suffix = element_id.split("-");
    element_suffix = element_suffix[element_suffix.length - 1];

    var color;
    //is the preview background white or black?
    if ($("#preview-tc").hasClass("preview-light")) {
        color = element_suffix === "fg" ? "black" : "white";
    } else {
        color = element_suffix === "fg" ? "white" : "black";
    }


    $(element_id).spectrum({
        showPaletteOnly: false,
        showPalette: true,
        showSelectionPalette: false,
        showInput: true,
        color: color,
        showButtons: false,
        togglePaletteOnly: false,
        showAlpha: false,
        type: "component",
        allowEmpty: false,
        preferredFormat: "rgb",
        replacerClassName: "replacer_valign",
        palette: palette,
        move: function (color) {
            try {
                var rgb = color.toRgb();
                $("#elements-list")
                    .children("li.ui-selected")
                    .attr(element_suffix == "fg" ? "option-fg" : "option-bg", rgbToHex(rgb.r, rgb.g, rgb.b));
            } catch (e) { }
            refresh_page();
        }
    });
}

//attach event listeners to available options.
function activate_element_options() {
    //add the predefined elements on click.
    $("li.prompt-option-origin").click(function () {
        add_prompt_element($(this));
    });

    custom_element_items.forEach(function (item) {

        if (item.regex) {
            $("input#custom-" + item.name + "-input")
                .on('keypress', function (event) {
                    var regex = item.regex;
                    var key_typed = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                    if (!regex.test($("input#custom-" + item.name + "-input").val() + key_typed)) {
                        event.preventDefault();
                        return false;
                    }
                });
            $("input#custom-" + item.name + "-input").autocomplete({
                source: autocomplete[item.name]
            });
        }
        $("button#custom-" + item.name + "-button")
            .tooltip()
            .click(function () {
                var input_box = $("#custom-" + item.name + "-input");

                //don't do anything if it's blank
                if (!input_box.val()) {
                    return;
                }
                var custom_text = (item.prependText ? item.prependText : "") + input_box.val() + (item.appendText ? item.appendText : "");

                input_box.val("");

                $('<li class="ui-state-default prompt-option ui-selected" element-identifier=custom_' + item.name + '>' +
                    custom_text +
                    '</li>')
                    .uniqueId()
                    .on("click.single-select", function () {
                        if (!$(this).hasClass("ui-selected")) {
                            $(this).addClass('ui-selected').siblings().removeClass('ui-selected');
                        }

                        match_spectrums();
                    })
                    .appendTo("#elements-list")
                    .hover(function () {
                        //FIXME: there may be a better way to find if there is a select operation currently going on
                        //this is currently searching the DOM to see if the div for the "lasso" exists.
                        if (!$("div.ui-selectable-helper").length) {
                            $(this).addClass("prompt-option-hover");
                        }
                    },
                        function () {
                            $(this).removeClass("prompt-option-hover");
                        })
                    .prepend('<div class="ui-state-default ui-icon prompt-option handle"></div>')
                    .siblings().removeClass('ui-selected');
                refresh_page();
            });
    });
}

/*End page setup functions.*/

//wrapper to regenerate the preview and output.
function refresh_page() {

    preview_types.forEach(function (item) { refresh_preview(item); });
    refresh_code();
    localStorage.setItem("prompt_data", $("#elements-list").html());
    //#input-spectrum-bg

    $("#input-spectrum-fg-link").prop("href", "https://rgb.to/" + $("#input-spectrum-fg").spectrum("get").toHex());
    $("#input-spectrum-bg-link").prop("href", "https://rgb.to/" + $("#input-spectrum-bg").spectrum("get").toHex());
}

$(document).ready(function () {
    $.ajaxSetup({
        'beforeSend': function (xhr) {
            if (xhr.overrideMimeType)
                xhr.overrideMimeType("text/plain");
        }
    });
    $.getJSON("data/nerdfont.json", function (data) {
        var items = [];
        custom_element_items.forEach(function (item) {
            /*
            '<li class="ui-state-default option-custom-inp" id="option-custom-txt">' + value.text. + '<br />' +
            '   <input type="text" id="custom-' + key + '-input" />' +
            '   <button id="custom-' + key + '-button" title="'+value.tooltip+'">+</button>' +
            '</li>';
            */
            var element = '<li class="ui-state-default option-custom-inp prompt-option ui-nf" id="option-custom-' + item.name + '">' + item.text + '<br />' +
                '<input type="text" class="ui-nf" id="custom-' + item.name + '-input" />&nbsp;' +
                '<button class="ui-nf" id="custom-' + item.name + '-button" title="' + (item.tooltip ? item.tooltip : "") + '">+</button>' +
                '</li>';
            items.push(element);
        });
        items.push("<br />");
        $.each(data, function (key, val) {
            //<li class="ui-state-default prompt-option-origin prompt-option" id="option-hyphen">-</li>
            items.push("<li class='ui-state-default prompt-option-origin prompt-option ui-nf' id='option-" + val + "' title='" + key + "'>" + val + "</li>");
        });
        $("#elements-extra").append(items);
        //make the list of added elements sortable
        $("#elements-list")
            .sortable({
                handle: ".handle",
                tolerance: "pointer",
                update: function () {
                    refresh_page();
                }

            })
            .selectable({
                stop: function () {
                    match_spectrums();

                    $("#elements-list")
                        .children("li.prompt-option")
                        .removeClass("prompt-option-sticky-hover");
                },
                start: function () {
                    $("#elements-list")
                        .children("li.prompt-option")
                        .each(function () {
                            if ($(this).hasClass("prompt-option-hover")) {
                                $(this).addClass("prompt-option-sticky-hover");
                            }
                        });
                }
            });
        preview_types.forEach(function (item) {
            $("#switch-toggle-bg-" + item).on("click", toggle_bg);
        });

        //separate the available sections into tabs.
        $("#elements-options").tabs();

        //add tooltips to the available options
        $("#elements-options").children("div.elements-tab").children("ul").children("li").tooltip();

        //add tooltips to the delete and reset buttons.
        $("#elements-control-buttons").children("button").tooltip();
        populatePalettes();

        make_spectrum("#input-spectrum-bg");
        make_spectrum("#input-spectrum-fg");
        activate_element_options();
        activate_buttons();
        $("#elements-list").html(localStorage.getItem("prompt_data"));
        match_spectrums();
        refresh_page();

    });
});
