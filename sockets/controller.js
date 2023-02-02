import { validateJWT } from "../helpers/generar-jwt.js";
import { ChatMsg } from "../models/chat-msg.js";

const chatMsgs = new ChatMsg();

export const socketController = async (socket, io) => {
  
  // se valida el JWT del cliente que se conecto
  const user = await validateJWT(socket.handshake.headers['x-token'])

  if (!user ){
    return socket.disconnect();
  }

  // Agregar el usuario conectado
  chatMsgs.connectUser(user);

  io.emit('active-users', chatMsgs.usersArr);

  socket.emit('recv-msg', chatMsgs.last10);

  // Conectarlo a una sala especial
  socket.join(user.id);// global, socket.id, user.id

  socket.on('disconnect', () => {
    chatMsgs.disconnectUser(user.id);
    io.emit('active-users', chatMsgs.usersArr);
  });

  socket.on('send-msg', ({uid, msg}) => {

    if (uid) {
      // Msg privado
      socket.to(uid).emit('priv-msg',{ from: user.name, msg });
    } else {
      chatMsgs.sendMsg(user.id, user.name, msg);
      io.emit('recv-msg', chatMsgs.last10);

    }

  })

}
