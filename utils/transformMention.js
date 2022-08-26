module.exports = (mention) => {
  if (mention[2] === '!') {
    mention = mention.splice(2, 1);
  }
  return mention.slice(2, -1);
};
