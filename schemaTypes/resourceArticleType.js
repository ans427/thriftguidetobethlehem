export const resourceArticleType = {
  name: "resourceArticle",
  title: "Resource Article",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 } },
    {
      name: "type",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "Fast Fashion Fact", value: "fact" },
          { title: "Practical Guide", value: "guide" },
          { title: "Local Resource", value: "local-resource" }
        ]
      }
    },
    { name: "summary", title: "Summary", type: "text", rows: 3 },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }]
    },
    { name: "sourceUrl", title: "Source URL", type: "url" },
    { name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: true }
  ]
};
