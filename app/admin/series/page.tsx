"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "../ToastContext";
import { PaginatedResponseSeries, Series } from "@/types/series";
import useDebounce from "@/app/hooks/useDebounce";
import { FaAnglesLeft, FaAnglesRight, FaChevronLeft, FaChevronRight, FaGear, FaPlus, FaTrash } from "react-icons/fa6";
import CreateSeriesModal from "./components/CreateSeriesModal";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

const SeriesList: React.FC = () => {
  const showToast = useToast();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<
    string | number | null
  >(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchSeries = useCallback(
    async (pageToFetch: number = currentPage, currentSearchQuery: string) => {
      setLoading(false);
      setError(null);
      try {
        const url = new URL(`http://127.0.0.1:8000/series/`);
        url.searchParams.append("page", pageToFetch.toString());
        url.searchParams.append("limit", itemsPerPage.toString());
        if (currentSearchQuery) {
          url.searchParams.append("search", currentSearchQuery);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          if (response.status === 404 && pageToFetch > 1) {
            setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PaginatedResponseSeries = await response.json();
        setSeries(data.results);
        setTotalItems(data.count);
        setCurrentPage(pageToFetch);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          showToast(`เกิดข้อผิดพลาดในการดึงข้อมูล: ${err.message}`, "error");
        } else {
          setError("An unknown error occurred.");
          showToast("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการดึงข้อมูล", "error");
        }
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage, showToast]
  );

  useEffect(() => {
    fetchSeries(1, debouncedSearchQuery);
  }, [debouncedSearchQuery, fetchSeries]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCurrentPage(1);
    setSearchQuery("");
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      fetchSeries(pageNumber, debouncedSearchQuery)
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center mt-8 text-red-600">
        เกิดข้อผิดพลาด: {error}
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="w-full flex flex-col min-h-[calc(100vh-100px)] bg-gray-900 text-blue-100 p-6 rounded-lg shadow-x">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-200">Series</h1>
          <div className="flex items-center bg-blue-900">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-blue-200 placeholder-gray-400 border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer shadow-lg shadow-blue-500/50"
          >
            <FaPlus className="mr-2" /> Create
          </button>
        </div>
        <table className="min-w-full table-auto border border-blue-600 shadow-lg shadow-blue-500/50">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                No.
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                Series Name
              </th>
              <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-700">
            <tr className="bg-gray-800 transition duration-300 ease-in-out">
              <td colSpan={3}>
                <div className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                  ไม่พบข้อมูลเกรด
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <CreateSeriesModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSeriesCreated={() => fetchSeries(1, "")}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-100px)] bg-gray-900 text-blue-100 p-6 rounded-lg shadow-x">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-200">Series</h1>
        <div className="flex items-center bg-blue-900">
          <input 
            type="text" 
            placeholder="Search..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out text-blue-200 placeholder-gray-400 border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out cursor-pointer shadow-lg shadow-blue-500/50"
        >
          <FaPlus className="mr-2" /> Create
        </button>
      </div>
      {series.length === 0 ? (
        <div className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">ไม่พบข้อมูล</div>
      ) : (
        <>
          <div className="flex-grow overflow-x-auto">
            <table className="min-w-full table-auto border border-blue-600 shadow-lg shadow-blue-500/50">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                    No.
                  </th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                    Series Name
                  </th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600">
                    Universe Name
                  </th>
                  <th className="px-6 py-3 bg-blue-800 text-center text-2xl font-medium text-blue-100 tracking-wider border-b border-blue-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700">
                {series.map((series, index) => (
                  <tr
                    key={series.series_id}
                    className="bg-gray-800 transition duration-300 ease-in-out"
                  >
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                      {series.series_name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 text-center">
                      {series.series_universe_name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xl font-medium text-blue-200 flex items-center justify-center">
                      <button

                        className="btn inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer shadow-md shadow-cyan-500/50 transition duration-300 ease-in-out"
                      >
                        <FaGear className="mr-2" /> Repair
                      </button>
                      <button
                        className="btn inline-flex items-center bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded cursor-pointer shadow-md shadow-red-500/50 transition duration-300 ease-in-out"

                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-gray-600">

            </div>
            <div className="flex items-center">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaAnglesLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaChevronLeft />
              </button>
              <span className="text-blue-200 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="py-2 px-4 bg-blue-600 text-white cursor-pointer rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                <FaAnglesRight />
              </button>
            </div>
          </div>
        </>
      )}
      <CreateSeriesModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSeriesCreated={() => fetchSeries(1, "")}
      />
    </div>
  );
};
export default SeriesList;
