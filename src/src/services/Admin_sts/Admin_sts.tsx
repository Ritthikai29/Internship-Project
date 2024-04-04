import { EmployeeInterface } from "../../models/Project/IEmployee";
import { VendorListForAdminInterface, VendorListForSearchInterface, VendorListInterface } from "../../models/Project/IVenderinfo";
import { apiUrl } from "../utilitity";

const GetUserforadmin = async () => {
    let res = await fetch(
        `${apiUrl}/admin/getUserforadmin.php`,
        {
            method:"GET",
            credentials:import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json()
    return resJson;
}

const GetUserforsearch = async (

    user:string,
) => {
    let res = await fetch(
        `${apiUrl}/admin/getUserforsearch.php?user=${user}`,
        {
            method:"GET",
            credentials:import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json()
    console.log(resJson)
    return resJson;
}

const GetRoleforadmin = async () => {
    let res = await fetch(
        `${apiUrl}/admin/getRole.php`,
        {
            method:"GET",
            credentials:import.meta.env.DEV ? "include": "same-origin"
        }
    );
    let resJson = await res.json()
    return resJson;
}

const deleteUserforadmin = async (
    index: EmployeeInterface,
) => {
    let res = await fetch(
        `${apiUrl}/admin/deleteUser.php`,
        {
            method:"POST",
            credentials:import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify({ empId: index.employee_id, empNO: index.employeeNO }),
        }
    );
    let resJson = await res.json()
    console.log(resJson)
    return resJson;
}


const getVenderListForSearch= async ( data:VendorListForSearchInterface) => {
   
    let res = await fetch(
        `${apiUrl}/admin/serachVenderList.php`,
        {
            method:"POST",
            credentials:import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify({ data_serach: data.data_serach, expertise: data.expertise }),
         }
    );
    let resJson = await res.json()
    console.log(resJson)
    return resJson;
}

const AddUserforadmin = async (
    data: any,
) => {
    console.log(data);
    let res = await fetch(
        `${apiUrl}/admin/addUserforadmin.php`,
        {
            method:"POST",
            credentials:import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify({ employeeNO: data.employeeNO, projectJobTypeId: data.projectJobTypeId }),

        }
    );
    let resJson = await res.json()
    console.log(resJson)
    return resJson;
}

const AddVenderList= async (
    data: VendorListForAdminInterface,
) => {
    console.log(data);
    let res = await fetch(
        `${apiUrl}/admin/addVenderList.php`,
        {
            method:"POST",
            credentials:import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify({ 
                vendor_key: data.vendor_key ,
                add_datetime: data.add_datetime ,
                company_name: data.company_name ,
                affiliated: data.affiliated,
                location: data.location ,
                location_main: data.location_main,
                manager_name: data.manager_name ,
                manager_role: data.manager_role ,
                phone_number: data.phone_number ,
                email: data.email ,
                expertise: data.expertise ,
                note: data.note ,
                vendor_level: data.vendor_level,
                jobtype: data.jobtype
            }),
        }
    );
    let resJson = await res.json()
    console.log(resJson)
    return resJson;
}


const UpdateVendorList= async (
    data: VendorListInterface,
) => {
    console.log(data);
    let res = await fetch(
        `${apiUrl}/admin/updateVendorList.php`,
        {
            method:"POST",
            credentials:import.meta.env.DEV ? "include": "same-origin",
            body: JSON.stringify({ 
                vendor_key: data.vendor_key ? data.vendor_key : null ,
                add_datetime: data.add_datetime ? data.add_datetime : null ,
                company_name: data.company_name ? data.company_name : null ,
                affiliated: data.affiliated ? data.affiliated : null ,
                location_detail: data.location_detail ? data.location_detail : null ,
                location_main: data.location_main ? data.location_main_id : null ,
                manager_name: data.manager_name ? data.manager_name : null ,
                manager_role: data.manager_role ? data.manager_role : null ,
                phone_number: data.phone_number ? data.phone_number : null ,
                email: data.email ? data.email : null ,
                expertise: data.expertise ? data.expertise : null ,
                note: data.note ? data.note : null ,
                vendor_level: data.vendor_level ? data.vendor_level : null ,
                jobtype: data.jobtype ? data.jobtype : null, 
                expertise_value: data.expertise_value ? data.expertise_value : null ,
            }),
        }
    );
    let resJson = await res.json()
    console.log(resJson)
    return resJson;
}


const ListAllExpertise = async () => {
    const res = await fetch(
        `${apiUrl}/admin/getExpertise.php`,
        {
            method: "GET",
            credentials: import.meta.env.DEV ? "include": "same-origin"
        }
    )
    const resJson = await res.json();
    return resJson;
}

export {
    GetUserforadmin,
    deleteUserforadmin,
    getVenderListForSearch,
    GetRoleforadmin,
    AddUserforadmin,
    GetUserforsearch,
    AddVenderList,
    UpdateVendorList,
    ListAllExpertise
}