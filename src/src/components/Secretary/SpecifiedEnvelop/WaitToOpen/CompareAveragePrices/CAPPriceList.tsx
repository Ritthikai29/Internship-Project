import {
  IProject,
  IVendorProject,
} from "../../../../../models/Secretary/IProjectSecretary";
import { showFileOnClick } from "../../../../../services/utilitity";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CAPPriceList({
  vendor,
  project,
}: {
  vendor: IVendorProject[] | undefined;
  project: IProject;
}) {
  const [isOpenMap, setIsOpenMap] = useState<{ [key: number]: boolean }>({});
  const [hasSubprice, setHasSubprice] = useState<boolean>(false);

  const handleButtonClick = (index: number) => {
    if (vendor && vendor[index].subprice && vendor[index].subprice.length > 0) {
      setIsOpenMap((prevState) => ({
        ...prevState,
        [index]: !prevState[index],
      }));
      setHasSubprice(true);
    } else {
      setHasSubprice(false);
    }
  };

  const withOpenHistory = async (index: number) => {   

    console.log('ประวัติการเสนอราคา')
    console.log(vendor?.[index]?.history_price) 

    Swal.fire({
        title: 'ประวัติการเสนอราคา',
        html: ` <div style="margin-left: 10px; 
                          margin-right: 20px; 
                          padding: 10px; 
                          border: 1px solid #CFCFCF; 
                          box-shadow:0px 2px #888888; 
                          background-color: #EAE7E7; 
                          display: flex; 
                          flex-direction: column; 
                          font-size: medium;">    
              
                  <table id="additionalTable">
                  </table>
                </div>
            `,
        confirmButtonColor: '#2B3467',
        confirmButtonText: '<div style="font-size: 13px; ">ปิด</div>',
        
        didOpen: () => {
            const additionalTable = document.getElementById('additionalTable');  
              if(additionalTable){
                if(vendor) {
                  
                  for (let i = 0; i < vendor[index].history_price!.length; i++) {
                    let data = vendor[index]
                    const newRow = document.createElement('tr');
                    if (i === 0){
                      newRow.innerHTML = `
                    <td style="text-align: left;">เสนอราคาครั้งแรก </td>
                    <td style="text-align: left;"> : </td>
                    <td style="text-align: left;">${  data.history_price ? 
                                                      data.history_price[i]!.registers_status_id == "11"? "สละสิทธิ์" : 
                                                      data.history_price[i]!.registers_status_id == "12"? "ไม่มีการเสนอราคา":
                                                      data.history_price[i]!.registers_status_id == "10"?  Number(data.history_price[i]!.price).toLocaleString(undefined, {minimumFractionDigits: 2,}):"-": "-"} </td>
                    `;
                    
                    } else{
                      newRow.innerHTML = `
                    <td style="text-align: left;">เจรจาครั้งที่ ${i}</td>
                    <td style="text-align: left;"> : </td>
                    <td style="text-align: left;">${  data.history_price ? 
                                                      data.history_price[i]!.registers_status_id == "11"? "สละสิทธิ์" : 
                                                      data.history_price[i]!.registers_status_id == "12"? "ไม่มีการเสนอราคา":
                                                      data.history_price[i]!.registers_status_id == "7"?  Number(data.history_price[i]!.price).toLocaleString(undefined, {minimumFractionDigits: 2,}):"ไม่ถูกเชิญเจรจา": "ไม่ถูกเชิญเจรจา"} </td>
                    `;
                      //Number(data.history_price[i]!.price).toLocaleString(undefined, {minimumFractionDigits: 2,})
                    }
                    additionalTable.appendChild(newRow);  
                } 
                }
                
              }
                           
             
        }
 
    } as any).then( (result) =>{

      console.log(result)
    })
  }

  useEffect(() => {

    console.log("รายละเอียดโปรเจค");
    console.log(project);
    console.log("รายละเอียดผู้รับเหมา");
    console.log(vendor);

  }, [isOpenMap]);

  // ตารางราคากลางย่อยที่จะให้แสดงเมื่อทำการกดปุ่มเปิด
  const SubTable: React.FC<{ subtable?: IVendorProject[]; index: number }> = ({
    subtable = [],
    index,
  }) => {
    const selectedVendor = subtable[index];
    const projects = project; // ลบ as IProject[] ออก
    return (
      <div className="col-span-6 w-full text-black text-xl bg-[#ffffff] drop-shadow-md items-center gap-y-2 mt-1 mb-1 p-2">
        <div className="grid grid-cols-4 justify-items-center text-white text-lg bg-[#2B3467] rounded-t-lg">
          <p className="py-3 pl-2">รายละเอียด</p>
          <p className="py-3 pl-2">ราคากลางที่บริษัทตั้งไว้</p>
          <p className="py-3 pl-2">ราคากลางที่ vendor เสนอ</p>
          <p className="py-3 pl-2">ผลลัพธ์</p>
        </div>

        <div className="grid grid-cols-4 justify-items-center text-lg bg-[#e5e5e5] ">
          {selectedVendor &&
            selectedVendor.subprice &&
            selectedVendor.subprice.map((subPriceItem, subIdex) => (
              <React.Fragment key={subPriceItem.id}>
                <p className="py-3 pl-2">{subPriceItem.detail}</p>
                <p className="py-3 pl-2">
                  {Number(projects.subPrice[subIdex].price).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="py-3 pl-2">
                  {subPriceItem.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p
                  className="py-3 pl-2 d-flex align-items-start"
                  style={{
                    color:
                      projects.subPrice[subIdex].price >= subPriceItem.price
                        ? "green"
                        : "red",
                  }}
                >
                  {projects.subPrice[subIdex].price >= subPriceItem.price
                    ? "ต่ำกว่าหรือเท่ากับราคาที่กำหนด"
                    : "สูงกว่าราคาที่กำหนด"}
                </p>
              </React.Fragment>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <table className="table-fixed w-full">
        <thead className="bg-[#2B2A2A]">
          <tr className="text-xl" style={{ verticalAlign: "top" }}>
            {/* <th className="py-4  text-white  rounded-tl-lg w-1/12 text-left pl-2">
              ลำดับ
            </th> */}
            <th className="py-4  text-white  rounded-tl-lg w-2/12">
            <span className="mx-1 text-left ">ลำดับ</span> <span className="mx-1 text-center ">ชื่อบริษัท/หน่วยงาน</span> 
            </th>
            <th className="py-4   text-white text-center w-2/12  ">
            ราคาที่เสนอครั้งแรก
            </th>
            <th className="py-4   text-white text-center w-2/12 ">ราคาที่เสนอล่าสุด</th>
            <th className="py-4   text-white text-center w-2/12 ">BOQ</th>
            <th className="py-4   text-white text-center rounded-tr-lg w-2/12 ">
              ราคากลางย่อย
            </th>
          </tr>
        </thead>
      </table>
      <div className="  text-black grid-cols-6  bg-white drop-shadow-2xl items-center gap-y-2 mt-2">
        {vendor?.map((item, index) => (
          <React.Fragment key={index}>
            <div
              key={index}
              className="  h-[60px]  grid grid-cols-5  text-black text-lg bg-white drop-shadow-md items-center gap-y-3 my-2"
              style={{ verticalAlign: "top" }}
            >
              <p
                className="overflow-hidden whitespace-nowrap text-ellipsis hover:overflow-visible hover:whitespace-normal"
                style={{
                  color:
                    Number(item.price) ===
                      Math.min(
                        ...vendor.map(
                          (v) => Number(v.price) || Number.POSITIVE_INFINITY
                        )
                      ) && Number(item.price) < Number(project?.price) && project?.order == null
                      ? "green"
                      : Number(item.price) ===
                          Math.min(
                            ...vendor.map(
                              (v) => Number(v.price) || Number.POSITIVE_INFINITY
                            )
                          ) && Number(item.price) > Number(project?.price)
                      ? "red"
                      : "black",
                }}
              >
                <div className="flex flex-between"><p className="mx-7">{index + 1}</p >
                <p className="text-center overflow-hidden overflow-ellipsis">{item.company_name}</p>
   
              </div>
                
              </p>
              <p
                className="py-3 pl-2 text-center"
                style={{
                  color:
                    Number(item.price) ===
                      Math.min(
                        ...vendor.map(
                          (v) => Number(v.price) || Number.POSITIVE_INFINITY
                        )
                      ) && Number(item.price) < Number(project?.price) && project?.order == null
                      ? "green"
                      : Number(item.price) ===
                          Math.min(
                            ...vendor.map(
                              (v) => Number(v.price) || Number.POSITIVE_INFINITY
                            )
                          ) && Number(item.price) > Number(project?.price) && item.order == 1
                      ? "red"
                      : item.price === 0 
                      ? "red"
                      : "black",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {item.price
                  ? Number(item.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                    : item.price === 0 
                    ? "สละสิทธิ์"
                  : "ไม่มีการเสนอราคา"}
              </p>
              <p
                className="py-3 pl-2 text-center"
                style={{
                  color:
                    Number(item.newPrice) ===
                      Math.min(
                        ...vendor.map(
                          (v) => Number(v.newPrice) || Number.POSITIVE_INFINITY
                        )
                      ) && Number(item.newPrice) < Number(project?.price) 
                      ? "green"
                      : Number(item.newPrice) ===
                          Math.min(
                            ...vendor.map(
                              (v) =>
                                Number(v.newPrice) || Number.POSITIVE_INFINITY
                            )
                          ) && Number(item.newPrice) > Number(project?.price)
                      ? "red"
                      : item.registers_status_id === "11" && item.newPrice === 0 
                    ? "red"
                      : "black",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {Number(item.newPrice)
                  ? Number(item.newPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                  : item.newPrice === null ? 'ไม่มีการเสนอราคา':item.newPrice === 0 ? 'สละสิทธิ์':project.order === undefined? 'สำหรับการเจรจา': project.status_name === 'รอเจรจาต่อรอง'?'รอเชิญเจรจา':'ไม่ถูกเชิญเจรจา' }
                { (project.order !== undefined && item.order != Number(project.order)+1 ) || (project.status_name !== 'รอเจรจาต่อรอง' && project.status_name !== 'กำลังเปิดซอง') &&( <button onClick={() => withOpenHistory(index)} className="inline-block m-[0.7em] text-[12px] border w-16 rounded-md border-cyan-950 text-cyan-950 hover:text-cyan-50 hover:bg-cyan-950 hover:translate-x-1"> ดูประวัติ</button> )}
                  
              </p>
              <div className="text-center">
                <button
                  className={`border border-black md:w-32 h-10 text-lg py-1 rounded-lg items-center ${
                    item.compare  === null || item.compare === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-white text-[#080e2d]"
                  }`}
                  onClick={() => {
                    // เพิ่มเงื่อนไขตรวจสอบว่า vendor_status_id เป็น null หรือไม่
                    if (item.price != null && item.vendor_status_id != null ) {
                      showFileOnClick(item.boq_uri);
                    }
                  }}
                  // เพิ่มเงื่อนไขตรวจสอบว่า vendor_status_id เป็น null หรือไม่
                  disabled={item.compare === null || item.compare === 0}
                >
                  ดาวโหลด
                </button>
              </div>
              <div className="text-center">
                <button
                  disabled={!item.subprice || item.subprice.length === 0}
                  className={`border text-white w-24 h-10 mx-2 text-lg py-1 rounded-md transition-colors duration-300 ${
                    isOpenMap[index] ? "bg-[#2B3467]" : "bg-[#2B3467]"
                  } hover:bg-[#4f5fba] hover:text-white ${
                    !item.subprice || item.subprice.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => handleButtonClick(index)}
                  hidden={!item.subprice || item.subprice.length === 0}
                >
                  {isOpenMap[index] ? "ซ่อน" : "เปิด"}
                </button>
                {!item.subprice || item.subprice.length === 0 ? (
                  <p
                    className="text-[#000000] text-md"
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    ไม่มีราคากลางย่อย
                  </p>
                ) : null}
              </div>
            </div>
            {isOpenMap[index] && (
              <React.Fragment key={`sub-${index}`}>
                {isOpenMap[index] && (
                  <React.Fragment key={`sub-${index}`}>
                    <SubTable subtable={vendor || []} index={index} />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
