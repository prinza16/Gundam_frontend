"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../ToastContext";
import { SelectOption } from "@/types/select";
import { PaginatedResponseGrade } from "@/types/grade";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { PaginatedResponseSeller } from "@/types/seller";
import { PaginatedResponseType } from "@/types/type";
import DateCustom from "@/app/components/ui/DateCustom";
import SelectFile from "@/app/components/ui/SelectFile";
import ModalForMobilesuit from "@/app/components/ui/ModalForMobilesuit";

interface CreateMobilesuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMobilesuitCreated: () => void;
}

const CreateMobilesuitModal: React.FC<CreateMobilesuitModalProps> = ({
  isOpen,
  onClose,
  onMobilesuitCreated,
}) => {
  const showToast = useToast();
  const [mobilesuitName, setMobilesuitsName] = useState("");
  const [selectedGradeId, setSelectedGradeId] = useState<string | number>("");
  const [gradeOptions, setGradeOptions] = useState<SelectOption[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string | number>("");
  const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | number>("");
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);
  const [boxLength, setBoxLength] = useState("");
  const [boxWidth, setBoxWidth] = useState("");
  const [boxHeight, setBoxHeight] = useState("");
  const [mobilesuitImage, setMobilesuitsImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSeller, setIsLoadingSeller] = useState(false);
  const [isLoadingType, setIsLoadingType] = useState(false);
  const [dateReleases, setDateReleases] = useState("");

  const fetchGrades = async () => {
    setIsLoadingGrades(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/grade/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PaginatedResponseGrade = await response.json();
      const actualOptions: SelectOption[] = data.results.map((grade) => ({
        value: grade.grade_id,
        label: grade.grade_name,
      }));

      const placeholderOption: SelectOption = {
        value: "",
        label: " ",
      };

      setGradeOptions([placeholderOption, ...actualOptions]);
    } catch (err) {
      console.error("Error fetching grades:", err);
      if (err instanceof Error) {
        showToast(
          `เกิดข้อผิดพลาดในการดึงข้อมูล Grades: ${err.message}`,
          "error"
        );
      } else {
        showToast(
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Grades",
          "error"
        );
      }
    } finally {
      setIsLoadingGrades(false);
    }
  };

  const fetchSeller = async () => {
    setIsLoadingSeller(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/gundam_data/seller/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PaginatedResponseSeller = await response.json();
      const actualOptions: SelectOption[] = data.results.map((seller) => ({
        value: seller.seller_id,
        label: seller.seller_name,
      }));

      const placeholderOption: SelectOption = {
        value: "",
        label: " ",
      };

      setSellerOptions([placeholderOption, ...actualOptions]);
    } catch (err) {
      console.error("Error fetching universes:", err);
      if (err instanceof Error) {
        showToast(
          `เกิดข้อผิดพลาดในการดึงข้อมูล Universe: ${err.message}`,
          "error"
        );
      } else {
        showToast(
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Universe",
          "error"
        );
      }
    } finally {
      setIsLoadingSeller(false);
    }
  };

  const fetchType = async () => {
    setIsLoadingType(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/gundam_data/types/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PaginatedResponseType = await response.json();
      const actualOptions: SelectOption[] = data.results.map((type) => ({
        value: type.types_id,
        label: type.types_name,
      }));

      const placeholderOption: SelectOption = {
        value: "",
        label: " ",
      };

      setTypeOptions([placeholderOption, ...actualOptions]);
    } catch (err) {
      console.error("Error fetching universes:", err);
      if (err instanceof Error) {
        showToast(
          `เกิดข้อผิดพลาดในการดึงข้อมูล Universe: ${err.message}`,
          "error"
        );
      } else {
        showToast(
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Universe",
          "error"
        );
      }
    } finally {
      setIsLoadingType(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGrades();
      fetchSeller();
      fetchType();
      setMobilesuitsName("");
      setSelectedGradeId("");
      setSelectedSellerId("");
      setSelectedTypeId("");
      setBoxWidth("");
      setBoxLength("");
      setBoxHeight("");
      setDateReleases("");
      setError(null);
    }
  }, [isOpen]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const monthValue = e.target.value
    const fullDate = monthValue + '-01'
    setDateReleases(fullDate)
    console.log('Selected Month:', e.target.value)

  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (selectedGradeId === "") {
      setError("Please Select Grade");
      showToast("Please Select Grade", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("model_name", mobilesuitName);
    formData.append("model_length", boxLength);
    formData.append("model_width", boxWidth);
    formData.append("model_height", boxHeight);
    formData.append("model_grade", String(selectedGradeId));
    formData.append("model_seller", String(selectedSellerId));
    formData.append("model_type", String(selectedTypeId));
    formData.append("model_initial", dateReleases);
    formData.append("is_active", "true");

    if (mobilesuitImage) {
      formData.append("mobilesuit_image", mobilesuitImage);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/gundam_data/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, Details: ${JSON.stringify(
            errorData
          )}`
        );
      }

      await response.json();

      showToast("Success!", "success");

      onMobilesuitCreated();
      onClose();
      setMobilesuitsName("");
      setSelectedGradeId("");
      setSelectedSellerId("");
      setSelectedTypeId("");
      setBoxWidth("");
      setBoxLength("");
      setBoxHeight("");
      setDateReleases("");
      setMobilesuitsImage(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาด: ${err.message}`, `error`);
      } else {
        setError("An unknown error occurred during creation.");
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการสร้างเกรด", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ModalForMobilesuit isOpen={isOpen} onClose={onClose} title="Create Data">
        <form onSubmit={handleSubmit} className="overflow-auto">
          <div className="mb-4">
            <Input
              label="Mobilesuit Name"
              type="text"
              id="mobilesuitName"
              value={mobilesuitName}
              onChange={(e) => setMobilesuitsName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex justify-between gap-3">
            <div className="w-full">
              <Select
                label="Grade Name"
                options={gradeOptions}
                selectedValue={selectedGradeId}
                onSelect={setSelectedGradeId}
                disabled={isLoadingGrades}
              />
            </div>
            <div className="w-full">
              <Select
                label="Seller Name"
                options={sellerOptions}
                selectedValue={selectedSellerId}
                onSelect={setSelectedSellerId}
                disabled={isLoadingSeller}
              />
            </div>
          </div>
          <div className="mb-4">
          </div>
          <div className="mb-4">
            <Select
              label="Type Name"
              options={typeOptions}
              selectedValue={selectedTypeId}
              onSelect={setSelectedTypeId}
              disabled={isLoadingType}
            />
          </div>
          <div className="mb-4 flex justify-between gap-3">
            <div>
              <Input
                label="Box Length"
                type="text"
                id="boxLength"
                value={boxLength}
                onChange={(e) => setBoxLength(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Box Width"
                type="text"
                id="boxWidth"
                value={boxWidth}
                onChange={(e) => setBoxWidth(e.target.value)}
              />
            </div>
            <div>
              <Input
                label="Box Height"
                type="text"
                id="boxHeight"
                value={boxHeight}
                onChange={(e) => setBoxHeight(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <SelectFile
              label="Mobilesiut Image"
              id="mobilesuitImage"
              onFileChange={setMobilesuitsImage}
              selectedFileName={mobilesuitImage ? mobilesuitImage.name : null}
            />
          </div>
          <div className="mb-4">
            <DateCustom
              label="Date Releases"
              id="dateReleases"
              value={dateReleases ? dateReleases.slice(0,7) : ''}
              onChange={handleMonthChange}
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-blue-200 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer shadow-md shadow-cyan-500/50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </ModalForMobilesuit>
    </>
  );
};
export default CreateMobilesuitModal;
