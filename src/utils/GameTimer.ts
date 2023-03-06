import { Socket } from "socket.io-client";

export default function countDown(timer: number, socket: Socket) {
  console.log(timer);

  let countdownInterval = setInterval(() => {
    timer--;

    if (timer <= 0) {
      console.log("TIME'S UP!!!");
      clearInterval(countdownInterval);
      socket.emit("timer-ended", "Timer has ended");
    }
  }, 1000);

  socket.on("stop timer", () => {
    console.log("STOPPED");

    clearInterval(countdownInterval);
  });
}
