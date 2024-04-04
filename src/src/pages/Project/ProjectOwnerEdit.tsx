import React from 'react'
import DetailProjectOwnerEditComponent from '../../components/ProjectOwnerEdit/DetailProjectOwnerEditComponent'
import FileProjectOwnerEditComponent from '../../components/ProjectOwnerEdit/FileProjectOwnerEditComponent'
import { ProjectEditOwnerInterface, ReasonEditProjectInterface } from '../../models/Project/IProject'
import { createContext, useContext, useEffect, useState } from 'react'
import { GetEditProjectByKey, UpdateProjectByProjectKey, GetReasonProjectEdit } from '../../services/EditProjectService/EditProjectService'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import CalculatorManagerComponent from '../../components/ProjectOwnerEdit/CalculatorManagerComponent'
import ReasonToEditComponent from '../../components/ProjectOwnerEdit/ReasonToEditComponent'
import { useNavigate } from 'react-router-dom'

// use context for this page only 

interface ReasonContextInterface {
  reason: Partial<ReasonEditProjectInterface>;
  setReason: React.Dispatch<React.SetStateAction<Partial<ReasonEditProjectInterface>>>;
}
const ReasonContext = createContext<ReasonContextInterface>({
  reason: {},
  setReason: () => { },
})
export function useReasonContext() {
  const context = useContext(ReasonContext)
  if (context === undefined) {
      throw new Error("useReasonContext error")
  }
  return context
}

interface EditProjectOwnerContent {
  editProject: Partial<ProjectEditOwnerInterface>
  setEditProject: React.Dispatch<React.SetStateAction<Partial<ProjectEditOwnerInterface>>>;
}

const EditProjectContext = createContext<EditProjectOwnerContent>({
  editProject: {},
  setEditProject: () => { }
})

export function useEditProjectContext() {
  const context = useContext(EditProjectContext)
  return context
}

export default function ProjectOwnerEdit() {

  const queryParameters = new URLSearchParams(location.search)
  const navigate = useNavigate();

  const [editProject, setEditProject] = useState<Partial<ProjectEditOwnerInterface>>({});
  const [reason, setReason] = useState<Partial<ReasonEditProjectInterface>>({});

  const handleSaveEditProject = async () => {
    console.log(editProject.key)
    const mySwal = withReactContent(Swal);
    mySwal.fire(
      {
        title: (
          <div>
            <h4 className='text-[#2B3467]'>ยืนยันการบันทึก</h4>

          </div>
        ),
        html: (
          <div>
            <p className='text-[#188493] text-lg '>ต้องการดำเนินการหรือไม่!</p>
            
          </div>
        ),
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ตกลง",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let res = await UpdateProjectByProjectKey(editProject as ProjectEditOwnerInterface);
          if (res.status !== 200) {
            mySwal.showValidationMessage(res.err)
          }
          return res.data
        }
      }
    ).then(
      (response) => {
        if (response.isConfirmed) {
          Swal.fire(
            {
                title: 'ส่งสำเร็จ!',
                text: "",
                icon: 'success',
                confirmButtonText: 'ยืนยัน',
            }
          ).then(() => {
            navigate("/project/ManageProject");
        });
        }
      }
    )
  }

  const getProjectByKey = async () => {
    let projectKey = queryParameters.get("project_key");
    if (projectKey == null) {
      alert("ไม่พบคีย์โครงการ")
      throw new Error("not found project key");
    }
    let res = await GetEditProjectByKey(projectKey);
    setEditProject(res.data)
  }

  const getReasonById = async () => {
    let projectId = queryParameters.get("project_id");
    if (projectId == null) {
      alert("ไม่พบโครงการ")
      throw new Error("not found project id");
    }
    let res = await GetReasonProjectEdit(projectId);
    setReason(res.data)
    console.log(res.data)
  }

  useEffect(() => {
    getProjectByKey()
    getReasonById()
  }, []);
  return (
    <EditProjectContext.Provider value={{
      editProject,
      setEditProject
    }}>
      <div className='my-5 mx-[2rem]'>

        <ReasonToEditComponent />
        <DetailProjectOwnerEditComponent /> 
        <FileProjectOwnerEditComponent />

        <div className='flex justify-center gap-12 mt-4'>
          {
            (editProject.status &&
              editProject.status.status_name === "ต้องแก้ไขเอกสาร") &&
            <button
              className='border px-24 py-2 bg-[#2B3467] text-white text-2xl rounded-lg'
              onClick={handleSaveEditProject}
            >
              บันทึก
            </button>}
        </div>

        {/* SECTION DEFINE A BUDGET */}
        <CalculatorManagerComponent />
        
      </div>
    </EditProjectContext.Provider>
  )
}
