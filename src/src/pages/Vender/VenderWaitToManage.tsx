import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import {
  fileVenderInterface,
  listvenderinterface,
  listProjectForVendor,
} from "../../models/Vendor/IVendor";
import {
  getDetailVendor,
  uploadCertiFileVendor,
  uploadBookFileVendor,
  uploadVATFileVendor,
  listVendorProject,
  VendorCalcelProjectByKey,
  getRetreat,
  CreateProjectCancelVenderRegister,
} from "../../services/VendorService/VendorService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CheckPasscode } from "../../services/VendorProjectService/VenderRegisterService";
import withReactContent from "sweetalert2-react-content";
import {
  ListRetreatProject,
  ProjectWaitInterface,
} from "../../models/Project/IListWaitProject";
import ReactPaginate from "react-paginate";
import validator from "validator";
import { showFileOnClick } from "../../services/utilitity";

export default function VenderWaitToManage() {
  const navigate = useNavigate();

  const [vendor, setvendor] = useState<listvenderinterface[]>([]); //ใส่[]เป็นค่าเริ่มต้นกันundi err
  const [certificate, setcertificate] = useState<Partial<fileVenderInterface>>(
    {}
  );
  const [vat, setvat] = useState<Partial<fileVenderInterface>>({});
  const [bookbank, setbookbank] = useState<Partial<fileVenderInterface>>({});
  const [listReject, setListReject] = useState<ListRetreatProject[]>([]);

  const [listProjects, setListProjects] = useState<listProjectForVendor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProject, setTotalProject] = useState(0);
  const [indexstart, setIndexStart] = useState(1);
  const selectionRef = useRef<HTMLSelectElement>(null);
  const inputDetailRejectRef = useRef<HTMLTextAreaElement>(null);

  const [project_wait, setProject_Wait] = useState<ProjectWaitInterface[]>([]);

  const [projectSearch, setProjectSearch] = useState<listProjectForVendor[]>(
    []
  );

  const [editCertificate, setEditCertificate] = useState(false);
  const [editvat, setEditvat] = useState(false);
  const [editBookbank, setEditbookbank] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<number>(99);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const validateAttachment = () => {
    const hasCertificate = vendor[0]?.certificate_uri != null;
    const hasVAT = vendor[0]?.vat_uri != null;
    const hasBookbank = vendor[0]?.bookbank_uri != null;

    return hasCertificate && hasVAT && hasBookbank;
  };

  const getListVendorProject = async () => {
    try {
      const start = 0;
      setIndexStart(start);

      // Fetch all data without applying any filters
      const res = await listVendorProject(0, 9999); // Fetch all data

      if (res.status !== 200) {
        // Handle error
        // alert("err")
        return;
      }

      // Calculate pagination
      const totalPage = Math.ceil(res.total / 5);
      setTotalPages(totalPage);
      setTotalProject(res.total);

      // Paginate the data based on the start index
      const paginatedData = res.data.slice(start, start + 5);

      // Update state
      setListProjects(paginatedData);
      setProjectSearch(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getDetail = async () => {
    let res = await getDetailVendor();

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setvendor(() => res.data);
  };

  const getReason_retreat = async () => {
    let res = await getRetreat();

    if (res.status !== 200) {
      alert("err");
      return;
    }
    setListReject(res.data);
  };

  const handlePaginationClick = async (e: { selected: number }) => {
    setCurrentPage(e.selected);
    setIndexStart(e.selected * 5);
    let res;
    if (selectedStatus === 99) {
      res = await listVendorProject(e.selected * 5, 5); // Fetch data based on selected page
    } else {
      let key =
        selectedStatus === 1
          ? "รอเสนอราคาอีกครั้ง"
          : selectedStatus === 2
          ? "เสนอราคาแล้ว"
          : selectedStatus === 3
          ? "สละสิทธิ์"
          : selectedStatus === 4
          ? "รอใส่เสนอราคา"
          : "สถานะทั้งหมด";
      res = await listVendorProject(0, 9999); // Fetch all data without applying status filter
      res.data = res.data.filter((project: any) =>
        project.vendor_status.includes(key)
      );
      // Calculate pagination
      const totalPage = Math.ceil(res.data.length / 5);
      setTotalPages(totalPage);
      setTotalProject(res.data.length);
      // Paginate the data
      const paginatedData = res.data.slice(
        e.selected * 5,
        (e.selected + 1) * 5
      );
      res.data = paginatedData;
    }

    if (res.status !== 200) {
      // Handle error
      // alert("err")
      return;
    }

    // Update state
    setListProjects(res.data);
    setProjectSearch(res.data);
    console.log(1111);
  };

  const handleEditfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    const filetype = e.currentTarget.name;
    if (filetype === "Certi") {
      setEditCertificate(true);
    } else if (filetype === "vat") {
      setEditvat(true);
    } else if (filetype === "bookbank") {
      setEditbookbank(true);
    }
  };

  const handleBackEditfile = (e: React.MouseEvent<HTMLButtonElement>) => {
    const filetype = e.currentTarget.name;
    if (filetype === "Certi") {
      setEditCertificate(false);
    } else if (filetype === "vat") {
      setEditvat(false);
    } else if (filetype === "bookbank") {
      setEditbookbank(false);
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const projectKey = e.currentTarget.value;
    // ตรวจสอบว่าไฟล์ทั้ง 3 รายการถูกแนบหรือไม่
    if (validateAttachment() && vendor[0]?.vendor_type === "unlist") {
      Swal.fire({
        title:
          '<span style="color: #2B3467">โปรดใส่ Passcode ที่ท่านได้รับจากหนังสือเชิญ</span> <p style="color: #BA9821">ตัวอย่าง : D3X25T</p>',
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ปิด",
        confirmButtonColor: "#EB455F", // สีแดง
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
      }).then(async (result) => {
        if (result.isConfirmed) {
          const passCode = validator.trim(result.value);
          let res = await CheckPasscode(passCode, projectKey);
          if (res.status !== 200) {
            Swal.fire("รหัส Passcode ไม่ถูกต้อง");
          } else {
            navigate(`/vender/quotation?key=${projectKey}`);
          }
        }
      });
    } else if (vendor[0]?.vendor_type === "list") {
      Swal.fire({
        title:
          '<span style="color: #2B3467">โปรดใส่ Passcode ที่ท่านได้รับจากหนังสือเชิญ</span> <p style="color: #BA9821">ตัวอย่าง : D3X25T</p>',
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ปิด",
        confirmButtonColor: "#EB455F", // สีแดง
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
      }).then(async (result) => {
        if (result.isConfirmed) {
          const passCode = validator.trim(result.value);
          let res = await CheckPasscode(passCode, projectKey);
          if (res.status !== 200) {
            Swal.fire("รหัส Passcode ไม่ถูกต้อง");
          } else {
            navigate(`/vender/quotation?key=${projectKey}`);
          }
        }
      });
    } else {
      // แจ้งเตือนผู้ใช้ให้แนบไฟล์ทั้ง 3 รายการ
      alert("กรุณาแนบไฟล์ทั้ง 3 รายการ");
    }
  };

  const handleCancelOnClick = (key: string) => {
    let MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <p className="text-[#2B3467] text-4xl">กรุณาระบุเหตุผล</p>,
      html: (
        <div>
          <p className="text-red-500 text-xl font-extrabold">
            คำเตือน หากยืนยันแล้วจะไม่สามารถแก้ไขได้
          </p>
          <p className="text-red-500 mb-3 text-xl font-extrabold">
            กรุณาตรวจสอบอีกครั้งก่อนยืนยัน
          </p>
          <div className="flex flex-col gap-4">
            <select
              className="border p-2 text-2xl"
              defaultValue={"DEFAULT"}
              ref={selectionRef}
            >
              <option key={"DEFAULT"} value={"DEFAULT"} disabled>
              โปรดเลือกเหตุผลการสละสิทธิ์
              </option>
              {listReject.map((data) => (
                <option key={data.id} value={data.id}>
                  {data.retreat_name}
                </option>
              ))}
            </select>
            <textarea
              className="border p-2 text-2xl"
              placeholder="รายละเอียดเพิ่มเติม"
              ref={inputDetailRejectRef}
            />
          </div>
        </div>
      ),
      confirmButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ยืนยัน</p>,
      icon: "question",
      confirmButtonColor: "#EB455F",
      showCancelButton: true,
      cancelButtonText: <p className="text-3xl px-5 py-2 w-[150px]">ปิด</p>,
      cancelButtonColor: "#979797",
      preConfirm: async () => {
        // const commentInput = document.getElementById('comment') as HTMLInputElement;
        const comment = inputDetailRejectRef.current?.value || "";
        const reject_id: number = parseInt(
          (selectionRef.current?.value as string) || "",
          10
        );
        console.log(comment);
        console.log(reject_id);
        console.log(key);
        let res = await VendorCalcelProjectByKey(key, reject_id, comment); // wait for test
        let data3 = await CreateProjectCancelVenderRegister(key);
        if (res.status !== 200) {
          MySwal.showValidationMessage(res.err);
        }
        if (data3.status !== 200) {
          MySwal.showValidationMessage(res.err);
        }
        console.log(res);
        return res;
      },
    }).then((data) => {
      if (data.isConfirmed) {
        MySwal.fire({
          title: <h1 className="text-4xl text-[#4BAE4F]">ดำเนินการสำเร็จ!</h1>,
          icon: "success",
          confirmButtonText: (
            <p className="text-3xl px-5 py-2 w-[150px]">ตกลง</p>
          ),
          confirmButtonColor: "#2B3467",
        });
        setProject_Wait([]);
        getListVendorProject();
      }
    });
  };

  const handleClickA = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const projectKey = e.currentTarget.value;
    Swal.fire({
      title:
        '<span style="color: #2B3467">โปรดใส่ Passcode ที่ท่านได้รับจากหนังสือเชิญ</span> <p style="color: #BA9821">ตัวอย่าง : D3X25T</p>',
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",
      confirmButtonColor: "#EB455F", // สีแดง
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
    }).then(async (result) => {
      if (result.isConfirmed) {
        const passCode = validator.trim(result.value);
        let res = await CheckPasscode(passCode, projectKey);
        if (res.status !== 200) {
          Swal.fire("รหัส Passcode ไม่ถูกต้อง");
        } else {
          navigate(`/vender/afternegotiating?key=${projectKey}`);
        }
      }
    });
  };

  const handleClickEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const projectKey = e.currentTarget.value;
    navigate(`/vender/Editquotation?key=${projectKey}`);
  };

  const handleCertiFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name as keyof typeof certificate;

    if (event.target.files) {
      console.log(event.target.files);
      let data = {
        vendor_key: vendor[0].vendor_key,
        vendor_file: event.target.files[0],
      };
      let res = await uploadCertiFileVendor(data);
      if (res.status !== 200) {
        alert("ไฟล์ไม่ผ่าน");
        console.log(res.status);
      } else {
        getDetail();
        setEditCertificate(false);
        console.log(res.status);
      }
    }
  };

  const handleVATFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name as keyof typeof vat;

    if (event.target.files) {
      console.log(event.target.files[0]);

      console.log(vat);
      let data = {
        vendor_key: vendor[0].vendor_key,
        vendor_file: event.target.files[0],
      };
      let res = await uploadVATFileVendor(data);
      if (res.status !== 200) {
        alert("ไฟล์ไม่ผ่าน");
        console.log(res.status);
      } else {
        getDetail();
        setEditvat(false);
        console.log(res.status);
      }
    }
  };

  const handleBookChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = event.target.name as keyof typeof bookbank;

    if (event.target.files) {
      let data = {
        vendor_key: vendor[0].vendor_key,
        vendor_file: event.target.files[0],
      };
      let res = await uploadBookFileVendor(data);
      console.log(res.status);
      if (res.status !== 200) {
        alert("ไฟล์ไม่ผ่าน");
        console.log(res.status);
      } else {
        getDetail();
        setEditbookbank(false);
        console.log(res.status);
      }
    }
  };

  const handleOnStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    try {
      setCurrentPage(0);
      setIndexStart(0);
      const selectedValue = parseInt(event.target.value, 10);
      let key = "สถานะทั้งหมด";
      if (selectedValue !== 99) {
        key =
          selectedValue === 1
            ? "รอเสนอราคาอีกครั้ง"
            : selectedValue === 2
            ? "เสนอราคาแล้ว"
            : selectedValue === 3
            ? "สละสิทธิ์"
            : selectedValue === 4
            ? "รอใส่เสนอราคา"
            : "สถานะทั้งหมด";
      }
      setSelectedStatus(selectedValue);

      // Fetch data based on status
      let res;
      if (selectedValue === 99) {
        res = await listVendorProject(0, 9999); // Fetch all data
      } else {
        res = await listVendorProject(0, 9999); // Fetch all data without applying status filter
        res.data = res.data.filter(
          (project: any) =>
            project.name.includes(searchTerm) &&
            project.key.includes(searchTerm) &&
            project.vendor_status.includes(key)
        );
      }

      if (res.status !== 200) {
        // Handle error
        // alert("err")
        return;
      }
      // Calculate pagination
      const totalPage = Math.ceil(res.data.length / 5);
      setTotalPages(totalPage);
      setTotalProject(res.data.length);

      // Paginate the data
      const paginatedData = res.data.slice(0, 5);

      // Update state
      setListProjects(paginatedData);
      setProjectSearch(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleOnSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setCurrentPage(0);
      setIndexStart(0);
      const searchTerm = event.target.value.toLowerCase();
      setSearchTerm(searchTerm);

      // Fetch data based on search term and selected status
      let res;
      if (String(selectedStatus) === "99") {
        res = await listVendorProject(0, 9999); // Fetch all data
      } else {
        let key =
          selectedStatus === 1
            ? "รอเสนอราคาอีกครั้ง"
            : selectedStatus === 2
            ? "เสนอราคาแล้ว"
            : selectedStatus === 3
            ? "สละสิทธิ์"
            : selectedStatus === 4
            ? "รอใส่เสนอราคา"
            : "สถานะทั้งหมด";
        res = await listVendorProject(0, 9999); // Fetch all data without applying status filter
        res.data = res.data.filter((project: any) =>
          project.vendor_status.includes(key)
        );
      }

      if (res.status !== 200) {
        // Handle error
        // alert("err")
        return;
      }

      // Filter data based on search term
      const foundProjects = res.data.filter(
        (project: any) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.key.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Calculate pagination
      const totalPage = Math.ceil(foundProjects.length / 5);
      setTotalPages(totalPage);
      setTotalProject(foundProjects.length);

      // Paginate the data
      const paginatedData = foundProjects.slice(0, 5);

      // Update state
      setListProjects(paginatedData);
      setProjectSearch(foundProjects);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const invalidStatuses = [
    //status ที่ต้องมีการแก้ไขเอกสารหรือการเสนอราคา
    "ไฟล์ BOQ ไม่ถูกต้อง",
    "ไฟล์ Receipt ไม่ถูกต้อง",
    "เอกสารไม่ถูกต้อง",
  ];

  useEffect(() => {
    setListProjects([]);
    getDetail();
    getReason_retreat();
    getListVendorProject();
  }, []);

  return (
    <div>
      {/* container */}
      <div className="w-11/12 mx-auto py-12 rounded-2xl">
        <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5">
          <div className="bg-[#1D5182] pt-3 pb-10 text-white rounded-lg">
            <p className="text-lg text-end pr-4">
              เลขที่สมาชิก : {vendor[0]?.vendor_key}
            </p>
            <label className="text-4xl pl-16">{vendor[0]?.company_name}</label>
          </div>
          <div className="px-32 py-14 flex flex-col gap-5">
            <div className="flex flex-row">
              <p className="basis-1/2 text-2xl">
                ชื่อผู้จัดการ : {vendor[0]?.manager_name}
              </p>
              <p>
                {vendor[0]?.vendor_type === "list" ? (
                  <p className="basis-1/2 text-2xl">
                    ประเภทผู้รับเหมา : ใน List
                  </p>
                ) : (
                  <p className="basis-1/2 text-2xl">
                    ประเภทผู้รับเหมา : นอก List
                  </p>
                )}
              </p>
            </div>
            <div className="flex flex-row">
              <p className="basis-1/2 text-2xl">อีเมล์ : {vendor[0]?.email}</p>
              <p className="basis-1/2 text-2xl">
                เบอร์โทร : {vendor[0]?.phone_number}
              </p>
            </div>
          </div>
        </div>

        {vendor[0]?.vendor_type === "unlist" ? (
          <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5 py-10 px-16">
            <label className="text-3xl">1. เอกสารสำคัญของบริษัท</label>

            <div className="flex flex-row items-center">
              <p className="ml-20 text-2xl text-black">ไฟล์แนบ :</p>
              <p className="ml-6 text-2xl basis-1/3">
                หนังสือรับรองบริษัท (ไม่เกิน 6 เดือน)
              </p>
              {vendor[0]?.certificate_uri != null &&
              editCertificate === false ? (
                <div>
                  <button
                    className="border p-2 my-2 w-[130px] bg-[#2B3467] text-white text-lg rounded-lg"
                    onClick={() => {
                      showFileOnClick(vendor[0]?.certificate_uri || "");
                    }}
                  >
                    ตรวจสอบไฟล์
                  </button>
                  <button
                    className="border p-2 my-2 w-[100px] ml-2 bg-[#D9C304] text-white text-lg rounded-lg"
                    name="Certi"
                    onClick={handleEditfile}
                  >
                    แก้ไข
                  </button>
                </div>
              ) : editCertificate === true ? (
                <div className="">
                  <input
                    className="border rounded py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline basis-1/2"
                    id=""
                    type="file"
                    placeholder="ไฟล์อื่น ๆ"
                    name="vendor_file"
                    onChange={handleCertiFileChange}
                    accept="application/pdf"
                    required
                  />
                  <button
                    className="border p-2 ml-2  bg-[#2B3467] text-white text-lg rounded-lg"
                    name="Certi"
                    onClick={handleBackEditfile}
                  >
                    ย้อนกลับ
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    className="border rounded py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline basis-1/2"
                    id=""
                    type="file"
                    placeholder="ไฟล์อื่น ๆ"
                    name="vendor_file"
                    onChange={(event) => {
                      handleCertiFileChange(event);
                    }}
                    accept="application/pdf"
                    required
                  />
                  {/* <button className="border p-2 ml-5 bg-[#EB455F] text-white text-lg rounded-lg"
                                        onClick={
                                            handleUploadCertiFile
                                        }
                                    >เพิ่มไฟล์</button> */}
                </div>
              )}

              {/**/}
            </div>
            <div className="flex flex-row items-center">
              <p className="ml-[196px] basis-1/3 text-2xl">
                ทะเบียนภาษีมูลค่าเพิ่ม
              </p>
              {vendor[0]?.vat_uri != null && editvat === false ? (
                <div>
                  <button
                    className="border p-2 my-2 w-[130px] bg-[#2B3467] text-white text-lg rounded-lg"
                    onClick={() => {
                      showFileOnClick(vendor[0]?.vat_uri || "");
                    }}
                  >
                    ตรวจสอบไฟล์
                  </button>
                  <button
                    className="border p-2 my-2 w-[100px] ml-2 bg-[#D9C304] text-white text-lg rounded-lg"
                    name="vat"
                    onClick={handleEditfile}
                  >
                    แก้ไข
                  </button>
                </div>
              ) : editvat === true ? (
                <div>
                  <input
                    className="border rounded py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline basis-1/2"
                    id=""
                    type="file"
                    placeholder="ไฟล์อื่น ๆ"
                    name="vendor_file"
                    onChange={handleVATFileChange}
                    accept="application/pdf"
                    required
                  />

                  <button
                    className="border p-2 ml-2 bg-[#2B3467] text-white text-lg rounded-lg"
                    name="vat"
                    onClick={handleBackEditfile}
                  >
                    ย้อนกลับ
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    className="border rounded py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline basis-1/2"
                    id=""
                    type="file"
                    placeholder="ไฟล์อื่น ๆ"
                    name="vendor_file"
                    onChange={(event) => {
                      handleVATFileChange(event);
                      // handleUploadVATFile();
                    }}
                    // onChange={handleVATFileChange
                    accept="application/pdf"
                    required
                  />
                  {/* <button className="border p-2 ml-5 bg-[#EB455F] text-white text-lg rounded-lg"
                                        onClick={
                                            handleUploadVATFile
                                        }
                                    >เพิ่มไฟล์</button> */}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center">
              <p className="ml-[196px] text-2xl basis-1/3">
                หน้าสมุดบัญชีบริษัท (Book Bank)
              </p>
              {vendor[0]?.bookbank_uri != null && editBookbank === false ? (
                <div>
                  <button
                    className="border p-2 my-2 w-[130px] bg-[#2B3467] text-white text-lg rounded-lg"
                    onClick={() => {
                      showFileOnClick(vendor[0]?.bookbank_uri || "");
                    }}
                  >
                    ตรวจสอบไฟล์
                  </button>
                  <button
                    className="border p-2 my-2 w-[100px] ml-2 bg-[#D9C304] text-white text-lg rounded-lg"
                    name="bookbank"
                    onClick={handleEditfile}
                  >
                    แก้ไข
                  </button>
                </div>
              ) : editBookbank === true ? (
                <div>
                  <input
                    className="border rounded py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline basis-1/2"
                    id=""
                    type="file"
                    placeholder="ไฟล์อื่น ๆ"
                    name="vendor_file"
                    onChange={handleBookChange}
                    accept="application/pdf"
                    required
                  />
                  <button
                    className="border p-2 ml-2 bg-[#2B3467] text-white text-lg rounded-lg"
                    name="bookbank"
                    onClick={handleBackEditfile}
                  >
                    ย้อนกลับ
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    className="border rounded py-2 px-3 mt-2 text-gray-700 text-lg focus:shadow-outline basis-1/2"
                    id=""
                    type="file"
                    placeholder="ไฟล์อื่น ๆ"
                    name="vendor_file"
                    onChange={(event) => {
                      handleBookChange(event);
                      // handleUploadBookFile();
                    }}
                    // onChange={handleBookChange}
                    accept="application/pdf"
                    required
                  />
                  {/* <button className="border p-2 ml-5 bg-[#EB455F] text-white text-lg rounded-lg"
                                        onClick={
                                            handleUploadVATFile
                                        }
                                    >เพิ่มไฟล์</button> */}
                </div>
              )}
            </div>
            <p className="ml-20 text-2xl text-red-500">
              หมายเหตุ : โปรดรับรองสำเนาเอกสารทุกฉบับ
            </p>
          </div>
        ) : (
          <p></p>
        )}

        <div className="bg-white drop-shadow-lg rounded-lg border w-full my-4 mr-5 py-10 px-8">
          <div className="my-12 flex justify-between items-center">
            {/* dropdown */}
            <div className="relative inline-block text-left">
              <div className="flex gap-4">
                <select
                  className=" px-6 py-2 rounded-full border-2 text-xl bg-[#2B2A2A] text-white"
                  value={selectedStatus}
                  onChange={handleOnStatusChange}
                >
                  <option value={99} key={99}>
                    สถานะทั้งหมด
                  </option>
                  <option value={1} key={1}>
                    รอเสนอราคาอีกครั้ง
                  </option>
                  <option value={2} key={2}>
                    เสนอราคาแล้ว
                  </option>
                  <option value={3} key={3}>
                    สละสิทธิ์
                  </option>
                  <option value={4} key={4}>
                    รอใส่เสนอราคา
                  </option>
                </select>
              </div>
            </div>

            {/* search */}
            <div className="flex justify-end">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsSearch />
                </div>
                <input
                  type="search"
                  className="block w-[25rem] p-3 px-3 pl-10 text-xl text-gray-700 border border-gray-300 rounded-lg bg-white "
                  placeholder="ค้นหารายการ"
                  onChange={handleOnSearch}
                />
              </div>
            </div>
          </div>
          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-lg">
              <thead className="text-white text-lg bg-[#2B2A2A] h-14">
                <tr
                  className="rounded-t-lg py-6"
                  style={{ verticalAlign: "top" }}
                >
                  <th className="w-1/12 rounded-tl-lg pt-4 text-sm md:text-base">
                    ลำดับ
                  </th>
                  <th className="w-2/12 pt-4 text-sm md:text-base">
                    ชื่อโครงการ
                  </th>
                  <th className="w-2/12 pt-4 text-sm md:text-base">
                    ระยะเวลาส่งเอกสาร
                  </th>
                  <th className="w-1/6 pt-4 text-sm md:text-base">
                    วันที่เข้าร่วมสมัคร
                  </th>
                  <th className="w-1/6 pt-4 text-sm md:text-base">TOR</th>
                  <th className="w-1/6 pt-4 text-sm md:text-base">สถานะ</th>
                  <th className="rounded-tr-lg w-1/3 pt-4 text-center text-sm md:text-base">
                    ดำเนินการ
                  </th>
                </tr>
              </thead>
              {Array.isArray(listProjects) &&
                listProjects.map((listProject, index) => (
                  <tbody className="bg-white border drop-shadow-lg rounded-lg">
                    <tr
                      className="rounded-lg border h-20 pt-4"
                      style={{ verticalAlign: "top" }}
                    >
                      <td className="text-center text-lg rounded-l-lg pt-4">
                        {index + indexstart + 1}
                      </td>
                      <td className="text-left pl-2 text-lg pt-4">
                        {listProject?.name}
                      </td>
                      <td className="text-center text-lg pt-4">
                        {listProject?.submission_period}
                      </td>
                      {listProject?.submit_datetime != null ? (
                        <td className="text-center text-lg pt-4">
                          {listProject?.submission_time}
                        </td>
                      ) : (
                        <td className="text-center text-lg pt-4">-</td>
                      )}

                      <td className="text-center text-lg pt-4">
                        <button
                          className="border-2 border-gray-300 rounded-full p-1 w-[120px] text-red-500"
                          onClick={() => {
                            showFileOnClick(listProject?.Tor_uri || "");
                          }}
                        >
                          ดาวน์โหลด
                        </button>
                      </td>
                      {
                      listProject.vendor_status === "สละสิทธิ์" ? (
                        <td className="text-center text-lg text-red-700 pt-4">
                          {listProject?.vendor_status}
                        </td>
                      ) : listProject.vendor_status === "เสนอราคาแล้ว" ? (
                        <td className="text-center text-lg text-green-700 pt-4">
                          {listProject?.vendor_status}
                        </td>
                      ) : listProject.vendor_status === "รอเสนอราคาอีกครั้ง" ? (
                        <td className="text-center text-lg text-yellow-700 pt-4">
                          {listProject?.vendor_status}
                        </td>
                      ) : (
                        <td className="text-center text-lg text-black pt-4">
                          รอใส่เสนอราคา
                        </td>
                      )}

                      <td className="text-center text-lg rounded-r-lg my-2 pt-2">
                        {invalidStatuses.includes(
                          listProject?.registers_status
                        ) ? (
                          <button
                            className="border-2 border-gray-300 p-1 rounded-full w-[145px] my-2 mr-2"
                            value={listProject?.key}
                            onClick={handleClickEdit}
                          >
                            แก้ไขราคา
                          </button>
                        ) : (
                          <button
                            value={listProject?.key}
                            onClick={handleClick}
                            className={`border-2 border-gray-300 p-1 rounded-full w-[145px] my-2 mr-2 ${
                              listProject?.vendor_status === "สละสิทธิ์" 
                              || listProject?.vendor_status === "รอเสนอราคาอีกครั้ง" 
                              || listProject?.vendor_status === "เสนอราคาแล้ว"
                                ? "bg-gray-300 text-gray-500"
                                : ""
                            }`}
                            disabled={
                              listProject?.vendor_status === "สละสิทธิ์" 
                              || listProject?.vendor_status === "รอเสนอราคาอีกครั้ง"
                              || listProject?.vendor_status === "เสนอราคาแล้ว"
                            } // ปุ่มกดไม่ได้เมื่อมีการเสนอราคาแล้ว
                          >
                            เสนอราคา
                          </button>
                        )}

                        <button
                          className={`border-2 border-gray-300 p-1 rounded-full w-[145px] my-2 mr-2 ${
                            ((listProject?.vendor_registers_id !== null ||
                              listProject?.vendor_status === "เสนอราคาแล้ว") &&
                              listProject?.vendor_status !==
                                "รอเสนอราคาอีกครั้ง") ||
                            listProject?.vendor_status === "สละสิทธิ์"
                              ? "bg-gray-300 text-gray-500"
                              : ""
                          }`}
                          disabled={
                            ((listProject?.vendor_registers_id !== null ||
                              listProject?.vendor_status === "เสนอราคาแล้ว") &&
                              listProject?.vendor_status !==
                                "รอเสนอราคาอีกครั้ง") ||
                            listProject?.vendor_status === "สละสิทธิ์"
                          }
                          onClick={() =>
                            handleCancelOnClick(listProject.key || "")
                          }
                        >
                          สละสิทธ์
                        </button>
                        {listProject?.vendor_status === "รอเสนอราคาอีกครั้ง" ? (
                          <button
                            value={listProject?.key}
                            onClick={handleClickA}
                            className="border-2 border-gray-300 p-1 rounded-full w-[145px] my-2 mr-2"
                          >
                            เสนอราคาอีกครั้ง
                          </button>
                        ) : (
                          <a></a>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
          {/* <hr className="my-2 w-full"></hr> */}
          <div className="my-12 flex justify-between items-center">
            <p>
              Showing {currentPage + 1} to {totalPages} of {totalProject}{" "}
              entries
            </p>
            <div className="flex justify-end">
              <ReactPaginate
                className="flex gap-5 col-start-10 col-end-12"
                pageClassName="flex justify-center items-center w-10 h-10 text-[#EB455F] transition-colors duration-150 rounded-full focus:shadow-outline hover:bg-indigo-100 border"
                activeClassName="w-10 h-10 text-white transition-colors duration-150 bg-[#EB455F] border border-r-0 border-[#EB455F] rounded-full focus:shadow-outline"
                nextLinkClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                previousClassName="flex items-center justify-center w-10 h-10 text-[#EB455F] transition-colors duration-150 bg-white rounded-full focus:shadow-outline hover:bg-indigo-100"
                onPageChange={handlePaginationClick}
                pageCount={totalPages}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                nextLabel=">"
                previousLabel="<"
                forcePage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
