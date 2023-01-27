exports.calcReadingTime = (body) => {

    if (!body) {
        throw new Error('body cannot be empty')
    }

    const wordCount = body.split(" ").length;
    const averageTime = Math.round(wordCount / 200); 
    if (averageTime < 1) {
        return '< 1 min'
    } else {
        return `${averageTime} mins`
    }
  }