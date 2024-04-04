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

const projectTitleElement = document.getElementById("project-title");
const projectKeyElement = document.getElementById("project-key");
const projectStatusElement = document.getElementById("project-status");
const projectDateElement = document.getElementById("project-date");
const buttonTorElement = document.getElementById("btn-TOR");
const buttonJobElement = document.getElementById("btn-JOB");
const buttonMainPriceElement = document.getElementById("main-price");
const inputFileElement = document.getElementById("file-input");
const inputBudgetElement = document.getElementById("auction-budget");
const radioButtonId1Element = document.getElementById("radioButtonId1");
const radioButtonId2Element = document.getElementById("radioButtonId2");
const subPriceListElement = document.getElementById("item-list");
const btnApproveElement = document.getElementById("btn-approve");
const btnRejectElement = document.getElementById("btn-reject");

// Log
const tableHistory = document.getElementById("history-project");

let swal_coustome = new SweetAlert();

let sumSubPrice = 0;

import {
    getProject,
    getLastBudgetCalculator,
    listSubBudgetByBudgetCalculatorID,
    postVerify,
    getReason,
    getLogProject,
    dateFormatter,
} from "./service/checkerService.js";

// run when page in loading
document.addEventListener("DOMContentLoaded", async () => {
    // Loading screen
    swal_coustome.showLoadingAlert();

    // Get a project id from localStorage
    let projectKey = localStorage.getItem("pj_key");
    if (!projectKey) {
        Swal.fire({
            title: "Error",
            text: "ไม่เจอโปรเจค กรุณาลองใหม่จากลิงค์ทางอีเมล์",
            icon: "error",
        });
        return;
    }
    // Fetch Project ด้วย Project ID
    let project = await getProject(projectKey);

    if (project.status !== 200) {
        console.log(project.err);
        return;
    }

    projectTitleElement.innerText = project.data.name;
    projectKeyElement.innerText = project.data.key;
    projectDateElement.innerText = dateFormatter(project.data.add_datetime);
    projectStatusElement.innerText = project.data.status.status_name;

    //   Load a main price
    let calculate = await getLastBudgetCalculator(projectKey);
    if (calculate.status !== 200) {
        console.log(calculate.err);
        Swal.fire("ไม่สามารถเข้าถึงได้", calculate.err.data, "error");
        return;
    }

    // add element main price of budget
    console.log(calculate.data);
    const budget = parseFloat(calculate.data.Budget);
    inputBudgetElement.value = Number(budget.toFixed(2)).toLocaleString();

    if (calculate.data.sub_budgets) {
        radioButtonId1Element.checked = true;
        toggleInput(true);
        LoadASubPrice(calculate.data.sub_budgets);
        console.log(calculate.data.sub_budgets);
    } else {
        radioButtonId2Element.checked = true;
    }

    // A click button for link to pdf
    buttonTorElement.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(`/STSBidding/projects/${project.data.key}/tor.pdf`);
    });
    buttonJobElement.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(
            `/STSBidding/projects/${project.data.key}/job-description.pdf`
        );
    });

    buttonMainPriceElement.addEventListener("click", (e) => {
        e.preventDefault();
        // console.log(calculate.data.calculate_file);
        window.open("/STSBidding" + calculate.data.calculate_file);
    });

    // for get log
    let logOfProject = await getLogProject(project.data.key);
    tableHistory.innerHTML = "";

    if (logOfProject.data) {
        logOfProject.data.forEach((Log) => {
            const row = createLogTableRow(Log);
            tableHistory.appendChild(row);
        });
    }

    Swal.close();
});

// BTN APPROVE
btnApproveElement.addEventListener("click", async (e) => {
    e.preventDefault();
    Swal.fire({
        title: "<strong style='color:#2B3467;'> ยืนยันอนุมัติ </strong>",
        html: "<span style='color:#188493;'>**เมื่อกดปุ่มนี้ ระบบจะส่งข้อมูลไปยังผู้ตรวจสอบและผู้อนุมัติ ท่านสามารถกลับมาแก้ไขได้กรณีมีการ Reject กลับมาเท่านั้น</span>",
        confirmButtonText: "<span style='#fff'>ยืนยัน</span>",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            let data = {
                project_key: localStorage.getItem("pj_key"),
                reason_id: "0",
                comment: "0",
                is_verify: 1,
            };

            let res = await postVerify(data);
            return res;
        },
    }).then(async (e) => {
        if (e.isConfirmed) {
            console.log(e);
            let res = e.value;
            if (res.status !== 200) {
                // console.log(data);
                Swal.fire("บันทึกไม่สำเร็จ!", res.err, "error");
            } else {
                Swal.fire("บันทึกสำเร็จ!", "", "success").then(() => {
                    // window.location.href = "../../../index.php";
                });
            }
        }
    });
});

let reasonText = "";
let commentText = "";

// BTN REJECT
btnRejectElement.addEventListener("click", async (e) => {
    e.preventDefault();

    const reasons = await getReason();

    if (reasons.status !== 200) {
        Swal.fire({
            title: "ระบบมีปัญหา",
            text: "ระบบข้อมูลเหตุผลการปฏิเสธมีปัญหา กรุณาติดต่อ admin",
            confirmButtonText: "<span style='#fff'>ยืนยัน</span>",
        })
        return;
    }

    let options = "<option value='0'></option>";
    reasons.data.forEach((data) => {
        options += `<option value="${data.id}">${data.reason_t}</option>`;
    });

    let selectionOption = `<select id="reasons-option" class="formbold-form-input">${options}</select>`;

    // console.log(reasons);

    Swal.fire({
        title: "กรุณากรอกเหตุผล <br/>และข้อมูลเพิ่มเติมในการแก้ไข",
        html: `<div>
        <p>เหตุผลในการแก้ไข</p>
        ${selectionOption}
        <hr>
        <p>เนื้อหาเพิ่มเติม</p>
        <input type="text" id="comment" class="formbold-form-input">
        </div>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ok",

        preConfirm: async () => {
            reasonText =
                document.getElementById("reasons-option").selectedIndex;
            commentText = document.getElementById("comment").value;
            if (reasonText === "0" || !commentText) {
                await Swal.showValidationMessage("คุณยังกรอกข้อมูลไม่ครบ");
                return;
            }
            let data = {
                project_key: localStorage.getItem("pj_key"),
                reason_id: reasonText,
                comment: commentText,
                is_verify: 0,
            };

            let res = await postVerify(data);
            return res;
        },
    }).then(async (result) => {
        if (result.isConfirmed) {
            let res = result.value;
            console.log(res);
            if (res.status !== 200) {
                // console.log(data);
                Swal.fire("บันทึกไม่สำเร็จ!", res.err, "error");
            } else {
                Swal.fire("บันทึกสำเร็จ!", "", "success").then(() => {
                    // window.location.href = "../../../index.php";
                });
            }
        }
    });
});

const LoadASubPrice = (subcalculate) => {
    let counter = 0;
    //   let sumSubPrice = 0;

    for (let i = 0; i < subcalculate.length; i++) {
        const subbudget = subcalculate[i];
        console.log(subbudget);
        const itemDev = document.createElement("div");
        counter++;
        itemDev.innerHTML = `<div class="formbold-input-flex" style="margin:0;">           
      <span class="item-number" style="padding: 10px; padding-left: 80px; width:50px;">${counter}</span>
      <input disabled class="in2 m-auto" style="width: 350px; " type="text" name="sub_detail[]" value="${
          subbudget.name
      }" placeholder="(รายละเอียดงาน)" contenteditable>
      <input disabled class="in2" style="width: 350px; " type="text" name="sub_price[]" value="${Number(
          Number(subbudget.price).toFixed(2)
      ).toLocaleString()}"  step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)" contenteditable>
    </div>`;
        sumSubPrice += Number(subbudget.price);
        subPriceListElement.appendChild(itemDev);
    }

    const sumDiv = document.createElement("div");
    sumDiv.innerHTML = `<div class="formbold-input-flex" style="border-top: 1px #aeaeae solid ; margin:0;">
    <span class="item-number" style="padding: 10px; padding-left: 80px; width:50px;"></span>
    <span class="in2 m-auto" style="padding: 10px; width: 350px; font-weight: bold;">รวมราคากลางสุทธิ
      :</span>
    <span class="in2" id="total-price" style="padding: 10px; width: 350px; font-weight: bold; ">${Number(
        sumSubPrice.toFixed(2)
    ).toLocaleString()}</span>
      </div>`;
    subPriceListElement.appendChild(sumDiv);
};
