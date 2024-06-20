import * as React from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import Demo from "./Demo";

const DAte = () => {
  return (
    <div>
      <StyledEngineProvider injectFirst>
        <div>
          <Demo />
        </div>
      </StyledEngineProvider>
    </div>
  );
};

export default DAte;
