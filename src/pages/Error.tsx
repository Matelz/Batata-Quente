import React from "react";

export default function Error() {
  return (
    <div className="flex w-full h-screen bg-[url('bg.png')] bg-cover" id="bg">
      <div className="flex w-full h-screen bg-rose-500 bg-opacity-70 justify-center items-center">
        <div className="w-2/6 h-72 bg-white flex justify-center flex-col items-center rounded-lg border-4 border-black">
          <h1 className="font-bold text-3xl">Ocorreu um Erro</h1>
          <p className="text-center w-72 mt-5">
            Por favor, caso o erro continue acontecendo, contacte-nos via
            Twitter
          </p>
        </div>
      </div>
    </div>
  );
}
