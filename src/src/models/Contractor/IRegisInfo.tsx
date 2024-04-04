export interface VenderRegisListInterface{
    id?: number;
    company_name: string;
    submit_date: string;
    submit_time: string;
    receipt_uri: string;
    msg_th: string;
    email: string;
    vendor_type: string;
    bookbank_uri: string;
    certificate_uri: string;
    vat_uri: string;
}

export interface VenderRegisterStatusInterface{
    id? : number;
    msg_th : string;
    msg_en : string;
}

export interface ProjectSettingInterface{
    id? : number;
    deposit_money : number;
    end_date : string;
    end_time : string;
    creator_name : string;
}

export interface ProjectSettingEditInterface {
    key: string;
    end_datetime: string;
    deposit_money: string;
}

