import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { CreateRejectVerifyApproveVnedorProject, ListRejectTopicApproveVendorProject, VerifyUserIsAVerifier } from '../../../services/ContractorService/VerifyUnListService';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../components/Loading';
import { RejectApproveVendorProjectinterface, TopicRejectApproveVendorProject } from '../../../models/Contractor/IVerify';
import LoginForm from '../../loginemail/loginemail';
import { LogoutService } from '../../../services/LoginService';
import ErrorVerifyVendorPage from './ErrorVerifyVendorPage';

export default function RejectVerifyUnlistVendor() {

    const [checkState, setCheckState] = useState<string>("login")
    const urlParams = new URLSearchParams(window.location.search);
    const [approveId] = useState<string>(urlParams.get("approve_id") || "");
    const [rejectTopic, setRejectTopic] = useState<TopicRejectApproveVendorProject[]>([]);

    const [rejectApprove, setRejectApprove] = useState<Partial<RejectApproveVendorProjectinterface>>({});

    const navigate = useNavigate();

    const [page, setPage] = useState<string>("loading")
    const [error, setError] = useState<string>("")

    const handleSubmitButton = () => {
        const mySwal = withReactContent(Swal)
        mySwal.fire({
            title: (<p className='text-3xl'>ยืนยันการเสนอปฏิเสธ<br />กลุ่มผู้รับเหมานอกทะเบียน</p>),
            html: (
                <span className='text-red-500'>
                    หากท่านกดยืนยันแล้ว จะไม่สามารถแก้ไขได้อีก ท่านยืนยันที่จะปฏิเสธกลุ่มผู้รับเหมานอกทะเบียนเหล่านี้จริงหรือไม่
                </span>
            ),
            showCancelButton: true,
            cancelButtonText: <p className='text-xl'>ยกเลิก</p>,
            confirmButtonText: (<p className='text-xl'>ยืนยัน</p>),
            confirmButtonColor: "#EB455F",
            preConfirm: async () => {
                let res = await CreateRejectVerifyApproveVnedorProject(rejectApprove as RejectApproveVendorProjectinterface);
                if(res.status !== 200) mySwal.showValidationMessage(res.err)
                return res.data
            }
        }).then((response) => {
            if(response.isConfirmed){
                mySwal.fire({
                    title: (<h3 className='text-3xl text-green-500'>การปฏิเสธผู้เข้าร่วมโครงการสำเร็จ</h3>),
                    icon: "success",
                    confirmButtonText: (<p className='text-xl'>ตกลง</p>),
                }).then(() => {
                    navigate("/")
                })
            }
        })
    }

    const verifyApproveVendorProject = async () => {
        let res = await VerifyUserIsAVerifier(approveId);
        if (res.status === 401) {
            LogoutService();
            setPage("login");
            setCheckState("login");
            return;
        }
        if (res.status !== 200) {
            setPage("error")
            setError(res.err)
            return;
        }
        setPage("verify");
        setCheckState("verify");
    }

    const loadTopicApproveVendorProject = async () => {
        const res = await ListRejectTopicApproveVendorProject();
        setRejectTopic(res.data)
    }

    const handleChangeInputText = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const name = e.target.name as keyof typeof rejectApprove;
        setRejectApprove(
            {
                ...rejectApprove,
                [name] : e.target.value
            }
        )
    }

    const onSubmitLogin = async (loginResult: any): Promise<void> => {
        console.log(loginResult)
        Swal.fire({
            title: `<span style="color: red;">ยืนยันการพิจารณา</span>`,
            text: "เมื่อกดปุ่มนี้ ท่านไม่สามารถกลับมาแก้ไขได้อีก",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EB455F',
            cancelButtonColor: '#979797',
            confirmButtonText: '<span style="font-size: 25px;">ยืนยัน</span>',
            cancelButtonText: '<span style="font-size: 25px;">ปิด</span>',
      
        }).then(async (result) => {
            if (result.isConfirmed) {
              if (loginResult.status === 200) {
                setTimeout(() => {
                  setPage("loading");
                }, 10);
                setPage("loading");
                setCheckState("verify");
                // window.location.replace(window.location.href);
              } else {
                Swal.fire({
                  title: <h3>{loginResult.err}</h3>,
                });
              }
              console.log(555555);
            }
        })
      };
      

    useEffect(() => {
        console.log(checkState);
        switch (checkState) {
          case "login":
            setPage("login");
            break;
          case "verify":
            loadTopicApproveVendorProject();
            verifyApproveVendorProject();
            break;
          default:
            break;
        }
      }, [checkState]);
    
    useEffect(() => {
        setRejectApprove(
            {
                avp_id:approveId
            }
        )
    }, [])

    return (
        <div>
            {
                page === "loading" && <LoadingComponent />
            }
            {
                page == "login" && <LoginForm loginSubmit={onSubmitLogin} />
            }
            {
                page === "verify" && (
                    <div className='fixed flex justify-center items-center top-0 left-0 h-screen w-screen bg-white'>
                        <div className='
                            bg-white flex flex-col justify-center items-center px-10 w-7/12 h-1/2 border gap-4 drop-shadow-lg rounded-lg z-30'>
                            <p className=' mb-6 text-3xl text-red-500'>
                                กรุณาระบุเหตุผลการปฏิเสธ
                            </p>
                            <div className='grid grid-cols-12 gap-4 w-full  items-center'>
                                <label className='text-xl col-start-1 col-end-4'>กรุณาเลือกเหตุผลการปฏิเสธ:</label>
                                <select 
                                    value={ rejectApprove.reject_topic_id || 0} 
                                    name="reject_topic_id"
                                    className='border border-black w-full py-2 px-2 col-start-5 col-end-13 text-xl'
                                    onChange={handleChangeInputText}
                                >
                                    <option disabled className='text-gray-50' value={0}>เหตุผลการปฏิเสธ Vendor</option>
                                    {
                                        rejectTopic.map((item) => (
                                            <option value={item.id}>{item.reject_topic}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className='grid grid-cols-12 gap-4 w-full'>
                                <label className='text-xl col-start-1 col-end-4'>รายละเอียดเพิ่มเติม:</label>
                                <textarea
                                    name="reject_detail"
                                    onChange={handleChangeInputText}
                                    value={rejectApprove.reject_detail || ""}
                                    className='border h-40 border-black w-full py-2 px-2 col-start-5 col-end-13 text-xl'
                                    placeholder='ข้อมูลเพิ่มเติมในการปฏิเสธ vendor นอกทะเบียน' />
                            </div>

                            <button
                                className='px-6 py-4 text-white text-xl bg-[#2B3467] rounded-xl'
                                onClick={handleSubmitButton}
                            >
                                ยืนยันการปฏิเสธ
                            </button>
                        </div>
                    </div>
                )
            }
            {
                page === "error" && <ErrorVerifyVendorPage />
            }
        </div>
    )
}
