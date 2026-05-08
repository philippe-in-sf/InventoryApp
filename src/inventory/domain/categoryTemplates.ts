import type { CategoryTemplate } from "./types";

export const categoryTemplates: CategoryTemplate[] = [
  {
    id: "book",
    label: "Book",
    fields: [
      { id: "title", label: "Title", type: "text", required: true },
      { id: "author", label: "Author", type: "text", required: false },
      { id: "topic", label: "Topic or theme", type: "text", required: false },
      { id: "isbn", label: "ISBN", type: "text", required: false },
      { id: "publisher", label: "Publisher", type: "text", required: false },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    fields: [
      { id: "maker", label: "Maker", type: "text", required: false },
      { id: "deviceType", label: "Device type", type: "text", required: false },
      { id: "model", label: "Model", type: "text", required: false },
      { id: "serialNumber", label: "Serial number", type: "text", required: false },
      { id: "warrantyNotes", label: "Warranty or purchase notes", type: "text", required: false },
    ],
  },
  {
    id: "general",
    label: "General item",
    fields: [],
  },
];

export function findCategoryTemplate(categoryId: string): CategoryTemplate {
  return categoryTemplates.find((template) => template.id === categoryId) ?? categoryTemplates[2];
}
