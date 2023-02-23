import { Tooltip } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("ws://palavra-quente-378622.rj.r.appspot.com:65080");

export default function Game() {
  interface user {
    name: String;
    id: String;
  }

  const [users, updateUsers] = useState([]);
  const [isOwner, setOwner] = useState(false);
  const [hasStarted, startMatch] = useState(false);
  const [letter, setLetter] = useState("");
  const [turnObj, setTurn] = useState<user>({ name: "", id: "" });
  const [guess, setGuess] = useState("");
  const [currentGuess, setCurGuess] = useState("");
  const letters = currentGuess.split("");
  const [colors, setColors] = useState([
    "white",
    "white",
    "white",
    "white",
    "white",
  ]);

  const params = useParams();
  const location = useLocation();

  const [data, setData]: any = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    try {
      console.log(location.state.user);

      axios
        .get(
          `https://palavra-quente-378622.rj.r.appspot.com/roomData?c=${params.id}`
        )
        .then((response) => {
          if (response.data.members >= 6) {
            alert("A Sala está cheia");
          } else {
            console.log(response);
            setData(response.data);

            if (location.state.user === response.data.owner) {
              setOwner(true);
            }
            //START SOCKET IO CONNECTIONS
            socket.emit("join", params.id, location.state.user);
          }
        });
    } catch (error) {
      navigate("/", { replace: true });
      alert("Você não está logado!");
    }

    socket.on("new user", (newUsers) => {
      updateUsers(newUsers);
    });

    socket.on("user left", (leftUser) => {
      // Remove the left user from the users array
      updateUsers((prevUsers) => {
        const newUsers = prevUsers.filter((user: any) => user.id !== leftUser);
        console.log("New users:", newUsers);
        return newUsers;
      });
    });

    return () => {
      socket.off("new user");
      socket.off("user left");
      socket.off("letters");
      socket.off("guess word");
    };
  }, []);

  //Game Logic
  socket.on("guess word", (foda, state, turn) => {
    console.log(foda, state, turn);

    setCurGuess(foda);
    setTurn(users[turn]);

    if (state) {
      setColors((prevColors) => {
        const newColors = new Array(prevColors.length).fill(
          "text-white border-white"
        );
        state.forEach((i: number) => {
          newColors[i] = "border-emerald-500 text-emerald-500";
        });
        return newColors;
      });
    } else {
      setColors((prevColors) => {
        const newColors = new Array(prevColors.length).fill(
          "border-red-500 text-red-500"
        );
        return newColors;
      });
    }
  });

  socket.on("letters", (letters, turn) => {
    setTurn(users[turn]);
    setLetter(letters);
    console.log(turnObj.name + "'s turn");
    console.log(users[turn]);
  });

  function startGame() {
    socket.emit("start", users, 0);

    startMatch(true);
    console.log(users);
  }

  return (
    <div className="w-full h-screen bg-[url('bg.png')] bg-cover">
      <div className="w-full h-screen bg-rose-500 bg-opacity-50 grid grid-cols-6 gap-2">
        <div className="w-full mt-10 mb-10 bg-slate-800 border-4 border-black rounded-xl col-start-2 xl:col-end-5 col-end-6 grid-rows-[auto_1fr_10%] justify-items-center grid">
          <div className="w-full bg-slate-600 rounded-t-lg h-16 font-bold grid grid-cols-2 items-center text-2xl border-b-4 border-black pl-5 pr-5">
            <div className="flex flex-col">
              <h1 className="text-white">🔥 Sala de {data.owner}</h1>
              <p className="text-slate-400 text-sm self-start ml-8">
                {users.length}/6
              </p>
            </div>
            <Tooltip title="Copiar Link!">
              <button
                onClick={() => {
                  console.log("fouda");
                }}
                className="justify-self-end text-gray-800 hover:scale-95 transition-all cursor-pointer"
              >
                🔒 *****
              </button>
            </Tooltip>
          </div>
          <div className="w-full h-full bg-slate-800 flex flex-col gap-5 justify-evenly items-center">
            <div className="bg-gray-700 p-5 rounded-xl">
              <h1 className="font-bold text-emerald-500 text-5xl">
                {letter.toLocaleUpperCase()}
              </h1>
            </div>
            <div className="bg-gray-700 p-5 rounded-xl flex flex-row gap-2">
              {letters.map((letter, index) => (
                <div
                  key={index}
                  className={`${
                    colors[index]
                  } border-solid w-12 h-16 flex items-center justify-center rounded-md bg-slate-800 font-bold text-xl border-b-8 transition duration-500 ease-in-out ${
                    index === 0 ? "" : `transition-delay-${index}s`
                  }`}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
            <div className="flex gap-5">
              {users.map((element: any, index) => (
                <div
                  className={`flex-col flex items-center w-20 transition-transform ${
                    element.name === turnObj.name ? "scale-125" : "scale-100"
                  }`}
                  key={index}
                >
                  <img
                    src={`https://api.dicebear.com/5.x/thumbs/svg?seed=${element.name}&backgroundType=solid`}
                    alt="Avatar"
                    className="w-14 rounded-lg border-[3px] border-white"
                  />

                  <p className="font-bold text-white text-center mt-3">
                    {element.name}
                  </p>
                </div>
              ))}
            </div>
            {isOwner === true && hasStarted === false && (
              <button
                onClick={() => {
                  startGame();
                }}
                className="disabled:bg-slate-500 relative w-56 h-10 rounded-lg font-bold border-4 border-black bg-emerald-400 hover:bg-emerald-500 transition-colors"
              >
                Começar Partida
              </button>
            )}
          </div>
          <div className="w-full rounded-b-lg justify-center flex items-center gap-7 border-t-4 border-black">
            <input
              id="guess"
              type="text"
              placeholder={
                location.state.user === turnObj.name
                  ? "Digite uma palavra!"
                  : `Vez de ${turnObj.name}`
              }
              disabled={location.state.user !== turnObj.name}
              maxLength={5}
              name=""
              value={guess}
              onChange={(val) => {
                setGuess(val.target.value);
              }}
              className="w-2/4 h-14 bg-slate-600 rounded-2xl p-5 border-4 border-black text-xl text-white outline-none"
            />
            <button
              onClick={() => {
                if (guess.length < 5) {
                  return false;
                }

                const indexNum = users.findIndex(
                  (x: any) => x.id === turnObj.id
                );

                const sfx = new Audio("/guess.ogg");
                sfx.playbackRate = 3;
                sfx.play();

                socket.emit(
                  "guess",
                  guess.toLocaleLowerCase(),
                  letter,
                  users.length === indexNum + 1 ? 0 : indexNum + 1
                );

                setGuess("");
              }}
              type="button"
              disabled={
                location.state.user !== turnObj.name || guess.length < 5
              }
              className="w-36 h-10 border-black border-4 disabled:bg-slate-500 rounded-md bg-emerald-400 hover:bg-emerald-500 transition-colors text-md font-bold"
            >
              Dar Palpite
            </button>
          </div>
        </div>
        <div className="w-full hidden mt-10 mb-10 bg-slate-800 border-4 border-black rounded-xl col-start-5 grid-rows-[auto_1fr_10%] xl:grid justify-center items-center">
          <p className="text-center font-bold text-slate-600 text-2xl w-56 row-start-2 opacity-50">
            😓 Chat em Desenvolvimento
          </p>
        </div>
      </div>
    </div>
  );
}
