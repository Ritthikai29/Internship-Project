import React, { useState } from "react";

interface CookieSettingsProps {
  onClose: () => void;
}

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

type ShowDetails = Record<keyof CookiePreferences, boolean>;

const CookieSettings: React.FC<CookieSettingsProps> = ({ onClose }) => {
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(
    {
      analytics: true,
      marketing: false,
      functional: true,
    }
  );

  const [showDetails, setShowDetails] = useState<ShowDetails>({
    analytics: false,
    marketing: false,
    functional: false,
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setCookiePreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: checked,
    }));
  };

  const handleSavePreferences = () => {
    console.log("Saved preferences:", cookiePreferences);
    onClose();
  };

  const handleToggleAll = () => {
    setCookiePreferences({
      analytics: true,
      marketing: true,
      functional: true,
    });
    console.log("Saved preferences:", {
      analytics: true,
      marketing: true,
      functional: true,
    });
    onClose();
  };

  const handleShowDetailsToggle = (category: keyof ShowDetails) => {
    setShowDetails((prevShowDetails) => ({
      ...prevShowDetails,
      [category]: !prevShowDetails[category],
    }));
  };

  const renderCookieSection = (
    category: keyof CookiePreferences,
    label: string,
    details: string
  ) => (
    <div>
      <div className="mb-4 flex items-center p-4 border rounded-md border-gray-300 bg-gray-100">
        <button
          onClick={() => handleShowDetailsToggle(category)}
          className="text-red-500 ml-2 mr-2 hover:underline focus:outline-none"
        >
          {showDetails[category] ? "ᐯ" : "ᐱ"}
        </button>
        <span className="text-md font-medium text-gray-900 dark">{label}</span>
        <label className="relative inline-flex items-center ms-3 cursor-pointer ml-auto">
          <input
            type="checkbox"
            name={category}
            checked={cookiePreferences[category]}
            disabled={category === "functional"}
            onChange={handleCheckboxChange}
            className="peer sr-only"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
          <span
            className={`ms-2 text-sm font-medium text-gray-900 dark:text-${
              cookiePreferences[category] ? "gray-500" : "gray-300"
            }`}
          >
            {cookiePreferences[category] ? "เปิด" : "ปิด"}
          </span>
        </label>
      </div>
      {showDetails[category] && <div className="mb-4">{details}</div>}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-4">การปรับแต่งคุกกี้</h2>
      <p className="mb-4">
        ท่านสามารถปรับแต่งการใช้งานคุกกี้ได้ตามรายละเอียดต่อไปนี้
      </p>

      {renderCookieSection(
        "functional",
        "คุกกี้ที่จำเป็นสำหรับการทำงานของเว็บไซต์",
        "รายละเอียดเพิ่มเติมเกี่ยวกับคุกกี้ที่จำเป็นสำหรับการทำงานของเว็บไซต์ functional"
      )}
      {renderCookieSection(
        "analytics",
        "คุกกี้เพื่อปรับเนื้อหาเข้ากับกลุ่มเป้าหมาย",
        "รายละเอียดเพิ่มเติมเกี่ยวกับคุกกี้ที่จำเป็นสำหรับการทำงานของเว็บไซต์ analytics"
      )}
      {renderCookieSection(
        "marketing",
        "คุกกี้เพื่อนำเสนอโฆษณาให้เข้ากับกลุ่มเป้าหมาย",
        "รายละเอียดเพิ่มเติมเกี่ยวกับคุกกี้ที่จำเป็นสำหรับการทำงานของเว็บไซต์ marketing"
      )}

      <div className="mb-4 flex items-center p-4 border rounded-md border-gray-300 bg-gray-10">
        <p>
          ข้อมูลที่ได้และใช้ประมวลผลจากการใช้คุกกี้นั้นเป็นการเก็บข้อมูลทางสถิติจากการจราจรทางคอมพิวเตอร์เท่านั้น
          ไม่สามารถบ่งบอก หรือระบุความเป็นตัวตนของท่านได้
          ท่านสามารถปรับแต่งข้อมูลวิธีการที่เราใช้คุกกี้ได้จากด้านบนและทำการบันทึกข้อมูล
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none"
        >
          บันทึกข้อมูล
        </button>
        <button
          onClick={handleToggleAll}
          className="ml-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:text-gray-800 transition-colors duration-300 focus:outline-none"
        >
          ยอมรับทั้งหมด
        </button>
      </div>
    </div>
  );
};

export default CookieSettings;
