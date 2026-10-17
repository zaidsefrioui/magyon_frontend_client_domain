export function tiktokTrack(event, params = {}) {
    if (typeof window.ttq !== "undefined") {
        window.ttq.track(event, params);
    } else {
        console.warn("ttq not loaded yet");
    }
}