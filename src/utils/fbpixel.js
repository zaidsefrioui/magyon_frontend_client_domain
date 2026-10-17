export function pixelTrack(event, params = {}) {
    if (typeof window.fbq !== "undefined") {
        window.fbq("track", event, params);
    } else {
        console.warn("fbq not loaded yet");
    }
}
