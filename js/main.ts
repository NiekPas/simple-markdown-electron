/// <reference path="./components/references.ts"/>

console.log($);
$(document).ready(() => {
    $("#editor").focus();
    var e = new Editor(document.getElementById("editor"));
    e.setViewmode(Viewmode.Markdown);
    e.setTheme(ThemeOption.Dark);
});