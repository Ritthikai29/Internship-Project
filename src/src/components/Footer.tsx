import logo from "../assets/logo-footer.png";


export default function Footer() {
  return (
    
<footer className="bg-[#2B2A2A]">
    <div className="w-full max-w-screen-xl mx-auto p-4 md:py-4">
        <div className="flex pb-4">
          <div className="flex-none mb-4 sm:mb-0">

            <a href="" className="items-center">
                <img src={logo} className="h-40 mr-10" alt="Flowbite Logo" />
            </a>
          </div>
          <div className="flex-auto w-32 self-center">
            <p className="text-2xl text-white">About Us</p>
            <p className="text-white" >บริษัท ปูนซิเมนต์ไทย(ทุ่งสง) จำกัด</p>
          </div>
          <div className="flex-auto w-64 self-center">
            <p className="self-center text-2xl text-white">Contact Us </p>
            <p className="self-center text-white">ที่อยู่ : 52 หมู่ 6 ถนนทุ่งสง-ห้วยยอด ตำบลที่วัง อำเภอทุ่งสง จังหวัดนครศรีธรรมราช 80110</p>
            <p className="self-center text-white">โทรศัพท์ : 075-538222 ต่อ 1210</p>
            <p className="self-center text-white">เวลาทำการ : จันทร์-ศุกร์ เวลา 07.30-16.30 น.</p>
            <p className="self-center text-[#EFD700]">Created Developer by</p>
            <p className="self-center text-[#EFD700]"> </p>
          </div>
        </div>
        <hr className="my-1 border-white mx-my-4"/>
        <span className="block text-md text-white sm:text-center mt-3">© 2023 <a href="" className="hover:underline"></a>- All Rights Reserved</span>
    </div>
</footer>


  )
}
