import {listDepartment, listDivisions, listProjectTypes, listgetJobTypes} from './service.js'

const department_select = document.getElementById("department_select")
const division_select = document.getElementById("division_select")
// project_type_select
const project_type_select = document.getElementById('project_type_select')
// work_type_select
const work_type_select = document.getElementById("work_type_select")

const insertToComboBox = (element, datas, name ) => {
    datas.forEach((data) => {
        let optionElement = document.createElement('option')
        optionElement.value = data.id;
        optionElement.text = data[name];
        element.appendChild(optionElement)
    })
}


// To get and set a department checkbox
const getDepartmentToComboBox = async () => {
    let departments = await listDepartment();
    insertToComboBox(department_select, departments.data, 'department_name');
}

// To Get and set a Divisions checkbox
const getDivisionsToComboBox = async () => {
    let divisions = await listDivisions();
    insertToComboBox(division_select, divisions.data, 'division_name')
}
// To Get and set a ProjectTypes checkbox
const getProjectTypes = async () => {
    let projectTypes = await listProjectTypes()
    insertToComboBox(project_type_select, projectTypes.data, 'type_name')
}

// To Get and set a JobTypes checkbox
const getJobTypes = async () => {
    let jobTypes = await listgetJobTypes()
    insertToComboBox(work_type_select, jobTypes.data, 'job_type_name')
}

document.addEventListener('DOMContentLoaded', () => {
    getDepartmentToComboBox();
    getDivisionsToComboBox();
    getProjectTypes();
    getJobTypes();
})