const express = require('express');
const { Booking, User, Spot, Review, SpotImage, ReviewImage, Sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser, requireAuthRole } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete(
  '/:imageId', requireAuth, async (req, res, next) => {
    const { imageId } = req.params;
    const { user } = req;
    const image = await SpotImage.findByPk(imageId);

    if (!image) {
      res.status(404)
      return res.json({
        message: "Spot Image couldn't be found",
        statusCode: 404
      })
    }

    const spot = await Spot.findByPk(image.spotId)

    if( spot.ownerId === user.id) {
      await image.destroy()
      res.status(200)
      return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    } else {
      await requireAuthRole(req, res, next);
    }
  }
)




module.exports = router;
