const apiUrl = "/STSBidding/service/";


const getLogProject = async (projectKey) => {
    const reqOpt = {
        method: "GET"
    };
    const res = await fetch(apiUrl + `STSSP_LOG/getLog.php?key=${projectKey}`, reqOpt)
    .then((response) => response.json())
    .then((res) => {
        return res;
    })

    return res;
}


const getProject = async (projectKey) => {
    const reqOpt = {
        method: "GET",
    };
    const res = await fetch(
        apiUrl + `STSSP20000/getProject.php?key=${projectKey}`,
        reqOpt
    ).then((response) => response.json())
    .then((res) => {
        return res
    })
    return res
}


const getLastBudgetCalculator = async (refPriceCalculatorId) => {
    const reqOpt = {
        method: "GET",
    };
    const res = await fetch(
        apiUrl + `STSSP20000/getBudgetCalculate.php?key=${refPriceCalculatorId}`,
        reqOpt
    ).then((response) => response.json())
    .then(res => {return res})
    return res
}


const listSubBudgetByBudgetCalculatorID = async (budgetId) => {
    const reqOpt = {
        method: "GET"
    };
    const res = await fetch(
        apiUrl + `STSSP20000/getSubBudget?bud_id=${budgetId}`,
        reqOpt
    ).then((response) => response.json())
    .then((res) => {
        return res
    })
    return res;
}


const postVerify = async (data) => {
    const reqOpt = {
        method: "POST",
        body: JSON.stringify(data)
    };
    const res = await fetch(
        apiUrl + `STSSP20000/verifyBC.php`,
        reqOpt
    ).then((response) => response.json())
    .then(res => {
        return res
    })
    return res;
}


const getReason = async () => {
    const reqOpt = {
        method: "GET"
    };
    const res = await fetch(
        apiUrl + `STSSP20000/getReason.php`,
        reqOpt
    ).then((response) => response.json())
    .then((res) => {
        return res
    })
    return res;
}

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

export {
    getProject, 
    getLastBudgetCalculator, 
    listSubBudgetByBudgetCalculatorID,
    postVerify,
    getReason,
    getLogProject,
    dateFormatter
}