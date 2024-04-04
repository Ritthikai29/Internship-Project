
import { apiUrl } from "../utilitity";


async function getProjectSetting( key : string) {
    let res = await fetch(`${apiUrl}/projectRegisters/getProjectInfo.php?key=${key}`,  {
        
        method:"GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    
        return resJson;
}
async function getVendorInfo( ) {
    let res = await fetch(`${apiUrl}/projectRegisters/getVendorInfo.php`,  {
        
        method:"GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    
        return resJson;
}
async function getsubprice( key : string ) {
    let res = await fetch(`${apiUrl}/projectRegisters/getSubPriceName.php?key=${key}`,  {
        
        method:"GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    
        return resJson;
}
async function getProjectByKey( key : string ) {
    let res = await fetch(`${apiUrl}/projectRegisters/getVendorRegisterInfo?key=${key}`,  {
        
        method:"GET",
        credentials: import.meta.env.DEV ? "include": "same-origin"
    });
    const resJson = await res.json();
    
        return resJson;
}

// async function registerProjectService( key : string ) {
//     let res = await fetch(`${apiUrl}/projectRegisters/vendorRegister.php?key=${key}`,  {
        
//         method:"GET",
//         credentials: import.meta.env.DEV ? "include": "same-origin"
//     });
//     const resJson = await res.json();
    
//         return resJson;
// }



// async function getProjectinfo(key : string ) {
//     let res = await fetch(`${apiUrl}/projectRegisters/getProjectInfo.php?key=${key}`,  {
        
//         method:"GET",
//         credentials: import.meta.env.DEV ? "include": "same-origin"
//     });
//     const resJson = await res.json();
    
//         return resJson;
// }




export { getProjectSetting
    ,getVendorInfo,
    getsubprice,
    getProjectByKey
    // registerProjectService
} ;


