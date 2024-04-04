export interface VendorOutsideUnList {
    vendor_key?: string;
    company_name: string;
    email: string;
    manager_name: string;
    manager_role: string;
    phone_number: string;
    affiliated: string;
    location_detail: string;
    location_main_id: number | string;
    note?: string;
}

export interface CreateVendorOutsideUnList {
    unlistVendor: VendorOutsideUnList[],
    reason: string;
    verifier_id: string | number;
    approver_id: string | number;
    cc_send_id?: (string | number)[];
    project_id: string | number;
    affiliated: string | number;
    setCC?: string[];
}


export interface UserStaffForVendorOutsideInterface {
    id: number;
    employee_id: string;
    employeeNO: string;
    nametitle_t: string;
    firstname_t: string;
    lastname_t: string;
    postiton: string;
}