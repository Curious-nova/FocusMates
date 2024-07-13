import { Socket } from "socket.io";
import IMember from "./IMember";
import { Room, rooms } from "./room";

export default class Controller {
  private socket: Socket;
  private doLogging: boolean = true;

  constructor(socket: Socket) {
    console.log(`${socket.id} connected`);
    this.socket = socket;

    this.initEvents();
  }

  private log(content: string) {
    if (this.doLogging) {
      console.log("(LOG)", content);
    }
  }

  private initEvents() {
    this.socket.on("echo", (msg: string) => this.echo(msg));
    this.socket.on("setName", (name: string) => this.setName(name));
    this.socket.on("getName", () => this.getName());
    this.socket.on("createRoom", (rn: string) => this.createRoom(rn));
    this.socket.on("joinRoom", (rn: string) => this.joinRoom(rn));
  }

  private echo(msg: string) {
    this.log(`Echo: ${msg}`);
    this.socket.send(msg);
  }

  private setName(name: string) {
    this.log(`Set name: ${name}`);
    this.socket.data.name = name;
  }

  private getName() {
    this.log("Get name");
    this.socket.send(this.socket.data.name);
  }

  private createRoom(roomName: string) {
    this.log(`Create Room: ${roomName}, user: ${this.socket.data.name}`);

    let room = rooms.find((room) => room.name === roomName);
    if (room) {
      this.socket.send("A room with this name already exists.");
    } else {
      rooms.push(
        new Room(roomName, {
          name: this.socket.data.name,
          id: this.socket.id,
        }),
      );

      this.socket.join(roomName);
      this.socket.send("Success");
    }
  }

  private joinRoom(roomName: string) {
    this.log(`Join room ${roomName}, user: ${this.socket.data.name}`);
    let room = rooms.find((room) => room.name === roomName);
    if (room) {
      room.addMember({
        name: this.socket.data.name,
        id: this.socket.id,
      });

      this.socket.join(roomName);
      this.socket.send("Success");
    } else {
      this.socket.send("No such room exists.");
    }
  }
}
