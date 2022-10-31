const express = require('express');
const { Booking, User, Spot, Review, SpotImage, ReviewImage, Sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser, requireAuthRole } = require('../../utils/auth');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateSpotCreate = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    // .isLength({ min: 4 })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];

// router.get(
//   '/', async (req, res) => {

//     let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

//     if (!page) page = 1;
//     if (!size) size = 20;

//     page = parseInt(page);
//     size = parseInt(size);


//     if (page >= 1 && size >= 1) {
//       query.limit = size;
//       offset = size * (page - 1);
//     }

//     const spotsLists = await Spot.findAll({
//       attributes: {
//         include: [
//           [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
//         ]
//       },
//       group: ['Spot.id', 'SpotImages.id'], //need more info
//       include: [
//         {
//           model: SpotImage,
//         },
//         {
//           model: Review,
//           attributes: []
//         }],
//     });

//     let Spots = [];
//     spotsLists.forEach(spot => {
//       Spots.push(spot.toJSON())
//     })

//     Spots.forEach(spot => {
//       spot.SpotImages.forEach(image => {
//         if (image.preview === true) {
//           spot.previewImage = image.url
//         }
//       })
//       if (!spot.previewImage) {
//         spot.previewImage = 'no preview image'
//       }
//       delete spot.SpotImages
//     })


//     return res.json({ Spots, page, size })
//   }
// );


// router.get(
//   '/', async (req, res) => {

//     let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

//     if (!page) page = 1;
//     if (!size) size = 20;

//     page = parseInt(page);
//     size = parseInt(size);


//     // if (page >= 1 && size >= 1) {
//     //   query.limit = size;
//     //   offset = size * (page - 1);
//     // }

//     const Spots = await Spot.findAll({
//       attributes: {
//         include: [
//           [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
//         ]
//       },
//       group: ['Spot.id'], //need more info
//       include: [
//         {
//           model: SpotImage,
//         },
//         {
//           model: Review,
//           attributes: []
//         }],
//     });


//     const spots = await Spot.findAll()
//     const Spotss = spots.forEach(spot => {
//     spot.dataValues.something = "ddd"
//     })
//     // let Spots = [];
//     // spotsLists.forEach(spot => {
//     //   Spots.push(spot.toJSON())
//     // })

//     // Spots.forEach(spot => {
//     //   //spot.SpotImages.forEach(image => {
//     //     //if (image.preview === true) {
//     //       const spott = spot.toJSON()
//     //       spott.previewImage = '1'
//     //   //  }
//     //   //})
//     //   // if (!spot.previewImage) {
//     //   //   spot.previewImage = 'no preview image'
//     //   // }
//     //   delete spot.SpotImages
//    // })


//     return res.json(Spotss)

//   });
const validateGetAllSpotsQueries = [
  query("page")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Page must be greater than or equal to 0"),
  query("size")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Size must be greater than or equal to 0"),
  query("maxLat")
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  query("minLat")
    .optional()
    .isDecimal()
    .withMessage("Minimum latitude is invalid"),
  query("maxLng")
    .optional()
    .isDecimal()
    .withMessage("Maximum longitude is invalid"),
  query("minLng")
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
  query("maxPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Size must be greater than or equal to 0"),
  query("minPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Size must be greater than or equal to 0"),
  handleValidationErrors,
];



router.get(
  '/', validateGetAllSpotsQueries, async (req, res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    if (!page) page = 1;
    if (!size) size = 20;

    page = parseInt(page);
    size = parseInt(size);

    let limit = size;
    let offset = size * (page - 1);

    const where = {}

    if (maxLat) where.lat = { [Op.lte]: Number(maxLat) };
    if (minLat) where.lat = { [Op.gte]: Number(minLat) };
    if (maxLng) where.lng = { [Op.lte]: Number(maxLat) };
    if (minLng) where.lng = { [Op.gte]: Number(minLng) };
    if (maxPrice) where.price = { [Op.lte]: Number(maxPrice) };
    if (minPrice) where.price = { [Op.gte]: Number(minPrice) };

    const spotsLists = await Spot.findAll({
      // attributes: {
      //   include: [
      //     [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
      //   ]
      // },
      limit,
      offset,
      group: ['Spot.id'], //need more info
      include: [
        {
          model: SpotImage,
        },
        {
          model: Review,
          attributes: []
        }],
    });

    let Spots = [];
    spotsLists.forEach(spot => {
      Spots.push(spot.toJSON())
    })

    const allreviews = await Review.findAll()
    Spots.forEach(spot => {


      const thisId = spot.id

      let reviews = [];
      allreviews.forEach(review => {
        if (review.spotId === thisId) {
          reviews.push(review.toJSON())
        }
      })

      let count = reviews.length
      let sum = 0
      reviews.forEach(review => {
        sum += review.stars
      })
      spot.avgRating = sum / count






      spot.SpotImages.forEach(image => {
        if (image.preview === true) {
          spot.previewImage = image.url
        }
      })
      if (!spot.previewImage) {
        spot.previewImage = 'no preview image'
      }
      delete spot.SpotImages
    })
    return res.json({ Spots, page, size })
  }
);



router.post(
  '/', requireAuth, validateSpotCreate, async (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const existLats = await Spot.findAll({ where: { lat } });

    if (existLats) {
      existLats.forEach(existLat => {
        if (existLat.lng === lng) {
          res.status(400)
          return res.json({
            message: "Lat&lng combination already exists",
            statusCode: 400
          })
        }
      })
    }
    const spot = await Spot.create({ ownerId: user.id, address, city, state, country, lat, lng, name, description, price });
    res.status(201)
    return res.json(spot)
  });

router.post(
  '/:spotId/images', requireAuth, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    if (spot.ownerId === user.id) {
      const newImage = await SpotImage.create({ spotId, url, preview })

      return res.json({
        id: newImage.id,
        url,
        preview
      })
    } else {
      await requireAuthRole(req, res, next);
    }
  });

router.get(
  '/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const spotsAll = await Spot.findAll({
      attributes: {
        include: [
          [Sequelize.fn("AVG", Sequelize.col("stars")), "avgRating"],
        ]
      },
      where: { ownerId: user.id },
      group: ['Spot.id', 'SpotImages.id'], //need more info
      include: [
        {
          model: SpotImage,
        },
        {
          model: Review,
          attributes: []
        }],
    });

    let Spots = [];
    spotsAll.forEach(spot => {
      Spots.push(spot.toJSON())
    })

    Spots.forEach(spot => {
      spot.SpotImages.forEach(image => {
        if (image.preview === true) {
          spot.previewImage = image.url
        }
      })
      if (!spot.previewImage) {
        spot.previewImage = 'no preview image'
      }
      delete spot.SpotImages
    })
    return res.json({ Spots })
  }
);

router.get(
  '/:spotId', async (req, res, next) => {

    const { spotId } = req.params;

    const spots = await Spot.findByPk(spotId, {
      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("review")), "numReviews"],
          [Sequelize.fn("AVG", Sequelize.col("stars")), "avgStarRating"]
        ]
      },
      group: ['Spot.id', 'SpotImages.id', 'User.id'], //need more info
      include: [
        {
          model: SpotImage,
          attributes: ["id", "url", "preview"]
        },
        {
          model: Review,
          attributes: []
        },
        {
          model: User
        }
      ],
    });

    if (!spots) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    const Owner = await User.findOne({
      where: { id: spots.ownerId },
      attributes: ["id", "firstName", "lastName"]
    })

    let spotsWithOwner = [];
    spotsWithOwner.push(spots.toJSON())

    spotsWithOwner.forEach(spot => {
      spot.Owner = Owner
      delete spot.User
    })
    return res.json(spotsWithOwner[0])
  });

router.put(
  '/:spotId', requireAuth, validateSpotCreate, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }
    const existLats = await Spot.findAll({ where: { lat } });

    // if (existLats) {
    //   existLats.forEach(existLat => {
    //     if (existLat.lng === lng) {

    //       if(existLat.lng.toString() === spotId) {
    //         res.status(400)
    //         return res.json({
    //         message: "Lat&lng combination already exists",
    //         statusCode: 400
    //       })
    //     }
    //     }
    //   })
    // } else
    if (spot.ownerId === user.id) {
      await spot.update(
        { address, city, state, country, lat, lng, name, description, price }
      )
      return res.json(spot)
    } else {
      await requireAuthRole(req, res, next);
    }
  });

const validateReviewCreate = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .custom((value) => value <= 5 && value >= 1)
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

router.post(
  '/:spotId/reviews', requireAuth, validateReviewCreate, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId)

    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    const existedReview = await Review.findOne({
      where: { spotId, userId: user.id }
    })
    if (existedReview) {
      res.status(403)
      return res.json({
        message: "User already has a review for this spot",
        statusCode: 403
      })
    }
    const newReview = await Review.create({
      spotId,
      userId: user.id,
      review,
      stars
    })

    const theNewReview = await Review.findOne({
      attributes: ["id", "userId", "spotId", "review", "stars", "createdAt", "updatedAt"],
      where: { spotId, userId: user.id }
    })
    res.status(201)
    return res.json(theNewReview)
  })

router.delete(
  '/:spotId', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    if (spot.ownerId === user.id) {
      await spot.destroy()
      res.status(200)
      return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
    } else {
      await requireAuthRole(req, res, next);
    }
  })


router.get(
  '/:spotId/reviews', async (req, res, next) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(spotId)
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    const Reviews = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"]
        }
      ]
    })
    return res.json({ Reviews })
  })

router.get(
  '/:spotId/bookings', requireAuth, async (req, res, next) => {
    const { spotId } = req.params;
    const { user } = req;

    const spot = await Spot.findByPk(spotId)
    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }
    //not the owner of the spot
    if (spot.ownerId !== user.id) {
      const Bookings = await Booking.findAll({
        attributes: ["spotId", "startDate", "endDate"],
        where: { spotId },
      })
      return res.json({ Bookings })
    }

    // as the owner of the spot
    if (spot.ownerId === user.id) {
      const Bookings = await Booking.findAll({
        where: { spotId },
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"]
          }
        ]
      })
      return res.json({ Bookings })
    }
  })

router.post(
  '/:spotId/bookings', async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      res.status(404)
      return res.json({
        message: "Spot couldn't be found",
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

    const currentBooking = await Booking.findAll({
      where: { spotId }
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

    const newBooking = await Booking.create({ spotId, userId: user.id, startDate, endDate })

    return res.json(newBooking)

  })




module.exports = router;
