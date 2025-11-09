import { extractMarkdown } from "./extractmarkdown";


test('adds 1 + 2 to equal 3', async () => {
    expect(await extractMarkdown('<indiepitcher-markdown>test <a href="https://example.com">click</a></indiepitcher-markdown>'))
        .toBe('test <a href="https://example.com">click</a>');
});