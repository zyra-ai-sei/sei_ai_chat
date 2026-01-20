import React from "react";
import DcaSimulationPanel from "@/components/strategy/DcaSimulationPanel";
import LumpSumSimulationPanel from "@/components/strategy/LumpSumSimulationPanel";
import TokenVisualization from "@/components/tokenVisualization/TokenVisualization";
import TweetResponseBox from "../TweetResponseBox";

interface DataOutputRendererProps {
  data: any;
  chatIndex: number;
}

const DataOutputRenderer: React.FC<DataOutputRendererProps> = ({ data, chatIndex }) => {
  if (!data || !data.type) return null;

  console.log('checkout',data.type)

  switch (data.type) {
    case "DCA_SIMULATION":
      return (
        <DcaSimulationPanel
          data={data}
          coinSymbol={data.coin || "Token"}
          coinName={data.coinName || "Cryptocurrency"}
        />
      );
    case "LUMP_SUM_SIMULATION":
      return (
        <LumpSumSimulationPanel
          data={data}
          coinSymbol={data.coin || "Token"}
          coinName={data.coinName || "Cryptocurrency"}
        />
      );
    case "CRYPTO_MARKET_DATA":
      return (
        <TokenVisualization
          data={data}
          chatIndex={chatIndex}
        />
      );
    case "TWEETS":
      return (
      <TweetResponseBox data={data} />
    )
    default:
      console.warn(`[DataOutputRenderer] Unknown data type: ${data.type}`);
      return null;
  }
};

export default DataOutputRenderer;
