import Swal from "sweetalert2";
import {
  IProject2,
  IVendorProject,
} from "../../../../../models/Secretary/IProjectSecretary";

import React, { useState, useEffect } from "react";

export default function CAPPriceList({
  vendor,
  project,
}: {
  vendor: IVendorProject[] | undefined;
  project: IProject2;
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
    console.log(vendor);
    console.log(project);
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
        <div className="grid grid-cols-4 justify-items-center text-white text-xl bg-[#2B3467] rounded-t-lg">
          <p className="py-3 pl-2">รายละเอียด</p>
          <p className="py-3 pl-2">ราคากลางที่บริษัทตั้งไว้</p>
          <p className="py-3 pl-2">ราคากลางที่ vendor เสนอ</p>
          <p className="py-3 pl-2">ผลลัพธ์</p>
        </div>

        <div className="grid grid-cols-4 justify-items-center text-xl bg-[#e5e5e5] ">
          {/* Data Rows */}
          {selectedVendor &&
            selectedVendor.subprice &&
            selectedVendor.subprice.map((subPriceItem, subIdex) => (
              <React.Fragment key={subPriceItem.id}>
                <p className="py-3 pl-2">{subPriceItem.detail}</p>
                <p className="py-3 pl-2">
                  {projects.subPrice[subIdex].price.toLocaleString(undefined, {
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
      <div className="px-[2rem] py-12 rounded-2xl">
        <table className="table-fixed w-full">
          <thead className="bg-[#2B2A2A]">
            <tr className="text-xl" style={{ verticalAlign: "top" }}>
              <th className="py-4  text-white text-center rounded-tl-lg ">
                ชื่อบริษัท/หน่วยงาน
              </th>
              <th className="py-4  text-white text-center ">สถานะ</th>
              <th className="py-4   text-white text-center  ">
                ราคาประมูล <p>({project.project_unit_price})</p>
              </th>
              <th className="py-4   text-white text-center  ">
                ราคาใหม่ <p>({project.project_unit_price})</p>{" "}
              </th>
              <th className="py-4   text-white text-center rounded-tr-lg ">
                ราคากลางย่อย
              </th>
            </tr>
          </thead>
        </table>
        <div className="  text-black grid-cols-5 text-xl bg-white drop-shadow-2xl items-center gap-y-2 mt-2">
          {vendor?.map((item, index) => (
            <React.Fragment key={index}>
              <div
                key={index}
                className="  h-[60px]  grid grid-cols-5  text-black text-xl bg-white drop-shadow-md items-center gap-y-3 my-2"
              >
                <p
                  className="text-center "
                  style={{
                    // color:
                    //   Number(item.price) ===
                    //     Math.min(
                    //       ...vendor.map(
                    //         (v) => Number(v.price) || Number.POSITIVE_INFINITY
                    //       )
                    //     ) && item.result == "win"
                    //     ? "green"
                    //     : item.result == "lose"
                    //     ? "red"
                    //     : "black",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.company_name}
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
                        ) && item.result == "win" ? "green": "red",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.result === "win"
                      ? "ชนะการประกวด"
                      : "แพ้การประกวด"
                  }
                </p>
                <p
                  className="py-3 pl-2 text-center"
                  style={{
                     // color:
                    //   Number(item.price) ===
                    //     Math.min(
                    //       ...vendor.map(
                    //         (v) => Number(v.price) || Number.POSITIVE_INFINITY
                    //       )
                    //     ) && item.result == "win"
                    //     ? "green"
                    //     : item.result == "lose"
                    //     ? "red"
                    //     : "black",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.price
                    ? Number(item.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })
                    : item.price === null && item.vendor_status_id === null
                    ? "ไม่มีการเสนอราคา"
                    : "สละสิทธิ์"}
                </p>
                <p
                  className="py-3 pl-2 text-center"
                  style={{
                     // color:
                    //   Number(item.price) ===
                    //     Math.min(
                    //       ...vendor.map(
                    //         (v) => Number(v.price) || Number.POSITIVE_INFINITY
                    //       )
                    //     ) && item.result == "win"
                    //     ? "green"
                    //     : item.result == "lose"
                    //     ? "red"
                    //     : "black",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {Number(item.newPrice)
                  ? Number(item.newPrice).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })
                  : item.newPrice === null ? 'ไม่มีการเสนอราคา':item.newPrice === 0 ? 'สละสิทธิ์': project.status_name === 'รอเจรจาต่อรอง'?'รอเชิญเจรจา':'ไม่ถูกเชิญเจรจา' }
                { project.order !== 1 &&( <button onClick={() => withOpenHistory(index)} className="inline-block m-[0.7em] text-[12px] border w-16 rounded-md border-cyan-950 text-cyan-950 hover:text-cyan-50 hover:bg-cyan-950 hover:translate-x-1"> ดูประวัติ</button> )}
                
                </p>
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
    </div>
  );
}