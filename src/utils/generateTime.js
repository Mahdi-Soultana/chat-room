const generateTime = (username,message) => ({username,message,createdAt: new Date().getTime()});

const generateTimeLocation=(username,location)=>({username,location,createdAt:new Date().getTime()});

module.exports={generateTime,generateTimeLocation};