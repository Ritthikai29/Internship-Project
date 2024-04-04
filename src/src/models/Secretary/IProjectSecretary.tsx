// I = Interface 
// ex ISubPrice = Interface of SubPrice
export interface ISubPrice {
    id?: string;
    project_id: string;
    detail: string;
    price: number
}

export interface IHistoryPrice {
    price?: string | number| null
    order?: string | number| null
    registers_status_id?: string | number| null
}
export interface IProject {
    [x: string]: any;
    id?: string;
    key: string;
    name: string;
    price: number;
    calculate_uri: string;
    Tor_uri: string;
    division_name: string;
    Job_description_uri: string;
    add_datetime: string | Date;
    status_name: string;
    subPrice: ISubPrice[]
    project_unit_price: string
    department_name:string 
    SECTION:string;
    SUBSECTION:string;
    order?: number | string | null;
}

export interface IProject2 {
    [x: string]: any;
    id?: number;
    key: string;
    name: string;
    price: number;
    calculate_uri: string;
    Tor_uri: string;
    division_name: string;
    Job_description_uri: string;
    add_datetime: string | Date;
    status_name: string;
    subPrice: ISubPrice[]
    project_unit_price: string
    department_name:string 
    SECTION:string;
    SUBSECTION:string;
    order?: number | string | null;
}


export interface IVendorProject {
    id?: string | number;
    vendor_key: string;
    vendor_status_id: string;
    company_name: string;
    result: string;
    boq_uri: string;
    price: number | string | null;
    newPrice: number | string | null;
    email: string;
    registers_status_id:string | null;
    subprice: ISubPrice[],
    history_price?: IHistoryPrice[];
    compare?: number | string | null;
    order?: number | string | null;

}

export interface ISecretarySum {
    project_id: string;
    director_id: string;
    topic_id: string;
    comment: string;
    passcode: string;
}

export interface ISecretarySave{
    project_id: string;
    open_id: string;
    topic_id: string;
    comment: string;
    passcode: string;
}
