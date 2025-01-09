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
 * Extract the YouTube embed link from a URL.
 */
function getYouTubeEmbedLink(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);

  // If there's a match and the ID looks valid
  if (match && match[7]?.length === 11) {
    const videoId = match[7];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Return null if not a valid YouTube link
  return null;
}

/**
 * Collapse the expanded video card and stop video playback.
 */
function collapseCard(card) {
  card.classList.remove('expanded');
  const iframeContainer = card.querySelector('.video-player-content');
  if (iframeContainer) {
    iframeContainer.remove(); // Remove the iframe and controls
  }
}

/**
 * On DOMContentLoaded, replace the img src in each
 * .video-card if data-link is a YouTube URL and set up the player.
 */
document.addEventListener('DOMContentLoaded', () => {
  const videoCards = document.querySelectorAll('.video-card');
  let expandedCard = null; // Track the currently expanded card

  // Replace video card thumbnail images and set up click events
  videoCards.forEach((card) => {
    const link = card.getAttribute('data-link');
    
    // Set thumbnail for video cards
    if (link && (link.includes('youtube.com') || link.includes('youtu.be'))) {
      const thumbnailUrl = getYouTubeThumbnail(link);
      if (thumbnailUrl) {
        const img = card.querySelector('.video-card__image');
        img.src = thumbnailUrl;
      }

      // Set up click event to expand video card
      card.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor link behavior

        // Collapse any previously expanded card
        if (expandedCard) {
          collapseCard(expandedCard);
        }

        // Expand the clicked card by replacing its content with the video player
        const embedLink = getYouTubeEmbedLink(link);
        if (embedLink) {
          card.classList.add('expanded');
          expandedCard = card;

          // Create and embed iframe inside the card's content area
          let iframeContainer = document.createElement('div');
          iframeContainer.classList.add('video-player-content');
          iframeContainer.innerHTML = `
            <iframe class="video-player-iframe" src="${embedLink}" frameborder="0" allowfullscreen></iframe>
            <button class="close-btn">&times;</button>
          `;
          card.innerHTML = ''; // Clear current content
          card.appendChild(iframeContainer); // Insert iframe and close button

          // Add close button functionality
          const closeBtn = card.querySelector('.close-btn');
          closeBtn.addEventListener('click', () => {
            collapseCard(card);
            expandedCard = null; // Reset expanded card tracker
            card.innerHTML = ''; // Reset card content
            card.innerHTML = `
              <img class="video-card__image" src="${thumbnailUrl}">
              <div class="video-card__content">
                <h3 class="video-card__title">Video Title</h3>
                <p class="video-card__description">Short description of the video.</p>
              </div>
            `;
          });

          // Adjust layout of other video cards
          const featuredContent = document.querySelector('.featured-content');
          featuredContent.style.gridTemplateColumns = '1fr'; // Make full width
        }
      });
    }
  });

  // Close expanded video card when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (expandedCard && !expandedCard.contains(e.target) && !e.target.classList.contains('close-btn')) {
      collapseCard(expandedCard);
      expandedCard = null;
    }
  });
});
