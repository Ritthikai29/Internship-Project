export interface VendorInfoInterface{
    
    id: Number,
    vendor_key: string,
    password: string,
    company_name: string,
    add_datetime: string,
    email: string,
    manager_name:string,
    manager_role: string,
    phone_number: Number,
    affiliated: string,
    vendor_type: string ,
    location_detail: string,
    note: null,
    vendor_level: null,
    location_main_id: Number,


}

export interface SucpriceInfoInterface{
   
    detail: string;
}

export interface VendorListForSearchInterface{

    data_serach: string ,
	expertise: string ,
}

export interface VendorListInterface{
        vendor_key: string ,
		add_datetime: string ,
		company_name: string ,
		affiliated: string ,
		location: string ,
        location_main: string ,
        location_detail: string ,
        location_main_id: string ,
		manager_name: string ,
		manager_role: string ,
		phone_number: string ,
		email: string ,
		expertise: string ,
		note: string ,
		vendor_level: string,
        jobtype:string,
        expertise_value: {}
}

export interface VendorListForAdminInterface{
    vendor_key: string ,
    add_datetime: string ,
    company_name: string ,
    affiliated: string ,
    jobtype: string ,
    location_main: string | number ,
    location: string ,
    manager_name: string ,
    manager_role: string ,
    phone_number: string ,
    email: string ,
    expertise: string ,
    note: string ,
    vendor_level: string
}

