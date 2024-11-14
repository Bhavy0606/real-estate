const handleLogin = (req, res) => {
  res.json({ message: "Login successful", credentials: { ...req.body } });
};

export default handleLogin;
