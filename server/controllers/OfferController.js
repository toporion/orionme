const Offer = require("../models/OfferModel");
const UserModel = require("../models/UserModel");

const createOrUpdateOffer = async (req, res) => {
    try {
        const { name, startDate, endDate, discountRange, isActive } = req.body;

        const existingOffer = await Offer.findOne();
        if (existingOffer) {
            existingOffer.name = name;
            existingOffer.startDate = startDate;
            existingOffer.endDate = endDate;
            existingOffer.discountRange = discountRange;
            existingOffer.isActive = isActive;
            await existingOffer.save();
        } else {
            const newOffer = new Offer({ name, startDate, endDate, discountRange, isActive });
            await newOffer.save();
        }

        res.status(200).json({ success: true, message: "Offer updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server problem" });
    }
};
// Validate Token API
const validateToken = async (req, res) => {
    try {
      const { email, token } = req.body;
  
      // Check if the user exists and has a valid token
      const user = await UserModel.findOne({ email });
      if (!user || user.token !== token) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }
  
      // Check if the associated offer is still active
      const offer = await Offer.findOne({ isActive: true });
      if (!offer || new Date(offer.endDate) < new Date()) {
        // Expire user's token if the offer is no longer valid
        user.token = null;
        user.discount = null;
        await user.save();
        return res.status(400).json({
          success: false,
          message: "The offer has expired. Token is no longer valid.",
        });
      }
  
      // Token is valid
      res.status(200).json({
        success: true,
        message: "Token is valid.",
        discount: user.discount, // Return the discount percentage
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  const useToken = async (req, res) => {
    try {
      const { email, token } = req.body;
  
      // Find the user with the provided email and token
      const user = await UserModel.findOne({ email, token });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid email or token",
        });
      }
  
      // Check if the user's offer is still valid
      const offer = await Offer.findById(user.offer);
      if (!offer || !offer.isActive || new Date() > new Date(offer.endDate)) {
        return res.status(400).json({
          success: false,
          message: "The token has expired or the offer is no longer valid.",
        });
      }
  
      // Mark the offer as used and deactivate the token
      offer.isActive = false;
      await offer.save();
  
      user.token = null; // Remove the token from the user
      user.discount = null; // Remove the discount as it is no longer valid
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Token has been successfully used.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  
  const getAllActiveOffers = async (req, res) => {
    try {
      const currentDate = new Date();
  
      // Find all active offers where endDate is in the future
      const activeOffers = await Offer.find({ 
        isActive: true, 
        endDate: { $gte: currentDate }
      });
  
      if (activeOffers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No active offers available",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Active offers retrieved successfully",
        data: activeOffers,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  

  const getActiveOfferByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user and populate their associated offer
      const user = await UserModel.findById(userId).populate("offer");
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Return the populated offer
      if (!user.offer) {
        return res.status(404).json({ success: false, message: "No offer associated with this user" });
      }
  
      res.status(200).json({
        success: true,
        message: "Active offer retrieved successfully",
        data: {
          discount: user.discount,  // Ensure the discount is being passed correctly
          startDate: user.offer.startDate,
          endDate: user.offer.endDate,
          isActive: user.offer.isActive,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  
  const getUsersWithOffers = async (req, res) => {
    try {
      const users = await UserModel.find()
        .populate('offer') // Populate the offer details
        .exec();
  
      res.status(200).json({
        success: true,
        message: "Users with their associated offers retrieved successfully",
        data: users,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  
  const updateUserOffer = async (req, res) => {
    try {
      const { userId } = req.params;
      const { offerId } = req.body; // The ID of the new offer to assign
  
      // Find the user by ID
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // Check if the new offer exists
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res.status(404).json({
          success: false,
          message: "Offer not found",
        });
      }
  
      // Update the user's offer
      user.offer = offerId;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "User's offer updated successfully",
        data: user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
    }
  };
  const getActiveUsersCount = async (req, res) => {
    try {
      const activeUsersCount = await UserModel.countDocuments({ offer: { $ne: null } });
      res.status(200).json({
        success: true,
        message: "Active users with offers retrieved successfully",
        data: { activeUsersCount },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  };
  
 
  // Toggle Offer Status
const toggleOfferStatus = async (req, res) => {
  try {
      const { offerId } = req.params;

      // Check if the offer exists
      const offer = await Offer.findById(offerId);
      if (!offer) {
          return res.status(404).json({
              success: false,
              message: "Offer not found",
          });
      }

      // Toggle the `isActive` status
      offer.isActive = !offer.isActive;
      await offer.save();

      res.status(200).json({
          success: true,
          message: `Offer ${offer.isActive ? "activated" : "deactivated"} successfully`,
          data: {
              offerId: offer._id,
              isActive: offer.isActive,
          },
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: "Failed to toggle offer status",
          error: error.message,
      });
  }
};



  
  
module.exports={createOrUpdateOffer,validateToken,useToken,
  getAllActiveOffers ,getActiveOfferByUserId,
  getUsersWithOffers,updateUserOffer,getActiveUsersCount,
  toggleOfferStatus
}