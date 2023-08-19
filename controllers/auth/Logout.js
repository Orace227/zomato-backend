exports.logout = async (req, res) => {
  try {
    res.clearCookie("token").status(200).json("successfully token deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
