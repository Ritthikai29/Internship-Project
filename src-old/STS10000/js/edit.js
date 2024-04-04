async function populateData() {
  const url = "api/edit_get_project_exists?token=" + token;
  const jsonData = await FetchAPI.getData(url);
  if(!jsonData) return;
  
  await pupulateProjectType(jsonData.data.project_type);
  await pupulateWorkType(jsonData.data.work_type);
  await pupulateDivision(jsonData.data.division);
  await pupulateDepartment(jsonData.data.department);

  const myForm = document.getElementById("editproject_form").elements;
  myForm.project.value = jsonData.data.previous["Project"];
  myForm.project_type_select.value = jsonData.data.previous["pjt_id"];
  myForm.work_type_select.value = jsonData.data.previous["wt_id"];
  myForm.division_select.value = jsonData.data.previous["div_id"];
  myForm.department_select.value = jsonData.data.previous["dept_id"];
}


async function pupulateWorkType(jsonData) {
  const work_type_select = $("#work_type_select");

  // Add each item as an option in the dropdown
  jsonData.forEach((item) => {
    work_type_select.append(
      `<option value="${item.wt_id}">${item.wt_name}</option>`
    );
  });
}

async function pupulateProjectType(jsonData) {
  const project_type_select = $("#project_type_select");

  // Add each item as an option in the dropdown
  jsonData.forEach((item) => {
    project_type_select.append(
      `<option value="${item.pjt_id}">${item.pjt_name}</option>`
    );
  });
}

async function pupulateDivision(jsonData) {
  const division_select = $("#division_select");

  // Add each item as an option in the dropdown
  jsonData.forEach((item) => {
    division_select.append(
      `<option value="${item.division_id}">${item.division_name}</option>`
    );
  });
}

async function pupulateDepartment(jsonData) {
  const department_select = $("#department_select");

  // Add each item as an option in the dropdown
  jsonData.forEach((item) => {
    department_select.append(
      `<option value="${item.department_id}">${item.department_name}</option>`
    );
  });
}

async function editProject(Form) {
  // create a new FormData object
  const formData = new FormData(Form);
  formData.append('token', token);
  const url = "api/edit_project_exists";
  alert.showLoadingAlert();
  await FetchAPI.postData(url, formData).then((response) => {
    if (response) {
      location.replace("Current-Project");
    }
  });

}

const editForm = document.getElementById("editproject_form");
editForm.addEventListener("submit", function (event) {
  event.preventDefault();

  funcList = function() {
    editProject(editForm);
  } 
  alert = new SweetAlertClass();
  alert.showConfirmAlert(funcList, "ต้องการนำเนินการแก้ไขรือไม่?");
});
