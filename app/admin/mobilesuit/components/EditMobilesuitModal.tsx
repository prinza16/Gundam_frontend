"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../ToastContext";
import { SelectOption } from "@/types/select";
import { PaginatedResponseGrade } from "@/types/grade";
import { MobilesuitRead } from "@/types/mobilesuit";
import { PaginatedResponseSeller } from "@/types/seller";
import { PaginatedResponseType } from "@/types/type";
import Modal from "@/app/components/ui/Modal";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import DateCustom from "@/app/components/ui/DateCustom";
import SelectFile from "@/app/components/ui/SelectFile";

interface EditMobilesuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  mobilesuitId: string | number | null;
  onMobilesuitUpdated: () => void;
}

const EditMobilesuitModal: React.FC<EditMobilesuitModalProps> = ({
  isOpen,
  onClose,
  mobilesuitId,
  onMobilesuitUpdated,
}) => {
  const showToast = useToast();
  const [formData, setFormData] = useState<{
    model_name: string;
    model_grade?: number;
    model_seller?: number;
    model_type?: number;
    model_length?: string;
    model_width?: string;
    model_height?: string;
    model_initial?: string;
    main_image?: string | null;
  }>({
    model_name: "",
  });

  const fullImageUrl = formData.main_image
    ? formData.main_image.startsWith("http")
      ? formData.main_image
      : `http://127.0.0.1:8000${formData.main_image}`
    : undefined;

  const [selectedGradeId, setSelectedGradeId] = useState<string | number>("");
  const [gradeOptions, setGradeOptions] = useState<SelectOption[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string | number>("");
  const [sellerOptions, setSellerOptions] = useState<SelectOption[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<string | number>("");
  const [typeOptions, setTypeOptions] = useState<SelectOption[]>([]);
  const [mobilesuitImage, setMobilesuitsImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSeller, setIsLoadingSeller] = useState(false);
  const [isLoadingType, setIsLoadingType] = useState(false);
  const [dateReleases, setDateReleases] = useState("");

  useEffect(() => {
    if (!isOpen || !mobilesuitId) {
      setLoading(false);
      return;
    }

    const fetchGrades = async () => {
      setIsLoadingGrades(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/grade/");
        const data: PaginatedResponseGrade = await response.json();
        const actualOptions: SelectOption[] = data.results.map((grade) => ({
          value: grade.grade_id,
          label: grade.grade_name,
        }));

        setGradeOptions([{ value: "", label: " " }, ...actualOptions]);
      } catch (err) {
        showToast("เกิดข้อผิดพลาดในการดึงข้อมูล Universe", "error");
      } finally {
        setIsLoadingGrades(false);
      }
    };

    const fetchSeller = async () => {
      setIsLoadingSeller(true);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/gundam_data/seller/"
        );
        const data: PaginatedResponseSeller = await response.json();
        const actualOptions: SelectOption[] = data.results.map((seller) => ({
          value: seller.seller_id,
          label: seller.seller_name,
        }));

        setSellerOptions([{ value: "", label: " " }, ...actualOptions]);
      } catch (err) {
        showToast("เกิดข้อผิดพลาดในการดึงข้อมูล Universe", "error");
      } finally {
        setIsLoadingSeller(false);
      }
    };

    const fetchType = async () => {
      setIsLoadingType(true);
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/gundam_data/types/"
        );
        const data: PaginatedResponseType = await response.json();
        const actualOptions: SelectOption[] = data.results.map((type) => ({
          value: type.types_id,
          label: type.types_name,
        }));

        setTypeOptions([{ value: "", label: " " }, ...actualOptions]);
      } catch (err) {
        showToast("เกิดข้อผิดพลาดในการดึงข้อมูล Universe", "error");
      } finally {
        setIsLoadingType(false);
      }
    };

    const fetchMobilesuitsDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/gundam_data/${mobilesuitId}/`
        );
        const data: MobilesuitRead = await response.json();
        setFormData({
          model_name: data.model_name,
          model_grade: data.model_grade,
          model_seller: data.model_seller,
          model_type: data.model_type,
          model_length: data.model_length,
          model_height: data.model_height,
          model_width: data.model_width,
          main_image: data.main_image,
          model_initial: data.model_initial,
        });
        setSelectedGradeId(data.model_grade || "");
        setSelectedSellerId(data.model_seller || "");
        setSelectedTypeId(data.model_type || "");
        setDateReleases(data.release_date ? data.release_date.slice(0, 7) : "");
      } catch (err) {
        showToast("เกิดข้อผิดพลาดในการโหลดข้อมูล", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMobilesuitsDetail();
    fetchGrades();
    fetchSeller();
    fetchType();
  }, [isOpen, mobilesuitId, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("model_name", formData.model_name);
      formDataToSend.append("model_length", formData.model_length ?? "");
      formDataToSend.append("model_width", formData.model_width ?? "");
      formDataToSend.append("model_height", formData.model_height ?? "");

      if (selectedGradeId) {
        formDataToSend.append("model_grade", selectedGradeId.toString());
      }

      if (selectedSellerId) {
        formDataToSend.append("model_seller", selectedSellerId.toString());
      }

      if (selectedTypeId) {
        formDataToSend.append("model_type", selectedTypeId.toString());
      }

      if (dateReleases) {
        formDataToSend.append("model_initial", `${dateReleases}-01`);
      }

      if (mobilesuitImage) {
        formDataToSend.append("model_image", mobilesuitImage);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/gundam_data/${mobilesuitId}/`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! ${response.status}: ${JSON.stringify(errorData)}`
        );
      }

      showToast("Success!", "success");
      onMobilesuitUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("เกิดข้อผิดพลาดในการแก้ไขข้อมูล", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="กำลังโหลดข้อมูล...">
        <LoadingSpinner />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Data`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            label="Mobilesuit Name"
            type="text"
            name="model_name"
            value={formData.model_name}
            onChange={handleInputChange}
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
              name="model_length"
              value={formData.model_length?.toString() ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label="Box Width"
              type="text"
              name="model_width"
              value={formData.model_width?.toString() ?? ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Input
              label="Box Height"
              type="text"
              name="model_height"
              value={formData.model_height?.toString() ?? ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mb-4">
          <DateCustom
            label="Date Releases"
            id="dateReleases"
            value={dateReleases}
            onChange={(e) => setDateReleases(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <SelectFile
            label="Mobilesiut Image"
            id="mobilesuitImage"
            onFileChange={setMobilesuitsImage}
            selectedFileName={mobilesuitImage ? mobilesuitImage.name : null}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default EditMobilesuitModal;
