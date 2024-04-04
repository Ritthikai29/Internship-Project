// Default Value
const apiUrl = "/STSBidding/service/";

// all element to loading to screen
const auc_file = document.getElementById("auction_file");
const auc_budget = document.getElementById("auction-budget");
const btnSummary = document.getElementById("btn-summary");
const radio_have = document.getElementById("radio-have");
const radio_not_have = document.getElementById("radio-not-have");
const buttonCalculate = document.getElementById("btn-CAL");
const itemList = document.getElementById("item-list");
const totalPrice = document.getElementById("total-price");
const tableHistory = document.getElementById("history-project");

const rejectReason = document.getElementById("reject-reason");
const rejectComment = document.getElementById("reject-comment");

let projectId = ""; // Collect a project id
let projectKey = ""; // Collect a project id
let projectDate;

const projectID = localStorage.getItem("pj_id");
const user_id = localStorage.getItem("u_id");

let budgetPrice;

let fileLink = "";

import {
    GetProjectByProjectID,
    getPrevBudget,
    updateTextView,
    getLog,
    getReasonReject,
    createLogTableRow,
    dateFormatter,
    CreateBudget,
    CreateBudgetWithSub,
} from "./functions/get-project.js";

// utilty function

/**
 * ในส่วนนี้จะเป็นการจัดการราคากลางย่อยที่ได้มาใส่ไว้ใน Array 2 ตัว
 * 1. array extract_sub_detail ไว้เก็บข้อมูล Detail ของราคากลางย่อย
 * 2. array extract_sub_price ไว้เก็บราคากลางย่อย ของ Detail แต่ละตัวตาม Index
 *
 */

function extract_sub_budget_to_array() {
    let subPrices = [];
    document
        .querySelectorAll("input[name='sub_detail[]']")
        .forEach((element) => {
            const parentNode = element.parentNode;
            const detail = parentNode.querySelector(
                "input[name='sub_detail[]']"
            );
            const price = parentNode.querySelector("input[name='sub_price[]']");
            let data = {
                detail_price: detail.value,
                price: parseFloat(price.value.replace(/,/g, "")),
            };
            subPrices.push(data);
        });

    return JSON.stringify(subPrices);
}

document.getElementById("test").addEventListener("click", async (e) => {
    let arrays = extract_sub_budget_to_array();
    const formData = new FormData();
    formData.append("subPrice", JSON.stringify(arrays));
    formData.append("data", "1");
    let data = await fetch("../../../service/STSSP30000/test.php", {
        body: formData,
        method: "POST",
    }).then((response) => response.json());

    // console.log(data);
});

// First query project by project_key
async function getProjectByProject_Key() {
    // function get project

    // get Project from url
    let res = await GetProjectByProjectID(projectID);

    if (res.err) {
        Swal.fire({
            title: "ไม่พบโปรเจค",
            text: "ไม่พบโปรเจคที่คุณต้องการ กรุณาลงใหม่ในภายหลัง",
            icon: "error",
            confirmButtonText: "รับทราบ!",
        }).then(() => {
            return true;
        });
        return true;
    }

    // console.log(res.data);
    projectId = res.data.id;
    projectKey = res.data.key;
    $("#project-name").text(res.data.name);
    $("#project-key").text(projectKey);
    $("#project-status").text(res.data.status.status_name);
    $("#project-date").text(dateFormatter(res.data.add_datetime));
    // Swal.close();
    return false;
}

// Function create with sub_budget
let submitWithSubBudget = async (formData, checked) => {
    // Prepare Data เพื่อทำการสร้างราคากลางย่อย
    let subPrice = extract_sub_budget_to_array();

    formData.append("sub_price", subPrice);
    let res = await CreateBudgetWithSub(formData);

    if (res.status !== 200) {
        return [res, true];
    }
    return [res, false];
};

// Function สร้างราคากลางแบบไม่มีราคากลางย่อย
let submitBudget = async (formData, checked) => {
    // Create a Function

    // Run function
    let res = await CreateBudget(formData);
    if (res.data) {
        let budget_created = res.data;
        // console.log(budget_created);
        return [res.data, false];
        // console.log(res.data);
    } else {
        // console.log(res.err);
        return [res.err, true];
    }
};

// var inputField = document.getElementById('inputField');
auc_budget.addEventListener("keyup", function () {
    updateTextView(this);
});
document.getElementById("price-input").addEventListener("keyup", function () {
    updateTextView(this);
});

//open Tor File
$("#btn-TOR").click(() => {
    window.open(`/STSBidding/projects/${projectKey}/tor.pdf`, "_blank");
});

// open Job descriptions
$("#btn-JOB").click(() => {
    window.open(
        `/STSBidding/projects/${projectKey}/job-description.pdf`,
        "_blank"
    );
});

// If file change
$("#auction_file").on("change", () => {
    // console.log("edit");
});

// Open File on code
$("#btn-file-check").click(() => {
    const fileInput = $("#auction_file")[0];
    const file = fileInput.files[0];
    const blobData = new Blob([file], { type: file.type });
    const blobUrl = URL.createObjectURL(blobData);
    window.open(blobUrl);
    URL.revokeObjectURL(blobUrl);
});

let checkInputAll = () => {
    const detailInput = document.getElementById("detail-input");
    const priceInput = document.getElementById("price-input");

    // Have a file ?
    if (document.getElementById("auction_file").value == "") {
        Swal.fire({
            title: "ไม่ได้ทำการอัพโหลดไฟล์เอกสาร",
            text: "กรุณาอัพโหลดไฟล์เอกสารก่อนสรุปข้อมูล",
            icon: "error",
            confirmButtonText: "รับทราบ!",
        });
        return true;
    }

    // have a price
    if (document.getElementById("auction-budget").value == "") {
        Swal.fire({
            title: "คุณไม่ได้ทำการระบุราคากลาง",
            text: "กรุณาระบุราคากลางก่อนสรุปข้อมูล",
            icon: "error",
            confirmButtonText: "รับทราบ!",
        });
        return true;
    }

    const checked_length = $('input[name="option[]"]:checked').length;
    const checked = $('input[name="option[]"]:checked').val();

    // sub price button is check?
    if (checked_length == 0) {
        Swal.fire({
            title: "ไม่ได้เลือกราคากลางย่อย",
            text: "กรุณาเลือกตัวเลือกก่อนสรุปข้อมูล",
            icon: "error",
            confirmButtonText: "รับทราบ!",
        });
        return true;
    }

    if (checked == 1) {
        // total price [eq] main price ?
        let budgetValue = parseFloat(auc_budget.value.replace(/[^0-9-.]/g, ""));
        // console.log(totalPrice.innerText)
        let totalPriceValue = parseFloat(
            totalPrice.innerText.replace(/[^0-9-.]/g, "")
        );
        if (totalPriceValue === 0 || totalPriceValue !== Number(budgetValue)) {
            Swal.fire({
                title: "ราคากลางย่อยไม่ตรงกับราคากลางหลัก",
                text: "กรุณาแก้ไขราคากลางย่อยให้ตรงกัน",
                icon: "error",
                confirmButtonText: "รับทราบ!",
            });
            return true;
        }

        // text input is null ?
        if (priceInput.value !== "" || detailInput.value !== "") {
            Swal.fire({
                title: "คุณไม่ได้ทำการ Add ราคากลางย่อย",
                text: "คุณไม่ได้ทำการ Add ราคากลางย่อย",
                icon: "error",
                confirmButtonText: "รับทราบ!",
            });
            return true;
        }

        // check all input box in sub price is not null ?
        let sub_details = document.querySelectorAll(
            "input[name='sub_detail[]']"
        );
        let sub_prices = document.querySelectorAll("input[name='sub_price[]']");

        for (let i = 0; i < sub_details.length; i++) {
            const sub_detail = sub_details[i];
            const sub_price = sub_prices[i];
            if (sub_detail.value === "" || sub_price.value === "") {
                Swal.fire({
                    title: "ข้อมูลราคากลางย่อยไม่ควรเป็นค่าว่าง",
                    text: "กรุณาแก้ไขราคากลางย่อย",
                    icon: "error",
                    confirmButtonText: "รับทราบ!",
                });
                return true;
            }
        }
    }
    return false;
};

btnSummary.addEventListener("click", (e) => {
    e.preventDefault();
    const sumForm = document.getElementById("summary-form");
    const subForm = document.getElementById("submit-form");
    const detailInput = document.getElementById("detail-input");
    const priceInput = document.getElementById("price-input");

    let err = checkInputAll();

    if (err) {
        return;
    }

    document.querySelectorAll("input[name='sub_detail[]']").forEach((input) => {
        input.disabled = true;
    });
    document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
        input.disabled = true;
    });

    let disabledElement = [
        auc_budget,
        auc_file,
        radio_have,
        radio_not_have,
        detailInput,
        priceInput,
    ];
    isDisabled(disabledElement, true);

    addButton.style.display = "none";
    sumForm.style.display = "none";
    subForm.style.display = "flex";
    // console.log(totalPrice);
});

function isDisabled(elements, status) {
    elements.forEach((element) => {
        element.disabled = status;
    });
}

$("#btn-edit").click(() => {
    const sumForm = document.getElementById("summary-form");
    const subForm = document.getElementById("submit-form");
    const detailInput = document.getElementById("detail-input");
    const priceInput = document.getElementById("price-input");

    document.querySelectorAll("input[name='sub_detail[]']").forEach((input) => {
        input.disabled = false;
    });
    document.querySelectorAll("input[name='sub_price[]']").forEach((input) => {
        input.disabled = false;
    });

    addButton.style.display = "block";

    let disabledElement = [
        auc_budget,
        auc_file,
        radio_have,
        radio_not_have,
        detailInput,
        priceInput,
    ];

    isDisabled(disabledElement, false);
    sumForm.style.display = "block";
    subForm.style.display = "none";
});

// On submit
$("#btn-submit").click(() => {
    // File Input
    const fileInput = $("#auction_file")[0];
    const file = fileInput.files[0];
    const checked = $('input[name="option[]"]:checked').val();
    // ค่าราคากลาง
    let budget = $("#auction-budget").val();

    let numberString = budget;
    let a = numberString.split(",");
    let number = a.join("");
    budget = parseInt(number);
    // console.log(typeof budget);
    // return

    // Prepare data before sending to create main budget
    const formData = new FormData();
    formData.append("auction_file", file);

    formData.append("budget", budget);
    formData.append("have", checked);
    // two parameter for find Ref_price_manager_id
    formData.append("pj_id", projectId);
    formData.append("user_id", localStorage.getItem("u_id"));

    Swal.fire({
        title: "<strong style='color:#2B3467;' >ยืนยันการเสนออนุมัติ</strong>",
        html: `<span style="color:#188493;">**เมื่อกดปุ่มนี้ ระบบจะส่งข้อมูลไปยังผู้ตรวจสอบและผู้อนุมัติ <br/>ท่านสามารถกลับมาแก้ไขได้กรณีมีการ Reject กลับมาเท่านั้น</span>`,
        confirmButtonText: "<span style='#fff'>ยืนยัน</span>",
        showCancelButton: true,

        preConfirm: async () => {
            let data;
            let err;
            // console.log("test")
            if (Number(checked) === 1) {
                [data, err] = await submitWithSubBudget(formData, checked);
            } else {
                [data, err] = await submitBudget(formData, checked);
            }
            return [data, err];
        },
    }).then(async (result) => {
        if (result.isConfirmed) {
            let [data, err] = result.value;
            if (err) {
                // console.log(data);
                if (data.data) {
                    Swal.fire("บันทึกไม่สำเร็จ!", data.data, "error");
                } else {
                    if (data.err) {
                        Swal.fire("บันทึกไม่สำเร็จ!", data.err, "error");
                    } else {
                        Swal.fire("บันทึกไม่สำเร็จ!", data, "error");
                    }
                }
            } else {
                Swal.fire("บันทึกสำเร็จ!", "", "success").then(() => {
                    window.location.href = "../../../index.php";
                });
            }
        }
    });
});

// main command
document.addEventListener("DOMContentLoaded", async () => {
    // Loading Module
    Swal.fire({
        title: "Loading",
        text: "โปรดรอสักครู่...",
        allowEscapeKey: false,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
    let err = await getProjectByProject_Key();
    if (err) {
        return;
    }

    let reason = await getUIRejectReason(localStorage.getItem("pj_key"));

    // get old budget from latest budget of the project (if have a reason)
    if (reason.data.err === null) {
        let oldBudget = await getPrevBudget(localStorage.getItem("pj_key"));
        let budget = parseFloat(oldBudget.mainBudget.Budget);
        auc_budget.value = Number(budget).toLocaleString();

        // load file calculator เก่า
        document.getElementById("old-file-calculator").style.display = "";
        document.getElementById("old-file-calculator").addEventListener("click", () => {
            window.open(
                `/STSBidding` + oldBudget.mainBudget.calculate_file,
                "_blank"
            );
        })

        const fileBlob = await fetch(`/STSBidding/${oldBudget.mainBudget.calculate_file}`)
        .then((res) => res.blob())
        const calculateFile = new File([fileBlob], "calculate.pdf", {
            type: 'application/pdf'
        })

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(calculateFile)
        auc_file.files = dataTransfer.files;


        const itemDiv = document.createElement("div");
        if (oldBudget.subBudget.length) {
            console.log("test")
            radio_have.checked = true;
            document.getElementById("sub-field").style.display = "";
            let subBudget = oldBudget.subBudget;
            let total = 0
            subBudget.forEach((subBud) => {
                counter += 1;
                itemDiv.innerHTML += `
                <div class="formbold-input-flex" style="margin:0;">
                <span class="item-number" style="padding-left: 80px; width:50px;" >${counter}.</span>
                <input  align="center" class="in" style = "width: 350px; text-align: center;" type="text" name="sub_detail[]" value="${
                    subBud.name
                }" placeholder="(รายละเอียดงาน)" contenteditable>
                <input  class="in" style = "width: 350px; text-align: center;" type="text"  name="sub_price[]" value="${Number(
                    subBud.price
                ).toLocaleString()}" step="0.01" maxlength="12" placeholder="(ราคากลางย่อย)" contenteditable>
                <button type="button" class="debt delete-button">Delete</button>
                </div>`;
                total += Number(subBud.price);
            });
            itemList.appendChild(itemDiv);
            document
                .querySelectorAll("input[name='sub_price[]']")
                .forEach((input) => {
                    input.addEventListener("keyup", function () {
                        updateTextView(this);
                    });
                });

            totalPrice.innerText = total.toLocaleString();
            document.getElementById("price-status").textContent =
                "(ราคารวมตรงกับราคากลางสุทธิ)";
            document.getElementById("price-status").style.color = "green";
        }else{
            radio_not_have.checked = true;
        }
    }

    // Get a reject reason / comment if have a history
    // await getRejectReason(projectID);
    let logs = await getLog(localStorage.getItem("pj_key"));
    if(logs.data){
        logs.data.forEach((Log) => {
            const row = createLogTableRow(Log)
            tableHistory.appendChild(row);
        })
    }
    await Swal.close();
}); // end

const getUIRejectReason = async (project_id) => {
    const reasonVerify = await getReasonReject(project_id);

    if (reasonVerify.status !== 200) {
        await Swal.fire({
            title: "ข้อมูลการปฏิเสธมีปัญหา กรุณาลองใหม่",
            text: reasonVerify.err,
        });
        return reasonVerify;
    }
    if (reasonVerify.status == 200 && reasonVerify.data.err !== null) {
        return reasonVerify;
    }

    document.getElementById("reject-section").style.display = "block";

    // Setup to the element
    if (reasonVerify.data) {
        rejectReason.textContent = reasonVerify.data.reason.reason_t;
        rejectComment.textContent = reasonVerify.data.comment;
    }
    return reasonVerify;
};

