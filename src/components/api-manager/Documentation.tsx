import { colorSchemeExamples } from "@/components/admin/api-status/sampleData";

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
          <li>
            <strong>colorScheme</strong>: Object - Contains color settings
            <pre className="mt-2 p-2 bg-background rounded">
              {JSON.stringify(colorSchemeExamples.default, null, 2)}
            </pre>
            <div className="mt-2">Available color scheme examples:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {Object.entries(colorSchemeExamples).map(([name, scheme]) => (
                <div 
                  key={name}
                  className="p-2 rounded"
                  style={{
                    backgroundColor: scheme.secondary,
                    border: `2px solid ${scheme.primary}`,
                    color: scheme.primary
                  }}
                >
                  <div className="font-semibold capitalize">{name}</div>
                  <div className="text-xs opacity-80">
                    Primary: {scheme.primary}
                  </div>
                </div>
              ))}
            </div>
          </li>
          <li><strong>images</strong>: Array of image objects with id, url, and alt text</li>
          <li><strong>menu_items</strong>: Array of menu items with id, name, description, price, and image</li>
          <li><strong>sections</strong>: Array of content sections with id, heading, and body</li>
          <li><strong>faq</strong>: Array of FAQ entries with question and answer fields</li>
        </ul>
      </div>
    </div>
  );
};