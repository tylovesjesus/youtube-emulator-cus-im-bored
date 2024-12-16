const apiKey = 'AIzaSyBm7ICg36Kcqo0i5Eo_H_14tYuSMBWxDFE';  // Replace with your YouTube Data API key // Replace with your YouTube Data API key
let nextPageToken = '';  // Keeps track of the next page token for pagination
let searchQuery = '';    // The current search query

// Function to search YouTube API and retrieve video details
async function searchVideos() {
  searchQuery = document.getElementById('search-query').value;  // Get the search query from input
  if (!searchQuery) {
    alert("Please enter a search term.");
    return;
  }

  nextPageToken = '';  // Reset the nextPageToken for a new search

  // YouTube Data API request URL (retrieves up to 5 videos)
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=5&key=${apiKey}`;
  
  try {
    // Fetch data from YouTube API
    const response = await fetch(url);
    const data = await response.json();

    // Check if there are results
    if (data.items && data.items.length > 0) {
      embedVideos(data.items);  // Call function to embed the videos
      nextPageToken = data.nextPageToken || '';  // Set nextPageToken for pagination
      toggleLoadMoreButton();  // Show or hide "Load More" button
    } else {
      alert('No videos found for your search.');
    }
  } catch (error) {
    console.error('Error fetching data from YouTube API:', error);
    alert('There was an error with the search. Please try again later.');
  }
}

// Function to embed multiple videos using iframe
function embedVideos(videos) {
  const videoContainer = document.getElementById('video-container');
  videoContainer.innerHTML = '';  // Clear any previous videos embedded

  // Loop through the video results and create an iframe for each video
  videos.forEach(video => {
    const videoId = video.id.videoId;  // Extract the video ID from each video result

    // Create an iframe element to embed the YouTube video
    const iframe = document.createElement('iframe');
    iframe.width = "560";
    iframe.height = "315";
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.frameBorder = "0";
    iframe.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    iframe.allowFullscreen = true;

    // Append the iframe to the container in the HTML
    videoContainer.appendChild(iframe);
  });
}

// Function to load more videos when "Load More" button is clicked
async function loadMoreVideos() {
  // YouTube Data API request URL to fetch the next set of 5 videos
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=5&pageToken=${nextPageToken}&key=${apiKey}`;

  try {
    // Fetch data from YouTube API
    const response = await fetch(url);
    const data = await response.json();

    // Check if there are results
    if (data.items && data.items.length > 0) {
      embedVideos(data.items);  // Append more videos to the container
      nextPageToken = data.nextPageToken || '';  // Update the nextPageToken
      toggleLoadMoreButton();  // Show or hide "Load More" button
    } else {
      alert('No more videos available.');
    }
  } catch (error) {
    console.error('Error fetching more data from YouTube API:', error);
    alert('There was an error loading more videos. Please try again later.');
  }
}

// Function to toggle the "Load More" button visibility
function toggleLoadMoreButton() {
  const loadMoreButton = document.getElementById('load-more');
  if (nextPageToken) {
    loadMoreButton.style.display = 'block';  // Show the button if there are more results
  } else {
    loadMoreButton.style.display = 'none';  // Hide the button if no more results
  }
}
