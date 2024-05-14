import { CircularProgress, Backdrop } from "@mui/material";
import "./styles/rendition.scss";

export default function LoadingAnim({ auth, requestId }) {

  return (
    <Backdrop className="rendition__backdrop" open={true} >
      <CircularProgress size="40vw" color="primary" className="rendition__loading" />
    </Backdrop>
  );
}