import { CircularProgress, Backdrop } from "@mui/material";
import "./styles/rendition.scss";

export default function LoadingAnim() {

  return (
    <Backdrop className="rendition__backdrop" open={true} >
      <CircularProgress size="5rem" color="primary" className="rendition__loading" />
    </Backdrop>
  );
}