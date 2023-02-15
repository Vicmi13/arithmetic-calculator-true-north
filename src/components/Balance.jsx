import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import "./balance.css";

// TODO validate when you dont have more credit
const Balance = ({ amount }) => {
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    amount !== 0 ? setCurrentBalance(amount) : setCurrentBalance(100);
  }, [amount]);

  return (
    <Box
      sx={{
        boxShadow: 1,
        borderRadius: 2,
        p: 2,
      }}
      className="balance-info"
    >
      <Box sx={{ color: "text.secondary" }}>Current balance</Box>
      <Box sx={{ color: "text.primary", fontSize: 40, fontWeight: "medium" }}>
        $ {currentBalance}
      </Box>
    </Box>
  );
};

export default Balance;
