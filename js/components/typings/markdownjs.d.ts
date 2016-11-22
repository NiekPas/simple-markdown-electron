interface Markdown {
    toHTML(markdown: string, dialect?: string): string;
}

declare var markdown: Markdown;