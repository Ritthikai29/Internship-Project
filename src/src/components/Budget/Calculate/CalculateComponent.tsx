import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  RejectCalculateInterface,
  ResProjectInterface,
} from "../../../models/Project/IProject";
import {
  CreateCalculate,
  CreateCalculateWithSubPrice,
  GetOldBudgetCalculate,
  GetProjectById,
  GetRejectOld,
} from "../../../services/BudgetService/CalculateService";
import {
  CalculateInterface,
  CalculateSubPriceInterface,
} from "../../../models/Budget/Calculate/ICalculate";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";
import { BsDownload } from "react-icons/bs";
import ManagerComponent from "./ManagerComponent";
import LogComponent from "../LogCalculate/LogComponent";
import { useNavigate } from "react-router-dom";
import { GetUnitPrice } from "../../../services/ProjectService/ProjectService";
import AsyncSelect from "react-select/async";
import { UpdateUnitPriceOfProject } from "../../../services/ProjectService/ProjectService";
import { datetimeFormatter } from "../../../services/utilitity";

export default function CalculateComponent({
  projectId,
  projectKey,
}: {
  projectId: string;
  projectKey: string;
}) {
  const MySwal = withReactContent(Swal);
  // use useref to show validate form to all input

  const [isHaveSubPrice, setIsHaveSubPrice] = useState<boolean>();
  const [project, setProject] = useState<ResProjectInterface>();

  const [calculate, setCalculate] = useState<Partial<CalculateInterface>>({});

  const [reject, setReject] = useState<RejectCalculateInterface>();
  const detailSubPriceRef = useRef<HTMLInputElement>(null);

  const [priceSubPrice, setPriceSubPrice] = useState<string>("");

  const calculateFileRef = useRef<HTMLInputElement>(null);
  const calculatePriceRef = useRef<HTMLInputElement>(null);

  const [oldFile, setOldFile] = useState<boolean>(false);
  const [showfileold, setShowfileold] = useState<boolean>(true);
  const [showcheckfile, setShowcheckfile] = useState<boolean>(true);
  const [calculateFileOld, setCalculateFileOld] = useState<string>("");
  const [calculateFileOldshow, setCalculateFileOldshow] = useState<{
    file: File | null;
    fileName: string;
  }>({
    file: null,
    fileName: "No file chosen",
  });

  const [disable, setDisable] = useState<boolean>(false);
  const [selectedUnit, setSelectedUnit] = useState<any>();
  const firstSub = calculate.sub_price?.[0];

  const navigate = useNavigate();

  const loadUnitPrice = async (inputValue: string) => {
    const res = await GetUnitPrice();
    const unitPrice = res.data || [];
    return unitPrice
      .filter((unitPrice: any) =>
        unitPrice.unit_price_name
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      )
      .map((unitPrice: any) => ({
        label: unitPrice.unit_price_name,
        value: unitPrice.unit_price_name,
      }));
  };

  const handleUnitPriceChange = async (selectedOption: any) => {
    setSelectedUnit(selectedOption);
    console.log(selectedOption);
  };

  const handleMoreUnitPriceChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const object = {
      label: "อื่นๆ",
      value: e.target.value,
    };

    setSelectedUnit(object);
    console.log(selectedUnit);
  };

  const dateTimeFormatter = (date: string) => {
    const dateFormat = new Date(date);
    return `${dateFormat.getDate()} / ${
      dateFormat.getMonth() + 1
    } / ${dateFormat.getFullYear()}`;
  };

  const getProject = async () => {
    let resProject = await GetProjectById(projectId);
    setProject({
      ...resProject.data,
    });
    setCalculate({
      pj_id: resProject.data.id,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    console.log((e.target.value).length)
    if((e.target.value).length === 0){
      setShowcheckfile(true);
    }else{
      const name = e.target.name as keyof typeof calculate;
      setOldFile(false);
      setShowcheckfile(false);
      if (e.target.files) {
        setCalculate({
          ...calculate,
          [name]: e.target.files[0],
        });
      }
    }
  };

  const handleAddSubPriceChange = (value: string) => {
    setPriceSubPrice(value);
  };

  useEffect(() => {
    // to get a project
    getProject();

    // to get a reject and old data
    getReject();
    MySwal.fire({
      title: "กำลังดาวน์โหลด",
      html: "<p>โปรดรอสักครู่ ...</p>",
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        MySwal.showLoading(); // Show the loading spinner
      },
      willClose: () => {
        MySwal.hideLoading(); // Hide the loading spinner
      },
    });

    setTimeout(() => {
      MySwal.close();
    }, 3000);
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [editedSubPrice, setEditedSubPrice] = useState<{
    detail_price: string;
    price: number |string ;
  }>({ detail_price: "", price: 0 });
  const [editedIndex, setEditedIndex] = useState(-1);

  const handleEditClick = (index: number) => {
    if (calculate.sub_price && calculate.sub_price[index]) {
      setEditedSubPrice({ ...calculate.sub_price[index] });
    }
    setEditedIndex(index);
    setIsEditing(true);
  };

  const handleSaveClick = (index: number) => {
    // ทำการบันทึกค่าใหม่ลง state หลังจากแก้ไข
    const updatedSubPriceList = [...(calculate.sub_price || [])];
    updatedSubPriceList[index] = { ...editedSubPrice };
    setCalculate({ ...calculate, sub_price: updatedSubPriceList });

    // รีเซ็ตค่าและปิดโหมดแก้ไข
    setEditedSubPrice({ detail_price: "", price: 0 });
    setEditedIndex(-1);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedSubPrice({ detail_price: "", price: 0 });
    setEditedIndex(-1);
    setIsEditing(false);
  };

  const isPriceComplete = useMemo(() => {
    return (
      Array.isArray(calculate.sub_price) &&
      calculate.sub_price.reduce((prev, curr) => {
        return prev + parseFloat((curr.price as string) || "0");
      }, 0) === parseFloat(calculate.budget as string)
    );
  }, [calculate.sub_price, calculate.budget]);

  const showFileOnClick = (filePath: string) => {
    window.open(
      (import.meta.env.DEV
        ? import.meta.env.VITE_URL_DEV
        : import.meta.env.VITE_URL_PRODUCTION) + filePath
    );
  };

  const openUploadFileOld = () => {
    const file = calculateFileOldshow.file;
    if (file !== null) {
      const blobData = new Blob([file], { type: file.type });
      const blobUrl = URL.createObjectURL(blobData);
      window.open(blobUrl);
      URL.revokeObjectURL(blobUrl);
    }
  };

  const openUploadFile = () => {
    if(oldFile === false){
      const file = calculate.auction_file;
      // console.log(file.type);
      if (file !== undefined) {
        const blobData = new Blob([file], { type: file.type });
        const blobUrl = URL.createObjectURL(blobData);
        window.open(blobUrl);
        URL.revokeObjectURL(blobUrl);
      }
    }
    
  };

  const addSubPrice = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (detailSubPriceRef.current == null) {
      return;
    }

    if (detailSubPriceRef.current.value == "" || priceSubPrice == "") {
      return;
    }

    if (calculate.sub_price !== undefined) {
      setCalculate({
        ...calculate,
        sub_price: [
          ...calculate.sub_price,
          {
            detail_price: detailSubPriceRef.current.value,
            price: Number(priceSubPrice),
          },
        ],
      });
    } else {
      setCalculate({
        ...calculate,
        sub_price: [
          {
            detail_price: detailSubPriceRef.current.value,
            price: Number(priceSubPrice),
          },
        ],
      });
    }

    detailSubPriceRef.current.value = "";
    setPriceSubPrice("");
  };

  const onDisable = (Isdisable: boolean) => {
    if (Isdisable) {
      console.log(selectedUnit)
      /** validate all form in this project */
      if (
        isHaveSubPrice === undefined ||
        calculate.budget === undefined ||
        calculate.auction_file === undefined ||
        selectedUnit.value === 'อื่นๆ' ||
        selectedUnit.value === ''
      ) {
        MySwal.fire({
          title: (
            <p className="text-4xl mb-12 mt-6 font-bold">ใส่ข้อมูลไม่ครบ</p>
          ),
          confirmButtonText: (
            <p className="text-2xl px-5 py-1 w-[100px]">ปิด</p>
          ),
        });
        return;
      }

      if (
        isHaveSubPrice &&
        (calculate.sub_price == undefined || calculate.sub_price.length == 0)
      ) {
        MySwal.fire({
          title: (
            <p className="text-4xl mb-12 mt-6 font-bold">
              ใส่ข้อมูลราคากลางย่อยไม่ครบ
            </p>
          ),
          confirmButtonText: (
            <p className="text-2xl px-5 py-1 w-[100px]">ปิด</p>
          ),
        });
        return;
      }

      if (isHaveSubPrice) {
        let sum = 0;
        /** check a sum of array */
        calculate.sub_price?.forEach((element) => {
          sum += Number(element.price);
        });
        console.log(sum, calculate.budget);
        if (sum !== Number(calculate.budget)) {
          MySwal.fire({
            title: (
              <p className="text-4xl mb-12 mt-6 font-bold">
                ราคากลางไม่เท่ากัน
              </p>
            ),
            confirmButtonText: (
              <p className="text-2xl px-5 py-1 w-[100px]">ปิด</p>
            ),
          });
          return;
        }
      }

      setDisable(true);
      setIsSummaryMode(true);
    } else {
      setDisable(false);
      setIsSummaryMode(false);
    }
  };

  const deleteButton = (index: number) => {
    if (calculate.sub_price !== undefined) {
      calculate.sub_price.splice(index, 1);
      setCalculate({
        ...calculate,
        sub_price: [...calculate.sub_price],
      });
    }
  };

  const toggleConfirm = async () => {
    const MySwal = withReactContent(Swal);
    if (
      isHaveSubPrice === undefined ||
      calculate.budget === undefined ||
      calculate.auction_file === undefined
    ) {
      MySwal.fire({
        title: <p className="text-4xl mb-12 mt-6 font-bold">ใส่ข้อมูลไม่ครบ</p>,
        confirmButtonText: <p className="text-2xl px-5 py-1 w-[100px]">ปิด</p>,
      });
      return;
    }

    if (
      isHaveSubPrice &&
      (calculate.sub_price == undefined || calculate.sub_price.length == 0)
    ) {
      MySwal.fire({
        title: <p className="text-4xl mb-12 mt-6 font-bold">ใส่ข้อมูลไม่ครบ</p>,
        confirmButtonText: <p className="text-2xl px-5 py-1 w-[100px]">ปิด</p>,
      });
      return;
    }

    await MySwal.fire({
      title: <p className="text-[#2B3467] font-bold">ยืนยันการเสนออนุมัติ</p>,
      html: (
        <div className="p-2">
          <p className="text-[#188493] text-xl">
            **เมื่อกดปุ่มนี้ ระบบจะส่งข้อมูลไปยังผู้ตรวจสอบและผู้อนุมัติ
            ท่านจะไม่มีสิทธิ์แก้ไขหรือตรวจสอบข้อมูลดังกล่าวได้
            ท่านสามารถกลับมาแก้ไขได้กรณีมีการปฏิเสธกลับมาเท่านั้น
          </p>
        </div>
      ),
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
      cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
      showCancelButton: true,
      confirmButtonColor: "#EB455F",
      preConfirm: async () => {
        if (isHaveSubPrice == true) {
          const prepare: CalculateInterface = {
            auction_file: calculate.auction_file as File,
            budget: Number(calculate.budget),
            pj_id: calculate.pj_id as string,
            sub_price: calculate.sub_price
              ? calculate.sub_price.map((item) => {
                  return {
                    detail_price: item.detail_price,
                    price: Number(item.price),
                  } as CalculateSubPriceInterface;
                })
              : undefined,
          };
          console.log(prepare);
          let res = await CreateCalculateWithSubPrice(prepare);
          if (res.status !== 200) {
            MySwal.showValidationMessage(res.err);
          }

          // ตรวจสอบและอัพเดทข้อมูลที่ต้องการ
          let res2 = await UpdateUnitPriceOfProject(
            calculate.pj_id as string,
            selectedUnit.value
          );
          if (res2.status !== 200) {
            MySwal.showValidationMessage(res2.err);
          }

          return res2;
        } else {
          const prepare: CalculateInterface = {
            auction_file: calculate.auction_file as File,
            budget: Number(calculate.budget),
            pj_id: calculate.pj_id as string,
            sub_price: calculate.sub_price?.map((item) => {
              return {
                detail_price: item.detail_price,
                price: Number(item.price),
              } as CalculateSubPriceInterface;
            }),
          };
          console.log(prepare)
          let res = await CreateCalculate(prepare);
          if (res.status !== 200) {
            MySwal.showValidationMessage(res.err);
          }

          // ตรวจสอบและอัพเดทข้อมูลที่ต้องการ
          console.log(calculate.pj_id);
          let res2 = await UpdateUnitPriceOfProject(
            calculate.pj_id as string,
            selectedUnit.value
          );
          if (res2.status !== 200) {
            MySwal.showValidationMessage(res2.err);
          }

          return res2; // คืนค่า res2 หลังจากทำงานเสร็จ
        }
      },
    }).then((response) => {
      if (response.isConfirmed) {
        MySwal.fire({
          title: <h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>,
          icon: "success",
          confirmButtonText: (
            <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>
          ),
          confirmButtonColor: "#2B3467",
        }).then(() => {
          window.location.href = import.meta.env.BASE_URL;
        });
      }
    });
  };

  const getFile = async (url: string) => {
    const res = await fetch(
      `${
        import.meta.env.DEV
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_PRODUCTION
      }/fileQuery.php?page=${url}`
    );
    const resBlob = await res.blob();
    return resBlob;
  };

  const getReject = async () => {
    console.log(projectKey);
    let res = await GetRejectOld(projectKey);
    setReject(res.data);
    if (res.data.err === null) {
      // load old budget calculate
      res = await GetOldBudgetCalculate(projectKey);
      if (res.subBudget !== undefined && res.subBudget.length !== 0) {
        setIsHaveSubPrice(true);
      } else {
        setIsHaveSubPrice(false);
      }
      let file = await getFile(res.mainBudget.calculate_file);
      setOldFile(true);
      setShowfileold(false);

      setSelectedUnit(res.unit);
      let newFile = new File([file], "Estimated_Price.pdf", { type: "application/pdf" });
      const pathfilename = res.mainBudget.calculate_file;
      const parts = pathfilename.split("/");
      const fileName = parts[parts.length - 1];
      setCalculateFileOld(fileName);
      setCalculateFileOldshow({
        file: newFile,
        fileName: newFile.name,
      });
      setCalculate((prev) => ({
        ...prev,
        auction_file: newFile,
        budget: Number(res.mainBudget.Budget).toFixed(2),
        sub_price: res.subBudget,
      }));
    }
    console.log(res);
  };

  const handleSubpriceChange = (
    e: React.ChangeEvent<{ name: string; value: any }>,
    index: number
  ) => {
    const name = e.target.name;
    if (calculate.sub_price == undefined) {
      return;
    }

    if (name == "detail_price") {
      calculate.sub_price[index].detail_price = e.target.value;
    } else {
      calculate.sub_price[index].price = Number(
        e.target.value.replace(/[,]/g, "")
      );
    }
    setCalculate({
      ...calculate,
      sub_price: [...calculate.sub_price],
    });
  };

  const handleOnBlurCurrencyMain = () => {
    if (calculate.budget) {
      setCalculate({
        ...calculate,
        budget: Number(calculate.budget).toFixed(2),
      });
    }
  };

  const handleOnValueChangeCurrency = (
    value: string | undefined,
    name: string | undefined
  ) => {
    const nameAdd = name as keyof typeof calculate;
    setCalculate({
      ...calculate,
      [nameAdd]: value,
    });
  };

  return (
    <div className="bg-[#FAFAFA] -my-24">
      {/* <button onClick={test}>Test</button> */}
      <div className="flex flex-col justify-center my-[6rem] mx-auto w-5/6 ">
        {" "}
        {/* container */}
        <div className="bg-white drop-shadow-lg rounded-xl border w-full mb-5 mt-24 mr-5">
          <div className="px-12 py-12">
            <h1 className="text-5xl text-[#2B3467] font-bold mb-4">
              {project?.name}
            </h1>
            <hr />
            <div className=" md:grid-cols-2 mb-6 ml-6">
            <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>เลขที่เอกสาร</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project?.key}
                      </p>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>สถานะ</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {project?.status.status_name}
                      </p>
                    </label>
                  </div>
                  <div className="mt-3 grid grid-cols-11">
                    <label className="text-2xl font-bold col-span-2">
                      <p>วันที่เพิ่ม</p>
                    </label>
                    <label className="text-2xl text-left font-bold col-span-1 mr-3">
                      <p>:</p>
                    </label>
                    <label className="text-2xl col-span-7 pr-5">
                      <p className="inline"> 
                      {datetimeFormatter(project?.add_datetime || "")}
                      </p>
                    </label>
                  </div>
            </div>

            <div className="flex flex-col ml-6">
              <h3 className="text-3xl text-[#575757] font-bold">
                ดาวน์โหลดเอกสาร
              </h3>
              <div className="flex justify-start gap-5 mt-5">
                <div>
                  <button
                    className="text-white  bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-3xl text-2xl px-2 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                    onClick={() => {
                      showFileOnClick(project?.Tor_uri || "");
                    }}
                  >
                    <BsDownload className="text-2xl w-5 h-5 mr-2" />
                    TOR
                  </button>
                  <button
                    className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-3xl text-2xl px-6 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                    onClick={() => {
                      showFileOnClick(project?.Job_description_uri || "");
                    }}
                  >
                    <BsDownload className="text-2xl w-5 h-5 mr-2" />
                    ใบแจ้งงาน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white drop-shadow-lg rounded-xl border w-full my-5 mr-5">
          <div className="px-12 py-12">
            <h1 className="text-4xl font-bold mb-4 text-[#2B3467]">
              คำนวณราคากลาง
            </h1>
            <div className="flex flex-col">
              <div className="ml-4 mt-3 mb-5 flex flex-col">
                <label className="text-2xl mb-4">
                  1. ไฟล์คำนวณราคากลาง{" "}
                  <span className="text-xl text-[#FF0000]">
                    (โปรดเก็บเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)
                  </span>
                </label>{" "}
                {/* to show a tag of input */}
                <div hidden={showfileold}>
                <div className="grid grid-cols-12 pb-2">
                  <input
                    className="
                        col-start-1 col-end-7
                        w-full
                        border rounded-md
                        bg-neutral-100 input-disable first-letter:p-3 text-xl mx-2
                        px-3
                       "
                    value={calculateFileOld}
                    disabled
                  ></input>
                  {/* <div className="ml-5 col-start-7 col-end-9 flex flex-row justify-center">
                    <p className="text-md text-red-500">ไฟล์ราคากลางเดิม</p>
                  </div> */}
                  <div className="ml-4 col-start-7 col-end-10 flex flex-row">
                    <button
                      className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg"
                      onClick={openUploadFileOld}
                    >
                      ตรวจสอบไฟล์เดิม{" "}
                    </button>
                  </div>
                </div>
                </div>
                
                <div className="grid grid-cols-12">
                  <input
                    id="auction_file"
                    onChange={handleFileChange}
                    className="
                        col-start-1 col-end-7
                        w-full
                        relative p-2 px-3 py-2 m-0 ml-2 block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding  text-xl font-normal text-neutral-700 transition duration-300 ease-in-out 
                        file:-mx-3 file:-my-4 file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-5 file:py-3 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] file:hover:cursor-pointer
                        disabled:bg-gray-300 disabled:text-black
                        hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary
                        cursor-pointer"
                    type="file"
                    name="auction_file"
                    ref={calculateFileRef}
                    disabled={disable}
                    accept="application/pdf"
                  />{" "}
                  {/* to get a file when upload */}
                  <div className="col-start-7 col-end-9 flex flex-row justify-center" >
                    <button
                      className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg"
                      onClick={openUploadFile}
                      hidden={showcheckfile}
                    >
                      ตรวจสอบไฟล์{" "}
                    </button>
                  </div>
                </div>
              </div>
              <div className="ml-4 mt-3 mb-5 flex flex-col">
                <label className="text-2xl mb-4">2. ราคากลางที่คำนวณแล้ว</label>
                <div className="flex">
                <CurrencyInput
                  name="budget"
                  type="text"
                  className="ml-2 p-2.5 px-4 border text-2xl rounded-md w-1/3 text-left"
                  onValueChange={(
                    value: string | undefined,
                    name: string | undefined
                  ) => {
                    handleOnValueChangeCurrency(value, name);
                  }}
                  onBlur={handleOnBlurCurrencyMain}
                  value={calculate.budget}
                  disabled={disable}
                />
                <AsyncSelect
                  isDisabled={disable}
                  placeholder="หน่วย"
                  id="unit"
                  className={`w-1/4 h-10 px-3 text-xl focus:shadow-outline text-left ${
                    disable ? '  cursor-not-allowed' : 'bg-white'
                  }`}
                  cacheOptions
                  defaultOptions
                  loadOptions={loadUnitPrice}
                  onChange={handleUnitPriceChange}
                  value={selectedUnit}
                  styles={{
                    // เพิ่มสไตล์เพื่อปรับขนาดของกล่อง
                    control: (provided) => ({
                      ...provided,
                      minHeight: "55px", 
                      width: "100%",
                    }),
                  }}
                  
                />
                <input
                  disabled={disable}
                  placeholder="ระบุ"
                  className="border rounded w-3/12 h-15 px-3 text-gray-700 text-xl focus:shadow-outline"
                  id="unit-price"
                  name="unit-price"
                  type="text"
                  defaultValue={reject?.err === null && selectedUnit?.label == "อื่นๆ" ? selectedUnit?.value : null}
                  onChange={(e) => handleMoreUnitPriceChange(e)}
                  hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
                ></input>
                </div>
              </div>

              {/* sub budget */}
              <div className="ml-4 mt-3 flex flex-col">
                <label className="text-2xl mb-3">
                  3. มีราคากลางย่อยหรือไม่
                </label>
                <div className="ml-2">
                  <input
                    id="have-subPrice"
                    name="isHaveSubPrice"
                    className="inline-block w-4 h-4"
                    type="radio"
                    onClick={() => {
                      setIsHaveSubPrice(true);
                    }}
                    checked={
                      isHaveSubPrice === undefined
                        ? false
                        : isHaveSubPrice
                        ? true
                        : false
                    }
                    disabled={disable}
                  />
                  <label htmlFor="have-subPrice" className="pl-2 text-2xl">
                    มีราคากลางย่อย
                  </label>
                  <input
                    id="havent-subPrice"
                    name="isHaveSubPrice"
                    type="radio"
                    className="ml-3 w-4 h-4"
                    onClick={() => {
                      setIsHaveSubPrice(false);
                    }}
                    checked={
                      isHaveSubPrice === undefined
                        ? false
                        : isHaveSubPrice
                        ? false
                        : true
                    }
                    disabled={disable}
                  />
                  <label htmlFor="havent-subPrice" className="pl-2 text-2xl">
                    ไม่มีราคากลางย่อย
                  </label>
                </div>

                {/* add a sub Price location */}
                <div className={`${isHaveSubPrice ? "" : "hidden"} `}>
                  <hr className="my-8"></hr>
                  <div>
                    <p className="text-green-700 text-2xl p2">
                      <b>คำแนะนำ:</b> 1. กรุณาใส่ชื่อที่ต้องการเลือกลงในช่อง
                      และกดปุ่ม "เพิ่ม" เพื่อยืนยัน
                    </p>
                    <p className="text-green-700 text-2xl p2 ml-24">
                      2. สามารถเพิ่มรายละเอียดของราคากลางย่อยได้หลายรายการ
                    </p>
                  </div>
                  <div className="bg-white rounded-lg border mb-3 mt-6">
                    <table className="min-w-full rounded-lg overflow-auto">
                      <thead className="text-white bg-[#2B2A2A] rounded-lg h-14">
                        <tr className="text-xl">
                          <th
                            scope="col"
                            className="rounded-tl-lg px-6 py-3  w-[100px] text-center leading-4 uppercase tracking-wider"
                          >
                            ลำดับ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center leading-4 uppercase tracking-wider"
                          >
                            รายละเอียด
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-center w-[150px] leading-4 uppercase tracking-wider"
                          >
                            ราคา
                          </th>
                          <th>
                            หน่วย
                          </th>
                          <th
                            scope="col"
                            className="rounded-tr-lg px-6 py-3 w-[230px] text-center leading-4 uppercase tracking-wider"
                          ></th>
                        </tr>
                      </thead>

                      {/* Body */}
                      <tbody>
                        {calculate.sub_price?.map((sub, index: number) => (
                          <tr
                            key={index}
                            className="text-gray-700 text-lg h-14 border-b-2 border-black-700 pt-5"
                            style={{ verticalAlign: "top" }}
                          >
                            <td className="whitespace-no-wrap text-center text-xl py-4">
                              {index + 1}
                            </td>
                            <td className="whitespace-no-wrap text-xl text-left ps-2 py-4">
                                {isEditing && editedIndex === index ? (
                                  <textarea
                                    
                                    value={editedSubPrice.detail_price}
                                    onChange={(e) =>
                                      setEditedSubPrice({
                                        ...editedSubPrice,
                                        detail_price: e.target.value,
                                      })
                                    }
                                    className="border rounded  px-2 focus:outline-none w-full"
                                  />
                                ) : (
                                  <span>
                                    {sub.detail_price.length > 30 ? (
                                      <div className="break-words">{sub.detail_price}</div>
                                    ) : (
                                      sub.detail_price
                                    )}
                                  </span>
                                )}
                              </td>
                            <td className="whitespace-no-wrap text-xl text-center w-[150px] py-4">
                            {isEditing && editedIndex === index ? (
                              <CurrencyInput
                              type = "text"
                                value={editedSubPrice.price}
                                onValueChange={(value) =>
                                  setEditedSubPrice({
                                    ...editedSubPrice,
                                    price: Number(value) || 0,
                                  })
                                }
                                className="border rounded  px-2 focus:outline-none w-[150px]"
                              />
                              
                            ) : (
                              // จัดรูปแบบราคาด้วย toLocaleString
                              // (editedSubPrice.price || sub.price).toLocaleString(undefined, {
                              //   minimumFractionDigits: 2,
                              //   maximumFractionDigits: 2,
                              // }) + " " + selectedUnit.value 
                              
                              <CurrencyInput
                              name="budget"
                              type="text"
                              value={Number(sub.price).toFixed(2)}
                              readOnly
                                className="text-center rounded  px-2 focus:outline-none"
                              />   
                            )}
                            
                            </td>
                            <td className="text-lg text-center w-[150px] py-4">
                            {selectedUnit.value}
                            </td>
                            <td className=" whitespace-no-wrap text-center py-2">
                              <div>
                                {isEditing && editedIndex === index ? (
                                  <div>
                                    <button
                                      className="p-2 my-1 w-[70px] rounded-lg text-white bg-[#28a745] hover:bg-green-700 mr-4 "
                                      onClick={() => handleSaveClick(index)}
                                    >
                                      บันทึก
                                    </button>
                                    <button
                                      className="p-2 my-1 w-[70px] rounded-lg text-white bg-[#dc3545] hover:bg-red-700"
                                      onClick={handleCancelClick}
                                    >
                                      ยกเลิก
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      className={`p-2 my-1 w-[70px] rounded-lg text-white bg-[#007BFF] hover:bg-blue-700 mr-4 ${
                                        isSummaryMode ? "hidden" : ""
                                      }`}
                                      onClick={() => handleEditClick(index)}
                                    >
                                      แก้ไข
                                    </button>
                                    <button
                                      className={`p-2 my-1 w-[70px] rounded-lg text-white bg-[#CD2929] hover:bg-red-900 disabled:bg-gray-200 disabled:text-black ${
                                        isSummaryMode ? "hidden" : ""
                                      }`}
                                      onClick={(
                                        e: React.MouseEvent<HTMLButtonElement>
                                      ) => {
                                        e.preventDefault();
                                        deleteButton(index);
                                      }}
                                      disabled={disable || isEditing} // ป้องกันการลบเมื่ออยู่ในโหมดแก้ไข
                                    >
                                      ลบ
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}

                        <tr className="bg-[#e6e6e6] rounded-b-lg text-black text-xl h-14 border-b-2">
                          <th className="rounded-bl-lg"></th>
                          <th className="">รวมราคากลางสุทธิ</th>
                          <th>
                            {Array.isArray(calculate.sub_price) &&
                              calculate.sub_price
                                .reduce((prev, curr) => {
                                  return (
                                    prev +
                                    parseFloat((curr.price as string) || "0")
                                  );
                                }, 0)
                                .toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                          </th>

                          {firstSub && (
                            <th className="text-lg text-center w-[150px] py-4">
                              {selectedUnit.value}
                            </th>
                          )}
                          {!firstSub && (
                            <th className="text-lg text-center w-[150px] py-4">
                              
                            </th>
                          )}
                           
                              <th
                            className={` ${
                              Array.isArray(calculate.sub_price) &&
                              calculate.sub_price.reduce((prev, curr) => {
                                return (
                                  prev +
                                  parseFloat((curr.price as string) || "0")
                                );
                              }, 0) === parseFloat(calculate.budget as string)
                                ? "text-green-600"
                                : "text-red-500"
                            } rounded-br-lg`}
                          >
                            {Array.isArray(calculate.sub_price) &&
                            calculate.sub_price.reduce((prev, curr) => {
                              return (
                                prev + parseFloat((curr.price as string) || "0")
                              );
                            }, 0) === parseFloat(calculate.budget as string)
                              ? "ราคาครบตามกำหนดแล้ว"
                              : "ราคายังไม่ครบตามกำหนด"}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <table className="min-w-full mt-10">
                    <tr>
                      
                      <th hidden={disable} className="text-xl">รายละเอียด</th>
                      <th hidden={disable} className="w-[240px] text-xl">ราคากลางย่อย</th>
                      <th className="w-[230px]"></th>
                    </tr>
                    <tr>
                      
                      <td className="confirm-input-price">
                        <input
                          className="border rounded-md w-full py-2.5 px-3 mt-2 text-gray-700 text-xl focus:shadow-outline"
                          placeholder="รายละเอียด"
                          hidden={disable}
                          ref={detailSubPriceRef}
                        />
                      </td>
                      <td>
                        <CurrencyInput
                          className="border rounded-md w-full py-2.5 px-3 mt-2 mx-3 text-gray-700 text-xl focus:shadow-outline"
                          placeholder="ราคากลางย่อย"
                          onValueChange={(value) =>
                            handleAddSubPriceChange(value || "")
                          }
                          hidden={disable}
                          value={priceSubPrice}
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className={`py-2 px-5 mt-2 w-[70px] border rounded-lg bg-[#EB455F] text-white disabled:bg-gray-200 disabled:text-black ${
                            isPriceComplete ? "hidden" : ""
                          }`}
                          disabled={disable}
                          onClick={addSubPrice}
                        >
                          เพิ่ม
                        </button>
                      </td>
                    </tr>
                  </table>
                </div>

                {/* Submit Button */}

                <div className="flex justify-around mt-10 mx-40">
                  {!disable && (
                    <button
                      className="p-3 bg-[#2B3467] text-white text-3xl border rounded-lg px-12"
                      onClick={() => onDisable(true)}
                    >
                      สรุปข้อมูล
                    </button>
                  )}
                  {disable && (
                    <>
                      <button
                        className="p-3 bg-[#549743] text-white text-3xl border rounded-lg px-12"
                        onClick={toggleConfirm}
                      >
                        เสนออนุมัติ
                      </button>
                      <button
                        className="p-3 bg-[#D8C303] text-white text-3xl border rounded-lg px-12"
                        onClick={() => onDisable(false)}
                      >
                        แก้ไขข้อมูล
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* history Log section */}
        <div>
          <LogComponent />
        </div>
        {/* managers section */}
        <div>
          <ManagerComponent />
        </div>
        <div className="mb-16"></div>
      </div>
    </div>
  );
}