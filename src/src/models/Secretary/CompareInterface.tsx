export interface SubpriceInterface {
  id: string;
  detail: string;
  price: number;
  vendor_register_id: string;
  project: ProjectInterface[] | null;
}

export interface VendorInterface {
  id: string;
  vendor_key: string;
  company_name: string;
  add_datetime: string;
  email: string;
  manager_name: string;
  manager_role: string;
  phone_number: string;
  affiliated: string;
  vendor_type: string;
  location_detail: string;
  note: string | null;
  vendor_level: string | null;
  location_main_id: string;
}

export interface ListVendorItemInterface {
  id: string;
  project_id: string;
  vendor_id: string;
  passcode: string;
  approve: string;
  adder_user_staff_id: string;
  price: number | null;
  subprice: SubpriceInterface[] | null;
  newPrice: number | null;
  compare: number | null;
  result: string;
  vendor: VendorInterface;
  registers_status_id:string | null;
  boq: string;
  key: string;
  name: string;

  add_datetime: string;
  history_price?: history_price[] | null;
}

export interface history_price {
  price: string | number | null;
  order: string | number | null;
  registers_status_id: string | number | null[];
}

export interface ListVendorPriceInterface {
  price: number;
  data: ListVendorItemInterface[];
  res_status: ResultStatusInterface[];
  result: ListVendorItemInterface[];
  status: number;
}

export interface ResultStatusInterface {
  text: string;
  status: number;
}

export interface ProjectInterface {
    id: string;
    key: string;
    name: string;
    Tor_uri: string;
    Job_description_uri: string;
    price: number;
    calculate_uri: string;
    is_active: string;
    add_datetime: string;
    adder_user_staff_id: string;
    division: string;
    department: string;
    project_type: string;
    job_type: string;
    status_id: string;
    opendate_id: string;
  }
