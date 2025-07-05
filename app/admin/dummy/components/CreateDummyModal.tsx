"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../ToastContext";
import { SelectOption } from "@/types/select";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import { PaginatedResponseGrade } from "@/types/grade";
import { PaginatedResponseSeller } from "@/types/seller";
import { PaginatedResponseType } from "@/types/type";

interface CreateDummyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDummyCreated: () => void;
}

const CreateDummyModal: React.FC<CreateDummyModalProps> = ({
  isOpen,
  onClose,
  onDummyCreated,
}) => {
  const showToast = useToast();
  const [dummyName, setDummyName] = useState("");
  const [dummyLength, setDummyLength] = useState(0);
  const [dummyWidth, setDummyWidth] = useState(0);
  const [dummyHeight, setDummyHeight] = useState(0);
  const [dummyInitial, setDummyInitial] = useState("");
  const [selectedGradeId, setSelectedGradeId] = useState<number | "">("");
  const [selectedSellerId, setSelectedSellerId] = useState<number | "">("");
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [gradeOptions, setGradeOptions] = useState<SelectOption[]>([]);
  const [sellergradeOptions, setSellerOptions] = useState<SelectOption[]>([]);
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSeller, setIsLoadingSeller] = useState(false);
  const [isLoadingType, setIsLoadingType] = useState(false);

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
      console.error("Error fetching grade:", err);
      if (err instanceof Error) {
        showToast(
          `เกิดข้อผิดพลาดในการดึงข้อมูล Grade: ${err.message}`,
          "error"
        );
      } else {
        showToast(
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Grade",
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
      const response = await fetch("http://127.0.0.1:8000/gundam_data/seller");
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

      setGradeOptions([placeholderOption, ...actualOptions]);
    } catch (err) {
      console.error("Error fetching seller:", err);
      if (err instanceof Error) {
        showToast(
          `เกิดข้อผิดพลาดในการดึงข้อมูล Seller: ${err.message}`,
          "error"
        );
      } else {
        showToast(
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Seller",
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
      const data: PaginatedResponseType= await response.json();
      const actualOptions: SelectOption[] = data.results.map((type) => ({
        value: type.types_id,
        label: type.types_name,
      }));

      const placeholderOption: SelectOption = {
        value: "",
        label: " ",
      };

      setGradeOptions([placeholderOption, ...actualOptions]);
    } catch (err) {
      console.error("Error fetching Type:", err);
      if (err instanceof Error) {
        showToast(
          `เกิดข้อผิดพลาดในการดึงข้อมูล Type: ${err.message}`,
          "error"
        );
      } else {
        showToast(
          "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล Type",
          "error"
        );
      }
    } finally {
      setIsLoadingSeller(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGrades();
      fetchSeller();
      fetchType();
      setDummyName("");
      setDummyLength(0);
      setDummyWidth(0);
      setDummyHeight(0);
      setSelectedGradeId("");
      setSelectedSellerId("");
      setSelectedTypeId("");
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (selectedGradeId === '') {
        setError("Please Select Grade")
        showToast("Please Select Grade", "error")
        setLoading(false)
        return
    }

    if (selectedSellerId === '') {
        setError("Please Select Seller")
        showToast("Please Select Seller", "error")
        setLoading(false)
        return
    }

    if (selectedTypeId === '') {
        setError("Please Select Type")
        showToast("Please Select Type", "error")
        setLoading(false)
        return
    }

    const formData = new FormData()
    formData.append("model_name", dummyName)
    formData.append("model_length", dummyLength)
    formData.append("model_width", dummyWidth)
    formData.append("model_height", dummyHeight)
    formData.append("model_initial", dummyInitial)
    formData.append("model_grade", String(selectedGradeId))
    formData.append("model_seller", String(selectedSellerId))
    formData.append("model_type", String(selectedTypeId))
    formData.append("is_active", "true")

    try {
        const response = await fetch("http://127.0.0.1:8000/gundam_data/", {
            
        })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showToast(`เกิดข้อผิดพลาด: ${err.message}`, `error`);
      } else {
        setError("An unknown error occurred during creation.");
        showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุระหว่างการสร้างโมเดล", "error");
      }
    } finally {
        setLoading(false)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Data">
        <form>
          <div className="mb-4">
            <Input
              label="Model Name"
              type="text"
              id="dummyName"
              value={dummyName}
              onChange={(e) => setDummyName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Model Length"
              type="text"
              id="dummyLength"
              value={dummyLength}
              onChange={(e) => setDummyLength(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Model Width"
              type="text"
              id="dummyWidth"
              value={dummyWidth}
              onChange={(e) => setDummyWidth(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Input
              label="Model Height"
              type="text"
              id="dummyHeight"
              value={dummyHeight}
              onChange={(e) => setDummyHeight(e.target.value)}
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
      </Modal>
    </>
  );
};
export default CreateDummyModal;
