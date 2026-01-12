const getUserStats = async (req, res) => {
  try {
    // get users voted polls

    // get users 
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};

module.exports = { getUserStats };
