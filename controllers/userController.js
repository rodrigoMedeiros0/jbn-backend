const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const getUsers = async (req, res) => {
  try {
    const user = await User.find().select("-password");

    if (!user) {
        res.status(404).json({message: "Não foi possivel encontrar usuários no sistema, tente novamente"})
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar os dados dos usuários" });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  //    validations
  if (!name) {
    return res.status(422).json({ message: "O nome é obrigatório!" });
  }

  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatória!" });
  }

  if (password != confirmPassword) {
    return res
      .status(422)
      .json({ message: "A senha e a confirmação precisam ser iguais!" });
  }

  //    check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({
      message:
        "Email já cadastrado, por favor faça login com o email existente",
    });
  }

  //    create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  //    create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  // validations
  if (!email) {
    return res.status(422).json({ message: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ message: "A senha é obrigatório!" });
  }

  // check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  // checks if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ message: "Senha inválida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    const userData= {
      email: user.email,
      name: user.name,
      id: user.id,
    }
    res
      .status(200)
      .json({ message: "Autenticação realizada com sucesso!", userData, token });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erro inesperado, por favor tente novamente mais tarde",
      });
  }
};

exports.createUser = createUser;
exports.userLogin = userLogin;
exports.getUsers = getUsers;