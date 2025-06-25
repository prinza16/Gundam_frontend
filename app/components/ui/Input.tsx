const Input = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <label className="relative">
        <input 
          type="text" 
          className="h-20 w-96 px-6 text-4xl bg-white border-2 rounded-lg border-black border-opacity-50 outline-none focus:border-blue-500 text-[#333333] transition duration-200"
        />
        <span className="text-4xl text-[#333333] text-opacity-80 absolute left-0 top-4 mx-6 px-2 transition duration-200 input-text">Input</span>
      </label>
    </div>
  )
}
export default Input