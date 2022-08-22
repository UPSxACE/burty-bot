async function generateInvite(repliableObj, gameName, challengedPersonId) {
  const challengedPerson = await repliableObj.client.users.fetch(
    challengedPersonId
  );
  let user = null;
  if (repliableObj.type === 0) {
    user = repliableObj.author.id;
  } else {
    user = repliableObj.user.id;
  }
  repliableObj.reply(
    `<@${user}> invited you, <@${challengedPerson.id}>, for a ${gameName} match!`
  );
}

module.exports = async (
  gameId,
  repliableObj,
  challengedPersonId,
  effectFunction
) => {
  switch (gameId) {
    case 0:
      await generateInvite(
        repliableObj,
        'Rock Paper Scissors',
        challengedPersonId
      );
      break;
    default:
      console.log('Error CODE 9008');
      break;
  }
};
