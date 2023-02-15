import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

import Balance from "./Balance";
import Calculator from "./Calculator";
import PriceList from "./PriceList";
import { getLatestRecordByUser } from "../services/RecordService";
import { selectUserToken } from "../features/auth/authSlice";
import { addAuthorizationToHeader } from "../utils/request";
import EnhancedTable from "./table/RecordTable";
import "./dashboard.css";

// TODO validate when you dont have more credit
const Dashboard = () => {
  const userToken = useSelector(selectUserToken);

  const [balance, setbalance] = useState(0);
  const [userId, setuserId] = useState(null);

  useEffect(() => {
    const decodedToken = jwt_decode(userToken);
    if (!!decodedToken.id) {
      getcurrentBalance(decodedToken.id);
      setuserId(decodedToken.id);
    }
  }, []);

  const getcurrentBalance = async (id) => {
    try {
      const customHeader = addAuthorizationToHeader(userToken);
      const {
        data,
        data: { latestRecord },
      } = await getLatestRecordByUser(customHeader, id);
      setbalance(latestRecord.userBalance);
    } catch (error) {
      const { data, status } = error?.response || "";
      
      /**NO records registered */
      if (status === 404) setbalance(100);
    }
  };

  return (
    <div className="layout">
      <section className="calculator-container">
        <Calculator
          userBalance={balance}
          userId={userId}
          setBalance={setbalance}
        />
        <PriceList />
      </section>

      <section>
        <Balance amount={balance} s />
        <EnhancedTable />
      </section>
    </div>
  );
};

export default Dashboard;
