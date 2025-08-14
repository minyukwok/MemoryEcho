export function extractStoryText(fullText: string) {
    const match = fullText.match(/\*\*Summer Story\*\*([\s\S]*)/);
    return match ? match[1].trim() : fullText.trim();
  }
  
  export function storyToImagePrompt(storyText: string) {
    return `
    Cinematic, photo-realistic scene for a personal memory:
    ${storyText}
    No text overlay. High detail. 4k composition.
    `;
  }