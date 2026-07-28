function Settings() {
  return (
    <div className="w-200 mt-8 flex flex-col gap-y-5">
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-2xl font-bold">Form settings</h1>
        <p className="text-gray-300">
          Manage submission defaults, response options, and other form settings
          here!
        </p>
      </div>
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-xl font-bold">Settings category 1</h1>
        <p className="text-gray-300">Form settings coming soon!</p>
      </div>
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-xl font-bold">Settings category 2</h1>
        <p className="text-gray-300">Form settings coming soon!</p>
      </div>
    </div>
  );
}

export default Settings;
