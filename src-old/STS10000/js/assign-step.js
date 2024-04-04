// Change Step
const stepMenuOne = document.querySelector(".formbold-step-menu1");
const stepMenuTwo = document.querySelector(".formbold-step-menu2");

const stepOne = document.querySelector(".formbold-form-step-1");
const stepTwo = document.querySelector(".formbold-form-step-2");

const formSubmitBtn = document.querySelector(".formbold-btn");
const formBackBtn = document.querySelector(".formbold-back-btn");

const uploadTor = document.getElementById("tor");
const uploadDescription = document.getElementById("description");
const uploadAuction_file = document.getElementById("auction_file");

var validateDecimal = function (e) {
    var t = e.value;
    var regex = /^-?\d*\.?\d{0,2}$/; // regular expression to validate decimal number
    if (!regex.test(t)) {
        // if the input does not match the regular expression
        e.value = t.slice(0, -1); // remove the last character from the input
    }
};
const auctionInput = document.getElementById("auction");
auctionInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9\.]/g, ""); // only allow numeric values and decimal point
});

uploadTor.onchange = function () {
    if (this.files[0].size > 2097152) {
        errorTor.textContent = "ขนาดไฟล์ใหญ่เกินกว่า 2 MB";
        this.value = "";
    } else errorTor.textContent = "";
};
uploadDescription.onchange = function () {
    if (this.files[0].size > 2097152) {
        errorDescription.textContent = "ขนาดไฟล์ใหญ่เกินกว่า 2 MB";
        this.value = "";
    } else errorDescription.textContent = "";
};
uploadAuction_file.onchange = function () {
    if (this.files[0].size > 2097152) {
        errorAuction_file.textContent = "ขนาดไฟล์ใหญ่เกินกว่า 2 MB";
        this.value = "";
    } else errorAuction_file.textContent = "";
};

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
                price: price.value,
            };
            subPrices.push(data);
        });

    return subPrices;
}

formSubmitBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    if (stepMenuOne.className == "formbold-step-menu1 active") {
        event.preventDefault();
        const menu1Element = [
            project_adder_form.project.value,
            project_adder_form.project_type_select.value,
            project_adder_form.work_type_select.value,
            project_adder_form.division_select.value,
            project_adder_form.department_select.value,
            project_adder_form.tor.value,
            project_adder_form.description.value,
        ];

        if (menu1Element.some((element) => !element)) {
            errorMenu1.textContent =
                "เกิดข้อผิดพลาด : โปรดกรอกข้อมูลให้ครบถ้วน";
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: "โปรดกรอกข้อมูลให้ครบถ้วน",
                icon: "error",
            });
            return;
        }
        // Change to step 2
        errorMenu1.textContent = "";
        formSubmitBtn.textContent = "Submit";

        stepMenuOne.classList.remove("active");
        stepMenuTwo.classList.add("active");

        stepOne.classList.remove("active");
        stepTwo.classList.add("active");

        formBackBtn.classList.add("active");
        formBackBtn.addEventListener("click", function (event) {
            // Change back to step 1
            event.preventDefault();
            formSubmitBtn.textContent = "Next Step";

            stepMenuOne.classList.add("active");
            stepMenuTwo.classList.remove("active");

            stepOne.classList.add("active");
            stepTwo.classList.remove("active");

            formBackBtn.classList.remove("active");
        });
    } else if (stepMenuTwo.className == "formbold-step-menu2 active") {
        event.preventDefault();
        // Check which tab is currently active
        const formData = new FormData();

        // get input value from a data
        const typeCreate = document.getElementById("create-type");
        const calculatorId = document.getElementById("calculator-id");
        const checkerId = document.getElementById("checker-id");
        const approverId = document.getElementById("approver-id");
        const approver2Id = document.getElementById("approver2-id");

        if (typeCreate.value === "1") {
            console.log("with price");
            // prepare a data for send

            formData.append("projectName", project_adder_form.project.value);
            formData.append(
                "projectTypeId",
                project_adder_form.project_type_select.value
            );
            formData.append(
                "projectJobTypeId",
                project_adder_form.work_type_select.value
            );
            formData.append(
                "divisionId",
                project_adder_form.division_select.value
            );
            formData.append(
                "departmentId",
                project_adder_form.department_select.value
            );
            formData.append("tor", project_adder_form.tor.files[0]);
            formData.append(
                "jobDescription",
                project_adder_form.description.files[0]
            );
            formData.append(
                "calculateFile",
                project_adder_form.auction_file.files[0]
            );
            formData.append("price", project_adder_form.auction.value);
            formData.append(
                "is_sub_price",
                project_adder_form.is_sub_price.value
            );
            formData.delete("calculator_id");
            formData.delete("verifier_id");
            formData.delete("verifier_id");
            formData.delete("approver2_id");

            // check if else if is have sub price is mean have a sub price
            if (project_adder_form.is_sub_price.value == 1) {
                let data = extract_sub_budget_to_array();
                formData.append("subPrice", JSON.stringify(data));
                // check a sub price is eq price
                let totalPrice = 0;
                data.forEach((value) => {
                    totalPrice += parseFloat(value.price);
                });

                if (
                    !project_adder_form.tor.value ||
                    !project_adder_form.description.value ||
                    !project_adder_form.auction_file.value
                ) {
                    Swal.fire({
                        title: "ไฟล์ไม่ครบ",
                        text: "กรุณาเลือกไฟล์ให้ครบทั้งหมดก่อนกดยืนยัน",
                    });
                    return;
                } else if (!formData.get("price")) {
                    Swal.fire({
                        title: "ไม่พบราคากลาง",
                        text: "กรุณากรอกราคากลางก่อนกด Submit",
                    });
                    return;
                } else if (totalPrice !== parseFloat(formData.get("price"))) {
                    Swal.fire({
                        title: "ข้อมูลราคากลางย่อยไม่ตรงกับราคากลางหลัก",
                        text: "ราคากลางย่อยรวมไม่เท่ากับราคากลางหลัก",
                    });
                    return;
                }

                // send a data to create a sub price
                Swal.fire({
                    title: "ยืนยันการเพิ่มข้อมูล",
                    html: `<span style='color: red;'>หากคุณกดยืนยันแล้วจะถือว่าเพิ่มข้อมูลแล้ว</span>`,
                    confirmButtonText: "ยืนยัน",
                    cancelButtonText: "ปิด",
                    preConfirm: async () => {
                        const withSubPriceCreate = await createWithSubPrice(
                            formData
                        );
                        return withSubPriceCreate;
                    },
                }).then(async (result) => {
                    console.log(result);
                    if (result.isConfirmed) {
                        if (result.value.status === 200) {
                            Swal.fire({
                                title: "Successful",
                                text: "การเพิ่มข้อมูบของคุณสำเร็จ",
                                icon: "success",
                                confirmButtonText: "ยืนยัน",
                            }).then(() => {});
                        } else {
                            Swal.fire({
                                title: "Error",
                                html: `การเพิ่มข้อมูบของคุณไม่สำเร็จเนื่องจาก:<br> ${result.value.err}`,
                                icon: "error",
                                confirmButtonText: "ปิด",
                            });
                        }
                    }
                });
            } else {
                formData.delete("subPrice");
                Swal.fire({
                    title: "ยืนยันการเพิ่มข้อมูล",
                    html: `<span style='color: red;'>หากคุณกดยืนยันแล้วจะถือว่าเพิ่มข้อมูลแล้ว</span>`,
                    confirmButtonText: "ยืนยัน",
                    cancelButtonText: "ปิด",
                    preConfirm: async () => {
                        const projectCreate = await createWithoutSubPrice(
                            formData
                        );

                        return projectCreate;
                    },
                }).then(async (result) => {
                    console.log(result);
                    if (result.isConfirmed) {
                        if (result.value.status === 200) {
                            Swal.fire({
                                title: "Successful",
                                text: "การเพิ่มข้อมูบของคุณสำเร็จ",
                                icon: "success",
                                confirmButtonText: "ยืนยัน",
                            }).then(() => {});
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: `การเพิ่มข้อมูบของคุณไม่สำเร็จเนื่องจาก: ${result.value.err}`,
                                icon: "error",
                                confirmButtonText: "ปิด",
                            });
                        }
                    }
                });
            }

            // addProject(formData);
        } else if (typeCreate.value === "2") {
            // prepare a data to form data
            formData.append("projectName", project_adder_form.project.value);
            formData.append(
                "projectTypeId",
                project_adder_form.project_type_select.value
            );
            formData.append(
                "projectJobTypeId",
                project_adder_form.work_type_select.value
            );
            formData.append(
                "divisionId",
                project_adder_form.division_select.value
            );
            formData.append(
                "departmentId",
                project_adder_form.department_select.value
            );
            formData.append("tor", project_adder_form.tor.files[0]);
            formData.append(
                "jobDescription",
                project_adder_form.description.files[0]
            );
            formData.append("calculator_id", calculatorId.value);
            formData.append("verifier_id", checkerId.value);
            formData.append("approver_id", approverId.value);
            formData.append("approver2_id", approver2Id.value);
            formData.delete("is_sub_price");
            formData.delete("sub_price[]");
            formData.delete("auction");
            formData.delete("auction_file");

            Swal.fire({
                title: "ยืนยันการเพิ่มข้อมูล",
                html: `<span style='color: red;'>หากคุณกดยืนยันแล้วจะถือว่าเพิ่มข้อมูลแล้ว</span>`,
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ปิด",
                preConfirm: async () => {
                    const withManagers = await createWithManagers(formData);
                    return withManagers;
                },
            }).then(async (result) => {
                console.log(result);
                if (result.isConfirmed) {
                    if (result.value.status === 200) {
                        Swal.fire({
                            title: "Successful",
                            text: "การเพิ่มข้อมูบของคุณสำเร็จ",
                            icon: "success",
                            confirmButtonText: "ยืนยัน",
                        }).then(() => {});
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: `การเพิ่มข้อมูบของคุณไม่สำเร็จเนื่องจาก: ${result.value.err}`,
                            icon: "error",
                            confirmButtonText: "ปิด",
                        });
                    }
                }
            });

            addProject(formData);
        }
    }
});

//// Tab ////
const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const inputTab = document.getElementById("create-type");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const tabId = tab.getAttribute("data-tab");
        showTab(tabId);
    });
});

function showTab(tabId) {
    tabContents.forEach((content) => {
        inputTab.value = tabId.slice(-1);
        if (content.getAttribute("id") === tabId + "-content") {
            content.classList.add("active");
        } else {
            content.classList.remove("active");
        }
    });
    tabs.forEach((tab) => {
        if (tab.getAttribute("data-tab") === tabId) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });
}

function addProject(formData) {
    const formDataEntries = formData.entries();
    for (const entry of formDataEntries) {
        const [key, value] = entry;
        console.log(`Key: ${key}, Value: ${value}`);
    }
}

showTab("tab1");

const createWithoutSubPrice = async (formData) => {
    const reqOpt = {
        method: "POST",
        body: formData,
    };
    const res = await fetch(
        `/STSBidding/service/STS10000/STS10600/addProject.php`,
        reqOpt
    ).then((res) => res.json());
    return res;
};

const createWithSubPrice = async (formData) => {
    const reqOpt = {
        method: "POST",
        body: formData,
    };
    const res = await fetch(
        `/STSBidding/service/STS10000/STS10600/addProjectWithSub.php`,
        reqOpt
    ).then((res) => res.json());
    return res;
};

const createWithManagers = async (formData) => {
    const reqOpt = {
        method: "POST",
        body: formData,
    };
    const res = await fetch(
        `/STSBidding/service/STS10000/STS10600/addProjectWithManager.php`,
        reqOpt
    ).then((res) => res.json());
    return res;
};
