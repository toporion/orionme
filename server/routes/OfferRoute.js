const {createOrUpdateOffer, validateToken, useToken,getActiveOfferByUserId, getUsersWithOffers, updateUserOffer, getActiveUsersCount, getActiveOffer, getAllActiveOffers, toggleOfferStatus} = require('../controllers/OfferController');
const validateOffer = require('../middlewares/OfferValidation');


const route=require('express').Router()

route.post('/',validateOffer,createOrUpdateOffer)
route.post('/validToken',validateToken)
route.post('/use-token', useToken);
route.get('/allActiveOffers', getAllActiveOffers);
route.get('/activeOffer/:userId',getActiveOfferByUserId);
route.get('/usersWithOffers', getUsersWithOffers);
route.put('/updateUserOffer/:userId', updateUserOffer);
route.get('/analytics/active-users', getActiveUsersCount);
// Route to toggle offer status
route.patch("/toggleOffer/:offerId", toggleOfferStatus);





module.exports=route;