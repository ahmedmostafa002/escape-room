// Function to detect content type more accurately
function detectContentType(content: string): 'html' | 'markdown' | 'plain' {
  const trimmedContent = content.trim();
  
  // Check for HTML tags
  const hasHtmlTags = /<[^>]*>/g.test(trimmedContent);
  
  if (hasHtmlTags) {
    // Check if it's well-formed HTML with proper structure
    const hasProperHtmlStructure = /<h[1-6][^>]*>.*?<\/h[1-6]>/g.test(trimmedContent) || 
                                  /<ul[^>]*>.*?<\/ul>/g.test(trimmedContent) ||
                                  /<ol[^>]*>.*?<\/ol>/g.test(trimmedContent) ||
                                  /<p[^>]*>.*?<\/p>/g.test(trimmedContent);
    
    if (hasProperHtmlStructure) {
      return 'html';
    }
  }
  
  // Check for markdown patterns
  const hasMarkdownHeadings = /^#{1,6}\s+/gm.test(trimmedContent);
  const hasMarkdownLists = /^[\s]*[-*+]\s+/gm.test(trimmedContent) || /^[\s]*\d+\.\s+/gm.test(trimmedContent);
  const hasMarkdownLinks = /\[.*?\]\(.*?\)/g.test(trimmedContent);
  const hasMarkdownBold = /\*\*.*?\*\*/g.test(trimmedContent) || /__.*?__/g.test(trimmedContent);
  const hasMarkdownItalic = /\*.*?\*/g.test(trimmedContent) || /_.*?_/g.test(trimmedContent);
  
  if (hasMarkdownHeadings || hasMarkdownLists || hasMarkdownLinks || hasMarkdownBold || hasMarkdownItalic) {
    return 'markdown';
  }
  
  return 'plain';
}

// Function to parse markdown content with blog-style formatting
function parseMarkdown(content: string): string {
  const lines = content.split('\n');
  const processedLines = [];
  let inList = false;
  let inOrderedList = false;
  let listItems: string[] = [];
  let orderedListItems: string[] = [];
  let listItemCounter = 1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    if (!trimmedLine) {
      // Close any open lists
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      if (inOrderedList && orderedListItems.length > 0) {
        processedLines.push(`<ol class="list-none text-gray-700 mb-1 space-y-0">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
      processedLines.push('<br>');
      continue;
    }
    
    // Handle headings
    if (trimmedLine.startsWith('###### ')) {
      closeLists();
      processedLines.push(`<h6 class="text-lg font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${trimmedLine.substring(7)}</h6>`);
    } else if (trimmedLine.startsWith('##### ')) {
      closeLists();
      processedLines.push(`<h5 class="text-xl font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${trimmedLine.substring(6)}</h5>`);
    } else if (trimmedLine.startsWith('#### ')) {
      closeLists();
      processedLines.push(`<h4 class="text-xl font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>${trimmedLine.substring(5)}</h4>`);
    } else if (trimmedLine.startsWith('### ')) {
      closeLists();
      processedLines.push(`<h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-2 flex items-center gap-3"><div class="w-2 h-2 bg-escape-red rounded-full"></div>${trimmedLine.substring(4)}</h3>`);
    } else if (trimmedLine.startsWith('## ')) {
      closeLists();
      processedLines.push(`<h2 class="text-3xl font-bold text-gray-900 mb-3 mt-3 relative group"><span class="bg-gradient-to-r from-gray-900 to-escape-red-800 bg-clip-text text-transparent">${trimmedLine.substring(3)}</span><div class="absolute -bottom-1 left-0 w-12 h-0.5 bg-escape-red rounded-full group-hover:w-16 transition-all duration-300"></div></h2>`);
    } else if (trimmedLine.startsWith('# ')) {
      closeLists();
      processedLines.push(`<h1 class="text-4xl font-bold text-gray-900 mb-4 mt-4 relative"><span class="bg-gradient-to-r from-escape-red to-escape-red-700 bg-clip-text text-transparent">${trimmedLine.substring(2)}</span><div class="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-escape-red to-escape-red-600 rounded-full"></div></h1>`);
    }
    // Handle unordered lists
    else if (trimmedLine.match(/^[\s]*[-*+]\s+/)) {
      if (inOrderedList) {
        processedLines.push(`<ol class="list-none text-gray-700 mb-1 space-y-0">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const listItem = trimmedLine.replace(/^[\s]*[-*+]\s+/, '').trim();
      listItems.push(`<li class="flex items-start gap-3"><div class="w-2 h-2 bg-escape-red rounded-full mt-3 flex-shrink-0"></div><span>${processInlineMarkdown(listItem)}</span></li>`);
    }
    // Handle ordered lists
    else if (trimmedLine.match(/^[\s]*\d+\.\s+/)) {
      if (inList) {
        processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      if (!inOrderedList) {
        inOrderedList = true;
        orderedListItems = [];
        listItemCounter = 1;
      }
      const listItem = trimmedLine.replace(/^[\s]*\d+\.\s+/, '').trim();
      orderedListItems.push(`<li class="flex items-start gap-3"><div class="w-6 h-6 bg-escape-red text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0"></div><span>${processInlineMarkdown(listItem)}</span></li>`);
      listItemCounter++;
    }
    // Handle paragraphs
    else {
      closeLists();
      const processedLine = processInlineMarkdown(trimmedLine);
      
      // Split long paragraphs into shorter, more readable chunks
      if (processedLine.length > 120) {
        const sentences = processedLine.split(/[.!?]+/).filter((s: string) => s.trim()).map((s: string) => s.trim() + '.');
        const shortParagraphs = [];
        let currentParagraph = '';
        
        sentences.forEach((sentence: string) => {
          if (currentParagraph.length + sentence.length > 80 && currentParagraph.length > 0) {
            shortParagraphs.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
            currentParagraph = sentence;
          } else {
            currentParagraph += (currentParagraph ? ' ' : '') + sentence;
          }
        });
        
        if (currentParagraph) {
          shortParagraphs.push(`<p class="text-gray-700 mb-0 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
        }
        
        processedLines.push(shortParagraphs.join(''));
      } else {
        processedLines.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${processedLine}</p>`);
      }
    }
    
    function closeLists() {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
        listItems = [];
        inList = false;
      }
      if (inOrderedList && orderedListItems.length > 0) {
        processedLines.push(`<ol class="list-none text-gray-700 mb-1 space-y-0">${orderedListItems.join('')}</ol>`);
        orderedListItems = [];
        inOrderedList = false;
        listItemCounter = 1;
      }
    }
  }
  
  // Close any remaining lists
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
  }
  if (inOrderedList && orderedListItems.length > 0) {
    processedLines.push(`<ol class="list-none text-gray-700 mb-1 space-y-0">${orderedListItems.join('')}</ol>`);
  }
  
  return processedLines.join('');
}

// Function to process inline markdown (bold, italic, links) with blog styling
function processInlineMarkdown(text: string): string {
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$1</strong>')
    .replace(/__(.*?)__/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic text-escape-red-700 font-medium">$1</em>')
    .replace(/_(.*?)_/g, '<em class="italic text-escape-red-700 font-medium">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-escape-red hover:text-escape-red-700 underline decoration-escape-red/50 hover:decoration-escape-red transition-all duration-300 font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
    // Code
    .replace(/`([^`]+)`/g, '<code class="bg-escape-red/10 text-escape-red-800 px-2 py-1 rounded text-sm font-mono border border-escape-red/20">$1</code>');
}

// Function to process HTML content with blog styling
function processHtmlContent(content: string): string {
  // Split content by headings and process each section
  const sections = content.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>)/g);
  let processedSections = [];
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    
    // If it's a heading, keep it as is
    if (section.match(/^<h[1-6][^>]*>.*?<\/h[1-6]>$/)) {
      processedSections.push(section);
    } 
    // If it's text content, wrap it in paragraphs and split long ones
    else if (section.trim()) {
      const text = section.trim();
      if (text.length > 120) {
        // Split long text into shorter paragraphs
        const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim()).map((s: string) => s.trim() + '.');
        const shortParagraphs = [];
        let currentParagraph = '';
        
        sentences.forEach((sentence: string) => {
          if (currentParagraph.length + sentence.length > 80 && currentParagraph.length > 0) {
            shortParagraphs.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
            currentParagraph = sentence;
          } else {
            currentParagraph += (currentParagraph ? ' ' : '') + sentence;
          }
        });
        
        if (currentParagraph) {
          shortParagraphs.push(`<p class="text-gray-700 mb-0 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
        }
        
        processedSections.push(shortParagraphs.join(''));
      } else {
        processedSections.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${text}</p>`);
      }
    }
  }
  
  let fixedContent = processedSections.join('');
  
  // Fix malformed HTML where headings are inside paragraphs
    fixedContent = fixedContent.replace(/<p[^>]*>([^<]*<h[1-6][^>]*>.*?<\/h[1-6]>[^<]*)<\/p>/g, (match, pContent) => {
      // Extract headings and text separately
      const headingMatches = pContent.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/g) || [];
      const textParts = pContent.split(/<h[1-6][^>]*>.*?<\/h[1-6]>/);
      
      let result = '';
      for (let i = 0; i < textParts.length; i++) {
        if (textParts[i].trim()) {
        result += `<p class="text-gray-700 mb-6 leading-relaxed text-lg">${textParts[i].trim()}</p>`;
        }
        if (headingMatches[i]) {
          result += headingMatches[i];
        }
      }
      return result;
    });
    
  // Apply blog-style classes to HTML elements
  fixedContent = fixedContent
    // H1 styling
    .replace(/<h1([^>]*)>(.*?)<\/h1>/g, '<h1 class="text-4xl font-bold text-gray-900 mb-4 mt-4 relative"><span class="bg-gradient-to-r from-escape-red to-escape-red-700 bg-clip-text text-transparent">$2</span><div class="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-escape-red to-escape-red-600 rounded-full"></div></h1>')
    // H2 styling
    .replace(/<h2([^>]*)>(.*?)<\/h2>/g, '<h2 class="text-3xl font-bold text-gray-900 mb-3 mt-3 relative group"><span class="bg-gradient-to-r from-gray-900 to-escape-red-800 bg-clip-text text-transparent">$2</span><div class="absolute -bottom-1 left-0 w-12 h-0.5 bg-escape-red rounded-full group-hover:w-16 transition-all duration-300"></div></h2>')
    // H3 styling
    .replace(/<h3([^>]*)>(.*?)<\/h3>/g, '<h3 class="text-2xl font-semibold text-gray-900 mb-3 mt-2 flex items-center gap-3"><div class="w-2 h-2 bg-escape-red rounded-full"></div>$2</h3>')
    // H4 styling
    .replace(/<h4([^>]*)>(.*?)<\/h4>/g, '<h4 class="text-xl font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>$2</h4>')
    // H5 styling
    .replace(/<h5([^>]*)>(.*?)<\/h5>/g, '<h5 class="text-xl font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>$2</h5>')
    // H6 styling
    .replace(/<h6([^>]*)>(.*?)<\/h6>/g, '<h6 class="text-lg font-semibold text-gray-900 mb-2 mt-1 flex items-center gap-3"><div class="w-1.5 h-1.5 bg-escape-red rounded-full"></div>$2</h6>')
    // Paragraph styling with shorter paragraph splitting
    .replace(/<p([^>]*)>(.*?)<\/p>/g, (match, attrs, content) => {
      // Split long paragraphs into shorter, more readable chunks
      if (content.length > 120) {
        const sentences = content.split(/[.!?]+/).filter((s: string) => s.trim()).map((s: string) => s.trim() + '.');
        const shortParagraphs = [];
        let currentParagraph = '';
        
        sentences.forEach((sentence: string) => {
          if (currentParagraph.length + sentence.length > 80 && currentParagraph.length > 0) {
            shortParagraphs.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
            currentParagraph = sentence;
          } else {
            currentParagraph += (currentParagraph ? ' ' : '') + sentence;
          }
        });
        
        if (currentParagraph) {
          shortParagraphs.push(`<p class="text-gray-700 mb-0 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
        }
        
        return shortParagraphs.join('');
      } else {
        return `<p class="text-gray-700 mb-3 leading-relaxed text-lg">${content}</p>`;
      }
    })
    // Unordered list styling
    .replace(/<ul([^>]*)>(.*?)<\/ul>/g, '<ul class="list-none text-gray-700 mb-1 space-y-0">$2</ul>')
    // Ordered list styling
    .replace(/<ol([^>]*)>(.*?)<\/ol>/g, '<ol class="list-none text-gray-700 mb-1 space-y-0">$2</ol>')
    // List item styling for unordered lists
    .replace(/<li([^>]*)>(.*?)<\/li>/g, (match, attrs, content) => {
      // Check if parent is ul or ol by looking at context
      const parentContext = content.includes('<ul') ? 'ul' : 'ol';
      if (parentContext === 'ul') {
        return `<li class="flex items-start gap-3"><div class="w-2 h-2 bg-escape-red rounded-full mt-3 flex-shrink-0"></div><span>${content}</span></li>`;
          } else {
        // For ordered lists, we need to count items - this is a simplified approach
        return `<li class="flex items-start gap-3"><div class="w-6 h-6 bg-escape-red text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">•</div><span>${content}</span></li>`;
      }
    })
    // Strong/bold styling
    .replace(/<strong([^>]*)>(.*?)<\/strong>/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$2</strong>')
    .replace(/<b([^>]*)>(.*?)<\/b>/g, '<strong class="font-bold text-escape-red-800 bg-escape-red/10 px-1 rounded">$2</strong>')
    // Italic/emphasis styling
    .replace(/<em([^>]*)>(.*?)<\/em>/g, '<em class="italic text-escape-red-700 font-medium">$2</em>')
    .replace(/<i([^>]*)>(.*?)<\/i>/g, '<em class="italic text-escape-red-700 font-medium">$2</em>')
    // Link styling
    .replace(/<a([^>]*href="[^"]*"[^>]*)>(.*?)<\/a>/g, '<a$1 class="text-escape-red hover:text-escape-red-700 underline decoration-escape-red/50 hover:decoration-escape-red transition-all duration-300 font-medium" target="_blank" rel="noopener noreferrer">$2</a>')
    // Code styling
    .replace(/<code([^>]*)>(.*?)<\/code>/g, '<code class="bg-escape-red/10 text-escape-red-800 px-2 py-1 rounded text-sm font-mono border border-escape-red/20">$2</code>');
  
  return fixedContent;
}

// Main function to render content with proper HTML and markdown support
export function renderContent(content: string) {
  if (!content || content.trim() === '') {
    return <div className="text-gray-500 italic">No content available</div>;
  }
  
  const contentType = detectContentType(content);
  
  if (contentType === 'markdown') {
    const processedContent = parseMarkdown(content);
    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  } else if (contentType === 'html') {
    const processedContent = processHtmlContent(content);
    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: processedContent }} 
      />
    );
  } else {
    // Plain text - convert to HTML with proper formatting
    const lines = content.split('\n');
    const processedLines = [];
    let inList = false;
    let listItems: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-none text-gray-700 mb-6 space-y-3">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push('<br>');
        continue;
      }
      
      // Handle bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        const listItem = line.substring(2).trim();
        listItems.push(`<li class="flex items-start gap-3"><div class="w-2 h-2 bg-escape-red rounded-full mt-3 flex-shrink-0"></div><span>${listItem}</span></li>`);
      }
      // Handle numbered lists
      else if (/^\d+\.\s/.test(line)) {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        processedLines.push(`<ol class="list-none text-gray-700 mb-1 space-y-0">`);
        let j = i;
        let counter = 1;
        while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
          const listItem = lines[j].replace(/^\d+\.\s/, '').trim();
          processedLines.push(`<li class="flex items-start gap-3"><div class="w-6 h-6 bg-escape-red text-white rounded-full flex items-center justify-center text-sm font-bold mt-1 flex-shrink-0">${counter}</div><span>${listItem}</span></li>`);
          j++;
          counter++;
        }
        processedLines.push(`</ol>`);
        i = j - 1;
      }
      // Handle paragraphs
      else {
        if (inList && listItems.length > 0) {
          processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
          listItems = [];
          inList = false;
        }
        
        // Split very long paragraphs into reasonable chunks
        if (line.length > 200) {
          const sentences = line.split(/[.!?]+/).filter((s: string) => s.trim()).map((s: string) => s.trim() + '.');
          const shortParagraphs = [];
          let currentParagraph = '';
          
          sentences.forEach((sentence: string) => {
            if (currentParagraph.length + sentence.length > 150 && currentParagraph.length > 0) {
              shortParagraphs.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
              currentParagraph = sentence;
            } else {
              currentParagraph += (currentParagraph ? ' ' : '') + sentence;
            }
          });
          
          if (currentParagraph) {
            shortParagraphs.push(`<p class="text-gray-700 mb-0 leading-relaxed text-lg">${currentParagraph.trim()}</p>`);
          }
          
          processedLines.push(shortParagraphs.join(''));
        } else {
          processedLines.push(`<p class="text-gray-700 mb-3 leading-relaxed text-lg">${line}</p>`);
        }
      }
    }
    
    // Close any remaining list
    if (inList && listItems.length > 0) {
      processedLines.push(`<ul class="list-none text-gray-700 mb-1 space-y-0">${listItems.join('')}</ul>`);
    }
    
    return (
      <div 
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: processedLines.join('') }}
      />
    );
  }
}
