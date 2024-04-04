export interface ProjectInterface {
    id?: number;
    key: string;
    name: string;
    Tor_uri: string;
    Job_description_uri: string;
    add_datetime: string;
    adder_user_staff_id: number;
    status_id: number;
    status_name: string;
}

export interface SubBudgetInterface {
    id?: number;
    budget_calculate_id?: number;
    name: string;
    price: number | string;
    new_price: number | string;
}

export interface BudgetApprove1Interface {
    id?: number;
    price: number | string;
    new_price?: number | string;
    Budget_status_id: number;
    Ref_price_Manager_id: number;
    calculate_file: string;
    status_name: string;
    sub_price: SubBudgetInterface[];
    submit_datetime: string;
}

interface Approve1SubPriceInterface {
    detail: string;
    price: number;
}

export interface Approve1IsApproveInterface {
    id?: number;
    project_key: string;
    price: number;
    is_edit: boolean;
    sub_prices?: Approve1SubPriceInterface[];
    reasonedit?: RequestEditInterface;

}


export interface RejectReasonInterface {
    id?: number;
    reason_t?: string;
    reason_e?: string;
}


export interface RequestRejectInterface {
    project_key: string;
    reason_id: number;
    comment: string;
}

export interface RequestEditInterface {
    reason_id: number | null;
    comment: string  | null;
}