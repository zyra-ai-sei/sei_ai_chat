import { highlightCryptoPatterns } from "./cryptoHighlighter";

/**
 * Custom components configuration for ReactMarkdown
 * Handles rendering of various markdown elements with custom styling
 */
export const markdownComponents = {
  h1: ({ node, ...props }: any) => (
    <h1 className="mb-4 text-3xl font-bold text-white" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="mb-3 text-2xl font-bold text-white" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="mb-2 text-xl font-bold text-white" {...props} />
  ),
  p: ({ node, children, ...props }: any) => {
    // Apply highlighting to paragraph content
    const content = String(children);
    const highlighted = highlightCryptoPatterns(content);
    
    return (
      <p 
        className="mb-4 leading-relaxed text-gray-200" 
        dangerouslySetInnerHTML={{ __html: highlighted }}
        {...props}
      />
    );
  },
  a: ({ node, ...props }: any) => (
    <a
      className="text-blue-400 underline hover:text-blue-300"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const content = String(children);
    
    // Apply highlighting to inline code
    if (inline) {
      const highlighted = highlightCryptoPatterns(content);
      return (
        <code
          className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded text-sm"
          dangerouslySetInnerHTML={{ __html: highlighted }}
          {...props}
        />
      );
    }
    
    // Code blocks - apply highlighting
    const highlighted = highlightCryptoPatterns(content);
    return (
      <code
        className={`${className} block bg-gray-900 rounded-lg p-4 overflow-x-auto`}
        dangerouslySetInnerHTML={{ __html: highlighted }}
        {...props}
      />
    );
  },
  ul: ({ node, ...props }: any) => (
    <ul className="mb-4 space-y-2 list-disc list-inside" {...props} />
  ),
  ol: ({ node, ...props }: any) => (
    <ol className="mb-4 space-y-2 list-decimal list-inside" {...props} />
  ),
  li: ({ node, children, ...props }: any) => {
    // Apply highlighting to list items
    const content = String(children);
    const highlighted = highlightCryptoPatterns(content);
    
    return (
      <li 
        className="text-gray-200"
        dangerouslySetInnerHTML={{ __html: highlighted }}
        {...props}
      />
    );
  },
  blockquote: ({ node, ...props }: any) => (
    <blockquote
      className="pl-4 my-4 italic text-gray-300 border-l-4 border-blue-500"
      {...props}
    />
  ),
  table: ({ node, ...props }: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full border border-gray-700" {...props} />
    </div>
  ),
  th: ({ node, ...props }: any) => (
    <th className="px-4 py-2 bg-gray-800 border border-gray-700" {...props} />
  ),
  td: ({ node, children, ...props }: any) => {
    // Apply highlighting to table cells
    const content = String(children);
    const highlighted = highlightCryptoPatterns(content);
    
    return (
      <td 
        className="px-4 py-2 border border-gray-700"
        dangerouslySetInnerHTML={{ __html: highlighted }}
        {...props}
      />
    );
  },
};
