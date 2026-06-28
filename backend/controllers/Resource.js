const SubSection = require("../models/SubSection");
const cloudinary = require("cloudinary").v2;

const uploadResourceToCloudinary = async (file, folder, originalName) => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
  return await cloudinary.uploader.upload(file.tempFilePath, {
    folder,
    resource_type: "raw",
    public_id: nameWithoutExt,
    use_filename: true,
    unique_filename: true,
    timeout: 120000,
  });
};

exports.addResource = async (req, res) => {
  try {
    const { subsectionId, name } = req.body;
    const file = req.files?.resource;

    if (!subsectionId || !file || !name) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const uploaded = await uploadResourceToCloudinary(file, process.env.CLOUDINARY_FOLDER_NAME, file.name);

    // Get file extension from original filename
    const ext = file.name.split(".").pop();
    const displayName = name.includes(".") ? name : `${name}.${ext}`;

    const subsection = await SubSection.findByIdAndUpdate(
      subsectionId,
      { $push: { resources: { name: displayName, url: uploaded.secure_url } } },
      { new: true }
    );

    if (!subsection) return res.status(404).json({ success: false, message: "Lecture not found" });
    return res.status(200).json({ success: true, data: subsection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const { subsectionId, resourceId } = req.body;

    const subsection = await SubSection.findByIdAndUpdate(
      subsectionId,
      { $pull: { resources: { _id: resourceId } } },
      { new: true }
    );

    if (!subsection) return res.status(404).json({ success: false, message: "Lecture not found" });
    return res.status(200).json({ success: true, data: subsection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
