export const Documentation = () => {
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Documentation</h2>
      <div className="space-y-4 text-sm">
        <p>
          Use this interface to manage dynamic page content. The content should be valid JSON with the following structure:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>title</strong>: String - The main title of the page</li>
          <li><strong>description</strong>: String - A brief description</li>
          <li><strong>color_scheme</strong>: Object - Contains primary, secondary, and accent colors</li>
          <li><strong>images</strong>: Array of image objects with id, url, and alt text</li>
          <li><strong>menu_items</strong>: Array of menu items with id, name, description, price, and image</li>
          <li><strong>sections</strong>: Array of content sections with id, heading, and body</li>
          <li><strong>faq</strong>: Array of FAQ entries with question and answer fields</li>
        </ul>
      </div>
    </div>
  );
};