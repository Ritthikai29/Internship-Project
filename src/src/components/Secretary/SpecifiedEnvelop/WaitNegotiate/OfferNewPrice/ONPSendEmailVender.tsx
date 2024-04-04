import { useEffect, useState } from "react";
import { GetAllVendorProjectWaitToOfferByProjectId } from "../../../../../services/SecretaryService/HttpClientService";
import { IVendorBargain } from "../WNOfferNewPrice";

interface IVendorOptions {
  id?: string | number;
  company_name: string;
  vendor_key: string;
  vendor_type: string;
  phone_number: string;
  email: string;
  manager_name: string;
}

export default function OPNSendEmailVender({
  setVendorBargain,
  vendorBargain,
}: {
  setVendorBargain: React.Dispatch<React.SetStateAction<Partial<IVendorBargain>>>;
  vendorBargain: Partial<IVendorBargain>;
}) {
  const queryParameters = new URLSearchParams(window.location.search);

  const [vendors, setVendors] = useState<IVendorOptions[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const getAllVendorWaitOfferInProject = async () => {
    const res = await GetAllVendorProjectWaitToOfferByProjectId(
      queryParameters.get("project_id") || ""
    );
    setVendors(res.data);
  };

  const handleVendorClick = (id: string) => {
    if (selectedVendors.includes(id)) {
    // If vendor is already selected, remove it from the array
      setSelectedVendors((prevSelected) => prevSelected.filter((vendorId) => vendorId !== id));
    } else {
    // If vendor is not selected, add it to the array
      setSelectedVendors((prevSelected) => [...prevSelected, id]);
    }
  };

  useEffect(() => {
    getAllVendorWaitOfferInProject();
  }, []);

  useEffect(() => {
    // Update the vendor_project_id in the state whenever the selectedVendors array changes
    setVendorBargain({
      ...vendorBargain,
      vendor_project_id: selectedVendors.join(','), // Assuming vendor_project_id is a string
    });
  }, [selectedVendors, setVendorBargain]);

  return (
    <div>
      <div className=" pt-2 rounded-2xl">
        <p className="text-2xl font-bold text-[#2B3467]">
          2) ส่งอีเมลหา Vendor ที่ต้องเจรจา
        </p>
        <div className="scroll-x overflow-x-scroll rounded-lg ">
        <table className="w-[100vw] mt-6 drop-shadow-lg rounded-lg ">
          <thead className="text-white text-lg uppercase bg-[#2B2A2A] h-14">
            <tr>
              <th className="rounded-l-lg"> </th>
              <th className="">ลำดับ</th>
              <th className="">ประเภท</th>
              <th className="">เลขสมาชิก</th>
              <th className="">ชื่อ หจก./บริษัท</th>
              <th className="">ชื่อผู้จัดการ</th>
              <th className="">อีเมล์</th>
              <th className="rounded-r-lg">เบอร์โทร</th>
            </tr>
          </thead>
          <tbody className="bg-white border-b-lg rounded-xl h-14">
            {vendors.map((item, index) => (
              <tr
                key={item.id}
                className="text-gray-700 text-base h-14 border-b-2 border-black-700 text-center"
              >
                <td>
                  <input
                    type="checkbox"
                    name="vendor_project_id"
                    className="inline-block h-6 w-12"
                    onChange={() => handleVendorClick(item.id as string)}
                  />
                </td>
                <td className="">{index + 1}</td>
                <td
                  className={`${
                    item.vendor_type == "list"
                      ? "text-[#0083FF]"
                      : "text-[#FF0000]"
                  }`}
                >
                  {item.vendor_type == "list"
                    ? "ใน List ทะเบียน"
                    : "นอก List ทะเบียน"}
                </td>
                <td className="">{item.vendor_key}</td>
                <td className="text-left mx-2">{item.company_name}</td>
                <td className="text-left mx-2">{item.manager_name}</td>
                <td className="text-center mx-2">{item.email}</td>
                <td className="">{item.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
