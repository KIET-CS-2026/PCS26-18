import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import PropTypes from "prop-types";

const CopySection = (props) => {
  const { roomId } = props;

  return (
    <div className="flex flex-col absolute text-white border border-white rounded p-2 left-8 bottom-[100px] w-max">
      <div className="text-base mb-1">Copy Room ID:</div>
      <hr className="my-1" />
      <div className="flex items-center text-sm">
        <span>{roomId}</span>
        <CopyToClipboard text={roomId}>
          <Button
            className="ml-3 p-2 rounded-full text-white bg-secondary hover:bg-buttonPrimary"
            size="sm"
          >
            <Copy size={20} />
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
};
CopySection.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default CopySection;
