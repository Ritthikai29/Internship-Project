// This JS it will load all user from database for use in non-ref-price (ไม่มีราคากลาง)

// ? I think we should load when user write something to textbox ?
// * I should use Jquery for create a autocomplete in this code and have some value ?

const calculator = document.getElementById("calculator");
const verifier = document.getElementById("checker");
const approver = document.getElementById("approver");
const approver2 = document.getElementById("approver2");

const calculatorResult = document.getElementById("result_cal");
const verifierResult = document.getElementById("result_checker");
const approverResult = document.getElementById("result_approver");
const approver2Result = document.getElementById("result_approver2");

// list element
const claculatorList = document.getElementById("cal-list");
const verifierList = document.getElementById("checker-list");
const approverList = document.getElementById("approver-list");
const approver2List = document.getElementById("approver2-list");

// manager id
const calculatorId = document.getElementById("calculator-id");
const verifierId = document.getElementById("checker-id");
const approverId = document.getElementById("approver-id");
const approver2Id = document.getElementById("approver2-id");

import { listEmployeeByNameOrEmpNo, getEmployeeByEmpNO } from "./service.js";

const checkEmpNOIsDuplicate = async (employeeNO, elementInput) => {
    const employee = await getEmployeeByEmpNO(employeeNO);
    elementInput.value = "";
    console.log(employee);
    // if duplicate
    if (checkDuplicate(employee.data.employeeNO)) {
        await Swal.fire({
            title: "คุณเพิ่มข้อมูลซ้ำ",
            text: "ข้อมูลพนักงานของคุณซ้ำ กรุณาลองใหม่",
            icon: "error",
            confirmButtonText: "รับทราบ!",
        });
        return false;
    }
    return employee;
};
/**
 * function to check all of value is a duplicated?
 */
const checkDuplicate = (userStaffId) => {
    //get all of value in a input hidden box
    let valueStack = [
        calculatorId.value,
        verifierId.value,
        approverId.value,
        approver2Id.value,
    ];
    for (let index = 0; index < valueStack.length; index++) {
        if (valueStack[index] == userStaffId) {
            return true;
        }
    }
    return false;
};

let typingTimer;
calculator.addEventListener("input", async (event) => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(async function () {
        if (event.target.value != "") {
            claculatorList.innerHTML = "";
            verifierList.innerHTML = "";
            approverList.innerHTML = "";
            approver2List.innerHTML = "";

            let listData = await listEmployeeByNameOrEmpNo(event.target.value);
            claculatorList.style.display = "flex";
            if (listData.data.length == 0) {
                const li = document.createElement("li");
                li.innerHTML = `
                    <p>NOT FOUND</p>
                    `;
                claculatorList.appendChild(li);
                return;
            }
            listData.data.forEach((data, index) => {
                const li = document.createElement("li");
                li.classList.add("list-dropdown");
                // Event when click in list
                li.addEventListener("click", async () => {
                    const employeeNO = data.employeeNO;
                    const employee = await checkEmpNOIsDuplicate(
                        employeeNO,
                        calculator
                    );
                    if (!employee) {
                        return;
                    }
                    calculator.style.display = "none";
                    claculatorList.innerHTML = "";
                    calculatorId.value = employeeNO;
                    let buttonId = `btn-delete-cal-${employeeNO}`;
                    calculatorResult.innerHTML = `
                    <div class="row">
                        <div class="col-8 my-auto">
                            <p class="ms-5" style="margin-bottom:0; color:#006856;">
                            ${employee.data.firstname_t} 
                            ${employee.data.lastname_t}
                            <span>(0150-0${employeeNO})</span>
                            </p>
                        </div>
                        <div class="col-2 my-auto">
                        <button class="addbt2 btn search-btn" style="margin-bottom:0;" id="${buttonId}" > Delete </button>
                        </div>
                        <div class="col-2"></div>
                    </div>
                    `;
                    const btnDelete = document.getElementById(buttonId);
                    btnDelete.addEventListener("click", () => {
                        calculatorId.value = "";
                        calculatorResult.innerHTML = "";
                        calculator.style.display = "";

                        e.preventDefault();
                    });
                    claculatorList.style.display = "none";
                });

                // list style to list
                li.innerHTML = `
                    <p>${data.nametitle_t} ${data.firstname_t} ${data.lastname_t}</p>
                    <p>0150-0${data.employeeNO}</p>
                    `;
                claculatorList.appendChild(li);
            });
        } else {
            claculatorList.style.display = "none";
            claculatorList.innerHTML = "";
        }
    }, 700);
});

verifier.addEventListener("input", async (event) => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(async function () {
        if (event.target.value != "") {
            claculatorList.innerHTML = "";
            verifierList.innerHTML = "";
            approverList.innerHTML = "";
            approver2List.innerHTML = "";
            let listData = await listEmployeeByNameOrEmpNo(event.target.value);
            verifierList.style.display = "flex";
            if (listData.data.length == 0) {
                const li = document.createElement("li");
                li.innerHTML = `
                    <p>NOT FOUND</p>
                    `;
                verifierList.appendChild(li);
                return;
            }
            listData.data.forEach((data, index) => {
                const li = document.createElement("li");
                li.classList.add("list-dropdown");

                li.addEventListener("click", async () => {
                    const employeeNO = data.employeeNO;
                    const employee = await checkEmpNOIsDuplicate(
                        employeeNO,
                        verifier
                    );
                    if (!employee) {
                        return;
                    }
                    verifier.style.display = "none";
                    verifierList.innerHTML = "";
                    verifierId.value = employeeNO;
                    let buttonId = `btn-delete-ver-${employeeNO}`;
                    verifierResult.innerHTML = `
                    <div class="row">
                        <div class="col-8 my-auto">
                            <p class="ms-5" style="margin-bottom:0; color:#006856;">
                            ${employee.data.firstname_t} 
                            ${employee.data.lastname_t}
                            <span>(0150-0${employeeNO})</span>
                            </p>
                        </div>
                        <div class="col-2 my-auto">
                        <button class="addbt2 btn search-btn" style="margin-bottom:0;" id="${buttonId}" > Delete </button>
                        </div>
                        <div class="col-2"></div>
                    </div>
                    `;
                    const btnDelete = document.getElementById(buttonId);
                    btnDelete.addEventListener("click", () => {
                        verifierId.value = "";
                        verifierResult.innerHTML = "";
                        verifier.style.display = "";
                        e.preventDefault();
                    });
                    verifierList.style.display = "none";
                });

                // list style to list
                li.innerHTML = `
                    <p>${data.nametitle_t} ${data.firstname_t} ${data.lastname_t}</p>
                    <p>0150-0${data.employeeNO}</p>
                    `;
                verifierList.appendChild(li);
            });
        } else {
            verifierList.style.display = "none";
            verifierList.innerHTML = "";
        }
    }, 700);
});

approver.addEventListener("input", async (event) => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(async function () {
        if (event.target.value != "") {
            claculatorList.innerHTML = "";
            verifierList.innerHTML = "";
            approverList.innerHTML = "";
            approver2List.innerHTML = "";
            let listData = await listEmployeeByNameOrEmpNo(event.target.value);
            approverList.style.display = "flex";
            if (listData.data.length == 0) {
                const li = document.createElement("li");
                li.innerHTML = `
                    <p>NOT FOUND</p>
                    `;
                approverList.appendChild(li);
                return;
            }
            listData.data.forEach((data, index) => {
                const li = document.createElement("li");
                li.classList.add("list-dropdown");

                // event when click
                li.addEventListener("click", async () => {
                    approver.style.display = "none";
                    const employeeNO = data.employeeNO;
                    const employee = await checkEmpNOIsDuplicate(
                        employeeNO,
                        approver
                    );
                    if (!employee) {
                        return;
                    }
                    approverList.innerHTML = "";
                    approverId.value = employeeNO;
                    let buttonId = `btn-delete-ap1-${employeeNO}`;
                    approverResult.innerHTML = `
                    <div class="row">
                        <div class="col-8 my-auto">
                            <p class="ms-5" style="margin-bottom:0; color:#006856;">
                            ${employee.data.firstname_t} 
                            ${employee.data.lastname_t}
                            <span>(0150-0${employeeNO})</span>
                            </p>
                        </div>
                        <div class="col-2 my-auto">
                        <button class="addbt2 btn search-btn" style="margin-bottom:0;" id="${buttonId}" > Delete </button>
                        </div>
                        <div class="col-2"></div>
                    </div>
                    `;
                    const btnDelete = document.getElementById(buttonId);
                    btnDelete.addEventListener("click", () => {
                        approverId.value = "";
                        approverResult.innerHTML = "";
                        e.preventDefault();
                    });
                    approverList.style.display = "none";
                });

                li.innerHTML = `
                    <p>${data.nametitle_t} ${data.firstname_t} ${data.lastname_t}</p>
                    <p>0150-0${data.employeeNO}</p>
                    `;
                approverList.appendChild(li);
            });
        } else {
            approverList.style.display = "none";
            approverList.innerHTML = "";
        }
    }, 700);
});

approver2.addEventListener("input", async (event) => {
    clearTimeout(typingTimer);

    typingTimer = setTimeout(async function () {
        if (event.target.value != "") {
            claculatorList.innerHTML = "";
            verifierList.innerHTML = "";
            approverList.innerHTML = "";
            approver2List.innerHTML = "";
            let listData = await listEmployeeByNameOrEmpNo(event.target.value);
            approver2List.style.display = "flex";
            if (listData.data.length == 0) {
                const li = document.createElement("li");
                li.innerHTML = `
                    <p>NOT FOUND</p>
                    `;
                approver2List.appendChild(li);
                return;
            }
            listData.data.forEach((data, index) => {
                const li = document.createElement("li");
                li.classList.add("list-dropdown");

                li.addEventListener("click", async () => {
                    approver2.style.display = "none";
                    const employeeNO = data.employeeNO;
                    const employee = await checkEmpNOIsDuplicate(
                        employeeNO,
                        approver
                    );
                    if (!employee) {
                        return;
                    }
                    approver2.value = "";
                    approver2List.innerHTML = "";
                    approver2Id.value = employeeNO;
                    let buttonId = `btn-delete-ap2-${employeeNO}`;
                    approver2Result.innerHTML = `
                    <div class="row">
                        <div class="col-8 my-auto">
                            <p class="ms-5" style="margin-bottom:0; color:#006856;">
                            ${employee.data.firstname_t} 
                            ${employee.data.lastname_t}
                            <span>(0150-0${employeeNO})</span>
                            </p>
                        </div>
                        <div class="col-2 my-auto">
                        <button class="addbt2 btn search-btn" style="margin-bottom:0;" id="${buttonId}" > Delete </button>
                        </div>
                        <div class="col-2"></div>
                    </div>
                    `;
                    const btnDelete = document.getElementById(buttonId);
                    btnDelete.addEventListener("click", () => {
                        approver2Id.value = "";
                        approver2Result.innerHTML = "";
                        approver2.style.display = "";
                        e.preventDefault();
                    });

                    approver2List.style.display = "none";
                });

                li.innerHTML = `
                    <p>${data.nametitle_t} ${data.firstname_t} ${data.lastname_t}</p>
                    <p>0150-0${data.employeeNO}</p>
                    `;
                approver2List.appendChild(li);
            });
        } else {
            approver2List.style.display = "none";
            approver2List.innerHTML = "";
        }
    }, 700);
});

document.getElementById("login").addEventListener("click", async () => {
    let data = await fetch("/STSBidding/service/Login/staffLogin.php", {
        method: "POST",
        body: JSON.stringify({
            empNO: "34924",
            password: "123",
        }),
    }).then((res) => res.json());
    console.log(data);
});
