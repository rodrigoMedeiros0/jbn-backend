const Building = require("../models/Building");

const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const createBuilding = async (req, res) => {
  try {
    const {
      name,
      status,
      description,
      differential,
      address,
      size,
      bedroom,
      bathroom,
      garage,
      location,
      city,
      uf,
    } = req.body;

    if (
      !status ||
      !description ||
      !address ||
      !differential ||
      !size ||
      !bedroom ||
      !bathroom ||
      !name ||
      !garage ||
      !location ||
      !city ||
      !uf
    ) {
      return res
        .status(400)
        .json({ message: "Todos os campo são obrigatórios" });
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
      // loop through every file from files request
      for (const file of req.files) {
        // destructuring path of every file
        const { path } = file;
        // saving result
        const result = await cloudinary.uploader.upload(path);
        attachments.push({
          url: result.secure_url,
          cloudinary_id: result.public_id,
        });
      }
    }

    const building = new Building({
      name,
      status,
      description,
      differential,
      address,
      size,
      bedroom,
      bathroom,
      garage,
      location,
      city,
      uf,
      gallery: attachments,
    });
    await building.save();

    res
      .status(200)
      .json({ building, message: "Empreendimento salvo com sucesso" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro ao criar empreendimento" + err });
  }
};

const getAllBuilding = async (req, res) => {
  try {
    const building = await Building.find();

    res.status(200).json(building);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar dados dos empreendimentos" });
  }
};

const getBuildingById = async (req, res) => {
  const id = req.params.id;

  let building;

  try {
    building = await Building.findById(id);
    res.status(200).json({ building });
  } catch (err) {
    res.status(500).json({
      message:
        "Não foi possível localizar os dados desse empreendimento, verifique se ele existe",
    });
  }
};

const removeBuilding = async (req, res) => {
  const buildingId = req.params.id;

  try {
    const building = await Building.findById(buildingId);
    if (!building) {
      return res.status(404).json({ message: "Empreendimento não encontrado" });
    }

    const multipleDelete = async (id) => {
      // use cloudinary.uploader.destroy() to delete image from cloudinary
      await cloudinary.uploader.destroy(id);
    };

    const images = building.gallery;
    images.forEach((element) => {
      // console.log(element.cloudinary_id)
      multipleDelete(element.cloudinary_id);
    });

    await building.deleteOne();

    res.status(200).json({ message: "Empreendimento excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar empreendimento" + error });
  }
};

const updateBuilding = async (req, res) => {
  try {
    const {
      name,
      status,
      description,
      differential,
      address,
      size,
      bedroom,
      bathroom,
      garage,
      location,
      city,
      uf,
    } = req.body;
  } catch (error) {
    res.status(422).json({ message: "Preencha todos os campos" });
  }

  const id = req.params.id;

  const building = {
    name: req.body.name,
    status: req.body.status,
    description: req.body.description,
    differential: req.body.differential,
    address: req.body.address,
    size: req.body.size,
    bathroom: req.body.bathroom,
    bedroom: req.body.bedroom,
    garage: req.body.garage,
    location: req.body.location,
    city: req.body.city,
    uf: req.body.uf,
  };

  try {
    const updateBuilding = await Building.updateOne({ _id: id }, building);

    res.status(200).json({ message: "Empreendimento atualizado" });
  } catch (err) {
    res.status(422).json({
      message:
        "Não foi possível atualizar esse empreendimento, verifique se todos os",
    });
  }
};

exports.createBuilding = createBuilding;
exports.getAllBuilding = getAllBuilding;
exports.getBuildingById = getBuildingById;
exports.removeBuilding = removeBuilding;
exports.updateBuilding = updateBuilding;
