import { LuFolders } from 'react-icons/lu'
import { useEditProjectContext } from '../../pages/Project/ProjectOwnerEdit'
import React, { useEffect, useState } from 'react';
import { DivisionInterface } from '../../models/Project/IDivision';
import { getAffiliation, getDepartments, getDivision, getJobType, getProjectType } from '../../services/ProjectServices';
import { DepartmentInterface } from '../../models/Project/IDepartment';
import { ProjectTypeInterface } from '../../models/Project/IProjectType';
import { ProjectJobTypeInterface } from '../../models/Project/IProjectJobType';
import Select, { OptionsOrGroups } from 'react-select';
import { AffitiationInterface } from '../../pages/Project/ProjectCreate';

export default function DetailProjectOwnerEditComponent() {

  const [affiliationoption, setAffiliationOption] = useState<OptionsOrGroups<any, any> | undefined>([]);
  const [selectedOption, setSelectedOption] = useState<OptionsOrGroups<any, any> | undefined>(undefined);

  const { editProject, setEditProject } = useEditProjectContext();

  const [projectType, setProjectType] = useState<ProjectTypeInterface[]>([]);
  const [projectJobType, setProjectJobType] = useState<ProjectJobTypeInterface[]>([]);

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let name = e.target.name as keyof typeof editProject;
    setEditProject(
      {
        ...editProject,
        [name]: e.target.value
      }
    )
  }


  const listProjectType = async () => {
    let res = await getProjectType();
    setProjectType(res.data)
  }

  const listProjectJobType = async () => {
    let res = await getJobType()
    setProjectJobType(res.data)
  }

  const handleOnChangeDropDown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.name as keyof typeof editProject;
    let value = e.target.value
    setEditProject({
      ...editProject,
      [name]: value
    })
  }

  const handleChangeOptionAffiliation = (selectedOption: OptionsOrGroups<any, any> | undefined) => {
    const optionValue: number = (selectedOption as any).value;
    setSelectedOption(selectedOption);
        setEditProject({
        ...editProject,
        section_id: (optionValue),
    });
  };

  const getAllAffiliation = async () => {
    let res = await getAffiliation();
    console.log(res.data);
    const formattedOptions = (res.data).map((item: AffitiationInterface, index: number) => ({
      value: index + 1,
      label: `${item.SECTION} / ${item.department_name} / ${item.SUBSECTION} / ${item.division_name}`
    }));
    setAffiliationOption(formattedOptions);
    setSelectedOption(formattedOptions[0]);
};

  useEffect(() => {
    listProjectType();
    listProjectJobType();
    getAllAffiliation();

  }, [])

  return (
    <div className='mt-5 xl:border p-2 w-full bg-[#2B3467] rounded-xl'>
      <div className='flex xl:flex-row flex-col p-2 w-full justify-center  bg-[#2B3467]rounded-xl'>
        <div className='bg-[#2B3467] text-white flex justify-center items-center flex-col p-4 rounded-xl xl:rounded-r-none xl:rounded-l-xl w-full xl:w-1/3'>
          <LuFolders className="text-9xl " />
          <p className='text-3xl text-center'>ข้อมูลโครงการ <br /> เบื้องต้น</p>
        </div>
        {/* ชื่อโครงการ */}
        <div className='border p-4 box-border w-full rounded-r-xl bg-white'>
          <form className='flex flex-col gap-3'>
            <div className='flex flex-col'>
              <label className='text-lg md:text-2xl mb-2 ml-4 font-bold'>ชื่อโครงการ  </label>
              <input
                placeholder='ชื่อโครงการ'
                className=' text-lg md:text-xl p-2 ml-4  border rounded-lg w-11/12'
                name="name"
                value={editProject.name || ""}
                onChange={handleOnChangeInput}
              />
            </div>

            <div className='flex flex-col box-content md:flex-row gap-2 w-full'>
              {/* ประเภทโครงการ */}
              <div className='flex flex-col w-full xl:w-1/2'>
                <label className='text-lg md:text-2xl mb-2 ml-4 font-bold'>ประเภทโครงการ</label>
                <select
                  className='p-2 border rounded-lg text-lg ml-4 md:text-xl w-3/4'
                  value={editProject.project_type_id || "DEFALUT"}
                  name='project_type_id'
                  onChange={handleOnChangeDropDown}
                >
                  <option value={"DEFALUT"} disabled>
                    ประเภทโครงการ
                  </option>
                  {
                    projectType !== null && projectType.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.type_name}
                      </option>
                    ))
                  }
                </select>
              </div>
              {/* ประเภทงาน */}
              <div className=' flex flex-col  '>
                <label className='text-lg md:text-2xl mb-2 ml-4 font-bold'>ประเภทงาน</label>
                <select
                  className='p-2 border rounded-lg text-lg md:text-xl ml-4'
                  value={editProject.job_type_id || "DEFALUT"}
                  name='job_type_id'
                  onChange={handleOnChangeDropDown}
                >
                  <option value={"DEFALUT"} disabled>
                    ประเภทงาน
                  </option>
                  {
                    projectJobType !== null && projectJobType.map((data) => (
                      <option key={data.id} value={data.id}>
                        {data.job_type_name}
                      </option>
                    ))
                  }
                </select>
              </div>
            </div>

            
              {/* ส่วนงาน Division*/}
        
            <div className="lg:mb- flex flex-col lg:flex-row gap-3">
                                <div className="block w-full">
                                    <label className="text-lg md:text-2xl mb-2 ml-4 font-bold">
                                        สังกัด
                                    </label>
                                    <Select
                                    placeholder="เลือกสังกัด"
                                    id="division"
                                    className="w-11/12 py-2 px-3 mt-2 text-lg focus:shadow-outline ml-4 "
                                    classNamePrefix="select"
                                    value={selectedOption}
                                    options={affiliationoption}
                                    onChange={handleChangeOptionAffiliation}
                                    styles={{
                                        // เพิ่มสไตล์เพื่อปรับขนาดของกล่อง
                                        control: (provided) => ({
                                            ...provided,
                                            minHeight: '50px', // ปรับความสูงตามต้องการ
                                            width: '100%', // เพิ่มความกว้างเต็มรูป
                                        }),
                                    }}
                                />
                                </div>
                            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
