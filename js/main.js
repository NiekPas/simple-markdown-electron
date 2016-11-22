var ThemeOption;
(function (ThemeOption) {
    ThemeOption[ThemeOption["Dark"] = 0] = "Dark";
    ThemeOption[ThemeOption["Light"] = 1] = "Light";
})(ThemeOption || (ThemeOption = {}));
var Viewmode;
(function (Viewmode) {
    Viewmode[Viewmode["Markdown"] = 0] = "Markdown";
    Viewmode[Viewmode["HTML"] = 1] = "HTML";
})(Viewmode || (Viewmode = {}));
/// <reference path="references.ts"/>
var Editor = (function () {
    /**
     * Represents the editor
     * @constructor
     * @param {HTMLElement} editorElement - the HTML element which serves as the main text field
    */
    function Editor(el) {
        this.fullscreen = false;
        this.editorElement = el;
        this.markdownContent = "# SimpleMarkdown\n\n(Tip: press ctrl+space to view this introduction in formatted version).\n\nSimpleMarkdown is a minimalist markdown editor, designed to allow you to work without distractions. Turn on the dark mode, switch to fullscreen mode, preview your work, and when you're done, download an .md or .html file, or copy your work to the clipboard.\n\nFor a complete Markdown guide, go [here](https://daringfireball.net/projects/markdown/basics).";
        this.initialize();
    }
    Editor.prototype.initialize = function () {
        var _this = this;
        var self = this;
        $("body").on("keyup", function (e) {
            if (self.viewmode === Viewmode.Markdown) {
                self.markdownContent = $(self.editorElement)[0].innerText;
            }
            if (e.ctrlKey && e.keyCode == 32) {
                var nextViewmode = self.viewmode == Viewmode.Markdown
                    ? Viewmode.HTML
                    : Viewmode.Markdown;
                self.setViewmode(nextViewmode);
            }
        });
        $("#theme").on("click", function () {
            var nextTheme = self.theme == ThemeOption.Dark
                ? ThemeOption.Light
                : ThemeOption.Dark;
            self.setTheme(nextTheme);
        });
        $("#viewmode").on("click", function () {
            var nextViewmode = self.viewmode == Viewmode.Markdown
                ? Viewmode.HTML
                : Viewmode.Markdown;
            self.setViewmode(nextViewmode);
        });
        $("#html").on("click", function () {
            if (_this.copyToClipboard()) {
                // const tooltip = "<div class=\"tooltip-wrapper\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip\">Copied to clipboard!</div></div>"
                // $("#html").append(tooltip);
                // $(".tooltip-wrapper").delay(2000).fadeOut(1000);
                var button_1 = $("#html i.fa-code");
                // Change the fa-code to a fa-check
                button_1.removeClass("fa-code").addClass("fa-check");
                // wait 1000 milliseconds, then:
                setTimeout(function () {
                    // fadeout in 250 milliseconds, without affecting layout (thus 'animate', not fadeOut()).
                    button_1.animate({
                        opacity: 0
                    }, 150, "swing", function () {
                        // When fadeout is done, change the fa-check back to a fa-code and fade back in
                        button_1.removeClass("fa-check").addClass("fa-code");
                        button_1.animate({
                            opacity: 1
                        }, 150);
                    });
                }, 1000);
            }
            else {
                var html = markdown.toHTML(self.markdownContent);
                var w = window.open();
                $(w.document.body).text(html);
            }
        });
        $("#fullscreen").on('click', function () {
            var body = document.getElementsByTagName('body')[0];
            if (!_this.fullscreen) {
                if (body.requestFullscreen) {
                    body.requestFullscreen();
                    _this.fullscreen = true;
                }
                else if (body.mozRequestFullScreen) {
                    body.mozRequestFullScreen();
                    _this.fullscreen = true;
                }
                else if (body.webkitRequestFullscreen) {
                    body.webkitRequestFullscreen();
                    _this.fullscreen = true;
                }
                else if (body.msRequestFullscreen) {
                    body.msRequestFullscreen();
                    _this.fullscreen = true;
                }
            }
            else {
                if (body.exitFullscreen) {
                    body.exitFullscreen();
                    _this.fullscreen = false;
                }
                else if (body.mozCancelFullScreen) {
                    body.mozCancelFullScreen();
                    _this.fullscreen = false;
                }
                else if (body.webkitExitFullscreen) {
                    body.webkitExitFullscreen();
                    _this.fullscreen = false;
                }
            }
        });
        $("#options-visibility").on("click", function () {
            $("#editor-buttons").toggleClass("collapsed");
        });
    };
    Editor.prototype.copyToClipboard = function () {
        // This is messy, but:
        // 
        var ele = $("#editor");
        var text = ele.html();
        text = text.replace(/\<br\>/g, '\n');
        $("body").append("<textarea style=\"outline:0 !important;\" id=\"hidden-html\">" + "</textarea>");
        $("#hidden-html").val(text);
        $("#hidden-html").select();
        try {
            var successful = document.execCommand('copy');
            $("#hidden-html").remove();
            if (successful)
                return true;
            return false;
        }
        catch (err) {
            $("#hidden-html").remove();
            return false;
        }
    };
    /**
     * Applies theme to editor.
     * @param {ThemeOption} theme - the theme to apply
     */
    Editor.prototype.setTheme = function (t) {
        this.theme = t;
        var themeStr;
        var buttonClass;
        if (t === ThemeOption.Dark) {
            themeStr = "dark";
            buttonClass = "fa fa-sun-o";
        }
        else {
            themeStr = "light";
            buttonClass = "fa fa-moon-o";
        }
        $("body").removeClass("theme-light theme-dark");
        $("body").addClass("theme-" + themeStr);
        $("li#theme").children("i").removeClass().addClass(buttonClass);
    };
    /**
     * Applies viewmode to editor.
     * @param {Viewmode} mode - the viewmode to apply
     */
    Editor.prototype.setViewmode = function (m) {
        this.viewmode = m;
        if (m === Viewmode.HTML) {
            var htmlContent = markdown.toHTML(this.markdownContent);
            $(this.editorElement).html(htmlContent);
            $(this.editorElement).prop("contenteditable", false);
            $("li#viewmode").children("i").removeClass().addClass("fa fa-edit");
        }
        else {
            $(this.editorElement)[0].innerText = this.markdownContent;
            $(this.editorElement).prop("contenteditable", true);
            $(this.editorElement).focus();
            $("li#viewmode").children("i").removeClass().addClass("fa fa-font");
        }
    };
    return Editor;
}());
var FileManager = (function () {
    function FileManager() {
    }
    FileManager.prototype.saveFile = function () {
    };
    FileManager.prototype.exportHtmlFile = function () {
    };
    FileManager.prototype.exportMarkdownFile = function () {
    };
    return FileManager;
}());
/// <reference path="typings/jquery.d.ts"/>
/// <reference path="typings/markdownjs.d.ts" />
/// <reference path="enums.ts"/>
/// <reference path="editor.ts"/>
/// <reference path="FileManager.ts"/> 
/// <reference path="./components/references.ts"/>
console.log($);
$(document).ready(function () {
    $("#editor").focus();
    var e = new Editor(document.getElementById("editor"));
    e.setViewmode(Viewmode.Markdown);
    e.setTheme(ThemeOption.Dark);
});
