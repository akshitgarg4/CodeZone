import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "";
const video_token = localStorage.getItem("video_token");
const token = video_token
  ? video_token
  : "";
//vp8 is algorithm to encode the video
export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
