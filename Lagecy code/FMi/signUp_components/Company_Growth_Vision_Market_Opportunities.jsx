"use client";
import CommonHero from "@/components/CommonHero";
import SignUpLinks from "@/components/SignUpLinks";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { getData } from "@/utils/apiCall";
import Graph from "@/components/chart/Graph";
import { currenciesList } from "@/utils/constants/dropDownList";
import MultiSelector from "@/components/helperComponents/ReactSelector";
import { ToastContainer, toast } from "react-toastify";

import { geographyList } from "@/utils/constants/dropDownList";
import LoaderScreenPage from "@/components/helperComponents/Loader";

///////////////////////////////////////
// Set Yup validation schema
///////////////////////////////////////
const companyDetailsSchema = Yup.object().shape({
  marketSize: Yup.array().of(
    Yup.object().shape({
      country: Yup.string(),
      amount: Yup.number()
        .typeError("Amount must be a number")
        .min(0, "Amount cannot be negative"),
      currency: Yup.string(),
    }),
  ),
  currentShare: Yup.array().of(
    Yup.object().shape({
      country: Yup.string(),
      amount: Yup.number()
        .typeError("Amount must be a number")
        .min(0, "Amount cannot be negative"),
      currency: Yup.string(),
    }),
  ),
  your_competitors: Yup.string(),
  currentGeography: Yup.string(),
  why_are_you_different: Yup.string(),
  why_you_and_why_now: Yup.string(),
  revenueYearly: Yup.array().of(
    Yup.object().shape({
      year: Yup.number()
        .typeError("must be number")
        .positive("must be positive")
        .min(1800, "greater than  1800")
        .max(
          new Date().getFullYear(),
          `less than  ${new Date().getFullYear() + 1}`,
        ),
      value: Yup.number()
        .typeError("must be number")
        .positive("must be positive"),
    }),
  ),
  profitYearly: Yup.array().of(
    Yup.object().shape({
      year: Yup.number()
        .typeError("must be number")
        .positive("must be positive")
        .min(1800, "greater than  1800")
        .max(
          new Date().getFullYear(),
          `less than  ${new Date().getFullYear() + 1}`,
        ),
      value: Yup.number()
        .typeError("must be number")
        .positive("must be positive"),
    }),
  ),

  netWorthYearly: Yup.array().of(
    Yup.object().shape({
      year: Yup.number()
        .typeError("must be number")
        .positive("must be positive")
        .min(1800, "greater than  1800")
        .max(
          new Date().getFullYear(),
          `less than  ${new Date().getFullYear() + 1}`,
        ),
      value: Yup.number()
        .typeError("must be number")
        .positive("must be positive"),
    }),
  ),

  revenueQuarterly: Yup.array().of(
    Yup.object().shape({
      quarterly: Yup.string().typeError("must be string"),
      value: Yup.number()
        .typeError("must be number")
        .positive("must be positive"),
    }),
  ),

  profitQuarterly: Yup.array().of(
    Yup.object().shape({
      quarterly: Yup.string().typeError("must be string"),
      value: Yup.number()
        .typeError("must be number")
        .positive("must be positive"),
    }),
  ),
});
/////////////////////////////////
const initialValues = {
  marketSize: [{ country: "", amount: "", currency: "" }],
  currentShare: [{ country: "", percentage: "", value: "" }],
  your_competitors: "",
  why_are_you_different: "",
  why_you_and_why_now: "",
  currentGeography: "",
  revenueYearly: [{ year: "", value: "" }],
  profitYearly: [{ year: "", value: "" }],
  netWorthYearly: [{ year: "", value: "" }],
  revenueQuarterly: [
    { quarter: "Quarter 1", value: "" },
    { quarter: "Quarter 2", value: "" },
    { quarter: "Quarter 3", value: "" },
    { quarter: "Quarter 4", value: "" },
    { quarter: "Quarter 5", value: "" },
  ],
  profitQuarterly: [
    { quarter: "Quarter 1", value: "" },
    { quarter: "Quarter 2", value: "" },
    { quarter: "Quarter 3", value: "" },
    { quarter: "Quarter 4", value: "" },
    { quarter: "Quarter 5", value: "" },
  ],
};

// ///////////////////////////// Component Main FUNCTION /////////////////////////////////////////
// ///////////////////////////// Component Main FUNCTION /////////////////////////////////////////
// ///////////////////////////// Component Main FUNCTION /////////////////////////////////////////
// ///////////////////////////// Component Main FUNCTION /////////////////////////////////////////
const CompnayGrowth = ({ changeForm }) => {
  async function fillFields(values, setValues) {
    // console.log(localStorage.getItem("userData"));
    // do something...
    return;
  }

  // ////////////////////////State////////////////////////
  const [financialMatrixTime, setFinancialMatrixTime] = useState({
    yearly: true,
    quarterly: false,
  });
  const [geographySelectionList, setGeographySelectionList] = React.useState();

  const [financialMatrixTimeYears, setFinancialMatrixTimeYears] = useState({
    Revenue: true,
    Profit: false,
    NetProfit: false,
  });

  const [financialMatrixTimeQuaterly, setFinancialMatrixTimeQuaterly] =
    useState({ Revenue: true, Profit: false });

  const [fethedCountriesList, setFethedCountriesList] = useState([]);
  const [fethedContinentsList, setFethedContinentsList] = useState([]);

  // ///////////////////// navigation /////////////////////
  const router = useRouter();
  // console.log(globalState);
  const [loading, setLoadig] = useState(false);

  /////////////////////

  const [countriesList, setCountriesList] = useState([]);
  const [continents, setContinents] = useState([]);

  const [jwtToken, setJwtToken] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) {
        setJwtToken(token);
      }
    }
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////

  ///////////// API Call //////////////

  useEffect(() => {
    (async () => {
      try {
        setLoadig(true);
        const [countriesResult, continentsResult] = await Promise.all([
          getData("/master/countries"),
          getData("/master/continents"),
        ]);

        console.log(
          "API call result ---> : ",
          countriesResult,
          continentsResult,
        );

        setCountriesList(countriesResult.data);
        setContinents(continentsResult.data);

        setFethedCountriesList(
          countriesResult.data.map((obj) => obj.country_name),
        );
        setFethedContinentsList(
          continentsResult.data.map((obj) => obj.continent_name),
        );

        console.log("fethedCountriesList", fethedCountriesList);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadig(false);
      }
    })();
  }, []);

  ////////////////////
  /////////////////// API call to save company details//////////////////////
  async function saveCompnayGrowth(values) {
    setLoadig(true);

    const compnayGrowthDetails = {
      ...values,
      user_id:
        window && typeof window !== undefined
          ? JSON.parse(window.localStorage.getItem("userData")).primaryObjectID
          : "",
      [`${(values.currentGeography == "Country" && "country") ||
        (values.currentGeography == "Continents" && "continents")
        }`]: geographySelectionList,
    };

    // not to add in payload
    delete compnayGrowthDetails.currentGeography;

    console.log("before API call \ncompany details --> ", compnayGrowthDetails);
    console.log(jwtToken);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FMI_URL}/growth`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + jwtToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(compnayGrowthDetails),
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
        // router.push("/Sign_Up/Funding_Ask");
      }
    } catch (er) {
      console.log(er);
    } finally {
      setLoadig(false);
    }
  }

  ///////////////////////////////////// JSX ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////
  return (
    <>
      {/* {loading && <LoaderScreenPage />} */}

      <div className="text-nowrap bg-[#FFFFFF]">
        <ToastContainer position="top-right" autoClose={5000} />

        <div className="flex w-full flex-col justify-center">
          <Formik
            initialValues={initialValues}
            validationSchema={companyDetailsSchema}
            onSubmit={(values, action) => {
              const financialMatrixTimeValue = financialMatrixTime.yearly
                ? "yearly"
                : "quarterly";
              console.log(values, financialMatrixTimeValue);
              saveCompnayGrowth(values);
            }}
            className="flex w-full justify-center"
          >
            {({
              values,
              handleSubmit,
              handleChange,
              handleBlur,
              setValues,
            }) => {
              useEffect(() => {
                fillFields(values, setValues);
              }, [setValues]);

              return (
                <Form
                  className="rounded- lg flex flex-col items-center justify-center gap-0 bg-[#FFFFFF] p-8 text-black shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)]"
                  onSubmit={handleSubmit}
                >
                  {console.log(values)}
                  {/* ///////////////////////marketSize///////////////////////////// */}

                  <div className="flex w-full flex-wrap items-center justify-center gap-4 lg:flex-row lg:gap-8">
                    <FieldArray name="marketSize" className="flex w-[98%]">
                      {({ push, remove }) => (
                        <div className="w-full">
                          <label className="ms-2 text-sm font-[550] capitalize text-[#170F49] underline">
                            Global MarketSize
                          </label>
                          {values.marketSize.map((MarketSize, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-0 gap-x-2"
                            >
                              <div className="flex w-[95%] flex-col lg:w-[30%]">
                                <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]">
                                  Country
                                </label>
                                <Field
                                  as="select"
                                  name={`marketSize[${index}].country`}
                                  className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                >
                                  <option value="">Select</option>

                                  {countriesList.map((value, index) => (
                                    <option key={index} value={value._id}>
                                      {value.country_name}
                                    </option>
                                  ))}
                                </Field>
                                <div className="ms-2 h-3 text-xs text-red-600">
                                  <ErrorMessage
                                    name={`marketSize[${index}].country`}
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="flex w-[95%] flex-col lg:w-[30%]">
                                <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]">
                                  Currency
                                </label>
                                <Field
                                  as="select"
                                  name={`marketSize[${index}].currency`}
                                  className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                >
                                  <option value="">Select</option>

                                  {currenciesList.map((value, index) => (
                                    <option key={index} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </Field>
                                <div className="ms-2 h-3 text-xs text-red-600">
                                  <ErrorMessage
                                    name={`marketSize[${index}].currency`}
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="flex w-[95%] flex-col lg:w-[30%]">
                                <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]">
                                  Amount
                                </label>
                                <Field
                                  name={`marketSize[${index}].amount`}
                                  className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                />
                                <div className="ms-2 h-3 text-xs text-red-600">
                                  <ErrorMessage
                                    name={`marketSize[${index}].amount`}
                                    component="div"
                                  />
                                </div>
                              </div>

                              <div className="flex w-[3.5rem] items-center justify-center">
                                {index === values.marketSize.length - 1 && (
                                  <CiCirclePlus
                                    type="button"
                                    className="h-auto w-7 cursor-pointer text-black"
                                    size={30}
                                    onClick={() =>
                                      push({
                                        country: "",
                                        amount: "",
                                        currency: "",
                                      })
                                    }
                                  />
                                )}
                                {index > 0 &&
                                  values.marketSize.length - 1 == index && (
                                    <CiCircleMinus
                                      type="button"
                                      className="h-auto w-7 cursor-pointer text-black"
                                      size={30}
                                      onClick={() => remove(index)}
                                    />
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>
                  <div className="flex w-full flex-wrap items-center justify-center gap-8">
                    <FieldArray name="currentShare">
                      {({ push, remove }) => (
                        <div className="w-full">
                          <label className="ms-2 text-sm font-[550] capitalize text-[#170F49] underline">
                            Current Market Share
                          </label>
                          {values.currentShare.map((MarketSize, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-0 gap-x-2"
                            >
                              <div className="flex w-[95%] flex-col lg:w-[30%]">
                                <label className="ms-2 font-[500] text-[#170F49]">
                                  Country
                                </label>
                                <Field
                                  as="select"
                                  name={`currentShare[${index}].country`}
                                  className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                >
                                  <option value="">Select</option>

                                  {countriesList.map((value) => (
                                    <option key={value._id} value={value._id}>
                                      {value.country_name}
                                    </option>
                                  ))}
                                </Field>
                                <div className="ms-2 h-3 text-xs text-red-600">
                                  <ErrorMessage
                                    name={`currentShare[${index}].country`}
                                    component="div"
                                  />
                                </div>
                              </div>

                              <div className="flex w-[95%] flex-col lg:w-[30%]">
                                <label className="ms-2 font-[500] text-[#170F49]">
                                  share %
                                </label>
                                <Field
                                  placeholder="Enter percentage"
                                  name={`currentShare[${index}].percentage`}
                                  className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                />
                                <div className="ms-2 h-3 text-xs text-red-600">
                                  <ErrorMessage
                                    name={`currentShare[${index}].percentage`}
                                    component="div"
                                    className="text-red-600"
                                  />
                                </div>
                              </div>
                              <div className="flex w-[95%] flex-col lg:w-[30%]">
                                <label className="ms-2 text-sm font-[550] capitalize text-[#170F49]">
                                  Value
                                </label>
                                <Field
                                  // as="select"
                                  type="text"
                                  name={`currentShare[${index}].value`}
                                  className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                />
                                {/* <option value="">Select</option>

                                {currenciesList.map((value, index) => (
                                  <option key={index} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </Field> */}
                                <div className="ms-2 h-3 text-xs text-red-600">
                                  <ErrorMessage
                                    name={`currentShare[${index}].value`}
                                    component="div"
                                  />
                                </div>
                              </div>
                              <div className="flex w-[3.5rem] items-center justify-center">
                                {index === values.currentShare.length - 1 && (
                                  <CiCirclePlus
                                    type="button"
                                    className="h-auto w-7 cursor-pointer text-black"
                                    size={30}
                                    onClick={() =>
                                      push({
                                        country: "",
                                        percentage: "",
                                        value: "",
                                      })
                                    }
                                  />
                                )}
                                {index > 0 &&
                                  values.currentShare.length - 1 && (
                                    <CiCircleMinus
                                      type="button"
                                      className="h-auto w-7 cursor-pointer text-black"
                                      size={30}
                                      onClick={() => remove(index)}
                                    />
                                  )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="flex w-full flex-col gap-0">
                    <label
                      className="ms-2 font-[500] text-[#170F49]"
                      htmlFor="your_competitors"
                    >
                      Your Competitors
                    </label>
                    <textarea
                      name="your_competitors"
                      placeholder="write about your competitors"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                    />
                    <div className="ms-2 h-3 text-xs text-red-600">
                      <ErrorMessage name="your_competitors" component="div" />
                    </div>
                  </div>
                  <div className="flex w-[100%] flex-col gap-1">
                    <label
                      className="ms-2 font-[500] text-[#170F49]"
                      htmlFor="why_are_you_different"
                    >
                      Why are you different ?
                    </label>
                    <textarea
                      name="why_are_you_different"
                      placeholder="Enter why are you different"
                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    <div className="ms-2 h-3 text-xs text-red-600">
                      <ErrorMessage
                        name="why_are_you_different"
                        component="div"
                      />
                    </div>
                  </div>
                  <div className="flex w-[100%] flex-col gap-1">
                    <label
                      className="ms-2 font-[500] text-[#170F49]"
                      htmlFor="why_you_and_why_now"
                    >
                      Why you and why now ?
                    </label>
                    <textarea
                      name="why_you_and_why_now"
                      placeholder="Enter why you and why now"
                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                    <div className="ms-2 h-3 text-xs text-red-600">
                      <ErrorMessage
                        name="why_you_and_why_now"
                        component="div"
                      />
                    </div>
                  </div>


                  {/* ///////////////////////// Financial Matrix  ///////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                  <div className="flex w-full flex-col items-center justify-between gap-2 px-8 py-8 lg:flex-row-reverse">
                    <div className="flex h-[2.5rem] w-[12rem] justify-between rounded-full shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none">
                      <div
                        className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTime.yearly
                          ? "bg-[#0066C5] text-white"
                          : "text-black"
                          }`}
                        onClick={() =>
                          setFinancialMatrixTime({
                            yearly: true,
                            quarterly: false,
                          })
                        }
                      >
                        Yearly
                      </div>
                      <div
                        className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTime.quarterly
                          ? "bg-[#0066C5] text-white"
                          : "text-black"
                          }`}
                        onClick={() =>
                          setFinancialMatrixTime({
                            yearly: false,
                            quarterly: true,
                          })
                        }
                      >
                        Quarterly
                      </div>
                    </div>
                    {financialMatrixTime.yearly && (
                      <div className="borde flex h-[2.5rem] w-[15rem] rounded-full border-[#d15f9f] bg-[#FFFFFF] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none lg:w-[22rem]">
                        <div
                          className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTimeYears.Revenue
                            ? "bg-[#0066C5] text-white"
                            : "text-black"
                            }`}
                          onClick={() =>
                            setFinancialMatrixTimeYears({
                              Revenue: true,
                              Profit: false,
                              NetProfit: false,
                            })
                          }
                        >
                          Revenue
                        </div>
                        <div
                          className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTimeYears.Profit
                            ? "bg-[#0066C5] text-white"
                            : "text-black"
                            }`}
                          onClick={() =>
                            setFinancialMatrixTimeYears({
                              Revenue: false,
                              Profit: true,
                              NetProfit: false,
                            })
                          }
                        >
                          Profit
                        </div>
                        <div
                          className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTimeYears.NetProfit
                            ? "bg-[#0066C5] text-white"
                            : "text-black"
                            }`}
                          onClick={() =>
                            setFinancialMatrixTimeYears({
                              Revenue: false,
                              Profit: false,
                              NetProfit: true,
                            })
                          }
                        >
                          Net Worth
                        </div>
                      </div>
                    )}

                    {financialMatrixTime.quarterly && (
                      <div className="flex h-[2.5rem] w-[14.8rem] rounded-full shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)]">
                        <div
                          className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTimeQuaterly.Revenue
                            ? "bg-[#0066C5] text-white"
                            : "text-black"
                            }`}
                          onClick={() =>
                            setFinancialMatrixTimeQuaterly({
                              Revenue: true,
                              Profit: false,
                            })
                          }
                        >
                          Revenue
                        </div>
                        <div
                          className={`m-0 flex h-full w-[50%] cursor-pointer items-center justify-center rounded-full border-none py-2 text-sm font-light shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] transition-colors lg:py-2 ${financialMatrixTimeQuaterly.Profit
                            ? "bg-[#0066C5] text-white"
                            : "text-black"
                            }`}
                          onClick={() =>
                            setFinancialMatrixTimeQuaterly({
                              Revenue: false,
                              Profit: true,
                            })
                          }
                        >
                          Profit
                        </div>
                      </div>
                    )}
                  </div>
                  {/* /////////////////////////////// Yearly /////////////////////////////////// */}
                  {/* /////////////////////////////// Yearly /////////////////////////////////// */}
                  {/*/////////////////////////////////////////// Revenue //////////////////////////// */}
                  {financialMatrixTime.yearly &&
                    financialMatrixTimeYears.Revenue && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-6 py-2 lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center">
                            <div className="mb-2 w-full font-Poppins">
                              <div className="m-0 flex w-[84%] items-center justify-center gap-1">
                                <label
                                  className="m-0 ms-2 w-[42%] pe-9 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="Year"
                                >
                                  Year
                                </label>
                                <label
                                  className="m-0 ms-2 w-[42%] pe-4 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="value"
                                >
                                  value
                                </label>
                              </div>
                              <div className="flex w-[3.5rem] items-center"></div>
                            </div>

                            <FieldArray name="revenueYearly">
                              {({ push, remove }) => (
                                <div className="m-0 w-full p-0">
                                  {values.revenueYearly.map((_, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-0 gap-x-2"
                                    >
                                      <div className="flex w-[42%] flex-col">
                                        <Field
                                          type="text"
                                          name={`revenueYearly[${index}].year`}
                                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                          placeholder="Ex.(2024)"
                                          disabled={index > 0}
                                        />
                                        <div className="h-6">
                                          <ErrorMessage
                                            className="h-full w-full text-xs text-red-600"
                                            component="div"
                                            name={`revenueYearly[${index}].year`}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex w-[42%] flex-col">
                                        <Field
                                          name={`revenueYearly[${index}].value`}
                                          placeholder="Value"
                                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                        />
                                        <div className="">
                                          <div className="h-6">
                                            <ErrorMessage
                                              className="h-full w-full text-xs text-red-600"
                                              component="div"
                                              name={`revenueYearly[${index}].value`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="-mt-5 flex w-[3.5rem]">

                                        {index ===
                                          values.revenueYearly.length - 1 &&
                                          index < 4 &&
                                          values.revenueYearly[
                                            values.revenueYearly.length - 1
                                          ].year !== "" &&
                                          values.revenueYearly[
                                            values.revenueYearly.length - 1
                                          ].value !== "" && (
                                            <CiCirclePlus
                                              type="button"
                                              className="h-7 w-7 cursor-pointer text-black"
                                              size={30}
                                              onClick={() => {
                                                push({
                                                  year:
                                                    values.revenueYearly[0]
                                                      .year -
                                                    (index + 1),
                                                  value: "",
                                                });
                                              }}
                                            />
                                          )}
                                        {index >
                                          values.revenueYearly.length - 2 &&
                                          index !== 0 && (
                                            <CiCircleMinus
                                              type="button"
                                              className="h-7 w-7 cursor-pointer text-black"
                                              size={30}
                                              onClick={() => {
                                                remove(index);
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
                        <div className="auto flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 lg:w-[50%]">
                          <div>
                            <h4 className="text-center font-Poppins text-[1.3rem] font-bold text-[#2E2E30]">
                              Graph
                            </h4>
                            <p className="text-[0.9rem] text-[#2E2E30]">
                              Revenue as per Yearly
                            </p>
                          </div>
                          <div className="h-[17rem] w-[95%]">
                            <Graph graphData={values.revenueYearly} />
                          </div>
                        </div>
                      </div>
                    )}

                  {/*/////////////////////////////////////////// Profit Graph //////////////////////////// */}
                  {financialMatrixTime.yearly &&
                    financialMatrixTimeYears.Profit && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-6 py-2 lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center">
                            <div className="mb-2 w-full font-Poppins">
                              <div className="m-0 flex w-[84%] items-center justify-center gap-1">
                                <label
                                  className="m-0 ms-2 w-[42%] pe-9 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="Year"
                                >
                                  Year
                                </label>
                                <label
                                  className="m-0 ms-2 w-[42%] pe-4 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="value"
                                >
                                  value
                                </label>
                              </div>
                              <div className="flex w-[3.5rem] items-center"></div>
                            </div>
                            <FieldArray name="profitYearly">
                              {({ push, remove }) => (
                                <div className="m-0 w-full p-0">
                                  {values.profitYearly.map((_, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-0 gap-x-2"
                                    >
                                      <div className="flex w-[42%] flex-col">
                                        <Field
                                          type="text"
                                          name={`profitYearly[${index}].year`}
                                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                          placeholder="Ex.(2024)"
                                          disabled={index > 0}
                                        />
                                        <div className="h-6 text-xs text-red-600">
                                          <ErrorMessage
                                            name={`profitYearly[${index}].year`}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex w-[42%] flex-col">
                                        <Field
                                          name={`profitYearly[${index}].value`}
                                          placeholder="Value"
                                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                        />
                                        <div className="h-6 text-xs text-red-600">
                                          <ErrorMessage
                                            name={`profitYearly[${index}].value`}
                                          />
                                        </div>
                                      </div>
                                      <div className="-mt-5 flex w-[3.5rem]">
                                        {index ===
                                          values.profitYearly.length - 1 &&
                                          index < 4 &&
                                          values.profitYearly[
                                            values.profitYearly.length - 1
                                          ].year !== "" &&
                                          values.profitYearly[
                                            values.profitYearly.length - 1
                                          ].value !== "" && (
                                            <CiCirclePlus
                                              type="button"
                                              className="h-auto w-7 cursor-pointer text-black"
                                              size={30}
                                              onClick={() => {
                                                push({
                                                  year:
                                                    values.profitYearly[0]
                                                      .year -
                                                    (index + 1),
                                                  value: "",
                                                });
                                              }}
                                            />
                                          )}
                                        {index >
                                          values.profitYearly.length - 2 &&
                                          index !== 0 && (
                                            <CiCircleMinus
                                              type="button"
                                              className="h-auto w-7 cursor-pointer text-black"
                                              size={30}
                                              onClick={() => {
                                                remove(index);
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
                        <div className="auto flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 lg:w-[50%]">
                          <div>
                            <h4 className="text-center font-Poppins text-[1.3rem] font-bold text-[#2E2E30]">
                              Graph
                            </h4>
                            <p className="text-[0.9rem] text-[#2E2E30]">
                              Profit as per Yearly
                            </p>
                          </div>
                          <div className="h-[17rem] w-[95%]">
                            <Graph graphData={values.profitYearly} />
                          </div>
                        </div>
                      </div>
                    )}

                  {/*/////////////////////////////////////////// Profit Graph //////////////////////////// */}
                  {financialMatrixTime.yearly &&
                    financialMatrixTimeYears.NetProfit && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-6 py-2 lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center">
                            <div className="mb-2 w-full font-Poppins">
                              <div className="m-0 flex w-[84%] items-center justify-center gap-1">
                                <label
                                  className="m-0 ms-2 w-[42%] pe-9 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="Year"
                                >
                                  Year
                                </label>
                                <label
                                  className="m-0 ms-2 w-[42%] pe-4 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="value"
                                >
                                  value
                                </label>
                              </div>
                              <div className="flex w-[3.5rem] items-center"></div>
                            </div>
                            <FieldArray name="netWorthYearly">
                              {({ push, remove }) => (
                                <div className="m-0 w-full p-0">
                                  {values.netWorthYearly.map((_, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-0 gap-x-2"
                                    >
                                      <div className="flex w-[42%] flex-col">
                                        <Field
                                          type="text"
                                          name={`netWorthYearly[${index}].year`}
                                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                          placeholder="Ex.(2024)"
                                          disabled={index > 0}
                                        />
                                        <div className="h-6">
                                          <ErrorMessage
                                            className="h-full w-full text-xs text-red-600"
                                            component="div"
                                            name={`netWorthYearly[${index}].year`}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex w-[42%] flex-col">
                                        <Field
                                          name={`netWorthYearly[${index}].value`}
                                          placeholder="Value"
                                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                        />
                                        <div className="">
                                          <div className="h-6">
                                            <ErrorMessage
                                              className="h-full w-full text-xs text-red-600"
                                              component="div"
                                              name={`netWorthYearly[${index}].value`}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="-mt-5 flex w-[3.5rem]">

                                        {index ===
                                          values.netWorthYearly.length - 1 &&
                                          index < 4 &&
                                          values.netWorthYearly[
                                            values.netWorthYearly.length - 1
                                          ].year !== "" &&
                                          values.netWorthYearly[
                                            values.netWorthYearly.length - 1
                                          ].value !== "" && (
                                            <CiCirclePlus
                                              type="button"
                                              className="h-7 w-7 cursor-pointer text-black"
                                              size={30}
                                              onClick={() => {
                                                push({
                                                  year:
                                                    values.netWorthYearly[0]
                                                      .year -
                                                    (index + 1),
                                                  value: "",
                                                });
                                              }}
                                            />
                                          )}
                                        {index >
                                          values.netWorthYearly.length - 2 &&
                                          index !== 0 && (
                                            <CiCircleMinus
                                              type="button"
                                              className="h-7 w-7 cursor-pointer text-black"
                                              size={30}
                                              onClick={() => {
                                                remove(index);
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

                        <div className="auto flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 lg:w-[50%]">
                          <div>
                            <h4 className="text-center font-Poppins text-[1.3rem] font-bold text-[#2E2E30]">
                              Graph
                            </h4>
                            <p className="text-[0.9rem] text-[#2E2E30]">
                              Net Worth as per Yearly
                            </p>
                          </div>
                          <div className="h-[17rem] w-[95%]">
                            <Graph graphData={values.netWorthYearly} />
                          </div>
                        </div>
                      </div>
                    )}

                  {/* /////////////////////////////// Quarterly /////////////////////////////////// */}
                  {/* /////////////////////////////// Quarterly /////////////////////////////////// */}

                  {/* /////////////////////////////// revenue /////////////////////////////////// */}
                  {financialMatrixTime.quarterly &&
                    financialMatrixTimeQuaterly.Revenue && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-6 py-2 lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center">
                            <div className="mb-2 w-full font-Poppins">
                              <div className="m-0 flex w-[84%] items-center justify-center gap-1">
                                <label
                                  className="m-0 ms-2 w-[42%] pe-9 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="quarterly"
                                >
                                  Quarterly
                                </label>

                                <label
                                  className="m-0 ms-2 w-[42%] pe-4 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="value"
                                >
                                  value
                                </label>
                              </div>
                              <div className="flex w-[3.5rem] items-center"></div>
                            </div>
                            <FieldArray name="revenueQuarterly">
                              <div className="m-0 w-full p-0">
                                {values.revenueQuarterly.map((obj, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-0 gap-x-2"
                                  >
                                    <div className="flex w-[42%] flex-col">
                                      <Field
                                        type="text"
                                        name={`revenueQuarterly[${index}].quarterly`}
                                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                        placeholder={obj.quarter}
                                        disabled={true}
                                      />

                                      <div className="h-6">
                                        <ErrorMessage
                                          name={`revenueQuarterly[${index}].quarterly`}
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex w-[42%] flex-col">
                                      <Field
                                        name={`revenueQuarterly[${index}].value`}
                                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                      />
                                      <div className="h-6">
                                        <ErrorMessage
                                          name={`revenueQuarterly[${index}].value`}
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </FieldArray>
                          </div>
                        </div>

                        <div className="auto flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 lg:w-[50%]">
                          <div>
                            <h4 className="text-center font-Poppins text-[1.3rem] font-bold text-[#2E2E30]">
                              Graph
                            </h4>
                            <p className="text-[0.9rem] text-[#2E2E30]">
                              Revenue as per Quarterly
                            </p>
                          </div>
                          <div className="h-[17rem] w-[95%]">
                            <Graph graphData={values.revenueQuarterly} />
                          </div>
                        </div>
                      </div>
                    )}

                  {/* /////////////////////////////// Profit /////////////////////////////////// */}
                  {financialMatrixTime.quarterly &&
                    financialMatrixTimeQuaterly.Profit && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-6 py-2 lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center">
                            <div className="mb-2 w-full font-Poppins">
                              <div className="m-0 flex w-[84%] items-center justify-center gap-1">
                                <label
                                  className="m-0 ms-2 w-[42%] pe-9 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="quarterly"
                                >
                                  Quarterly
                                </label>
                                <label
                                  className="m-0 ms-2 w-[42%] pe-4 text-center font-[500] capitalize text-[#170F49]"
                                  htmlFor="value"
                                >
                                  value
                                </label>
                              </div>
                              <div className="flex w-[3.5rem] items-center"></div>
                            </div>

                            <FieldArray name="profitQuarterly">
                              <div className="m-0 w-full p-0">
                                {values.profitQuarterly.map((obj, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-0 gap-x-2"
                                  >
                                    <div className="flex w-[42%] flex-col">
                                      <Field
                                        name={`profitQuarterly[${index}].quarterly`}
                                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                        placeholder={obj.quarter}
                                        disabled={true}
                                      />
                                      <div className="h-6">
                                        <ErrorMessage
                                          name={`profitQuarterly[${index}].quarterly`}
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                    <div className="flex w-[42%] flex-col">
                                      <Field
                                        name={`profitQuarterly[${index}].value`}
                                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                      />
                                      <div className="h-6">
                                        <ErrorMessage
                                          name={`profitQuarterly[${index}].value`}
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </FieldArray>
                          </div>
                        </div>

                        <div className="auto flex w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 lg:w-[50%]">
                          <div>
                            <h4 className="text-center font-Poppins text-[1.3rem] font-bold text-[#2E2E30]">
                              Graph
                            </h4>
                            <p className="text-[0.9rem] text-[#2E2E30]">
                              Profit as per Quarterly
                            </p>
                          </div>
                          <div className="h-[17rem] w-[95%]">
                            <Graph graphData={values.profitQuarterly} />
                          </div>
                        </div>
                      </div>
                    )}
                  {/* ///////////////////////// Submit button  ///////////////////////// */}
                  <button
                    type="submit"
                    className="btn btn-primary self-start rounded-full px-8 text-[0.8rem] font-[600] text-white lg:text-[1.1rem]"
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
};

export default CompnayGrowth;
