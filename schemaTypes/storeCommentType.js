export const storeCommentType = {
  name: "storeComment",
  title: "Store Comment",
  type: "document",
  fields: [
    {
      name: "store",
      title: "Thrift store",
      type: "reference",
      to: [{ type: "thriftStore" }],
      validation: (Rule) => Rule.required()
    },
    {
      name: "authorName",
      title: "Name (or nickname)",
      type: "string",
      validation: (Rule) => Rule.max(80)
    },
    {
      name: "body",
      title: "Comment",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(2).max(2000)
    },
    {
      name: "photo",
      title: "Found Item Photo",
      type: "image",
      options: { hotspot: true }
    }
  ],
  preview: {
    select: { title: "authorName", subtitle: "body" }
  }
};
