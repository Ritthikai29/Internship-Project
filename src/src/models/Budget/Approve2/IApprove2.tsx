export interface ResLatestBudgetApprove1 {
    id?: number;
    verify_calculate_id: number;
    Ref_price_Managers_id: number;
    approve: number;
    price: number;
    submit_datetime: Date | string;
    is_edit: string;
    sub_prices :ResSubPrice []
}

interface ResSubPrice {
    id?: number;
    approve_calculate_id?: number;
    detail: string;
    price: number;
    budget_calculate_id?: number
}
export interface SubBudgetInterface {
    id?: number;
    budget_calculate_id?: number;
    name: string;
    price: number | string;
    new_price: number | string;
}

export interface ResLatestBudgetCalculate {
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

export interface ReqRejectApprove2Interface {
    project_key: string;
    reason_id: number | string;
    comment: string;
    
}