import * as RadixTooltip from "@radix-ui/react-tooltip";
import { PropsWithChildren, useState } from "react";
import * as S from "./styles";

type Props = PropsWithChildren<{
  text: string;
  side: RadixTooltip.PopperContentProps["side"];
  open?: boolean;
}>;

const Tooltip = ({ text, children, open, side }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseOver = () => {
    if (open) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (open) {
      setIsOpen(true);
      return;
    }
    setIsOpen(false);
  };

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={isOpen}>
        <RadixTooltip.Trigger
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content side={side} css={S.tooltipContent}>
            {text}
            <RadixTooltip.Arrow css={S.tooltipArrow} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

export default Tooltip;