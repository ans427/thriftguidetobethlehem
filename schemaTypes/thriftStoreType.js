const categoryOptions = [
  { title: "Vintage", value: "vintage" },
  { title: "Secondhand", value: "secondhand" },
  { title: "Thrift", value: "thrift" },
  { title: "Consignment", value: "consignment" },
  { title: "Affordable", value: "affordable" },
  { title: "Student-friendly", value: "student-friendly" },
  { title: "Non-profit", value: "non-profit" },
  { title: "Curated", value: "curated" },
  { title: "Furniture", value: "furniture" },
  { title: "Family clothing", value: "family clothing" },
  { title: "Workwear", value: "workwear" },
  { title: "Accessories", value: "accessories" }
];

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
    {
      name: "priceRange",
      title: "Price Range",
      type: "string",
      options: {
        list: [
          { title: "$ (Budget)", value: "$" },
          { title: "$$ (Moderate)", value: "$$" },
          { title: "$$$ (Higher)", value: "$$$" }
        ]
      }
    },
    { name: "donationDropoff", title: "Donation Drop-off Available", type: "boolean" },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: categoryOptions,
            layout: "dropdown"
          }
        }
      ],
      options: { layout: "tags" },
      validation: (Rule) => Rule.unique()
    },
    { name: "website", title: "Website", type: "url" },
    { name: "instagram", title: "Instagram", type: "url" },
    { name: "description", title: "Description", type: "text", rows: 4 },
    {
      name: "photos",
      title: "Store Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt text", type: "string" }]
        }
      ]
    },
    { name: "featured", title: "Featured on Homepage", type: "boolean", initialValue: true }
  ]
};
