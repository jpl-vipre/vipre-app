import { FC } from "react";
import { VizTab } from "../utils/store";

interface VizContentProps {
  tab: VizTab;
}
const VizContent: FC<VizContentProps> = ({ tab }) => {
  return <div>{tab.label}</div>;
};

export default VizContent;
