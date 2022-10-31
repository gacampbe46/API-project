const express = require('express');
const { Booking, User, Spot, Review, SpotImage, ReviewImage, Sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser, requireAuthRole } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.get(
  '/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const BookingsAll = await Booking.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Spot,
          attributes: {
            exclude: ["description", "createdAt", "updatedAt"]
          },
          include: [
            {
              model: SpotImage
            }
          ]
        }
      ]
    })

    let Bookings = [];
    BookingsAll.forEach(spot => {
      Bookings.push(spot.toJSON())
    })

    Bookings.forEach(spot => {
      spot.Spot.SpotImages.forEach(image => {
        if (image.preview === true) {
          spot.Spot.previewImage = image.url
        }
        if (image.preview === false) {
          spot.Spot.previewImage = 'no preview image'
        }
      })
      delete spot.Spot.SpotImages
    })
    res.json({ Bookings })
  })

router.put(
  '/:bookingId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingId)

    if (!booking) {
      res.status(404)
      return res.json({
        message: "Booking couldn't be found",
        statusCode: 404
      })
    }

    const parsedStart = Date.parse(startDate)
    const parsedEnd = Date.parse(endDate)

    if (parsedEnd <= parsedStart) {
      res.status(400)
      return res.json({
        message: "Validation error",
        statusCode: 400,
        errors: "endDate cannot be on or before startDate"
      })
    }

    const today = new Date()
    const parsedToday = Date.parse(today)
    const oldEndDate = Date.parse(booking.endDate)
    if (parsedToday > oldEndDate) {
      res.status(403)
      return res.json({
        message: "Past bookings can't be modified",
        statusCode: 403
      })
    }

    const currentBooking = await Booking.findAll({
      where: { spotId: booking.spotId }
    })

    let allBookings = [];
    currentBooking.forEach(booking => {
      allBookings.push(booking.toJSON())
    })

    allBookings.forEach(booking => {
      const start = Date.parse(booking.startDate)
      const end = Date.parse(booking.endDate)
      if (start <= parsedStart < end && (parsedEnd <= end && parsedEnd > start)) {
        res.status(403)
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          statusCode: 403,
          errors: [
            "Start date conflicts with an existing booking",
            "End date conflicts with an existing booking"
          ]
        })
      }
    })

    if (booking.userId = user.id) {
      await booking.update(
        { startDate, endDate }
      )
      return res.json(booking)
    }
  })

  router.delete(
    '/:bookingId', requireAuth, async (req, res, next) => {
      const { bookingId } = req.params;
      const { user } = req;
      const booking = await Booking.findByPk(bookingId)

      if (!booking) {
        res.status(404)
        return res.json({
          message: "Booking couldn't be found",
          statusCode: 404
        })
      }

      const today = new Date()
      const parsedToday = Date.parse(today)
const parsedStart = Date.parse(booking.startDate)
if (parsedStart < parsedToday) {
  res.status(403)
  return res.json({
    message: "Bookings that have been started can't be deleted",
    statusCode: 403
  })
}



      const spot = await Spot.findByPk(booking.spotId)
      if (booking.userId === user.id || spot.ownerId === user.id) {
        await booking.destroy()
        res.status(200)
        return res.json({
          "message": "Successfully deleted",
          "statusCode": 200
        })
      } else {
        await requireAuthRole(req, res, next);
      }

    })








module.exports = router;
