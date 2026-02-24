import { fetchEventSource } from "@microsoft/fetch-event-source";
import { store } from "./store";
import { routeSSEEvent } from "./redux/chatData/action";

class SSEManager {
  private controller: AbortController | null = null;
  private isConnected = false;
  private network: string = "sei";

  connect(token: string, network: string) {
    if (!token || !network) {
      console.log("SSEManager: Missing token or network, skipping connect", {
        hasToken: !!token,
        network,
      });
      return;
    }

    if (this.isConnected) {
      console.log("SSEManager: already connected, skipping");
      return;
    }

    console.log("SSEManager: connecting...", { network });

    this.network = network;
    this.controller = new AbortController();
    this.isConnected = true;

    const url = `/api/v1/llm/toolDataStream?network=${network}`;

    fetchEventSource(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      signal: this.controller.signal,
      openWhenHidden: true,

      onmessage: (event) => {
        if (!event.data || event.data === ":") return;
        try {
          const payload = JSON.parse(event.data);
          // event.event is the SSE "event:" field (e.g. "token", "tool_result", "tool_data", "end")
          const eventType = event.event || payload.type;
          if (!eventType) return;
          store.dispatch(
            routeSSEEvent({ event: eventType, payload, network: this.network }) as any,
          );
        } catch (e) {
          console.error("Failed to parse SSE message:", event.data, e);
        }
      },
      onerror: (err) => {
        if (err?.name === "AbortError") return;
        console.error("SSE error", err);
        this.isConnected = false;
      },
      onclose: () => {
        console.log("SSE connection closed");
        this.isConnected = false;
      },
    });
  }

  disconnect() {
    console.log("SSEManager: disconnecting");
    this.controller?.abort();
    this.controller = null;
    this.isConnected = false;
  }
}

export const sseManager = new SSEManager();