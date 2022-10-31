const express = require('express');
const { User, Spot, Review, SpotImage, ReviewImage, Sequelize } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser, requireAuthRole } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.post(
  '/:reviewId/images', requireAuth, async (req, res, next) => {
    const { user } = req;
    const { reviewId } = req.params;
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      res.status(404)
      return res.json({
        message: "Review couldn't be found",
        statusCode: 404
      })
    }

    const allImages = await ReviewImage.findAll({ where: { reviewId } })

    if (allImages.length > 3) {
      res.status(403)
      return res.json({
        message: "Maximum number of images for this resource was reached",
        statusCode: 403
      })
    }

    if (review.userId === user.id) {
      const newImage = await ReviewImage.create({ reviewId, url })
      return res.json({
        id: newImage.id,
        url
      })
    } else {
      await requireAuthRole(req, res, next);
    }
  });

router.get(
  '/current', requireAuth, async (req, res, next) => {
    const { user } = req;

    const reviewsAll = await Review.findAll({
      where: { userId: user.id },
      //group: ['Spot.id', 'Review.id', 'User.id'],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]
        },
        {
          model: Spot,
          attributes: {
            exclude: ["description", "createdAt", "updatedAt"]
          },
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"]
        }
      ],
    });

    let Reviews = []
    reviewsAll.forEach(review => {
      Reviews.push(review.toJSON())
    })

    Reviews.forEach(review => {
      review.ReviewImages.forEach(image => {
        review.Spot.previewImage = image.url
      })
      if (!review.ReviewImages[0]) {
        review.Spot.previewImage = 'no preview image'
      }
    })
    return res.json({ Reviews })
  })


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

router.put(
  '/:reviewId', requireAuth, validateReviewCreate, async (req, res, next) => {
    const { user } = req;
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    const reviewById = await Review.findByPk(reviewId)

    if (!reviewById) {
      res.status(404)
      return res.json({
        message: "Review couldn't be found",
        statusCode: 404
      })
    }

    if (reviewById.userId === user.id) {
      await reviewById.update(
        { review, stars }
      )
      return res.json(reviewById)
    } else {
      await requireAuthRole(req, res, next);
    }
  });


router.delete(
  '/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;
    const { user } = req;
    const review = await Review.findByPk(reviewId)

    if (!review) {
      res.status(404)
      return res.json({
        message: "Review couldn't be found",
        statusCode: 404
      })
    }

    if (review.userId === user.id) {
      await review.destroy()
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
