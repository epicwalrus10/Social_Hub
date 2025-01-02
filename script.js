/**
 * Extract the YouTube video ID from various URL formats
 * and return a direct thumbnail URL.
 */
function getYouTubeThumbnail(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    // If there's a match and the ID looks valid
    if (match && match[7]?.length === 11) {
      const videoId = match[7];
      // For higher resolution, try maxresdefault.jpg
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    
    // Return null if not a valid YouTube link
    return null;
  }
  
  /**
   * On DOMContentLoaded, replace the img src in each
   * .video-card if data-link is a YouTube URL.
   */
  document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach((card) => {
      const link = card.getAttribute('data-link');
      if (link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
        const thumbnailUrl = getYouTubeThumbnail(link);
        if (thumbnailUrl) {
          const img = card.querySelector('.video-card__image');
          img.src = thumbnailUrl;
        }
      }
    });
  });
  