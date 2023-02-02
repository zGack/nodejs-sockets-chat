class Message {
  constructor(uid, name, msg) {
    this.uid = uid;
    this.name = name;
    this.msg = msg;
  }
}

export class ChatMsg {

  constructor() {
    this.msgs = [];
    this.users = {};
  }

  get last10() {
    this.msgs = this.msgs.splice(0,10);
    return this.msgs;
  }

  get usersArr() {
    return Object.values(this.users);
  }

  sendMsg(uid, name, msg) {
    this.msgs.unshift(
      new Message(uid, name, msg)
    );
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  disconnectUser(id) {
    delete this.users[id];
  }

}