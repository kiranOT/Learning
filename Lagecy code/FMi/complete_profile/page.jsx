"use client";

import CompanyDetailsResults from "@/components/signUp_components/Company_Details_&_Results";
import CompnayGrowth from "@/components/signUp_components/Company_Growth_Vision_Market_Opportunities";
import FundingAsk from "@/components/signUp_components/Funding_Ask";
import TeamForm from "@/components/user/signup/TeamForm";
import React, { useEffect, useState } from "react";
import style from "./complete_profile.module.css";
import UserStepper from "@/components/user/stepper/UserStepper";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

const CompleteProfile = () => {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/Login");
    }
  }, []);

  const baseSteps = [
    {
      labelName: "Company Details & Results",
      isCompleted: false,
      isCurrent: true,
      active: 1,
    },
    {
      labelName: "Company Growth Vision & Market Opportunities",
      isCompleted: false,
      isCurrent: false,
      active: 2,
    },
    {
      labelName: "Ask Funding",
      isCompleted: false,
      isCurrent: false,
      active: 3,
    },
    {
      labelName: "Team",
      isCompleted: false,
      isCurrent: false,
      active: 4,
    },
  ];

  const [steps, setSteps] = useState(baseSteps);

  const [activeStep, setActiveStep] = useState(1);

  const handleStepperChange = () => {
    const newSteps = steps.map((item) => {
      if (activeStep === item.active) {
        return { ...item, isCompleted: true, isCurrent: false };
      } else if (item.active === activeStep + 1) {
        return { ...item, isCompleted: false, isCurrent: true };
      } else {
        return { ...item };
      }
    });

    setSteps(newSteps);
    setActiveStep(activeStep + 1);
  };

  return (
    <>
      <div className={`w-screen font-DM ${style.multiplImage}`}>
        <div className="flex flex-col items-center justify-center p-8">
          <span className="p-4 text-center text-[2.1rem] font-[700] text-[#170F49]">
            Signup
          </span>
          <p className="text-[1.25 text-center font-[400] text-[#6F6C90]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            <br />
            eiusmod tempor incididunt ut labore et dolore.
          </p>
        </div>
        <div className={`${style.main_div} flex flex-col px-8 md:flex-row`}>
          <div className={`${style.main_left_div} mb-10`}>
            <UserStepper steps={steps} />
          </div>

          <div className={`${style.main_right_div} md:mr-[30px]`}>
            {activeStep === 11 && (
              <CompanyDetailsResults changeForm={handleStepperChange} />
            )}

            {activeStep === 11 && (
              <CompnayGrowth changeForm={handleStepperChange} />
            )}

            {activeStep === 1 && (
              <FundingAsk changeForm={handleStepperChange} />
            )}

            {activeStep === 11 && <TeamForm />}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompleteProfile;
