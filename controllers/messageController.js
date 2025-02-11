module.exports.sendPrivateMessage = (users, data, currentUserId) => {
  const { recipientId, text } = data;

  if (users[recipientId]) {
    const message = JSON.stringify({
      type: 'private_message',
      user: currentUserId,
      text: text
    });
    users[recipientId].send(message);
  } else {
    console.log(`Utilisateur ${recipientId} non connecté.`);
  }
};
