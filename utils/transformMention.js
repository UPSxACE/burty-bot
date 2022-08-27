module.exports = (mention) => {
  if (mention[0] === '<') {
    if (mention[2] === '!') {
      return mention.splice(2, 1).slice(2, -1);
    }
    return mention.slice(2, -1);
  } else {
    return mention;
  }
};
