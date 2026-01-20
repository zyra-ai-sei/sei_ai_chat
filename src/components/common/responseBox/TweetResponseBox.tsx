import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Repeat2, Heart, Share, ExternalLink, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TweetAuthor {
  name: string;
  userName: string;
  profilePicture: string;
}

interface TweetMedia {
  media_url_https: string;
  type: string;
}

interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  author: TweetAuthor;
  extendedEntities?: {
    media: TweetMedia[];
  };
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  viewCount: number;
  url: string;
}

interface TweetResponseBoxProps {
  data: {
    type: string;
    tweets: Tweet[];
  };
}

const TweetCard = ({ tweet, index }: { tweet: Tweet; index: number }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const TEXT_LIMIT = 120;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const renderText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const shouldTruncate = text.length > TEXT_LIMIT && !isTextExpanded;
    const displayText = shouldTruncate ? text.slice(0, TEXT_LIMIT) : text;

    return (
      <div className="text-[13px] leading-relaxed text-white/70 whitespace-pre-wrap break-words">
        {displayText.split(urlRegex).map((part, i) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400/90 hover:text-blue-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {part}
              </a>
            );
          }
          return part;
        })}
        {text.length > TEXT_LIMIT && (
          <button
            onClick={() => setIsTextExpanded(!isTextExpanded)}
            className="ml-1 font-bold text-blue-400/80 hover:text-blue-400 transition-colors"
          >
            {isTextExpanded ? ' ...show less' : ' ...read more'}
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-blue-500/30 hover:bg-white/[0.06] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      {/* Header: Author Info */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10 shrink-0 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
            <img 
              src={tweet.author.profilePicture} 
              alt={tweet.author.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="font-bold text-white/90 text-sm leading-tight hover:text-blue-400 transition-colors cursor-pointer truncate">
                {tweet.author.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-white/30 truncate">@{tweet.author.userName}</span>
              <span className="text-[11px] text-white/20">·</span>
              <span className="text-[11px] text-white/30 whitespace-nowrap">{formatDate(tweet.createdAt)}</span>
            </div>
          </div>
        </div>
        <a 
          href={tweet.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="rounded-full bg-white/5 p-2 text-white/20 transition-all hover:bg-blue-500/10 hover:text-blue-400"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Content: Tweet Text */}
      <div className="relative px-0.5">
        {renderText(tweet.text)}
      </div>

      {/* Media: Images */}
      {tweet.extendedEntities?.media && tweet.extendedEntities.media.length > 0 && (
        <div className="relative mt-1 overflow-hidden rounded-xl border border-white/5 shadow-2xl">
          <img 
            src={tweet.extendedEntities.media[0].media_url_https} 
            alt="Tweet media" 
            className={cn(
              "w-full object-cover transition-transform duration-500 group-hover:scale-105", 
              isTextExpanded ? "max-h-[400px]" : "max-h-[180px]"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Footer: Metrics */}
      <div className="relative mt-auto flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-4 text-white/40">
          <div className="flex items-center gap-1.5 transition-colors hover:text-blue-400 cursor-pointer">
            <MessageCircle className="h-4 w-4" />
            <span className="text-[11px] font-mono">{formatNumber(tweet.replyCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 transition-colors hover:text-emerald-400 cursor-pointer">
            <Repeat2 className="h-4 w-4" />
            <span className="text-[11px] font-mono">{formatNumber(tweet.retweetCount)}</span>
          </div>
          <div className="flex items-center gap-1.5 transition-colors hover:text-rose-400 cursor-pointer">
            <Heart className="h-4 w-4" />
            <span className="text-[11px] font-mono">{formatNumber(tweet.likeCount)}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-white/20">
          <BarChart2 className="h-4 w-4" />
          <span className="text-[11px] font-mono">{formatNumber(tweet.viewCount)}</span>
        </div>
      </div>
    </motion.div>
  );
};


const TweetResponseBox = ({ data }: TweetResponseBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!data || !(data.tweets?.length) || !Array.isArray(data.tweets)) {
    return null;
  }

  const displayedTweets = isExpanded ? data.tweets : data.tweets.slice(0, window.innerWidth >= 1024 ? 3 : 2);
  const hasMore = data.tweets.length > 3;

  return (
    <div className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0B0F1A] p-6 transition-all hover:border-blue-500/20 shadow-[0_20px_60px_rgba(5,6,14,0.6)]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-blue-600/5 blur-[80px] transition-all group-hover:bg-blue-600/10" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-600/5 blur-[80px] transition-all group-hover:bg-purple-600/10" />

      <div className="relative z-10 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 scale-110 rounded-full bg-blue-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-12 w-12 rounded-full border border-white/10 bg-[#161B2D] flex items-center justify-center shadow-xl">
                <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                Social Insights
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  REAL-TIME TRENDS
                </span>
                <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-mono font-bold text-white/40 uppercase tracking-widest">
              {data.tweets.length} Mentions
            </div>
          </div>
        </div>

        {/* Tweets Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {displayedTweets.map((tweet, idx) => (
              <TweetCard key={tweet.id || idx} tweet={tweet} index={idx} />
            ))}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group/btn relative flex items-center gap-3 overflow-hidden rounded-full border border-white/10 bg-white/5 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/60 transition-all hover:border-blue-500/40 hover:text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              {isExpanded ? (
                <>
                  Minimize <ChevronUp className="h-4 w-4 text-blue-400" />
                </>
              ) : (
                <>
                  View {data.tweets.length - 3} more <ChevronDown className="h-4 w-4 text-blue-400" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetResponseBox;
