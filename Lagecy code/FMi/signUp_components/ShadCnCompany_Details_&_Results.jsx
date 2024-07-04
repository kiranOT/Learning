"use client";
import { useEffect, useState } from "react";
import * as React from "react";
import RevenueGraph from "@/components/chart/Graph";
import * as Yup from "yup";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { getData } from "@/utils/apiCall";
import { format, subDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import MultiSelector from "@/components/helperComponents/ReactSelector";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  currentGeography: Yup.string(),
  company_type_explaination: Yup.string().required("Required"),
  stageOfTheCompany: Yup.string(),
  description: Yup.string().required("required"),
  numberOfEmployees: Yup.number()
    .typeError("Must be number")
    .positive("Must be positive")
    .required("Required"),
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
  description: "",
  numberOfEmployees: "",
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
  const [loading, setLoadig] = useState(false);
  const [startedDate, setStartedDate] = React.useState();

  const [geographySelectionList, setGeographySelectionList] = React.useState();

  const today = new Date();
  const yesterday = subDays(today, 1); // Yesterday's date

  const handleSelect = (selectedDate) => {
    if (isBefore(startOfDay(selectedDate), startOfDay(today))) {
      setStartedDate(selectedDate);
    } else {
      toast.error("Please select a date before today.");
    }
  };

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
  });
  //////////////////////////////////////////////////////////////////

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
      toast.error("shareholdingPatterns percentage must be 100%");
    }
    console.log(checkShareHolderPercentage);
  }
  /////////////////// API call to save company details//////////////////////
  async function saveCompanyDetails(values) {
    setLoadig(true);
    if (
      values.email.personal == "" &&
      values.email.professional == "" &&
      values.email.linkedIn == ""
    ) {
      toast.error("Please fill altest one email");
      return;
    }

    if (!startedDate) {
      toast.error("please select a started In field");
      return;
    }

    // use in future
    const compayDetails = {
      ...values,
      user_id:
        window && typeof window !== undefined
          ? JSON.parse(window.localStorage.getItem("userData")).primaryObjectID
          : "",
      [`${
        (values.currentGeography == "Country" && "countryGeography") ||
        (values.currentGeography == "Continents" && "continentalGeography")
      }`]: geographySelectionList,
      started: startedDate,
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
      setLoadig(false);
    }
  }

  return (
    <>
      {loading && <LoaderScreenPage />}
      <div className="text-nowrap bg-[#FFFFFF]">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="flex w-full flex-col justify-center text-[#EAEAEA]">
          <Formik
            initialValues={initialValues}
            validationSchema={companyDetailsSchema}
            onSubmit={(values, action) => {
              saveCompanyDetails(values);
            }}
            className="flex w-screen justify-center"
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              getFieldProps, // function that take name and return name and other attribute for input
            }) => {
              return (
                <Form
                  className="flex w-[95%] flex-col items-center justify-center gap-2 rounded-lg bg-[#FFFFFF] p-8 text-black shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] md:w-[80%] lg:w-[60%]"
                  onSubmit={handleSubmit}
                >
                  {console.log(values)}
                  {/* //////////////////////// Company details //////////////////////// */}
                  <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:gap-8">
                    <div className="h-22 flex w-[98%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="text-md ms-2 h-6 font-[550] text-[#170F49]"
                        htmlFor="companyName"
                      >
                        Company Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter Your Company name"
                        // className="w-[100%] bg-[#FFFFFF] h-10 py-2 px-4 placeholder:text-[#6F6C90] placeholder:text-sm placeholder:text-opacity-50 text-[#2d2828] focus:outline-none focus:shadow-md rounded-md border border-[#f6eff3] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)]"
                        {...getFieldProps("companyName")}
                      />
                      {touched.companyName && errors.companyName && (
                        <div className="h-6 text-xs text-red-600">
                          {errors.companyName}
                        </div>
                      )}
                    </div>
                    <div className="h-22 flex w-[98%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="text-md ms-2 h-6 font-[550] text-[#170F49]"
                        htmlFor="name"
                      >
                        Your Name
                      </label>
                      <Input
                        type="text"
                        {...getFieldProps("name")}
                        placeholder="Enter Your name"
                        // className="w-[100%] bg-[#FFFFFF] h-10 py-2 px-4 placeholder:text-[#6F6C90] placeholder:text-sm placeholder:text-opacity-50 text-[#2d2828] focus:outline-none focus:shadow-md rounded-md border border-[#f6eff3] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)]"
                      />
                      {touched.name && errors.name && (
                        <div className="h-6 text-xs text-red-600">
                          {errors.name}
                        </div>
                      )}
                    </div>
                    <div className="h-22 flex w-[98%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="text-md ms-2 h-6 font-[550] text-[#170F49]"
                        htmlFor="website"
                      >
                        Website
                      </label>
                      <input
                        type="text"
                        {...getFieldProps("website")}
                        placeholder="Enter Your Website"
                        className="h-10 w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                      />
                      {touched.website && errors.website && (
                        <div className="h-6 text-xs text-red-600">
                          {errors.website}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex w-[100%] flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="flex h-20 w-[100%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="email.personal"
                      >
                        Personal Email ID
                      </label>
                      <input
                        type="text"
                        {...getFieldProps("email.personal")}
                        placeholder="Enter Your Personal Email ID"
                        className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                      />
                      {touched.email?.personal && errors.email?.personal && (
                        <div className="text-xs text-red-600">
                          {errors.email.personal}
                        </div>
                      )}
                    </div>
                    <div className="flex h-20 w-[100%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="email.personal"
                      >
                        Professional Email ID
                      </label>
                      <input
                        type="text"
                        {...getFieldProps("email.professional")}
                        placeholder="Enter Your professional  Email ID"
                        className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                      />
                      {touched.email?.professional &&
                        errors.email?.professional && (
                          <div className="text-xs text-red-600">
                            {errors.email?.professional}
                          </div>
                        )}
                    </div>

                    <div className="flex h-20 w-[100%] flex-col gap-1 lg:w-[50%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="email.personal"
                      >
                        LinkedIn ID
                      </label>
                      <input
                        type="text"
                        {...getFieldProps("email.linkedIn")}
                        placeholder="Enter Your LinkedIn Id"
                        className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                      />
                      {touched.email?.linkedIn && errors.email?.linkedIn && (
                        <div className="text-xs text-red-600">
                          {errors.email?.linkedIn}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex w-[100%] flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="flex h-20 w-[98%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="Country"
                      >
                        Country
                      </label>

                      <Select {...getFieldProps("country")}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            className="text-sm text-[#6F6C90] placeholder:text-opacity-50"
                            placeholder="Select a country"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Countries</SelectLabel>
                            {countriesList.map((countryName, index) => (
                              <SelectItem key={index} value={countryName}>
                                {countryName}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {/* <select
                        as="select"
                        {...getFieldProps("country")}
                        className="w-[100%] bg-[#FFFFFF] h-10 py-2 px-4 text-[#6F6C90] text-sm focus:outline-none focus:shadow-md rounded-md border  shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)]"
                      >
                        <option value="">Select</option>

                        {countriesList.map((countryName, index) => (
                          <option key={index} value={countryName}>
                            {countryName}
                          </option>
                        ))}
                      </select> */}
                      {touched.country && errors.country && (
                        <div className="text-xs text-red-600">
                          {errors.country}
                        </div>
                      )}
                    </div>

                    <div className="flex h-20 w-[98%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="state"
                      >
                        State
                      </label>
                      {values.country == "India" && (
                        <input
                          as="select"
                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] focus:shadow-md focus:outline-none"
                          name="state"
                        >
                          <option value="">Select</option>
                          {statesInIndiaList.map((name, index) => (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          ))}
                        </input>
                      )}
                      {values.country !== "India" && (
                        <Field
                          type="text"
                          placeholder="Enter State"
                          className="w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] focus:shadow-md focus:outline-none"
                          name="state"
                        />
                      )}

                      {touched.state && errors.state && (
                        <div className="text-xs text-red-600">
                          {errors.state}
                        </div>
                      )}
                    </div>

                    <div className="flex h-20 w-[98%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="industry"
                      >
                        Industry
                      </label>
                      <Field
                        as="select"
                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] focus:shadow-md focus:outline-none"
                        name="industry"
                      >
                        <option value="">Select</option>

                        {industriesList.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                      {touched.industry && errors.industry && (
                        <div className="text-xs text-red-600">
                          {errors.industry}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex w-[100%] items-center justify-center gap-4">
                    <div className="flex w-[100%] flex-col gap-1">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="description"
                      >
                        Description about Company
                      </label>
                      <textarea
                        name="description"
                        type="text"
                        placeholder="Write Description about Company"
                        className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                      />
                      {touched.description && errors.description && (
                        <div className="text-xs text-red-600">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex w-[100%] items-center justify-center gap-8">
                    <div className="flex h-20 w-[100%] flex-col gap-1">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="products Services"
                      >
                        Products Or Services
                      </label>
                      <Field
                        as="select"
                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] focus:shadow-md focus:outline-none"
                        name="productsNServices"
                      >
                        <option value="">Select</option>

                        {productsServicesList.map((name, index) => (
                          <option key={index} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                      {touched.productsNServices &&
                        errors.productsNServices && (
                          <div className="text-xs text-red-600">
                            {errors.productsNServices}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex w-[100%] items-center justify-center gap-8">
                    <div className="flex w-[100%] flex-col gap-1">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="company_type_explaination"
                      >
                        Explaination
                      </label>
                      <textarea
                        name="company_type_explaination"
                        type="text"
                        placeholder="write about your product/service"
                        className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.company_type_explaination}
                      />
                      {touched.company_type_explaination &&
                        errors.company_type_explaination && (
                          <div className="text-xs text-red-600">
                            {errors.company_type_explaination}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex w-[100%] flex-col items-center justify-center gap-8 lg:flex-row">
                    <div className="flex h-20 w-[95%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="company_type_explaination"
                      >
                        Started In
                      </label>
                      <Popover className="bg-[#FFFFFF] text-[#6F6C90]">
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start bg-[#FFFFFF] text-left font-normal text-[#6F6C90]",
                              !startedDate &&
                                "text-muted-foreground shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)]",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-[#170F49]" />
                            {startedDate ? (
                              format(startedDate, "PPP")
                            ) : (
                              <span className="text-[#6F6C90]">
                                Pick a date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startedDate}
                            onSelect={handleSelect}
                            initialFocus
                            maxDate={yesterday}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex h-20 w-[95%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="stageOfTheCompany "
                      >
                        Stage Of The Company
                      </label>
                      <Field
                        as="select"
                        name="stageOfTheCompany"
                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] focus:shadow-md focus:outline-none"
                        value={values.stageOfTheCompany}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option name="">select</option>
                        {stageOfCompanyList.map((value, index) => (
                          <option key={index} name={value}>
                            {value}
                          </option>
                        ))}
                      </Field>
                      {touched.stageOfTheCompany &&
                        errors.stageOfTheCompany && (
                          <div className="text-xs text-red-600">
                            {errors.stageOfTheCompany}
                          </div>
                        )}
                    </div>
                    <div className="flex h-20 w-[95%] flex-col gap-1 lg:w-[33%]">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="numberOfEmployees "
                      >
                        Number Of Employees
                      </label>
                      <input
                        type="text"
                        name="numberOfEmployees"
                        placeholder="Enter Number Of Employees"
                        className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
                        value={values.numberOfEmployees}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.numberOfEmployees &&
                        errors.numberOfEmployees && (
                          <div className="text-xs text-red-600">
                            {errors.numberOfEmployees}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-8 self-start">
                    <div className="flex w-full flex-col justify-center gap-1">
                      <label
                        className="text-md ms-2 font-[550] text-[#170F49]"
                        htmlFor="currentGeography"
                      >
                        Current Geography
                      </label>
                      <Field
                        as="select"
                        className="h-10 w-full rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] focus:shadow-md focus:outline-none"
                        name="currentGeography"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.currentGeography}
                      >
                        <option value="">Select</option>

                        {geographyList.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </Field>
                    </div>
                  </div>
                  {(values.currentGeography == "Country" ||
                    values.currentGeography == "Continents") && (
                    <div className="flex w-full flex-col gap-8 self-start">
                      <MultiSelector
                        currentLists={
                          values.currentGeography == "Country"
                            ? countriesList
                            : continents
                        }
                        setGeographySelectionList={setGeographySelectionList}
                      />
                    </div>
                  )}

                  <div className="flex w-full flex-col self-start">
                    <label
                      className="text-md ms-2 font-[550] text-[#170F49]"
                      htmlFor={`parentCompany`}
                    >
                      Parent Company
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
                                className="w-[100%] rounded-md border border-[#f6eff3] bg-[#FFFFFF] px-4 py-2 text-[#2d2828] shadow-[0_2px_3px_rgba(0,0,255,0.1),0_-2px_3px_rgba(0,0,255,0.1),-2px_0_3px_rgba(0,0,255,0.1),2px_0_3px_rgba(0,0,255,0.1)] placeholder:text-sm placeholder:text-[#6F6C90] placeholder:text-opacity-50 focus:shadow-md focus:outline-none"
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
                                {values.parentCompany.length > 1 && (
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

                  {/* ///////////////////////// Financial Matrix  ///////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////// */}
                  {/* ///////////////////////// Financial Matrix  ///////////////////////// */}

                  <div className="flex w-screen flex-col items-center justify-center gap-2 py-8">
                    <span className="text-xl font-semibold text-[#1C1C1C] lg:text-2xl">
                      Company’s Financial Matrix
                    </span>
                    <div className="flex w-[12rem] rounded-md bg-[#B2DAFF] px-2 py-1 md:w-[24rem]">
                      <div
                        className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 py-1 font-medium transition-colors lg:py-2 ${
                          financialMatrixTime.yearly
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
                        className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 px-1 py-1 font-medium transition-colors lg:py-2 ${
                          financialMatrixTime.quarterly
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
                      <div className="flex w-[15rem] rounded-md bg-[#B2DAFF] px-2 py-1 lg:w-[24rem]">
                        <div
                          className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 py-1 font-medium transition-colors lg:py-2 ${
                            financialMatrixTimeYears.Revenue
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
                          className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 py-1 font-medium transition-colors lg:py-2 ${
                            financialMatrixTimeYears.Profit
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
                          className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 py-1 font-medium transition-colors lg:py-2 ${
                            financialMatrixTimeYears.NetProfit
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
                          Net Profit
                        </div>
                      </div>
                    )}

                    {financialMatrixTime.quarterly && (
                      <div className="flex w-[15rem] rounded-md bg-[#B2DAFF] px-2 py-1">
                        <div
                          className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 py-1 font-medium transition-colors lg:py-2 ${
                            financialMatrixTimeQuaterly.Revenue
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
                          className={`m-0 flex h-auto w-[50%] cursor-pointer items-center justify-center rounded-md border-none p-0 py-1 font-medium transition-colors lg:py-2 ${
                            financialMatrixTimeQuaterly.Profit
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
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg p-8 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center gap-8">
                            <FieldArray name="revenueYearly">
                              {({ push, remove }) => (
                                <div className="m-0 w-full p-0">
                                  {values.revenueYearly.map((_, index) => (
                                    <div
                                      key={index}
                                      className="mb-4 flex items-center gap-0 gap-x-2"
                                    >
                                      <div className="h-22 flex w-[42%] flex-col">
                                        <label
                                          className="text-md ms-2 font-[550] text-[#170F49]"
                                          htmlFor="Year"
                                        >
                                          Year
                                        </label>
                                        <Field
                                          type="text"
                                          name={`revenueYearly[${index}].year`}
                                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                          placeholder="Enter Year"
                                          disabled={index > 0}
                                        />

                                        <div className="h-6">
                                          <ErrorMessage
                                            className="text-xs text-red-600"
                                            component="div"
                                            name={`revenueYearly[${index}].year`}
                                          />
                                        </div>
                                      </div>
                                      <div className="h-22 flex w-[42%] flex-col">
                                        <label
                                          className="text-md ms-2 font-[550] text-[#170F49]"
                                          htmlFor="value"
                                        >
                                          value
                                        </label>
                                        <Field
                                          name={`revenueYearly[${index}].value`}
                                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                        />
                                        <div className="h-6">
                                          <ErrorMessage
                                            className="text-xs text-red-600"
                                            component="div"
                                            name={`revenueYearly[${index}].value`}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex w-[3.5rem] items-center">
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
                        <div className="auto flex h-[18rem] w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:h-[37rem] lg:w-[50%]">
                          <RevenueGraph graphData={values.revenueYearly} />
                        </div>
                      </div>
                    )}

                  {/*/////////////////////////////////////////// Profit Graph //////////////////////////// */}
                  {financialMatrixTime.yearly &&
                    financialMatrixTimeYears.Profit && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg p-8 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center gap-8">
                            <FieldArray name="profitYearly">
                              {({ push, remove }) => (
                                <div className="w-full">
                                  {values.profitYearly.map((_, index) => (
                                    <div
                                      key={index}
                                      className="mb-4 flex items-center gap-2"
                                    >
                                      <div className="h-22 flex w-[42%] flex-col">
                                        <label
                                          className="text-md ms-2 font-[550] text-[#170F49]"
                                          htmlFor="Year"
                                        >
                                          Year
                                        </label>
                                        <Field
                                          type="text"
                                          name={`profitYearly[${index}].year`}
                                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                          placeholder="Enter Year"
                                          disabled={index > 0}
                                        />

                                        <div className="h-6">
                                          <ErrorMessage
                                            className="text-sm text-red-600"
                                            name={`profitYearly[${index}].year`}
                                          />
                                        </div>
                                      </div>
                                      <div className="h-22 flex w-[42%] flex-col">
                                        <label
                                          className="text-md ms-2 font-[550] text-[#170F49]"
                                          htmlFor="value"
                                        >
                                          value
                                        </label>
                                        <Field
                                          name={`profitYearly[${index}].value`}
                                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                        />
                                        <div className="h-6">
                                          <ErrorMessage
                                            className="text-sm text-red-600"
                                            name={`profitYearly[${index}].value`}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex w-[3.5rem] items-center">
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
                        <div className="auto flex h-[18rem] w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:h-[37rem] lg:w-[50%]">
                          <RevenueGraph graphData={values.profitYearly} />
                        </div>
                      </div>
                    )}

                  {/*/////////////////////////////////////////// Profit Graph //////////////////////////// */}
                  {financialMatrixTime.yearly &&
                    financialMatrixTimeYears.NetProfit && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg p-8 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center gap-8">
                            <FieldArray name="netWorthYearly">
                              {({ push, remove }) => (
                                <div className="w-full">
                                  {values.netWorthYearly.map((_, index) => (
                                    <div
                                      key={index}
                                      className="mb-4 flex items-center gap-2"
                                    >
                                      <div className="h-22 flex w-[40%] flex-col">
                                        <label
                                          className="text-md ms-2 font-[550] text-[#170F49]"
                                          htmlFor="Year"
                                        >
                                          Year
                                        </label>
                                        <Field
                                          type="text"
                                          name={`netWorthYearly[${index}].year`}
                                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                          placeholder="Enter Year"
                                          disabled={index > 0}
                                        />

                                        <div className="h-6">
                                          <ErrorMessage
                                            className="text-sm text-red-600"
                                            name={`netWorthYearly[${index}].year`}
                                          />
                                        </div>
                                      </div>
                                      <div className="h-22 flex w-[40%] flex-col">
                                        <label
                                          className="text-md ms-2 font-[550] text-[#170F49]"
                                          htmlFor="value"
                                        >
                                          value
                                        </label>
                                        <Field
                                          name={`netWorthYearly[${index}].value`}
                                          className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                        />
                                        <div className="h-6">
                                          <ErrorMessage
                                            className="text-sm text-red-600"
                                            name={`netWorthYearly[${index}].value`}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex w-[3.5rem] items-center">
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
                                              className="cursor-pointer text-black"
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
                                              className="cursor-pointer text-black"
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
                        <div className="auto flex h-[18rem] w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:h-[37rem] lg:w-[50%]">
                          <RevenueGraph graphData={values.netWorthYearly} />
                        </div>
                      </div>
                    )}

                  {/* /////////////////////////////// Quarterly /////////////////////////////////// */}
                  {/* /////////////////////////////// Quarterly /////////////////////////////////// */}

                  {/* /////////////////////////////// revenue /////////////////////////////////// */}
                  {financialMatrixTime.quarterly &&
                    financialMatrixTimeQuaterly.Revenue && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg p-8 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center gap-8">
                            <FieldArray name="revenueQuarterly">
                              <div className="w-full">
                                {values.revenueQuarterly.map((obj, index) => (
                                  <div
                                    key={index}
                                    className="mb-4 flex items-center gap-2"
                                  >
                                    <div className="h-22 flex w-[42%] flex-col">
                                      <label
                                        className="text-md ms-2 font-[550] text-[#170F49]"
                                        htmlFor="quarterly"
                                      >
                                        Quarterly
                                      </label>
                                      <Field
                                        type="text"
                                        name={`revenueQuarterly[${index}].quarterly`}
                                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
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
                                    <div className="h-22 flex w-[42%] flex-col">
                                      <label
                                        className="text-md ms-2 font-[550] text-[#170F49]"
                                        htmlFor="value"
                                      >
                                        value
                                      </label>
                                      <Field
                                        name={`revenueQuarterly[${index}].value`}
                                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
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
                        <div className="auto flex h-[18rem] w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:h-[37rem] lg:w-[50%]">
                          <RevenueGraph graphData={values.revenueQuarterly} />
                        </div>
                      </div>
                    )}

                  {/* /////////////////////////////// Profit /////////////////////////////////// */}
                  {financialMatrixTime.quarterly &&
                    financialMatrixTimeQuaterly.Profit && (
                      <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                        <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg p-8 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:w-[50%]">
                          <div className="flex w-full flex-wrap items-center justify-center gap-8">
                            <FieldArray name="profitQuarterly">
                              <div className="w-full">
                                {values.profitQuarterly.map((obj, index) => (
                                  <div
                                    key={index}
                                    className="mb-4 flex items-center gap-2"
                                  >
                                    <div className="h-22 flex w-[42%] flex-col">
                                      <label
                                        className="text-md ms-2 font-[550] text-[#170F49]"
                                        htmlFor="quarterly"
                                      >
                                        Quarterly
                                      </label>
                                      <Field
                                        name={`profitQuarterly[${index}].quarterly`}
                                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
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
                                    <div className="h-22 flex w-[42%] flex-col">
                                      <label
                                        className="text-md ms-2 font-[550] text-[#170F49]"
                                        htmlFor="value"
                                      >
                                        value
                                      </label>
                                      <Field
                                        name={`profitQuarterly[${index}].value`}
                                        className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
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
                        <div className="flex h-[18rem] w-full flex-col items-center justify-start text-nowrap rounded-lg px-8 py-4 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] md:h-[25rem] lg:h-[37rem] lg:w-[50%]">
                          <RevenueGraph graphData={values.profitQuarterly} />
                        </div>
                      </div>
                    )}

                  {/* ///////////////////////// ShareHolding  /////////////////////////*/}
                  <div className="text-center text-xl font-semibold text-[#1C1C1C] lg:text-2xl">
                    <span>Share holding patterns</span>
                  </div>
                  <div className="flex w-full flex-col justify-between gap-12 sm:w-[100wh] lg:flex-row">
                    <div className="flex w-full flex-col items-center justify-start text-nowrap rounded-lg p-8 shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:w-[50%]">
                      <div className="flex w-full flex-wrap items-center justify-center gap-8">
                        <FieldArray name="shareholdingPatterns">
                          {({ push, remove }) => (
                            <div className="w-full">
                              {values.shareholdingPatterns.map((_, index) => (
                                <div
                                  key={index}
                                  className="mb-4 flex items-center gap-2"
                                >
                                  <div className="h-22 flex w-[40%] flex-col">
                                    <label
                                      className="text-md ms-2 font-[550] text-[#170F49]"
                                      htmlFor="Shareholder type"
                                    >
                                      Type
                                    </label>
                                    <Field
                                      as="select"
                                      name={`shareholdingPatterns[${index}].shareholder_type`}
                                      className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
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
                                          <option key={index} value={value}>
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
                                  <div className="h-22 flex w-[25%] flex-col sm:w-[40%]">
                                    <label
                                      className="text-md ms-2 font-[550] text-[#170F49]"
                                      htmlFor="Shareholder holding"
                                    >
                                      Holding %
                                    </label>
                                    <Field
                                      onKeyUp={(e) => {
                                        checkShareHolderPercentageFun(
                                          values.shareholdingPatterns,
                                        );
                                      }}
                                      name={`shareholdingPatterns[${index}].shareholder_holding`}
                                      className="h-10 w-[100%] rounded-md border border-[#EFF0F6] bg-[#FFFFFF] px-4 py-2 text-sm text-[#6F6C90] shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] focus:shadow-md focus:outline-none"
                                    />
                                    <div className="h-6">
                                      <ErrorMessage
                                        name={`shareholdingPatterns[${index}].shareholder_holding`}
                                        className="text-xs text-red-600"
                                        component="div"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex w-[3.5rem] items-center">
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
                                    {index > 0 && (
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
                    <div className="w-100 flex h-[20rem] flex-col items-center justify-start text-nowrap rounded-lg shadow-[0_10px_18px_-6px_rgba(0,0,0,0.1),0_-4px_6px_-1px_rgba(0,0,0,0.1),-4px_0_18px_-1px_rgba(0,0,0,0.1),4px_0_6px_-1px_rgba(0,0,0,0.1)] lg:h-[37rem] lg:w-[50%]">
                      <PieChart upComing={values.shareholdingPatterns} />
                    </div>
                  </div>

                  {/* ///////////////////////// Submit button  ///////////////////////// */}
                  <button
                    type="submit"
                    className="btn btn-primary self-start rounded-md px-6 text-[0.8rem] font-[600] text-white lg:text-[1.1rem]"
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
