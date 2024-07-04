/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Graph from "@/components/chart/Graph";
import * as React from "react";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { getData } from "@/utils/apiCall";
import MultiSelector from "@/components/helperComponents/ReactSelector";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PieChart from "@/components/chart/PieChart";
import LoaderScreenPage from "@/components/helperComponents/Loader";
import {
  countriesList,
  statesInIndiaList,
  industriesList,
  productsServicesList,
  geographyList,
  stageOfCompanyList,
  continents,
  shareholdingPatternList,
} from "@/utils/constants/dropDownList";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

///////////////////////////////////////
// Set Yup validation schema
///////////////////////////////////////
const companyDetailsSchema = Yup.object().shape({
  companyName: Yup.string().required("Required"),
  website: Yup.string().url("Invalid URL").required("Required"),
  parentCompany: Yup.array().of(Yup.string()),
  industry: Yup.string().required("Required"),
  name: Yup.string().required("Required"),
  email: Yup.object().shape({
    personal: Yup.string().email("Invalid email"),
    professional: Yup.string().email("Invalid email"),
    linkedIn: Yup.string().url("Invalid URL"),
  }),
  country: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  productsNServices: Yup.string().required("Required"),
  shareholdingPatterns: Yup.array().of(
    Yup.object().shape({
      shareholder_type: Yup.string(),
      shareholder_holding: Yup.number()
        .typeError("Must be number")
        .positive("must be positive"),
    }),
  ),
  started: Yup.string().required("Required"),
  currentGeography: Yup.string(),
  company_type_explaination: Yup.string().required("Required"),
  stageOfTheCompany: Yup.string(),
  description: Yup.string().required("required"),
  typeOfCompany: Yup.string(),
  // .required("Required"),
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
  companyName: "",
  parentCompany: [""],
  website: "",
  name: "",
  email: {
    personal: "",
    professional: "",
    linkedIn: "",
  },
  industry: "",
  country: "",
  state: "",
  productsNServices: "",
  company_type_explaination: "",

  shareholdingPatterns: [
    {
      shareholder_type: "",
      shareholder_holding: "",
    },
  ],
  currentGeography: "",
  stageOfTheCompany: "",
  started: "",
  description: "",
  typeOfCompany: "",
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

const CompanyDetailsResults = ({ changeForm }) => {
  const [startedDate, setStartedDate] = React.useState();
  const [geographySelectionList, setGeographySelectionList] = React.useState();

  const [financialMatrixTime, setFinancialMatrixTime] = useState({
    yearly: true,
    quarterly: false,
  });

  const [financialMatrixTimeYears, setFinancialMatrixTimeYears] = useState({
    Revenue: true,
    Profit: false,
    NetProfit: false,
  });

  const [financialMatrixTimeQuaterly, setFinancialMatrixTimeQuaterly] =
    useState({ Revenue: true, Profit: false });

  const [checkShareHolderPercentage, SetCheckShareHolderPercentage] =
    useState(0);

  // ///////////////////// navigation /////////////////////
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) {
        setJwtToken(token);
      }
    }
  }, []);
  //////////////////////////////////////////////////////////////////
  // Get the current year in UTC
  // Function to store the last 40 years in an array
  function storeYear() {
    let date = new Date().getUTCFullYear();
    let YearList = [];
    for (let i = 0; i <= 50; i++) {
      YearList.push(date - i);
    }
    return YearList;
  }

  const shareHoldingPattern = structuredClone(shareholdingPatternList);

  const [DynamicShareholdingPatternList, setDynamicShareholdingPatternList] =
    useState(shareholdingPatternList);

  function DynamicShareholdingPatternListFun(shareholdingPatterns, index = "") {
    setDynamicShareholdingPatternList(shareHoldingPattern);

    let tempDynamicShareholdingPatternList = structuredClone(
      DynamicShareholdingPatternList,
    );

    if (index && typeof index === "number") {
      const removedItem = shareholdingPatterns.at(index);

      const updatedShareholdingPatterns = shareholdingPatterns.filter(
        (item, index) => item !== removedItem,
      );

      checkShareHolderPercentageFun(updatedShareholdingPatterns);
      const selectedOptions = shareholdingPatterns.map(
        (item) => item.shareholder_type,
      );

      const remainingItem = shareHoldingPattern.filter(
        (item) => !selectedOptions.includes(item),
      );
      remainingItem.push(removedItem.shareholder_type);

      tempDynamicShareholdingPatternList = remainingItem;
    } else {
      shareholdingPatterns
        .map((obj) => obj.shareholder_type)
        .map((selectedOption) => {
          let findINdex =
            tempDynamicShareholdingPatternList.indexOf(selectedOption);
          if (findINdex !== -1) {
            tempDynamicShareholdingPatternList.splice(findINdex, 1);
          }
        });
    }

    setDynamicShareholdingPatternList(tempDynamicShareholdingPatternList);
  }

  function checkShareHolderPercentageFun(shareholdingPatterns) {
    console.log(shareholdingPatterns);
    // console.log(currentValue);
    const percentage = shareholdingPatterns.reduce(
      (accumulator, currentValue) => {
        if (typeof parseInt(currentValue.shareholder_holding) == "number")
          return (
            parseInt(currentValue.shareholder_holding) + accumulator
            // parseInt(currentValue)
          );
        return accumulator;
      },
      0,
    );

    SetCheckShareHolderPercentage(percentage);
    if (percentage > 100) {
      toast.error("Should not be more than 100%");
    }
    console.log(checkShareHolderPercentage);
  }
  /////////////////// API call to save company details//////////////////////
  async function saveCompanyDetails(values) {
    // setLoadig(true);
    if (
      values.email.personal == "" &&
      values.email.professional == "" &&
      values.email.linkedIn == ""
    ) {
      toast.error("Please fill altest one email");
      return;
    }

    // use in future
    const compayDetails = {
      ...values,
      user_id:
        window && typeof window !== undefined
          ? JSON.parse(window.localStorage.getItem("userData")).primaryObjectID
          : "",
      [`${(values.currentGeography == "Country" && "countryGeography") ||
        (values.currentGeography == "Continents" && "continentalGeography")
        }`]: geographySelectionList,
    };

    // not to add in payload
    delete compayDetails.currentGeography;

    console.log("before API call \ncompany details --> ", compayDetails);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FMI_URL}/company`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + jwtToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(compayDetails),
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
        // router.push("/Sign_Up/Company_Growth_Vision_&_Market_Opportunities");
      }
    } catch (er) {
      console.log(er);
    } finally {
      // setLoadig(false);
    }
  }

  return (
    <>
      {/* {loading && <LoaderScreenPage />} */}
      <div className="text-nowrap bg-[#FFFFFF]">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="flex w-full flex-col justify-center ">
          <Formik
            initialValues={initialValues}
            validationSchema={companyDetailsSchema}
            onSubmit={(values, action) => {
              saveCompanyDetails(values);
            }}
            className="flex w-full justify-center"
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setValues,
              getFieldProps,
            }) => {
              return (
                <Form
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] p-4 shadow-md md:p-8 lg:w-full"
                  onSubmit={handleSubmit}
                >
                  {/* //////////////////////// Company details //////////////////////// */}
                  <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:gap-8">
                    <div className="flex w-[98%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="companyName"
                      >
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Enter Your Company name"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        value={values.companyName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.companyName && errors.companyName}
                      </div>
                    </div>
                    <div className="flex w-[98%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="name"
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Your name"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.name && errors.name && errors.name}
                      </div>
                    </div>
                    <div className="flex w-[98%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="website"
                      >
                        Website *
                      </label>
                      <input
                        type="text"
                        name="website"
                        placeholder="Enter Your Website"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        value={values.website}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.website && errors.website && errors.website}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="email.personal"
                      >
                        Personal Email ID
                      </label>
                      <input
                        type="text"
                        name="email.personal"
                        placeholder="Enter Your Personal Email ID"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email.personal}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.email?.personal && errors.email?.personal}
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="email.personal"
                      >
                        Professional Email ID
                      </label>
                      <input
                        type="text"
                        name="email.professional"
                        placeholder="Enter Your professional  Email ID"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.email?.professional &&
                          errors.email?.professional}
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-1 lg:w-[50%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="email.personal"
                      >
                        LinkedIn ID
                      </label>
                      <input
                        type="text"
                        name="email.linkedIn"
                        placeholder="Enter Your LinkedIn Id"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.email?.linkedIn && errors.emai?.linkedIn}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="flex w-[98%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="Country"
                      >
                        Country *
                      </label>
                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="country"
                      >
                        <option value="">Select</option>
                        {countriesList.map((countryName, index) => (
                          <option key={index} value={countryName}>
                            {countryName}
                          </option>
                        ))}
                      </Field>
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.country && errors.country && errors.country}
                      </div>
                    </div>

                    <div className="flex w-[98%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="state"
                      >
                        State *
                      </label>
                      {values.country == "India" && (
                        <Field
                          as="select"
                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                          name="state"
                        >
                          <option value="">Select</option>
                          {statesInIndiaList.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </Field>
                      )}
                      {values.country !== "India" && (
                        <Field
                          type="text"
                          placeholder="Enter State"
                          className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                          name="state"
                        />
                      )}

                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.state && errors.state}
                      </div>
                    </div>

                    <div className="flex w-[98%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="industry"
                      >
                        Industry *
                      </label>
                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="industry"
                      >
                        <option value="">Select</option>

                        {industriesList.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.industry && errors.industry && errors.industry}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="flex w-full flex-col gap-1 lg:w-[33%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="company_type_explaination"
                      >
                        year of incorporation
                      </label>
                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="started"
                      >
                        <option value="">Select a year</option>
                        {storeYear().map((countryName, index) => (
                          <option key={index} value={countryName}>
                            {countryName}
                          </option>
                        ))}
                      </Field>

                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.started && errors.started}
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-1 lg:w-[33%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="stageOfTheCompany "
                      >
                        Stage Of The Company
                      </label>
                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="stageOfTheCompany"
                      >
                        <option name="">select</option>
                        {stageOfCompanyList.map((value, index) => (
                          <option key={index} name={value}>
                            {value}
                          </option>
                        ))}
                      </Field>
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.stageOfTheCompany && errors.stageOfTheCompany}
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-1 lg:w-[33%]">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="typeOfCompany "
                      >
                        Type Of Company
                      </label>

                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="typeOfCompany"
                      >
                        <option className="" value="">
                          Select
                        </option>
                      </Field>
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.numberOfEmployees && errors.numberOfEmployees}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-8 self-start">
                    <div className="flex w-full flex-col justify-center gap-1">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="currentGeography"
                      >
                        Current Geography
                      </label>
                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="currentGeography"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.currentGeography}
                      >
                        <option className="" value="">
                          Select
                        </option>

                        {geographyList.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                      <div className="ms-2 h-3 text-xs text-red-600"></div>
                    </div>
                  </div>
                  {(values.currentGeography == "Country" ||
                    values.currentGeography == "Continents") && (
                      <div className="flex w-full flex-col self-start">
                        <MultiSelector
                          currentLists={
                            values.currentGeography == "Country"
                              ? countriesList
                              : continents
                          }
                          setGeographySelectionList={setGeographySelectionList}
                        />
                        <div className="ms-2 h-3 text-xs text-red-600"></div>
                      </div>
                    )}

                  <div className="flex w-full flex-col self-start">
                    <label
                      className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                      htmlFor={`parentCompany`}
                    >
                      Parent Company (if any)
                    </label>
                    <FieldArray name="parentCompany" className="w-full">
                      {({ push, remove }) => (
                        <div className="w-full p-0">
                          {values.parentCompany.map((parentCompany, index) => (
                            <div
                              key={index}
                              className="mb-4 flex w-full justify-between gap-4"
                            >
                              <input
                                type="text"
                                name={`parentCompany[${index}]`}
                                placeholder="Enter Your Parent Company"
                                className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                value={values.parentCompany[index]}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage
                                name={`parentCompany[${index}]`}
                                className="text-red-600"
                              />
                              <div className="m-0 flex w-[3.5rem] items-center justify-start">
                                {index === values.parentCompany.length - 1 && (
                                  <CiCirclePlus
                                    type="button"
                                    className="h-auto w-7 cursor-pointer text-black"
                                    size={30}
                                    onClick={() => push("")}
                                  />
                                )}
                                {values.parentCompany.length > 1 &&
                                  index == values.parentCompany.length - 1 && (
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
                  <div className="flex w-full items-center justify-center gap-8">
                    <div className="flex w-full flex-col gap-1">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="products Services"
                      >
                        Products / Services *
                      </label>
                      <Field
                        as="select"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.8rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        name="productsNServices"
                      >
                        <option value="">Select</option>

                        {productsServicesList.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.productsNServices && errors.productsNServices}
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center justify-center gap-8">
                    <div className="flex w-full flex-col gap-1">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="company_type_explaination"
                      >
                        Explain about Products / Services *
                      </label>
                      <textarea
                        name="company_type_explaination"
                        type="text"
                        placeholder="write about your product/service"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.company_type_explaination}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.company_type_explaination &&
                          errors.company_type_explaination}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-center gap-4">
                    <div className="flex w-full flex-col gap-1">
                      <label
                        className="ms-2 text-sm font-[550] capitalize text-[#170F49]"
                        htmlFor="description"
                      >
                        description about company
                      </label>
                      <textarea
                        name="description"
                        type="text"
                        placeholder="Write Description about Company"
                        className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-5 py-[0.7rem] capitalize text-[#2d2828] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-sm placeholder:text-[#6F6C90] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      />
                      <div className="ms-2 h-3 text-xs text-red-600">
                        {touched.description && errors.description}
                      </div>
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

                  {/* ///////////////////////// ShareHolding  /////////////////////////*/}
                  <div className="text-center font-DM text-[1.1rem] font-[500] text-[#170F49] lg:text-[1.3]">
                    <span>Share holding patterns</span>
                  </div>
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
                        <FieldArray name="shareholdingPatterns">
                          {({ push, remove }) => (
                            <div className="w-full gap-2">
                              {values.shareholdingPatterns.map((_, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-0 gap-x-2"
                                >
                                  <div className="flex w-[42%] flex-col">
                                    <Field
                                      as="select"
                                      name={`shareholdingPatterns[${index}].shareholder_type`}
                                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-center text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                    >
                                      <option value="">
                                        {values.shareholdingPatterns[index]
                                          .shareholder_type == ""
                                          ? "select"
                                          : values.shareholdingPatterns[index]
                                            .shareholder_type}
                                      </option>
                                      {DynamicShareholdingPatternList.map(
                                        (value, index) => (
                                          <option
                                            className="text-start"
                                            key={index}
                                            value={value}
                                          >
                                            {value}
                                          </option>
                                        ),
                                      )}
                                    </Field>
                                    <div className="h-6">
                                      <ErrorMessage
                                        name={`shareholdingPatterns[${index}].shareholder_type`}
                                        className="text-sm text-red-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex w-[25%] flex-col sm:w-[40%]">
                                    <Field
                                      onKeyUp={(e) => {
                                        checkShareHolderPercentageFun(
                                          values.shareholdingPatterns,
                                        );
                                      }}
                                      name={`shareholdingPatterns[${index}].shareholder_holding`}
                                      className="w-full rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-[0.35rem] text-sm text-[#6F6C90] shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.07)] placeholder:text-center focus-within:shadow-[0px_1.36px_4.09px_0px_rgba(19,18,66,0.1)] focus:shadow-md focus:outline-none"
                                    />
                                    <div className="h-6">
                                      <ErrorMessage
                                        name={`shareholdingPatterns[${index}].shareholder_holding`}
                                        className="text-xs text-red-600"
                                        component="div"
                                      />
                                    </div>
                                  </div>
                                  <div className="-mt-5 flex w-[3.5rem]">
                                    {index ===
                                      values.shareholdingPatterns.length - 1 &&
                                      index < 6 &&
                                      values.shareholdingPatterns[
                                        values.shareholdingPatterns.length - 1
                                      ].shareholder_type !== "" &&
                                      checkShareHolderPercentage < 100 &&
                                      values.shareholdingPatterns[
                                        values.shareholdingPatterns.length - 1
                                      ].shareholder_holding !== "" && (
                                        <CiCirclePlus
                                          type="button"
                                          className="h-auto w-7 cursor-pointer text-black"
                                          size={30}
                                          onClick={() => {
                                            push({
                                              shareholder_type: "",
                                              shareholder_holding: "",
                                            });
                                            DynamicShareholdingPatternListFun(
                                              values.shareholdingPatterns,
                                            );
                                          }}
                                        />
                                      )}
                                    {index > 0 &&
                                      index ==
                                      values.shareholdingPatterns.length -
                                      1 && (
                                        <CiCircleMinus
                                          type="button"
                                          className="h-auto w-7 cursor-pointer text-black"
                                          size={30}
                                          onClick={() => {
                                            remove(index);
                                            DynamicShareholdingPatternListFun(
                                              values.shareholdingPatterns,
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
                        <PieChart upComing={values.shareholdingPatterns} />
                      </div>
                    </div>
                  </div>

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

export default CompanyDetailsResults;
