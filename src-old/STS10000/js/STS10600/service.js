const apiUrl = "/STSBidding/service/"

const listDepartment = async () => {
    const reqOpt = {
        method: 'GET',
    }

    const res = await fetch(
        apiUrl + `STS10000/STS10600/getDepartments.php`,
        reqOpt
    ).then((response) => response.json() )
    
    return res
}


const listDivisions = async () => {
    const reqOpt = {
        method: 'GET',
    }

    const res = await fetch(
        apiUrl + `STS10000/STS10600/getDivisions.php`,
        reqOpt
    )
    const resData = await res.json();

    return resData;

}

const listProjectTypes = async () => {
    const reqOpt = {
        method: 'GET',
    }

    const res = await fetch(
        apiUrl + `STS10000/STS10600/getProjectTypes.php`,
        reqOpt
    )
    const resData = await res.json();

    return resData;

}

const listgetJobTypes = async () => {
    const reqOpt = {
        method: 'GET',
    }

    const res = await fetch(
        apiUrl + `STS10000/STS10600/getJobTypes.php`,
        reqOpt
    )
    const resData = await res.json();

    return resData;

}

const listEmployeeByNameOrEmpNo = async (data) => {
    const reqOpt = {
        method: "GET"
    }
    const res = await fetch(
        apiUrl + `STS10000/STS10600/getUserStaffForSearch.php?user=${data}`,
        reqOpt
    )
    const resData = await res.json();
    return resData;
}

const getEmployeeByEmpNO = async (data) => {
    // extract a data from 0001-2xxxxx to xxxxx

    const employeeNo = data.slice(-5);
    const reqOpt = {
        method: "GET"
    }
    const res = await fetch(
        apiUrl + `STS10000/STS10600/getUserStaffByEmpNo.php?user=${employeeNo}`,
        reqOpt
    )
    const resData = await res.json();
    return resData;
}



export {
    listDepartment, 
    listDivisions, 
    listProjectTypes, 
    listgetJobTypes, 
    listEmployeeByNameOrEmpNo,
    getEmployeeByEmpNO
}