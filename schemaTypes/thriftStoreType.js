export const thriftStoreType = {
  name: "thriftStore",
  title: "Thrift Store",
  type: "document",
  fields: [
    { name: "name", title: "Store Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 } },
    { name: "address", title: "Address", type: "string" },
    { name: "neighborhood", title: "Neighborhood", type: "string" },
    { name: "coordinates", title: "Coordinates", type: "geopoint" },
    { name: "hours", title: "Hours", type: "text", rows: 3 },
    { name: "priceRange", title: "Price Range", type: "string" },
    { name: "donationDropoff", title: "Donation Drop-off Available", type: "boolean" },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }]
    },
    { name: "website", title: "Website", type: "url" },
    { name: "instagram", title: "Instagram", type: "url" },
    { name: "description", title: "Description", type: "text", rows: 4 },
    { name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: true }
  ]
};
