import "./index.scss";
// import kolkataLogo from "@/assets/home/kkr.png";
// import rcbLogo from "@/assets/home/rcb.png";
import VersusIcon from "@/assets/home/versus.svg?react";
// import RefreshIcon from "@/assets/home/refresh.svg?react";
import LiveButton from "../common/button/liveButton";

import { useEffect, useMemo } from "react";

import { gameStatusValue, matchStatusValue } from "@/enum/singleMatch.enum";
import { useApiRequest } from "@/hooks/useApiRequest";
import { get } from "lodash";
import { MatchScorecard } from "@/redux/matchScore/interface";
interface LiveMatchProps {
  matchId: number;
}
function LiveMatchBox(
  { matchId }: LiveMatchProps,
  { className }: { className?: string }
) {
  const [matchScoreDetails, fetchMatchScoreDetails] = useApiRequest(
    `/matches/${matchId}/scorecard`
  );

  const { matchScoreCard } = useMemo(() => {
    return {
      matchScoreCard: get(
        matchScoreDetails,
        "response.data.data",
        {}
      ) as MatchScorecard,
      // isDataLoading:
      //   get(matchScoreDetails, "status", "FETCHING") === "FETCHING",
    };
  }, [matchScoreDetails]);

  useEffect(() => {
    fetchMatchScoreDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matchStatusText = useMemo(() => {
    const status = matchScoreCard?.matchData?.status;
    const gameStatus = matchScoreCard?.matchData?.game_state || 3;

    if (status !== 3) {
      return matchStatusValue?.[status!] || "Live";
    } else {
      return gameStatusValue?.[gameStatus] || "Live";
    }
  }, [
    matchScoreCard?.matchData?.status,
    matchScoreCard?.matchData?.game_state,
  ]);

  return (
    <section
      className={`${className} liveBg min-h-[99px]  px-[16px] flex justify-between rounded-[20px] mainFont`}
    >
      <div className="flex items-center md:gap-x-[150px]">
        <div className="hidden md:flex items-center justify-center gap-x-[32px] py-[24px]">
          <div className="rounded-[50%] bg-neutral-greys-300 h-[72px] w-[72px] flex items-center justify-center">
            <img
              src={matchScoreCard?.matchData?.team_a?.logo_url}
              alt=""
              className="h-[50px] w-[50px]"
            />
          </div>
          <VersusIcon className="h-[37px] w-[32px]" />
          <div className="rounded-[50%] bg-neutral-greys-300 h-[72px] w-[72px] flex items-center justify-center">
            <img
              src={matchScoreCard?.matchData?.team_b?.logo_url}
              alt=""
              className="h-[50px] w-[50px]"
            />
          </div>
        </div>
        <div className="min-w-[150px] md:min-w-[230px]">
          <div className="w-full flex items-center gap-x-[8px] md:gap-x-[0px] md:justify-between">
            {" "}
            <div className="h-[24px] w-[24px] bg-neutral-greys-300 rounded-[50%]  md:hidden flex items-center justify-center">
              <img
                src={matchScoreCard?.matchData?.team_a?.logo_url}
                alt=""
                className="h-[14px] w-[14px]"
              />
            </div>
            <p className="typo-h5-semiBold text-neutral-greys-500 min-w-[50px] text-start">
              {matchScoreCard?.matchData?.team_a?.short_name}
            </p>{" "}
            {matchScoreCard?.matchData?.team_a ? (
              <p>
                {" "}
                <span className="typo-b2-regular text-neutral-greys-950">
                  {matchScoreCard?.matchData?.team_a?.scores_full}
                </span>{" "}
                {/* <span className="typo-h5-semiBold text-neutral-greys-950">
                  {" "}
                  {teama_score}
                </span>{" "} */}
              </p>
            ) : (
              <p>
                <span className="typo-b2-regular text-neutral-greys-500">
                  Yet to bat
                </span>{" "}
              </p>
            )}
          </div>
          <div className="w-full flex items-center gap-x-[8px] md:gap-x-[0px] md:justify-between mt-[16px]">
            {" "}
            <div className="h-[24px] w-[24px] bg-neutral-greys-300 rounded-[50%]  flex md:hidden items-center justify-center">
              <img
                src={matchScoreCard?.matchData?.team_b?.logo_url}
                alt=""
                className="h-[14px] w-[14px]"
              />
            </div>
            <p className="typo-h5-semiBold text-neutral-greys-500 min-w-[50px] text-start">
              {matchScoreCard?.matchData?.team_b?.short_name}
            </p>{" "}
            <p>
              {" "}
              <span className="typo-b2-regular text-neutral-greys-950">
                {matchScoreCard?.matchData?.team_b?.scores_full}
              </span>{" "}
              {/* <span className="typo-h5-semiBold text-neutral-greys-950">
                {" "}
                {teamb_score}
              </span>{" "} */}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between pt-[16px] pb-[14px] h-full min-h-[132px]">
        <div className="flex items-center gap-x-[12px]">
          {/* <p className="typo-b3-regular text-neutral-greys-500 flex  items-center">
            <span>refreshed 5 sec ago</span>
            <RefreshIcon className="ml-[5px] cursor-pointer" />
          </p> */}
          <LiveButton title={matchStatusText} />
        </div>
      </div>
    </section>
  );
}

export default LiveMatchBox;
