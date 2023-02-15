import React, { useEffect, useState } from "react";
import Balance from "./Balance";
import Calculator from "./Calculator";
import PriceList from "./PriceList";
import jwt_decode from "jwt-decode";
import { retrieveLatestRecordByUser } from "../services/RecordService";
import { useSelector } from "react-redux";
import { selectUserToken } from "../features/auth/authSlice";
import { addAuthorizationToHeader } from "../utils/request";
import "./dashboard.css";

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
        data: { latestRecord },
      } = await retrieveLatestRecordByUser(customHeader, id);
      setbalance(latestRecord.userBalance);
    } catch (error) {
      const { data } = error?.response || "";
      console.log(data);
    }
  };

  return (
    <div className="layout">
      <section className="calculator-container">
        <Calculator userBalance={balance} userId={userId} />
        <PriceList />
      </section>
      <Balance amount={balance} />
    </div>
  );
};

export default Dashboard;
