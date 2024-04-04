import { LuFileEdit, LuFolders } from "react-icons/lu";
import { DetailProjectInterface } from "../../models/Project/IListWaitProject";
import { useEffect, useState } from "react";
import { DetailProject, detailmanager } from "../../services/ProjectServices";
import { useParams } from "react-router-dom";
import { ListVendorItemInterface } from "../../models/Secretary/CompareInterface";
import { getVendorProjectforAnouncement } from "../../services/SecretaryService/ComparisionService";
import Swal from "sweetalert2";
import { showFileOnClick } from "../../services/utilitity";
import { BsDownload } from "react-icons/bs";

export default function ProjectResult() {
  const { key } = useParams();
  const [detailBidding, setdetailBidding] = useState<ListVendorItemInterface>();
  const [detailBidding2, setdetailBidding2] = useState<ListVendorItemInterface[]>([]);
  const [detailProject, setdetailProject] = useState<DetailProjectInterface>();
  const [committee, setCommittee] = useState<any>({});
  const [countBidding, setcountBidding] = useState<any>();

  const getInfoCompare = async (key: string) => {
    console.log(key);
    let res = await getVendorProjectforAnouncement(key);
    if (res.status !== 200) {
      Swal.showValidationMessage(res.err);
    }
    
    setdetailBidding(() => res.data);
    console.log(res.data);
    setdetailBidding2(() => res.data);
    if(res.countBidding){
      setcountBidding(() => res.countBidding);
    }
    
    console.log(res.data);
    console.log(res.countBidding);
  };

  const getDetailProject = async (key: string) => {
    let res = await DetailProject(key);
    if (res.status !== 200) {
      alert("err");
      return;
    }
    setdetailProject(() => res.data);
  };

  const getCommittee = async (key: string) => {
    const res = await detailmanager(key);
    if (res.status !== 200) {
      alert(res.err);
      return;
    }
    setCommittee(res.data);
  };


  const withOpenHistory = async (index: number) => {   
    console.log(detailBidding2[index])
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
                if(detailBidding2) {
                  
                  for (let i = 0; i < detailBidding2[index].history_price!.length; i++) {
                    let data = detailBidding2[index]
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
    getInfoCompare(String(key));
    getDetailProject(key || "");
    getCommittee(key || "");
  }, []);
  
  return (
    <>
      <div className="mt-5 xl:border p-2 w-11/12 bg-[#2B3467] rounded-xl mx-auto ">
        <div className="flex xl:flex-row flex-col p-2 w-full justify-center  bg-[#2B3467]rounded-xl">
        <div className="bg-[#2B3467] text-white flex justify-center items-center flex-col p-4 rounded-xl xl:rounded-r-none xl:rounded-l-xl w-full xl:w-1/3 shadow-lg">
            <LuFolders className="text-7xl mb-2" />
            <p className="text-2xl text-center font-semibold">สรุปผล</p>
            <label className="text-[#61de65] text-xl font-bold mt-2">
                <b>สถานะ :</b> {detailProject?.status_name}
            </label>
        </div>
          <div className="border p-4 box-border w-full rounded-r-xl bg-white">
            <form className="flex flex-col gap-3">
            <div className="bg-[#2B3467] pt-4 pb-8 text-white rounded-r-xl overflow-wrap-break-word">
              <div className="text-[#ffffff] text-2xl font-bold basis-1/2 text-right">
                  <label className="font-normal pr-4">
                      เลขที่เอกสาร : {detailProject?.key}
                  </label>
              </div>
              <div className="pl-5 grid grid-cols-11 text-[#ffffff] text-4xl">
                  <label className="font-bold pb-2 col-span-2">
                      <p >โครงการ</p>
                  </label>
                  <label className="font-bold pb-2 col-span-1 mr-3 text-center">
                      <p >:</p>
                  </label>
                  <label className="font-bold pb-2 col-span-8 pr-4">
                      <p className="inline">{detailProject?.name} </p>
                  </label>
              </div>
          </div>
              <div className="flex flex-col box-content md:flex-row gap-2 w-full">
                <div className="flex flex-col justify-between px-4  ">
                <div className="grid grid-cols-11">
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                      <p >ประเภทโครงการ </p>
                  </label>
                  <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                      <p >:</p>
                  </label>
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                      <p className="inline"> {detailProject?.type_name}</p>
                  </label>
                </div>
                <div className="grid grid-cols-11">
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                      <p >ประเภทงาน  </p>
                  </label>
                  <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                      <p >:</p>
                  </label>
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                      <p className="inline"> {detailProject?.job_type_name}</p>
                  </label>
                </div>
                <div className="grid grid-cols-11">
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                      <p >สังกัด  </p>
                  </label>
                  <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                      <p >:</p>
                  </label>
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                      <p className="inline"> {detailProject?.section_name}/
                    {detailProject?.department_name}/
                    {detailProject?.subsection_name}/
                    {detailProject?.division_name}</p>
                  </label>
                </div>
                <div className="grid grid-cols-11">
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-3">
                      <p >ไฟล์แนบ </p>
                  </label>
                  <label className="text-[#2B3467] text-2xl text-center font-bold pb-2 col-span-1 mr-3">
                      <p >:</p>
                  </label>
                  <label className="text-[#2B3467] text-2xl font-bold pb-2 col-span-7">
                  <button
                          className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-xl text-xl px-5 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                          onClick={(event) => {
                            event.preventDefault();
                            showFileOnClick(detailProject?.Tor_uri || "");
                          }}
                        >
                          <BsDownload className="text-xl w-5 h-5 mr-2" />
                          TOR
                        </button>
                        <button
                          className="text-white bg-[#2B3467] hover:bg-[#21284f] border-2 border-[#21284f] rounded-xl text-xl px-5 py-1 w-[183px] text-center inline-flex items-center justify-center mr-2 mb-2"
                          onClick={(event) => {
                            event.preventDefault();
                            showFileOnClick(
                              detailProject?.Job_description_uri || ""
                            );
                          }}
                        >
                          <BsDownload className="text-xl w-5 h-5 mr-2" />
                          ใบแจ้งงาน
                        </button>
                  </label>
                </div>
                 
                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mt-5 mb-5 xl:border p-2 w-11/12 rounded-lg mx-auto bg-zinc-300">
          <div className="py-2 pl-2 bg-[#2B3467] rounded-t-2xl mx-4 mt-4 flex items-center">
            <LuFileEdit className="text-5xl m-4 text-white" />
            <p className="font-black text-3xl m-4 text-white">
              รายชื่อคณะกรรมการเปิดซอง
            </p>
          </div>
          <div className="border rounded-2xl m-4 md:px-1 lg:px-5 my-2 bg-white drop-shadow-2xl overflow-x-auto" style={{ maxHeight: "500px" }}>
    <table className="table-fixed w-full mt-5 mb-5 overflow-x-auto">
    
            <thead className="bg-[#1D5182]">
                <tr>
                    <th className="py-4 text-xl w-[20rem] text-white text-center rounded-tl-lg">ชื่อ-นามสกุล</th>
                    <th className="py-4 text-xl  w-[20rem] text-white text-center">ตำแหน่ง</th>
                    <th className="py-4 text-xl w-[18rem] text-white text-center">บทบาท</th>
                    {/* <th className="py-4 text-xl w-[22rem] text-white text-center rounded-tr-lg">email</th> */}
                </tr>
            </thead>
            {Array.isArray(committee) &&
                committee
                    .sort((a, b) => {
                        if (a.role_name_t === "ประธาน") return -1;
                        if (b.role_name_t === "ประธาน") return 1;
                        if (a.role_name_t === "กรรมการ") return -1;
                        if (b.role_name_t === "กรรมการ") return 1;
                        if (a.role_name_t === "เลขาคณะกรรมการเปิดซอง") return -1;
                        if (b.role_name_t === "เลขาคณะกรรมการเปิดซอง") return 1;
                        return 0;
                    })
                    .map((manager, index) => (
                        <tbody key={index}>
                            <tr className="border" style={{ verticalAlign: "top" }}>
                                <td className="whitespace-no-wrap text-lg border rounded py-2 px-2 focus:outline-none text-left pl-4">{manager?.nametitle_t} {manager?.firstname_t} {manager?.lastname_t}</td>
                                <td className="whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none">{manager?.position}</td>
                                {/* <td className="whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none">{manager?.email}</td> */}
                                <td className="whitespace-no-wrap text-lg text-center border rounded py-2 px-2 focus:outline-none">{manager?.role_name_t}</td>
                            </tr>
                        </tbody>
                    ))}
        
    </table>
</div>
        </div>
        <div className="mt-5 mb-5 xl:border p-2 w-11/12 rounded-lg mx-auto bg-zinc-300">
          <div className="py-2 pl-2 bg-[#EB455F] rounded-t-2xl mx- mt-4 flex items-center">
            <LuFileEdit className="text-5xl m-4 text-white" />
            <p className="font-black text-3xl m-4 text-white">
              รายชื่อผู้รับเหมา
            </p>
          </div>
          <div className="border rounded-2xl m-4  md:px-1 lg:px-4 my-4 bg-white  drop-shadow-2xl overflow-x-auto">
            <table className="table-fixed w-full mt-5 mb-5">
              <thead className="bg-[#1D5182]">
                <tr>
                  <th className="py-4 text-xl text-white text-center rounded-tl-lg w-[6rem]">
                    ลำดับ
                  </th>
                  <th className="py-4 text-xl text-white text-center w-[10rem]">
                    ผลการประกวด
                  </th>
                  <th className="py-4 text-xl text-white text-center w-[20rem]">
                    ชื่อบริษัท/หน่วยงาน
                  </th>
                  <th className="py-4 text-xl text-white text-center  w-[12rem]">
                    ราคาที่เสนอ
                  </th>
                  <th className="py-4 text-xl  text-white text-center w-[12rem]">
                    ราคาที่เสนอใหม่
                  </th>
                  
                  
                  <th className="py-4 text-xl  text-white text-center rounded-tr-lg w-[20rem]">
                    ชื่อผู้จัดการ
                  </th>
                </tr>
              </thead>
              {Array.isArray(detailBidding) && (
                <tbody className="bg-white border-b-lg rounded-xl h-14 divide-x">
                  {detailBidding
                    .sort((a, b) => {
                      if (a.status_name_th === "ชนะการประกวด" && b.status_name_th !== "ชนะการประกวด") {
                        return -1;
                      }
                      if (a.status_name_th !== "ชนะการประกวด" && b.status_name_th === "ชนะการประกวด") {
                        return 1;
                      }
                    
                      // Handle the case when both have the status "แพ้การประกวด"
                      if (a.status_name_th === "แพ้การประกวด" && b.status_name_th === "แพ้การประกวด") {
                        if (a.compare === null && b.compare === null) {
                          return 0; // Both have compare as null, maintain order
                        } else if (a.compare === null) {
                          return 3;
                        } else if (b.compare === null) {
                          return -3;
                        } else if (Number(a.compare) === 0 && Number(b.compare) !== 0) {
                          return 4;
                        } else if (Number(b.compare) === 0 && Number(a.compare) !== 0) {
                          return -4;
                        } else {
                          return a.compare - b.compare;
                        }
                      }
                    
                      return 0;
                    })
                    .map((listBidding, index) => (
                      <tr
                        key={index}
                        className="text-gray-700 text-lg h-14 border-b-2 border-black-700 text-center"
                        style={{ verticalAlign: "top" }}
                      >
                        <td className="border py-3  text-center">
                          {index + 1}
                        </td>
                        <td
                          className={
                            listBidding?.status_name_th === "ชนะการประกวด"
                              ? "border py-3 pl-2 text-green-500 "
                             : "border py-3 pl-2 text-red-500 "
                              
                          }
                        >
                          {listBidding?.status_name_th }
                        </td>
                        <td
                          className="border py-3 text-left px-5 "
                          title={listBidding?.company_name}
                        >
                          {listBidding?.company_name}
                        </td>
                        <td className="border py-3 pl-5">
                        {listBidding?.price !== "ไม่เปิดเผย" ? listBidding?.history_price[0]?.price.toLocaleString(undefined, {minimumFractionDigits: 2, useGrouping: true}) : "ไม่เปิดเผย"}

                        </td>
                        <td className="border py-3 text-[#2B3467] ">
                        {
                            listBidding?.newPrice !== "ไม่เปิดเผย" ? 
                            Number(countBidding) > 1 ? 
                            listBidding?.history_price[Number(countBidding)-1]?.price.toLocaleString(undefined, {minimumFractionDigits: 2, useGrouping: true}) : 
                            "ไม่มีการเจรจา" : 
                            listBidding?.status_name_th === "ชนะการประกวด" ? 
                            Number(countBidding) > 1 ? 
                            listBidding?.history_price[Number(countBidding)-1]?.price.toLocaleString(undefined, {minimumFractionDigits: 2, useGrouping: true}) : 
                            "ไม่มีการเจรจา" : 
                            "ไม่เปิดเผย"  
                        }
                          { (Number(countBidding) > 1 && listBidding?.newPrice !== "ไม่เปิดเผย") && ( <button onClick={() => withOpenHistory(index)} className="inline-block m-[0.7em] text-[12px] border w-16 rounded-md border-cyan-950 text-cyan-950 hover:text-cyan-50 hover:bg-cyan-950 hover:translate-x-1"> ดูประวัติ</button> )}
                        </td>
                        
                        <td className="border py-3 pl-5 text-left"> 
                          {listBidding?.manager_name}
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
            <div className="mt-10 flex justify-between mb-5">
              <button
                className="px-8 py-2.5 rounded-lg bg-[#EB455F] drop-shadow-lg text-white text-2xl col-start-1"
                onClick={() => history.back()}
              >
                ย้อนกลับ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
