import IMember from "./IMember";

export class Room {
  name: string;
  admin: IMember;
  members: IMember[] = [];

  constructor(roomName: string, roomAdmin: IMember) {
    this.name = roomName;
    this.admin = roomAdmin;
    this.members.push(roomAdmin);
  }

  addMember(newMember: IMember) {
    this.members.find((m) => m == newMember);
  }
}

export let rooms: Room[];
