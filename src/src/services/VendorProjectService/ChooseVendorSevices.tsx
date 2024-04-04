
import { apiUrl } from "../utilitity";

async function AllJobType() {
    let res = await fetch(`${apiUrl}/vendorProjects/listVendorJobType.php`, {
        method: "GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}

const getVendorByJobOrName = async (search: any,project_id: any) => {
    let res = await fetch(`${apiUrl}/vendorProjects/listVendorListNameType.php?search=${search}&project_id=${project_id}`, {
        method: "GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}

const listVendorProject = async (projectId: any,type: any) => {
    let res = await fetch(`${apiUrl}/vendorProjects/listVendorProject.php?projectId=${projectId}&type=${type}`, {
        method: "GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}

const listBlacklistVendorProject = async () => {
    let res = await fetch(`${apiUrl}/vendorProjects/getBlacklistvendor.php`, {
        method: "GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}

async function createVendorlistProject(project_id: any,vendor_id : any) {
    const payload = {
        project_id: project_id,
        vendor_id: vendor_id
    };
    
    let res = await fetch(`${apiUrl}/vendorProjects/createVendorListOfProject.php`, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}

async function deleteVendorProject(vendor_project_id: any){
    let res = await fetch(`${apiUrl}/vendorProjects/removeVendorOfProject.php?vendor_project_id=${vendor_project_id}`
    , {
        method: "GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}
const listVendorProjectAll = async (projectId: any) => {
    let res = await fetch(`${apiUrl}/vendorProjects/listVendorProjectAll.php?projectId=${projectId}`, {
        method: "GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    if (res.status === 200) {
        return resJson;
    } else {
        return false;
    }
}

export
 { 
    AllJobType,
    getVendorByJobOrName,
    createVendorlistProject,
    listVendorProject,
    deleteVendorProject,
    listVendorProjectAll,
    listBlacklistVendorProject,
 };
