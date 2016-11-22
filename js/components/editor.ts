/// <reference path="references.ts"/>

class Editor {
    private markdownContent: string;
    private viewmode: Viewmode;
    private theme: ThemeOption;
    private fullscreen: boolean = false;
    editorElement: HTMLElement;

    /**
     * Represents the editor
     * @constructor
     * @param {HTMLElement} editorElement - the HTML element which serves as the main text field
    */
    constructor(el: HTMLElement) {
        this.editorElement = el;
        this.markdownContent = `# SimpleMarkdown

(Tip: press ctrl+space to view this introduction in formatted version).

SimpleMarkdown is a minimalist markdown editor, designed to allow you to work without distractions. Turn on the dark mode, switch to fullscreen mode, preview your work, and when you're done, download an .md or .html file, or copy your work to the clipboard.

For a complete Markdown guide, go [here](https://daringfireball.net/projects/markdown/basics).`;
        this.initialize();
    }

    private initialize(): void {
        var self = this;
        $("body").on("keyup", e => {
            if (self.viewmode === Viewmode.Markdown) {
                self.markdownContent = $(self.editorElement)[0].innerText;
            }
            if (e.ctrlKey && e.keyCode == 32) {	    // CTRL+spacebar
                var nextViewmode =
                    self.viewmode == Viewmode.Markdown
                        ? Viewmode.HTML
                        : Viewmode.Markdown
                self.setViewmode(nextViewmode);
            }
        });
        $("#theme").on("click", () => {
            var nextTheme =
                self.theme == ThemeOption.Dark
                    ? ThemeOption.Light
                    : ThemeOption.Dark;
            self.setTheme(nextTheme);
        });
        $("#viewmode").on("click", () => {
            var nextViewmode =
                self.viewmode == Viewmode.Markdown
                    ? Viewmode.HTML
                    : Viewmode.Markdown
            self.setViewmode(nextViewmode);
        });
        $("#html").on("click", () => {
            if (this.copyToClipboard()) {
                // const tooltip = "<div class=\"tooltip-wrapper\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip\">Copied to clipboard!</div></div>"
                // $("#html").append(tooltip);
                // $(".tooltip-wrapper").delay(2000).fadeOut(1000);

                const button = $("#html i.fa-code");
                // Change the fa-code to a fa-check
                button.removeClass("fa-code").addClass("fa-check");
                // wait 1000 milliseconds, then:
                setTimeout(() => {
                    // fadeout in 250 milliseconds, without affecting layout (thus 'animate', not fadeOut()).
                    button.animate({
                        opacity: 0
                    }, 150, "swing", () => {
                        // When fadeout is done, change the fa-check back to a fa-code and fade back in
                        button.removeClass("fa-check").addClass("fa-code");
                        button.animate({
                            opacity: 1
                        }, 150);
                    });
                }, 1000);
            }
            else {
                const html = markdown.toHTML(self.markdownContent);
                const w = window.open();
                $(w.document.body).text(html);
            }
        });
        $("#fullscreen").on('click', () => {
            const body = document.getElementsByTagName('body')[0];

            if (!this.fullscreen) {
                if (body.requestFullscreen) {
                    body.requestFullscreen();
                    this.fullscreen = true;
                } else if (body.mozRequestFullScreen) {
                    body.mozRequestFullScreen();
                    this.fullscreen = true;
                } else if (body.webkitRequestFullscreen) {
                    body.webkitRequestFullscreen();
                    this.fullscreen = true;
                } else if (body.msRequestFullscreen) {
                    body.msRequestFullscreen();
                    this.fullscreen = true;
                }
            }
            else {
                if (body.exitFullscreen) {
                    body.exitFullscreen();
                    this.fullscreen = false;
                } else if (body.mozCancelFullScreen) {
                    body.mozCancelFullScreen();
                    this.fullscreen = false;
                } else if (body.webkitExitFullscreen) {
                    body.webkitExitFullscreen();
                    this.fullscreen = false;
                }
            }
        });
        $("#options-visibility").on("click", () => {
            $("#editor-buttons").toggleClass("collapsed");
        });
    }

    private copyToClipboard(): boolean {
        // This is messy, but:
        // 
        let ele = $("#editor");
        let text: string = ele.html();
        text = text.replace(/\<br\>/g, '\n');

        $("body").append("<textarea style=\"outline:0 !important;\" id=\"hidden-html\">" + "</textarea>");
        $("#hidden-html").val(text);
        $("#hidden-html").select();
        try {
            var successful = document.execCommand('copy');
            $("#hidden-html").remove();
            if (successful) return true;
            return false;
        } catch (err) {
            $("#hidden-html").remove();
            return false;
        }
    }

    /**
     * Applies theme to editor.
     * @param {ThemeOption} theme - the theme to apply
     */
    public setTheme(t: ThemeOption) {
        this.theme = t;
        var themeStr: string;
        var buttonClass: string;

        if (t === ThemeOption.Dark) {
            themeStr = "dark";
            buttonClass = "fa fa-sun-o";
        }
        else {
            themeStr = "light";
            buttonClass = "fa fa-moon-o";
        }

        $("body").removeClass("theme-light theme-dark");
        $("body").addClass(`theme-${themeStr}`);

        $("li#theme").children("i").removeClass().addClass(buttonClass);
    }

    /**
     * Applies viewmode to editor.
     * @param {Viewmode} mode - the viewmode to apply
     */
    public setViewmode(m: Viewmode): void {
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
    }
}