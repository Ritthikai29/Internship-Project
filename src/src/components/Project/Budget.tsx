import React, { useRef, useState } from "react";
import {
  SubPriceInterface,
} from "../../models/Project/IProject";
import { useProjectContext } from "../../pages/Project/ProjectCreate";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import AsyncSelect from "react-select/async";
import { GetUnitPrice } from "../../services/ProjectService/ProjectService";

export default function Budget({
  isHaveSubprice,
  setIsHaveSubprice,
  selectedUnit,
  setSelectedUnit,
}: {
  isHaveSubprice: boolean | undefined;
  setIsHaveSubprice: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  selectedUnit: any;
  setSelectedUnit: React.Dispatch<React.SetStateAction<any>>;
}) {
  const {
    project,
    setProject,
    totalPrice,
    setTotalPrice,
    deciPrice,
    setDeciPrice,
  } = useProjectContext();
  const [price, setPrice] = useState<string>("");
  const [priceSubPrice, setPriceSubPrice] = useState<string>("");
  const [checkprice, setcheckprice] = useState<string>();
  const detailSubPriceRef = useRef<HTMLInputElement>(null);
  const [LocalTotalprice, setLocalTotalprice] = useState<number>(0);
  const [yourState, setYourState] = useState<boolean>(true);
  const [PriceState, setPriceState] = useState(false);
  // เพิ่ม State สำหรับการแก้ไขรายการ
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedDetail, setEditedDetail] = useState<string>("");
  const [editedPrice, setEditedPrice] = useState<string>("");

  // const [editedSubPrice, setEditedSubPrice] = useState<{
  //   detail_price: string;
  //   price: string | number;
  // }>({ detail_price: "", price: 0 });
  // const [editedIndex, setEditedIndex] = useState(-1);

  // Function เปิด Modal หรือ Form สำหรับการแก้ไข
  const openEditModal = (index: number) => {
    const subPriceToEdit = project.subPrice && project.subPrice[index];
    if (subPriceToEdit) {
      setEditingIndex(index);
      setEditedDetail(subPriceToEdit.detail_price);
      setEditedPrice(subPriceToEdit.price.toLocaleString());
    }
  };
  // Function บันทึกการแก้ไข
  const handleEditSubmit = (e: React.FormEvent, index: number) => {
    e.preventDefault();

    // นำข้อมูลที่แก้ไขมาอัพเดตใน state
    const updatedSubPrices = [...project.subPrice!];
    const originalPrice = updatedSubPrices[index].price;
    const oldItem = updatedSubPrices[index];
    const oldPrice = oldItem.price;

    updatedSubPrices[index] = {
      detail_price: editedDetail,
      price: Number(editedPrice.replace(/[,]/g, "")),
    };
    setProject({
      ...project,
      subPrice: updatedSubPrices,
    });
    // ปิดการแก้ไข
    setEditingIndex(null);
    setEditedDetail("");
    setEditedPrice("");
    // นำข้อมูลที่แก้ไขมาอัพเดตใน state รวมทั้งราคารวม
    const updatedTotalPrice =
      totalPrice - originalPrice + updatedSubPrices[index].price;
    setTotalPrice(updatedTotalPrice);
    setLocalTotalprice(updatedTotalPrice);

    // ตรวจสอบว่าราคารวมตรงกับ deciPrice หรือไม่
    if (updatedTotalPrice !== deciPrice) {
      setcheckprice("ราคายังไม่ครบตามกำหนด");
      setYourState(true);
    } else {
      setcheckprice("ราคาครบตามกำหนด");
      setYourState(false);
    }
  };

  // Function ยกเลิกการแก้ไข
  const cancelEdit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEditingIndex(null);
    setEditedDetail("");
    setEditedPrice("");
    // ปรับปรุงเงื่อนไขตรวจสอบราคา
    if (totalPrice !== deciPrice) {
      setcheckprice("ราคายังไม่ครบตามกำหนด");
      setYourState(true);
    } else {
      setcheckprice("ราคาครบตามกำหนด");
      setYourState(false);
    }
  };

  const handleAddSubPriceChange = (value: string) => {
    setPriceSubPrice(value);
  };
  // Function ลบรายการ
  const handleDelete = (index: number) => {
    const updatedSubPrices = [...project.subPrice!];
    const deletedItem = updatedSubPrices.splice(index, 1)[0];

    // นำราคาของรายการที่ลบออกจากราคารวม
    const updatedTotalPrice = totalPrice - deletedItem.price;
    setTotalPrice(updatedTotalPrice);

    // นำข้อมูลที่แก้ไขมาอัพเดตใน state
    setProject({
      ...project,
      subPrice: updatedSubPrices,
    });
    // ปรับปรุงเงื่อนไขตรวจสอบราคา
    if (updatedTotalPrice !== deciPrice) {
      setcheckprice("ราคายังไม่ครบตามกำหนด");
      setYourState(true);
    } else {
      setcheckprice("ราคาครบตามกำหนด");
      setYourState(false);
    }
  };

  const handleSubPriceAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPriceState(false);

    // console.log(priceSubPriceRef.current?.value === );
    if (priceSubPrice === "" || priceSubPrice === undefined) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกราคากลางย่อย",
      });
      return;
    }
    // console.log(detailSubPriceRef.current?.value === "");
    if (
      detailSubPriceRef.current?.value === "" ||
      detailSubPriceRef.current?.value == undefined
    ) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกรายละเอียด",
      });
      return;
    }

    if (project.subPrice === undefined) {
      // when it will not create a sub price
      setProject({
        ...project,
        subPrice: [
          {
            detail_price: detailSubPriceRef.current.value,
            price: Number(priceSubPrice.replace(/[,]/g, "")),
          },
        ],
      });
    } else {
      // when it create a sub price
      setProject({
        ...project,
        subPrice: [
          ...project.subPrice,
          {
            detail_price: detailSubPriceRef.current.value,
            price: parseFloat(priceSubPrice.replace(/[,]/g, "")),
          },
        ],
      });
    }
    // let totalPrice = Number(0);

    const total = totalPrice as number; // ราคารวม
    let price = Number(priceSubPrice.replace(/[,]/g, "")) as number; //ราคากลางย่อยแต่ละตัว

    console.log(price);
    if (isNaN(price)) {
      //ค่าผลรวม set NaN=0
      price = 0;
      return;
    }

    const LocalTotalprice = Number(total + price);
    setTotalPrice(LocalTotalprice);
    setLocalTotalprice(LocalTotalprice);
    // setLocalTotalprice(LocalTotalprice);
    console.log(LocalTotalprice);
    // const checkprice = (LocalTotalprice - project.price);
    // if(LocalTotalprice !== project.price){
    setDeciPrice(deciPrice);
    if (LocalTotalprice !== Number(deciPrice)) {
      setcheckprice("ราคายังไม่ครบตามกำหนด");
      setYourState(true);
    } else {
      setcheckprice("ราคาครบตามกำหนด");
      setYourState(false);
    }
    detailSubPriceRef.current.value = "";
    setPriceSubPrice("");
  };

  const test = () => {
    console.log(totalPrice);
  };
  const handleNumberChange = (
    e: React.ChangeEvent<{ name: string; value: any }>
  ) => {
    const name = e.target.name as keyof typeof project;
    const price: string = e.target.value;
    // ใช้ method replace และ regular expression เพื่อกำจัด comma และตรวจสอบทศนิยม
    let text = price.replace(/,/gi, "");
    let deciPrice = parseFloat(text);

    if (isNaN(deciPrice)) {
      deciPrice = 0;
    }

    setProject({
      ...project,
      [name]: deciPrice,
    });
    setDeciPrice(deciPrice);

    // ตรวจสอบว่าค่าที่ได้มีทศนิยมหรือไม่
    let lastCharIsADot = text.substring(text.length - 1) === ".";
    if (lastCharIsADot) {
      setPrice(deciPrice.toLocaleString("en-US") + ".");
    } else {
      setPrice(deciPrice.toLocaleString("en-US"));
    }

    if (totalPrice !== deciPrice) {
      setcheckprice(" ราคายังไม่ครบตามกำหนด ");
      setYourState(true);
      return;
    } else {
      setcheckprice("ราคาครบตามกำหนด");
      setYourState(false);
      return;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof typeof project;
    if (event.target.files) {
      setProject({
        ...project,
        [name]: event.target.files[0],
      });
    }
  };

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

  const handleMoreUnitPriceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const object = {
      label: "อื่นๆ",
      value: e.target.value,
    };
  
    setSelectedUnit(object);
    console.log(selectedUnit);
  };
  const openUploadFilejobDescription: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    
    // โค้ดเปิดหน้าใหม่
    const file = project.jobDescription;
    if (file !== undefined) {
        const blobData = new Blob([file], { type: file.type });
        const blobUrl = URL.createObjectURL(blobData);
        window.open(blobUrl, '_blank');
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 100);
    }
};
  
  

  return (
    <div>
      {/* <a onClick={test}>dsa</a> */}
      <div className="lg:mb-7">
        <label className=" text-gray-700 text-xl font-bold">
          1. โปรดแนบไฟล์ราคากลาง PDF ที่อนุมัติแล้ว
          <span className="text-red-500 text-lg ml-2">
            (โปรดเก็บเป็นความลับและห้ามพิมพ์ออกมาเด็ดขาด)
          </span>
        </label>
        <br />
        <input
          className="border rounded w-35/12 py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline"
          id="budget-price-file"
          type="file"
          placeholder="ราคากลาง"
          name="calculateFile"
          required
          onChange={handleFileChange}
          accept="application/pdf"
        />
        <button
          className="border p-2 bg-[#EB455F] text-white rounded-lg text-lg ml-2"
          onClick={openUploadFilejobDescription}
          >ตรวจสอบไฟล์ </button>
      </div>
      <div className="lg:mb-7">
        <label className=" text-gray-700 text-xl font-bold">
          2. โปรดใส่ราคากลางสุทธิ (รวม)
        </label>

        <div className="flex">
          <CurrencyInput
            className="border rounded w-6/12 h-12 py-2.5 px-3 mt-2 text-gray-700 text-xl focus:shadow-outline"
            id="budget-price"
            name="price"
            type="text"
            placeholder={
              deciPrice !== 0 ? deciPrice.toLocaleString() : "ราคากลาง"
            }
            required
            onChange={handleNumberChange}
          />
          <AsyncSelect
            placeholder="หน่วย"
            id="unit"
            className="w-3/12 h-12 py-2 px-3 text-xl focus:shadow-outline "
            cacheOptions
            defaultOptions
            loadOptions={loadUnitPrice}
            onChange={handleUnitPriceChange}
            value={selectedUnit}
            styles={{
              // เพิ่มสไตล์เพื่อปรับขนาดของกล่อง
              control: (provided) => ({
                ...provided,
                minHeight: "48px",
                width: "100%",
              }),
            }}
          />
          <input
            placeholder="หน่วยอื่นๆ"
            className="border rounded w-3/12 h-12 py-2.5 px-3 mt-2 text-gray-700 text-xl focus:shadow-outline"
            id="unit-price"
            name="unit-price"
            type="text"
            onChange={(e) => handleMoreUnitPriceChange(e)}
            hidden={selectedUnit == undefined || selectedUnit.label !== "อื่นๆ"}
          ></input>
        </div>
      </div>

      <div>
        <label className="text-gray-700 text-xl font-bold">
          3. ท่านมีราคากลางย่อยที่ต้องใช้กำหนดเปรียบเทียบในการประกวดราคาหรือไม่
        </label>
        <div className="mt-2">
          <div className="ml-6">
            <input
              className="mr-2"
              type="radio"
              name="is-have"
              id="is-have"
              required
              onClick={() => {
                setIsHaveSubprice(true);
              }}
            />
            <label htmlFor="is-have" className="text-gray-700 text-xl">
              มีราคากลางย่อย
            </label>
            <input
              className="ml-9 mr-2"
              type="radio"
              name="is-have"
              id="is-haven't"
              defaultChecked={true}
              required
              onClick={() => {
                setIsHaveSubprice(false);
              }}
            />
            <label htmlFor="is-haven't" className="text-gray-700 text-xl">
              ไม่มีราคากลางย่อย
            </label>
          </div>
        </div>
      </div>

      {/* part of subprice */}
      {isHaveSubprice && (
        <div id="sub-price-section">
          <hr className="my-8"></hr>
          <div>
            <p className="text-green-700 text-xl p2">
              <b>คำแนะนำ:</b> 1. กรุณาใส่รายละเอียดและราคากลางย่อยที่ต้องการลงในช่อง และกดปุ่ม
              "เพิ่ม" เพื่อยืนยัน
            </p>
            <p className="text-green-700 text-xl p2 ml-20">
              2. สามารถเพิ่มรายละเอียดของราคากลางย่อยได้หลายรายการ
            </p>
          </div>
          <div
            className="bg-white rounded-lg border mb-3 mt-6"
            id="sub-price-detail"
          >
            <table className="w-full rounded-lg table-fixed">
              <thead className="text-white uppercase bg-[#2B2A2A] h-14">
                <tr>
                  <th className="justify-self-center rounded-tl-lg text-lg w-[5rem]">
                    ลำดับ
                  </th>
                  <th className="justify-self-center text-lg w-[15rem]">รายละเอียด</th>
                  <th className="justify-self-center text-lg w-[10rem]">ราคา</th>
                  <th className="justify-self-center text-lg w-[10rem]">หน่วย</th>
                  <th className="justify-self-center rounded-tr-lg text-lg w-[10rem]">
                    {" "}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white border-b-lg rounded-xl h-14">
                {project.subPrice?.map(
                  (subPrice: SubPriceInterface, index: number) => (
                    <tr
                      key={index}
                      className="text-gray-700 text-lg h-14 border-b-2 border-black-700"
                    >
                      <th className="rounded-bl-lg">{index + 1}</th>
                      <th className="text-left">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editedDetail}
                            onChange={(e) => setEditedDetail(e.target.value)}
                            className="border rounded py-1 px-2 focus:outline-none"
                          />
                        ) : (
                          subPrice.detail_price
                        )}
                      </th>
                      <th>
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(e.target.value)}
                            className="border rounded py-1 px-2 focus:outline-none "
                          />
                        ) : (
                          subPrice.price.toLocaleString()
                        )}
                      </th>
                      <th>{selectedUnit.value}</th>
                      <th className="rounded-br-lg">
                        {editingIndex === index ? (
                          <>
                            <button
                              className="bg-green-500 text-lg text-white hover:bg-green-700 border py-1.5 px-4 rounded-xl mr-4"
                              onClick={(e) => handleEditSubmit(e, index)}
                            >
                              บันทึก
                            </button>
                            <button
                              className="bg-red-500 text-lg text-white hover:bg-red-700 border py-1.5 px-4 rounded-xl mr-4"
                              onClick={cancelEdit}
                            >
                              ยกเลิก
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-blue-500 text-lg text-white hover:bg-blue-700 border py-1.5 px-4 rounded-xl mr-4"
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                e.preventDefault();
                                openEditModal(index);
                              }}
                            >
                              แก้ไข
                            </button>
                            <button
                              className="bg-red-500 text-lg text-white hover:bg-red-700 border py-1.5 px-4 rounded-xl "
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>
                              ) => {
                                e.preventDefault();
                                handleDelete(index);
                              }}
                            >
                              ลบ
                            </button>
                          </>
                        )}
                      </th>
                    </tr>
                  )
                )}
                <tr className="bg-[#e6e6e6] rounded-b-lg text-black text-lg h-14 border-b-2" style={{ verticalAlign: "top" }}>
                  <th className="rounded-bl-lg"></th>
                  <th className="py-3">รวมราคากลางสุทธิ</th>
                  <th className="py-3">{totalPrice.toLocaleString()}</th>
                  <th className="py-3">{selectedUnit.value}</th>
                  <th style={{ color: yourState ? "red" : "green" }} className="pr-1 text-lg py-3">
                    {checkprice}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
          <br></br>
          <div id="sub-price-insert" className="w-full grid grid-cols-4">
            <div className="flex flex-col items-center col-start-1 col-end-3">
              <label className="text-gray-700 text-xl">รายละเอียด</label>
              <input
                className="border rounded w-[28rem] py-2.5 px-3 mx-3  mt-2 text-gray-700 text-lg focus:shadow-outline"
                id="sub-price-detail"
                name="detail_price"
                type="text"
                placeholder="รายละเอียด"
                ref={detailSubPriceRef}
              />
            </div>
            <div className="flex flex-col items-center mx-auto col-start-3">
              <label className="text-gray-700 text-xl">ราคากลางย่อย</label>
              <CurrencyInput
                className="border rounded-md w-full py-2.5 px-3 mt-2 mx-3 text-gray-700 text-lg focus:shadow-outline"
                placeholder="ราคากลางย่อย"
                onValueChange={(value) => handleAddSubPriceChange(value || "")}
                value={priceSubPrice}
              />
            </div>
            <div className="flex flex-col items-center mx-auto col-start-4 mb-5">
              <label>ㅤ</label>
              <button
                className={`py-2.5 px-5 mt-3 border rounded-xl ${
                  yourState ? "bg-red-500 text-white" : "hidden"
                }`}
                onClick={handleSubPriceAdd}
              >
                เพิ่ม
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
