import { Dialog } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [option, toggleOption] = useState(false);
  const [nick, setNick] = useState("");
  const [code, setCode] = useState("");
  const [pass, setPass] = useState("");
  const [popup, togglePopup] = useState(false);
  const [create, toggleCreate] = useState(false);

  var rooms: string | string[] = [];

  const navigate = useNavigate();

  // useEffect(() => {
  //   try {
  //     (window.adsbygoogle = window.adsbygoogle || []).push({});
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  function joinRoom(nick: String, code: String, pass: String) {
    if (nick === "" || pass === "") return false;

    axios
      .get(`http://localhost:8080/join?n=${nick}&c=${code}&p=${pass}`)
      .then((response) => {
        toast.success(response.data);
        togglePopup(false);

        navigate(`/${code}`, { state: { user: nick }, replace: true });
      })
      .catch((error) => {
        if (error) {
          toast.error("Código ou Senha Inválidos", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
  }

  function createRoom() {
    if (nick === "" || pass === "") return false;

    axios
      .post(
        `http://localhost:8080/createRoom`,
        {
          creator: nick,
          pass: pass,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success("Sala Criada!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        toggleCreate(!create);

        joinRoom(nick, res.data, pass);
      });
  }

  return (
    <div className="flex w-full h-screen bg-[url('bg.png')] bg-cover" id="bg">
      <ToastContainer />
      <div className="lg:grid lg:grid-cols-[330px_1fr_330px] flex w-full h-screen bg-rose-500 bg-opacity-70 justify-center">
        {/* <div className="p-10 w-full h-full items-center hidden lg:flex">
          <div
            id="ads"
            className="bg-transparent w-full h-3/4 rounded-md border-4 border-black"
          ></div>
        </div> */}
        <div className="flex flex-col justify-between col-start-2 items-center">
          <img
            src="./Logo.png"
            alt="Palavra Quente"
            width={350}
            className="mt-10"
          />
          <div
            className={`w-96 h-96 bg-white duration-500 ease-in-out grid-cols-1 grid items-center shadow-home rounded-lg justify-center hover:scale-[1.02] transition-transform border-4 border-black`}
          >
            <div className="flex gap-5 flex-col w-full items-center">
              <input
                required
                type="text"
                name=""
                id=""
                value={nick}
                onChange={(val) => {
                  setNick(val.target.value);
                }}
                placeholder="Nick"
                className="p-2 rounded-md border-2 border-black w-3/5"
              />
              <input
                required
                maxLength={7}
                type="text"
                name=""
                id=""
                placeholder="Código de Sala"
                value={code}
                onChange={(val) => {
                  setCode(val.target.value);
                }}
                className="p-2 rounded-md border-2 border-black w-3/5"
              />
              <button
                type="button"
                onClick={() => {
                  togglePopup(!popup);
                }}
                className="w-36 h-10 border-black border-2 rounded-md bg-emerald-400 hover:bg-emerald-500 transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={() => {
                  toggleCreate(!create);
                }}
                className="w-36 h-10 border-black border-2 rounded-md bg-cyan-400 hover:bg-cyan-500 transition-colors"
              >
                Criar Sala
              </button>
            </div>
          </div>
          <Dialog
            open={popup}
            onClose={() => {
              togglePopup(!popup);
            }}
            fullWidth
          >
            <div className="flex flex-col h-48 justify-evenly items-center">
              <h1 className="text-2xl">Por favor, insira a senha da sala:</h1>
              <input
                type="password"
                name=""
                id=""
                placeholder="Senha"
                value={pass}
                onChange={(val) => {
                  setPass(val.target.value);
                }}
                className="border-2 p-2 border-black rounded-md"
              />
              <button
                onClick={() => {
                  joinRoom(nick, code, pass);
                }}
                className="w-36 h-10 border-black border-2 rounded-md bg-emerald-400 hover:bg-emerald-500 transition-colors"
              >
                Entrar
              </button>
            </div>
          </Dialog>
          <Dialog
            open={create}
            onClose={() => {
              toggleCreate(!create);
            }}
            fullWidth
          >
            <div className="grid-cols-2 grid-rows-[50px] grid gap-5 h-72 justify-center items-center text-center">
              <h1 className="text-2xl col-start-1 col-end-3">Crie sua sala:</h1>
              <div className="col-start-1 w-full flex flex-col row-start-2 h-full justify-evenly items-center">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Nick"
                  value={nick}
                  onChange={(val) => {
                    setNick(val.target.value);
                  }}
                  className="border-2 p-2 border-black rounded-md"
                />
                <input
                  type="password"
                  name=""
                  id=""
                  placeholder="Crie uma senha"
                  value={pass}
                  onChange={(val) => {
                    setPass(val.target.value);
                  }}
                  className="border-2 p-2 border-black rounded-md"
                />
                <button
                  onClick={() => {
                    createRoom();
                  }}
                  className="w-36 h-10 border-black border-2 rounded-md bg-cyan-400 hover:bg-cyan-500 transition-colors"
                >
                  Criar Sala
                </button>
              </div>
              <div className="h-full items-center flex flex-col">
                <h1 className="font-bold text-lg">Atenção</h1>
                <p className="text-gray-500 text-md text-center w-3/4">
                  Caso o criador da sala saia durante a partida a sala se
                  fechará imediatamente!
                </p>
              </div>
            </div>
          </Dialog>
          <a
            href="https://ko-fi.com/W7W3IY93R"
            target="_blank"
            className="mb-5 font-semibold text-md text-black hover:scale-105 transition-transform"
          >
            Made with ❤ by: Matt
          </a>
        </div>
        {/* <div className="p-10 w-full h-full items-center hidden lg:flex">
          <div
            id="ads"
            className="bg-transparent w-full h-3/4 rounded-md border-4 border-black"
          ></div>
        </div> */}
      </div>
    </div>
  );
}
