export const timeAgo = (date) => {
   const now = Date.now(); // Get current time in milliseconds (UTC)
  const past = new Date(date).getTime(); // Get past time in milliseconds (UTC)
  const diff = Math.floor((now - past) / 1000); 

  if (diff < 60) {
    return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  } else if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (diff < 604800) {
    const days = Math.floor(diff / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (diff < 2592000) {
    const weeks = Math.floor(diff / 604800);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diff / 31536000);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
  }
}

