const apiUrl = "/STSBidding/service/";

const getLog = async (projectKey) => {
    const reqOpt = {
        method: "GET",
    };
    const res = await fetch(
        apiUrl + `STSSP_LOG/getLog.php?key=${projectKey}`,
        reqOpt
    ).then((response) => response.json())
    return res;
}

async function GetProjectByProjectID(projectID) {
    const reqOpt = {
        method: "GET",
    };
    const res = await fetch(
        apiUrl + `STSSP10000/get/get_project.php?pj_id=${projectID}`,
        reqOpt
    )
        .then((response) => response.json())
        .then((res) => {
            return res;
        });

    return res;
}

function isCheckedElementCheckBox(elements) {
    let checked_length = 0;
    elements.forEach((checkbox) => {
        if (checkbox.checked) {
            checked_length++;
        }
    });
    checked_length = Boolean(checked_length);

    for (let i = 0; i < elements.length; i++) {
        const checkbox = elements[i];
        if (checkbox.checked && Number(checkbox.value) === 1) {
            return [checked_length, true];
        }
    }
    return [checked_length, false];
}


/**
 * This Method will reture in this form
 * 
 * if found a data 
 * {
 *  data: {
 *      budget : { main },
 *      subBudget : [ {} , {}, {}]
 *    }
 * }
 * =======================================
 * if not found 
 * {
 *  err : {
 *      "data" : "{error}"
 *      }
 * }
 * 
 */
const getPrevBudget = async (projectId) => {
    const reqOpt = {
        method: "GET",
    };
    const res = await fetch(
        apiUrl + `STSSP10000/get/getPrevBudget.php?pj_key=${projectId}`,
        reqOpt
    ).then(
        (response) => response.json()
    ).then((res) => {
        return res;
    })
    return res
}



function updateTextView(obj) {
    var num = getNumber(obj.value);
    if (num === 0) {
        obj.value = "";
    } else {
        obj.value = num.toLocaleString();
    }
}

function getNumber(str) {
    var arr = str.split("");
    var out = [];
    for (var cnt = 0; cnt < arr.length; cnt++) {
        if (!isNaN(arr[cnt])) {
            out.push(arr[cnt]);
        }
    }
    return Number(out.join(""));
}

const getReasonReject = async (projectKey) => {
    const reqOpt = {
        method: "GET",
    }
    const res = await fetch( apiUrl + `STSSP10000/get/getRejectReason.php?key=${projectKey}`, reqOpt)
    const resData = await res.json();
    return resData;
}


// Helper function for creating DOM elements with attributes
const createDOMElement = (tag, attributes = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    return element;
};

// Helper function to create table row for log data
const createLogTableRow = (Log) => {
    const row = createDOMElement("tr");
    const td1 = createDOMElement("td", { class: "text-center" });
    const td2 = createDOMElement("td", { class: "text-center" });
    const td3 = createDOMElement("td", { class: "text-center" });

    td1.innerText = Log.action_datetime;
    td2.innerText = Log.log_action;
    td3.innerText = `${Log.Ref_price_Manager.user_staff.employee.firstname_t} ${Log.Ref_price_Manager.user_staff.employee.lastname_t}`;

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);

    return row;
};

function dateFormatter(dateString) {
    let date = new Date(dateString);
    let dateFormat = date.toLocaleString("th-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    return dateFormat;
}

// Run Method POST เพื่อเพิ่มราคากลาง
async function CreateBudget(formData) {
    const reqOpt = {
        method: "POST",
        body: formData,
    };
    const res = await fetch(apiUrl + "STSSP10000/post/create.php", reqOpt)
        .then((response) => response.json())
        .then((res) => {
            return res;
        });

    return res;
}

async function CreateBudgetWithSub(formData) {
    const reqOpt = {
        method: "POST",
        body: formData
    };
    const res = await fetch(
        apiUrl + `STSSP10000/post/create-sub.php`,
        reqOpt
    ).then((res) => res.json())
    return res;
}


export { 
    GetProjectByProjectID, 
    isCheckedElementCheckBox, 
    getPrevBudget, 
    updateTextView,
    getLog,
    getReasonReject,
    createLogTableRow,
    dateFormatter,
    CreateBudget,
    CreateBudgetWithSub
 };
