async function addProject(formData) {
    console.log(formData);
    const url = "api/create_project_exists";
    await FetchAPI.postData(url, formData).then((response) => {
        if (response) {
            // window.location.replace("Current-Project");
        }
    });
}

async function getUserStaff() {
    const url = "/service/STS10000/STS10600/getUserStaffs.php";
    const reqOpt = {
        method: "GET",
    };
    let res = await fetch(url, reqOpt).then((response) => response.json());
    return res;
}

let jsonData = [];

async function init(data) {
    jsonData = data;
}

$(document).ready(async function () {
    let users = await getUserStaff();
    await init(users.data);
    createAutoComplete("calculator", jsonData);
    createAutoComplete("checker", jsonData);
    createAutoComplete("approver", jsonData);
});

function createAutoComplete(inputID, jsonData) {
    $("#" + inputID)
        .autocomplete({
            source: function (request, response) {
                var searchTerm = request.term;
                var results = [];
                for (var i = 0; i < jsonData.length; i++) {
                    if (
                        jsonData[i].employee_code
                            .toLowerCase()
                            .indexOf(searchTerm.toLowerCase()) !== -1 ||
                        jsonData[i].first_name
                            .toLowerCase()
                            .indexOf(searchTerm.toLowerCase()) !== -1 ||
                        jsonData[i].last_name
                            .toLowerCase()
                            .indexOf(searchTerm.toLowerCase()) !== -1
                    ) {

                        let form = {
                            employee_code: jsonData[i].employee_code,
                            first_name: jsonData[i].first_name,
                            last_name: jsonData[i].last_name,
                        };

                        results.push(form);
                    }
                }
                if (results.length === 0) {
                    results.push({
                        employee_code: "",
                        first_name: "Not Found",
                        last_name: "",
                    });
                }
                response(results.slice(0, 5));
            },
            minLength: 1,
            focus: function (event, ui) {
                if (ui.item.employee_code !== "") {
                    $("#" + inputID).val(
                        ui.item.first_name + " " + ui.item.last_name + " (" + ui.item.employee_code + ")"
                    );
                }
                return false;
            },
            select: function (event, ui) {
                if (ui.item.employee_code !== "") {
                    $("#" + inputID).val(
                        ui.item.first_name + " " + ui.item.last_name + " (" + ui.item.employee_code + ")"
                    );
                }
                return false;
            },
            messages: {
                noResults: "",
                results: function () {},
            },
        })
        .autocomplete("instance")._renderItem = function (ul, item) {
        // If Search not found Display
        // ul.classList.add('search-ul');
        console.log(ul);
        if (item.first_name === "Not Found") {
            var listItem = $("<li class='search-dropdown'>").append(
                "<div>" + item.first_name + "</div>"
            );
            listItem.addClass("ui-state-disabled");
        }
        // If Search found Display
        else {
            var listItem = $("<li class='search-dropdown'>").append(
                "<div>" +
                    item.employee_code +
                    " - " +
                    item.first_name +
                    " " +
                    item.last_name +
                    "</div>"
            );
        }
        return listItem.appendTo(ul);
    };
}

const resultList = [];

const cal_resultList = [];
const checker_resultList = [];
const approver_resultList = [];

const calculatorName = document.getElementById("calculator");
const checkerName = document.getElementById("checker");
const approverName = document.getElementById("approver");

const resultUl_cal = document.getElementById("result_cal");
const resultUl_checker = document.getElementById("result_checker");
const resultUl_approver = document.getElementById("result_approver");

function searchStaff(id, temp_resultList, error, resultUl) {
    const name = id.value.trim();
    // Check if staff is already in the list
    if (
        resultList.some(
            (s) =>
                s.first_name.toLowerCase() ===
                    name.split(" ")[0].toLowerCase() &&
                s.last_name.toLowerCase() === name.split(" ")[1].toLowerCase()
        )
    ) {
        error.textContent = "พนักงานรายนี้อยู่ในรายการแล้ว";
        return;
    } else error.textContent = "";

    // Find staff by Firstname and Lastname
    const staff = jsonData.find(
        (s) =>
            s.first_name.toLowerCase() === name.split(" ")[0].toLowerCase() &&
            s.last_name.toLowerCase() === name.split(" ")[1].toLowerCase()
    );

    if (staff) {
        // Display staff name and employee_code in a new list item
        const listItem = document.createElement("li");
        listItem.classList.add("row", "align-items-center"); // Add row class

        // Add staff name and employee_code to the list item
        const nameCol = document.createElement("div");
        nameCol.classList.add("col");
        let staffcode = staff.employee_code;
        staffcode = `${
            staff.employee_code.slice(0, 4)
        }-${
            staff.employee_code.slice(4, 10)
        }`;
        nameCol.innerHTML = `<span id="firstname">${staff.first_name}</span> <span id="lastname" >${staff.last_name}</span> (<span id="employee_code">${staffcode}</span>)`;
        listItem.appendChild(nameCol);

        // Add delete button to the list item
        const deleteCol = document.createElement("div");
        deleteCol.classList.add("col"); // Add col-auto class to make it take up only the necessary width
        const deleteButton = document.createElement("div");
        deleteButton.innerHTML = '<span class="remove-span">&#x2716;</span>';
        deleteButton.classList.add("remove-btn");
        deleteButton
            .querySelector(".remove-span")
            .addEventListener("click", () => {
                listItem.remove();
                // Remove staff from the result list when deleted
                temp_resultList.splice(temp_resultList.indexOf(staff), 1);
                resultList.splice(resultList.indexOf(staff), 1);
            });
        deleteCol.appendChild(deleteButton);
        listItem.appendChild(deleteCol);

        resultUl.appendChild(listItem);

        // Add staff to the result list
        temp_resultList.push(staff);
        resultList.push(staff);

        // clear input
        id.value = "";
    } else {
        // Display error message if staff is not found
        error.textContent = "ไม่พบพนักงานรายนี้";
        return;
    }
}
