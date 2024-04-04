import React, { useState } from 'react'
import { LuFileUp } from 'react-icons/lu'
import { openUploadFile, showFileOnClick } from '../../services/utilitity'
import { useEditProjectContext } from '../../pages/Project/ProjectOwnerEdit'


export default function FileProjectOwnerEditComponent() {

  const { editProject, setEditProject } = useEditProjectContext();

  const [isUpdate, setIsUpdate] = useState<{
    tor: boolean,
    job_description: boolean
  }>({
    tor: false,
    job_description: false
  });

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    const name = e.target.name as keyof typeof isUpdate;
    if (e.target.files === null) {
      return;
    }
    setIsUpdate(
      {
        ...isUpdate,
        [name]: e.target.value
      }
    )

    setEditProject(
      {
        ...editProject,
        [name]: e.target.files[0]
      }
    )
  }

  return (
    <div className='mt-5 w-full border flex justify-center flex-col rounded-xl bg-zinc-200'>
      <div className='py-2 pl-2 bg-[#2B3467] rounded-t-2xl mx-4 mt-4 flex items-center'>
        <LuFileUp className="text-5xl m-4 text-white" />
        <p className='font-black text-3xl m-4 text-white'>ข้อมูลงาน</p>
      </div>
      <div className='border rounded-2xl m-4 px-2 md:px-1 lg:px-28 bg-white'>
        <div className='p-4 pb-8 flex flex-col gap-5 px-4 '>
          <div className='flex flex-col justify-center gap-2'>
            <label className='text-xl'>
              เอกสาร TOR <span className='text-red-500'>(PDF ขนาดไม่เกิน 2 MB)</span> :
            </label>
            <div className='flex gap-4'>
              <input className='
                  relative p-4 px-3 py-2 block min-w-1/4 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding  text-base font-normal text-neutral-700 transition duration-300 ease-in-out 
                  file:-mx-3 file:-my-4 file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-5 file:py-3 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] file:hover:cursor-pointer
                  w-full
                  disabled:bg-gray-300
                  hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary
                  cursor-pointer'
                onChange={handleOnChangeFile}
                type='file'
                accept='application/pdf'
                name='tor'
                placeholder='แก้ไขไฟล์'
              />
              {
                !isUpdate.tor ? (
                  <button
                    onClick={() => { showFileOnClick(editProject.Tor_uri || "") }}
                    className='bg-[#EB455F] text-white rounded-lg text-lg ml-2 whitespace-nowrap border p-2'
                  >
                    ตรวจสอบไฟล์ (ที่เคยแนบ)
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (editProject.tor !== undefined) {
                        openUploadFile(editProject.tor)
                      }
                    }}
                    className=' bg-[#EB455F] text-white rounded-lg text-lg ml-2 whitespace-nowrap border p-2'
                  >
                    ตรวจสอบไฟล์
                  </button>
                )
              }
            </div>
          </div>
          <div className='flex flex-col justify-center gap-2'>
            <label className='text-xl'>
              เอกสารแจ้งงาน <span className='text-red-500'>(PDF ขนาดไม่เกิน 2 MB)</span> :
            </label>
            <div className='flex gap-4'>
              <input className='
                  relative p-4 px-3 py-2 block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding  text-base font-normal text-neutral-700 transition duration-300 ease-in-out 
                  file:-mx-3 file:-my-4 file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-5 file:py-3 file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] file:hover:cursor-pointer
                  disabled:bg-gray-300
                  hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary
                  cursor-pointer'
                type='file'
                accept='application/pdf'
                name='job_description'
                onChange={handleOnChangeFile}
                placeholder='แก้ไขไฟล์'
              />
              {
                !isUpdate.job_description ? (
                  <button
                    onClick={() => { showFileOnClick(editProject.Job_description_uri || "") }}
                    className='bg-[#EB455F] text-white rounded-lg text-lg ml-2 whitespace-nowrap border p-2'
                  >
                    ตรวจสอบไฟล์ (ที่เคยแนบ)
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (editProject.job_description !== undefined) {
                        openUploadFile(editProject.job_description)
                      }
                    }}
                    className='bg-[#EB455F] text-white rounded-lg text-lg ml-2 whitespace-nowrap border p-2'
                  >
                    ตรวจสอบไฟล์
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
