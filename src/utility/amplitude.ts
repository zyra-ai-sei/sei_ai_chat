import * as amplitude from "@amplitude/analytics-browser";
import { FixTypeLater } from "react-redux";

export const trackUserEvent = (
  eventInput: string | amplitude.Types.BaseEvent,
  eventProperties?: Record<string, FixTypeLater> | undefined
  //   eventOptions?: amplitude.Types.EventOptions | undefined
) => {
  if (eventProperties) {
    amplitude.track(eventInput, eventProperties);
  } else {
    amplitude.track(eventInput);
  }
};

export default trackUserEvent;
