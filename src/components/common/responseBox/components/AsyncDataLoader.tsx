import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchAsyncToolData } from "@/redux/chatData/action";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { PendingAsyncData } from "@/types/asyncToolData.types";

interface AsyncDataLoaderProps {
  asyncData: PendingAsyncData;
  chatIndex: number;
}

// Poll interval in milliseconds
const POLL_INTERVAL = 2000;
const MAX_POLL_ATTEMPTS = 30; // Stop polling after 1 minute

const getIconForDataType = (dataType: string) => {
  switch (dataType) {
    case "CRYPTO_MARKET_DATA":
      return <TrendingUp className="h-5 w-5" />;
    case "TWITTER_LATEST_TWEETS":
    case "TWEETS":
      return <MessageSquare className="h-5 w-5" />;
    default:
      return <BarChart3 className="h-5 w-5" />;
  }
};

const getColorForDataType = (dataType: string) => {
  switch (dataType) {
    case "CRYPTO_MARKET_DATA":
      return "emerald";
    case "TWITTER_LATEST_TWEETS":
    case "TWEETS":
      return "blue";
    default:
      return "purple";
  }
};

const AsyncDataLoader = ({ asyncData, chatIndex }: AsyncDataLoaderProps) => {
  const dispatch = useAppDispatch();
  const pollCountRef = useRef(0);

  useEffect(() => {
    if (asyncData.status !== "pending") return;

    const pollData = () => {
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
        console.log(`Max poll attempts reached for ${asyncData.executionId}`);
        return;
      }

      pollCountRef.current += 1;
      dispatch(
        fetchAsyncToolData({
          chatIndex,
          executionId: asyncData.executionId,
          dataType: asyncData.dataType,
        }) as any,
      );
    };

    // Poll every POLL_INTERVAL milliseconds
    const interval = setInterval(pollData, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
      pollCountRef.current = 0;
    };
  }, [
    asyncData.status,
    asyncData.executionId,
    asyncData.dataType,
    chatIndex,
    dispatch,
  ]);

  const color = getColorForDataType(asyncData.dataType);
  const icon = getIconForDataType(asyncData.dataType);

  if (asyncData.status === "failed") {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400">
              Failed to load {asyncData.toolName}
            </p>
            {asyncData.error && (
              <p className="mt-1 text-xs text-red-400/60">{asyncData.error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pending state with loading animation
  return (
    <div
      className={`rounded-2xl border border-${color}-500/20 bg-${color}-500/5 p-5 backdrop-blur-sm transition-all`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-${color}-500/20 bg-${color}-500/10 text-${color}-400`}
        >
          {icon}
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className={`h-4 w-4 animate-spin text-${color}-400`} />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80">
            {asyncData.summary || `Loading ${asyncData.toolName}...`}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div
              className={`h-1.5 w-24 overflow-hidden rounded-full bg-${color}-500/20`}
            >
              <div
                className={`h-full bg-${color}-500 animate-pulse rounded-full`}
                style={{ width: "60%" }}
              />
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider text-${color}-400/60`}
            >
              Fetching data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsyncDataLoader;
