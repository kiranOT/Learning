/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import PieChart from "@/components/chart/PieChart";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as _ from "lodash";
import { getData } from "@/utils/apiCall";
import LoaderScreenPage from "@/components/helperComponents/Loader";

import {
  currenciesList,
  typeOfFundsList,
  LenderList,
  fundingReasonsList,
  investorsRoleList,
} from "@/utils/constants/dropDownList";

//////////////////////////////Formik and Yup////////////////////////////
const initialValues = {
  current_lender: [{ current_lender_type: "", amount: "" }],
  raising_now: { currency: "", amount: "" },
  funding_reason: [{ funding_reason_type: "", percentage: "" }],
  investor_role: "",
  otherOfInvestor_role: "",
  preferred_type_of_funding: "",
  if_equity: {
    dillution_of_equity: "",
    amount: "",
    company_valuation: "",
  },
  if_debt: {
    amount: "",
    company_valuation: "",
  },
};

const companyfundsSchema = Yup.object().shape({
  current_lender: Yup.array().of(
    Yup.object().shape({
      current_lender_type: Yup.string().required("Required"),
      amount: Yup.string(),
      amount: Yup.number()
        .typeError("must be number")
        .positive("must be positive"),
    }),
  ),
  raising_now: Yup.object().shape({
    currency: Yup.string(),
    amount: Yup.number()
      .typeError("must be number")
      .positive("must be positive"),
  }),
  funding_reason: Yup.array().of(
    Yup.object().shape({
      funding_reason_type: Yup.string(),
      percentage: Yup.number()
        .typeError("Must be number")
        .positive("must be positive")
        .max(100, "Must be 100 Or less"),
    }),
  ),
  preferred_type_of_funding: Yup.string(),
});

////////////////////////////// End Formik and Yup////////////////////////////
////////////////////////////// Hepler Function /////////////////////////////
function calculateCompanyValuation(dilution_of_equity, amount) {
  let dilution = parseFloat(dilution_of_equity) / 100;
  let raisedAmount = parseFloat(amount);

  let postMoneyValuation = raisedAmount / dilution;
  return postMoneyValuation;
}
////////////////////////////// End Hepler Function /////////////////////////////

//////////////// end of import //////////////////
export default function FundingAsk({ changeForm }) {
  //////////////// State //////////////////
  const router = useRouter();
  const [loading, setLoadig] = useState(false);

  const [jwtToken, setJwtToken] = useState();
  const [User_id, setUser_id] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) {
        setJwtToken(token);
      }
      const userId = JSON.parse(
        window.localStorage.getItem("userData"),
      )?.primaryObjectID;
      if (userId) {
        setUser_id(userId);
      }
    }
  });

  ////////////// Extra validation /////////////////////////
  const [checkfundingReasonPercentage, SetCheckfundingReasonPercentage] =
    useState(0);
  // percentage check
  function checkFundingReasonPercentageFun(funding_reasons) {
    const percentage = funding_reasons.reduce((accumulator, currentValue) => {
      let num = parseInt(currentValue.percentage);
      if (typeof num == "number") return num + accumulator;
      return accumulator;
    }, 0);

    SetCheckfundingReasonPercentage(percentage);
    if (percentage > 100) {
      toast.error("Funding reasons must be 100%");
    }
  }

  // dropDown validation for  Funding Reason

  const FundingReasonsLists = structuredClone(fundingReasonsList);

  const [fundingReasonList, setFundingReasonList] =
    useState(fundingReasonsList);

  function fundingReasonListFun(funding_reasons, index = "") {
    setFundingReasonList(FundingReasonsLists);

    let tempfundingReasonList = structuredClone(fundingReasonList);

    if (index && typeof index === "number") {
      const removedItem = funding_reasons.at(index);

      const updatedFundingReasonLists = funding_reasons.filter(
        (item, index) => item !== removedItem,
      );

      checkFundingReasonPercentageFun(updatedFundingReasonLists);
      const selectedOptions = funding_reasons.map(
        (item) => item.funding_reason_type,
      );

      const remainingItem = FundingReasonsLists.filter(
        (item) => !selectedOptions.includes(item),
      );
      remainingItem.push(removedItem.funding_reason_type);

      tempfundingReasonList = remainingItem;
    } else {
      funding_reasons
        .map((obj) => obj.funding_reason_type)
        .map((selectedOption) => {
          let findINdex = tempfundingReasonList.indexOf(selectedOption);
          if (findINdex !== -1) {
            tempfundingReasonList.splice(findINdex, 1);
          }
        });
    }
    setFundingReasonList(tempfundingReasonList);
  }

  /////////////////////// dropDown validation for  Funding Reason ///////////////////////

  const LendersList = structuredClone(LenderList);

  const [LenderListState, SetLenderListState] = useState(LenderList);

  function LenderListsFun(LenderListss, index = "") {
    SetLenderListState(LendersList);

    let tempSatate = structuredClone(LenderListState);

    if (index && typeof index === "number") {
      const removedItem = LenderListss.at(index);

      const selectedOptions = LenderListss.map(
        (item) => item.current_lender_type,
      );

      const remainingItem = LendersList.filter(
        (item) => !selectedOptions.includes(item),
      );
      remainingItem.push(removedItem.current_lender_type);

      tempSatate = remainingItem;
    } else {
      LenderListss.map((obj) => obj.current_lender_type).map(
        (selectedOption) => {
          let findINdex = tempSatate.indexOf(selectedOption);
          if (findINdex !== -1) {
            tempSatate.splice(findINdex, 1);
          }
        },
      );
    }
    SetLenderListState(tempSatate);
  }

  //////////////End Extra validation /////////////////////////

  /////////////////// API invoked//////////////////////
  async function saveFundingDetails(values) {
    // use in future
    setLoadig(true);

    if (values.investor_role.includes("Other")) {
      const index = values.investor_role.indexOf("Other");
      if (index !== -1) {
        values.investor_role = values.otherOfInvestor_role;
      }
    }

    const fundingDetails = {
      ...values,
      user_id: User_id,
    };

    delete fundingDetails.preferred_type_of_funding;
    delete fundingDetails.otherOfInvestor_role;

    console.log("before API call \ncompany details --> ", fundingDetails);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FMI_URL}/funding`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + jwtToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fundingDetails),
          cache: "no-store",
        },
      );
      const result = await response.json();
      console.log("backed response", result);
      if (!response.ok) {
        console.log(result.error);
        return;
      }

      if (result.success) {
        changeForm();
        // router.push("/Sign_Up/Team");
      }
    } catch (er) {
      console.log(er);
    } finally {
      setLoadig(false);
    }
  }
  /////////////////// End API invoked//////////////////////

  return (
    <>
      {loading && <LoaderScreenPage />}
      <div className="text-nowrap bg-[#FFFFFF]">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="flex w-full flex-col justify-center">

          <Formik
            initialValues={initialValues}
            validationSchema={companyfundsSchema}
            onSubmit={(values) => {
              // console.log(values);
              saveFundingDetails(values);
            }}
            className="flex w-screen justify-center"
          >
            {({ handleSubmit, values, touched, errors }) => {
              return (
                <Form
                  className="rounded- lg flex flex-col items-center justify-center gap-1 bg-[#FFFFFF] p-8 text-black shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)]"
                  onSubmit={handleSubmit}
                >
                  {/* {console.log(values)} */}
                  <span className="ms-2 mb-2 self-start text-md font-[550] text-wrap capitalize text-[#170F49] underline">
                    If you did a previous funding round, how much have you
                    raised?
                  </span>
                  <div className="flex w-full flex-wrap items-center justify-center gap-8">
                    <FieldArray name="current_lender" className="w-full">
                      {({ push, remove }) => (
                        <div className="w-full p-0">
                          {values.current_lender.map(
                            (current_lender, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-0 gap-x-2"
                              >
                                <div className="flex w-[95%] flex-col lg:w-[43%]">

                                  <label className="ms-2 font-[500] text-[#170F49]"
                                    htmlFor={`current_lender`}
                                  >
                                    Current Lender
                                  </label>
                                  <Field
                                    as="select"
                                    name={`current_lender[${index}].current_lender_type`}
                                    className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"

                                  >
                                    <option value="">
                                      {values.current_lender[index]
                                        .current_lender_type == ""
                                        ? "select"
                                        : values.current_lender[index]
                                          .current_lender_type}
                                    </option>

                                    {LenderListState.map((val, index) => (
                                      <option key={index} name={val}>
                                        {val}
                                      </option>
                                    ))}
                                  </Field>
                                  <div className="ms-2 h-3 text-xs text-red-600">
                                    <ErrorMessage
                                      name={`current_lender[${index}].current_lender_type`}
                                    />
                                  </div>
                                </div>
                                <div className="flex w-[95%] flex-col lg:w-[43%]">

                                  <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]"

                                    htmlFor={`amount`}
                                  >
                                    Amount
                                  </label>
                                  <Field
                                    name={`current_lender[${index}].amount`}
                                    placeholder="Enter Amount"
                                    className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"

                                  />
                                  <div className="ms-2 h-3 text-xs text-red-600">
                                    <ErrorMessage
                                      name={`current_lender[${index}].amount`}
                                    />
                                  </div>
                                </div>
                                <div className="flex w-[3.5rem] items-center justify-center">

                                  {index === values.current_lender.length - 1 &&
                                    values.current_lender[
                                      values.current_lender.length - 1
                                    ].current_lender_type !== "" &&
                                    values.current_lender[
                                      values.current_lender.length - 1
                                    ].amount !== "" && (
                                      <CiCirclePlus
                                        type="button"
                                        className="h-auto w-7 cursor-pointer text-black"
                                        size={30}
                                        onClick={() => {
                                          push({
                                            current_lender_type: "",
                                            amount: "",
                                          });
                                          LenderListsFun(values.current_lender);
                                        }}
                                      />
                                    )}
                                  {index > 0 &&
                                    values.current_lender.length - 1 ==
                                    index && (
                                      <CiCircleMinus
                                        type="button"
                                        className="h-auto w-7 cursor-pointer text-black"
                                        size={30}
                                        onClick={() => {
                                          remove(index);
                                          LenderListsFun(
                                            values.current_lender,
                                            index,
                                          );
                                        }}
                                      />
                                    )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <span className="ms-2 mb-2 self-start text-md font-[550] capitalize text-[#170F49] underline">
                    How much are you raising now?
                  </span>
                  <div className="flex w-full flex-col self-start">
                    <div className=" flex w-[95%] justify-between gap-4">
                      <div className="h-22 flex w-[50%] flex-col">
                        <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                          htmlFor={`Currency`}
                        >
                          Currency
                        </label>
                        <Field
                          as="select"
                          name={`raising_now.currency`}
                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"


                        >
                          <option name="" value={""}>
                            Select
                          </option>
                          {currenciesList.map((val, index) => (
                            <option key={index} name={val}>
                              {val}
                            </option>
                          ))}
                        </Field>
                        <div className="ms-2 h-3 text-xs text-red-600">
                          <ErrorMessage name={`raising_now.currency`} />
                        </div>
                      </div>
                      <div className="flex w-[50%] flex-col">
                        <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                          htmlFor={`amount`}
                        >
                          Amount
                        </label>
                        <Field
                          name={`raising_now.amount`}
                          placeholder="Enter Amount"


                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"

                        />
                        <div className="ms-2 h-3 text-xs text-red-600">
                          <ErrorMessage
                            name={`raising_now.amount`}
                            component="div"
                            className="text-red-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="ms-2 mb-2 self-start text-md font-[550] capitalize text-[#170F49] underline">
                    Investors Role
                  </span>
                  <div className="flex w-full flex-col self-start">
                    <div className=" flex justify-between gap-4 w-[95%]">
                      <div
                        className={`flex flex-col ${values.investor_role == "Other"
                          ? "w-[50%]"
                          : "w-full"
                          }`}
                      >
                        <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                          htmlFor={``}
                        >
                          Enter Investors Role
                        </label>
                        <Field
                          as="select"
                          name={`investor_role`}
                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"

                        >
                          <option value="">
                            {values.investor_role == ""
                              ? "select"
                              : values.investor_role}
                          </option>

                          {investorsRoleList.map((val, index) => (
                            <option key={index} name={val}>
                              {val}
                            </option>
                          ))}
                        </Field>
                        <div className="ms-2 h-3 text-xs text-red-600">
                          <ErrorMessage name={`investor_role`} />
                        </div>
                      </div>
                      {values.investor_role == "Other" && (
                        <div className="flex flex-col w-[50%]">
                          <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                            htmlFor={`Other`}
                          >
                            Other
                          </label>
                          <Field
                            name="otherOfInvestor_role"
                            placeholder="Enter Other Investors Role"
                            className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"

                          />
                          <div className="ms-2 h-3 text-xs text-red-600">
                            <ErrorMessage name="otherOfInvestor_role" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full p-2 font-bold">
                    Preffered Type of Funding
                  </div>

                  <div className="flex w-full flex-col">
                    <Field
                      as="select"
                      name="preferred_type_of_funding"
                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"

                    >
                      <option value="" className="text-start">
                        select
                      </option>
                      {typeOfFundsList.map((value, index) => (
                        <option
                          className="text-start"
                          key={index}
                          value={value}
                        >
                          {value}
                        </option>
                      ))}
                    </Field>
                    <div className="ms-2 h-3 text-xs text-red-600">
                      <ErrorMessage
                        name="preferred_type_of_funding"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  {/* //////////////////////////// */}

                  {(values.preferred_type_of_funding == "Equity" ||
                    values.preferred_type_of_funding == "Any equity/debt" ||
                    values.preferred_type_of_funding == "Both") && (
                      <>
                        <div className="w-full p-2 font-bold">Equity</div>
                        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
                          <div className="flex w-[98%] flex-col gap-1 lg:w-[33%]">
                            <label
                              className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                              htmlFor="dillution_of_equity"
                            >
                              dilution of equity %
                            </label>
                            <Field
                              placeholder="Enter dilution of equity"
                              className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                              name="if_equity.dillution_of_equity"
                            />
                            <div className="ms-2 h-3 text-xs text-red-600">
                              {touched.if_equity?.dillution_of_equity &&
                                errors.if_equity?.dillution_of_equity}
                            </div>
                          </div>
                          <div className="flex w-[98%] flex-col gap-1 lg:w-[33%]">
                            <label
                              className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                              htmlFor="amount"
                            >
                              amount
                            </label>
                            <Field
                              placeholder="Enter amount"
                              className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                              name="if_equity.amount"
                            />
                            <div className="ms-2 h-3 text-xs text-red-600">
                              {touched.if_equity?.amount &&
                                errors.if_equity?.amount}
                            </div>
                          </div>
                          <div className="flex w-[98%] flex-col gap-1 lg:w-[33%]">
                            <label
                              className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                              htmlFor="company_valuation"
                            >
                              company valuation
                            </label>
                            <Field
                              placeholder="company_valuation"
                              className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                              name="if_equity.company_valuation"
                              disabled={true}
                              value={
                                values.if_equity?.dillution_of_equity &&
                                values.if_equity?.amount &&
                                calculateCompanyValuation(
                                  values.if_equity?.dillution_of_equity,
                                  values.if_equity?.amount,
                                )
                              }
                            />
                            <div className="ms-2 h-3 text-xs text-red-600">
                              {touched.if_equity?.company_valuation &&
                                errors.if_equity?.company_valuation}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  {(values.preferred_type_of_funding == "Debt" ||
                    values.preferred_type_of_funding == "Any equity/debt" ||
                    values.preferred_type_of_funding == "Both") && (
                      <>
                        <div className="w-full p-2 font-bold">Debt</div>
                        <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
                          <div className="flex w-[98%] flex-col gap-1 lg:w-[50%]">
                            <label
                              className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                              htmlFor="amount"
                            >
                              amount
                            </label>
                            <Field
                              placeholder="Enter amount"
                              className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                              name="if_debt.amount"
                            />
                            <div className="ms-2 h-3 text-xs text-red-600">
                              {touched.if_debt?.amount && errors.if_debt?.amount}
                            </div>
                          </div>
                          <div className="flex w-[98%] flex-col gap-1 lg:w-[50%]">
                            <label
                              className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                              htmlFor="company_valuation"
                            >
                              company valuation
                            </label>
                            <Field
                              placeholder="Enter company valuation"
                              className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                              name="if_debt.company_valuation"
                            />
                            <div className="ms-2 h-3 text-xs text-red-600">
                              {touched.if_debt?.company_valuation &&
                                errors.if_debt?.company_valuation}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  <span className="self-start text-lg font-semibold text-[#1C1C1C] lg:text-lg">
                    Funding Reason
                  </span>

                  <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                    <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-6 py-2 lg:w-[50%]">
                      <div className="flex w-full flex-wrap items-center justify-center">
                        <div className="mb-2 w-full">
                          <div className="m-0 flex w-[84%] items-center justify-center gap-1">
                            <label
                              className="m-0 ms-2 w-[42%] pe-9 text-center font-Poppins font-[500] capitalize text-[#170F49]"
                              htmlFor="Type"
                            >
                              Type
                            </label>
                            <label
                              className="m-0 ms-2 w-[42%] pe-4 text-center font-Poppins font-[500] capitalize text-[#170F49]"
                              htmlFor="Holding %"
                            >
                              Holding %
                            </label>
                          </div>
                          <div className="flex w-[3.5rem] items-center"></div>
                        </div>
                        <FieldArray name="funding_reason">
                          {({ push, remove }) => (
                            <div className="w-full  gap-2">
                              {values.funding_reason.map((_, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-0 gap-x-2"
                                >
                                  <div className="flex w-[42%] flex-col">
                                    <Field
                                      as="select"
                                      name={`funding_reason[${index}].funding_reason_type`}
                                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-center text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                    >

                                      <option className="text-start" value="">
                                        {values.funding_reason[index]
                                          .funding_reason_type == ""
                                          ? "select"
                                          : values.funding_reason[index]
                                            .funding_reason_type}
                                      </option>
                                      {fundingReasonList.map((value, index) => (
                                        <option key={index}
                                          className="text-start"
                                          value={value}
                                        >
                                          {value}
                                        </option>
                                      ))}
                                    </Field>
                                    <div className="h-6">

                                      <ErrorMessage
                                        name={`funding_reason[${index}].funding_reason_type`}
                                        component="div"
                                        className="text-sm text-red-600"

                                      />
                                    </div>
                                  </div>
                                  <div className="flex w-[25%] flex-col sm:w-[40%]">

                                    <Field
                                      onKeyUp={(e) => {
                                        checkFundingReasonPercentageFun(
                                          values.funding_reason
                                        );
                                      }}
                                      name={`funding_reason[${index}].percentage`}
                                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                    />
                                    <div className="h-6">
                                      <ErrorMessage
                                        name={`funding_reason[${index}].percentage`}
                                        component="div"
                                        className="text-xs text-red-600"

                                      />
                                    </div>
                                  </div>
                                  <div className="-mt-5 flex w-[3.5rem]">

                                    {index ===
                                      values.funding_reason.length - 1 &&
                                      values.funding_reason[
                                        values.funding_reason.length - 1
                                      ].funding_reason_type !== "" &&
                                      checkfundingReasonPercentage < 100 &&
                                      values.funding_reason[
                                        values.funding_reason.length - 1
                                      ].percentage !== "" && (
                                        <CiCirclePlus
                                          type="button"
                                          className="h-auto w-7 cursor-pointer text-black"
                                          size={30}
                                          onClick={() => {
                                            push({
                                              funding_reason_type: "",
                                              percentage: "",
                                            });
                                            fundingReasonListFun(
                                              values.funding_reason,
                                            );
                                          }}
                                        />
                                      )}
                                    {index > 0 &&
                                      values.funding_reason.length - 1 ==
                                      index && (
                                        <CiCircleMinus
                                          type="button"
                                          className="h-auto w-7 cursor-pointer text-black"
                                          size={30}
                                          onClick={() => {
                                            remove(index);
                                            fundingReasonListFun(
                                              values.funding_reason,
                                              index,
                                            );
                                          }}
                                        />
                                      )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </FieldArray>
                      </div>
                    </div>
                    <div className="flex h-auto w-full flex-col items-center justify-center text-nowrap rounded-lg px-8 py-4 lg:w-[50%]">
                      <div className="w-full lg:h-[20rem]">
                        <PieChart upComing={values.funding_reason} />
                      </div>
                    </div>
                  </div>
                  {/* ///////////////////////// Submit button  ///////////////////////// */}
                  <button
                    type="submit"
                    className="btn btn-primary mt-4 self-start rounded-md px-6 text-[0.8rem] font-[600] lg:text-[1.1rem]"
                  >
                    Continue
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}
