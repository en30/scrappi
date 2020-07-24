import Mustache = require("mustache");
Mustache.escape = (text) => text;

export const defaultTemplate = `[{{title}} {{url}}]

Added on {{addedAt}}
#Scrappi!`;

export const render = (
  template: string,
  variables: Record<string, unknown>
): string => Mustache.render(template || defaultTemplate, variables);
