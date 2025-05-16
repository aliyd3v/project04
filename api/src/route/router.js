import express from "express"
import userController from "../controller/user.js"
import categoryController from '../controller/category.js'
import mealController from '../controller/meal.js'
import authController from '../controller/auth.js'
import AppError from '../utils/appError.js'
import tableController from "../controller/table.js"
import orderController from "../controller/order.js"
import orderItemController from "../controller/orderItem.js"
import upload from "../helper/multer.js"

// Setup router.
const router = express.Router()

///////////////////////////////////////////////
//              PUBLIC ROUTES                //
///////////////////////////////////////////////

// Root request.
router.get('/', (req, res) => res.status(200).json({ message: `Hello, I'am Server!` }))

// Login.
router.post('/login', authController.login)

// Categories with meals.
router.get('/categories-with-meals', categoryController.getCategoriesWithMeals)

///////////////////////////////////////////////
//              PRIVATE ROUTES               //
///////////////////////////////////////////////

// User route.
router.route('/user')
    .post(authController.checkToken, authController.checkRoles('Admin'), userController.createOne)
    .get(authController.checkToken, authController.checkRoles('Admin'), userController.getAll)
router.route('/user/:id')
    .get(authController.checkToken, authController.checkRoles('Admin'), userController.getOne)
    .put(authController.checkToken, authController.checkRoles('Admin'), userController.updateOne)
    .patch(authController.checkToken, authController.checkRoles('Admin'), userController.changePassword)
    .delete(authController.checkToken, authController.checkRoles('Admin'), userController.deleteOne)
router.get('/check-token', authController.checkToken, authController.checkRoles('Admin', 'Chef', 'Cook', 'Waiter', 'Waitress'), userController.checkUser)

// Category route.
router.route('/category')
    .post(authController.checkToken, authController.checkRoles('Admin'), categoryController.createOne)
    .get(authController.checkToken, authController.checkRoles('Admin'), categoryController.getAll)
router.route('/category/:id')
    .get(authController.checkToken, authController.checkRoles('Admin'), categoryController.getOne)
    .put(authController.checkToken, authController.checkRoles('Admin'), categoryController.updateOne)
    .delete(authController.checkToken, authController.checkRoles('Admin'), categoryController.deleteOne)
router.put('/category/:id/change-status', authController.checkToken, authController.checkRoles('Admin'), categoryController.changeActive)

// Meal route.
router.route('/meal')
    .post(authController.checkToken, authController.checkRoles('Admin'), upload.single('image'), mealController.createOne)
    .get(authController.checkToken, authController.checkRoles('Admin'), mealController.getAll)
router.route('/meal/:id')
    .get(authController.checkToken, authController.checkRoles('Admin'), mealController.getOne)
    .put(authController.checkToken, authController.checkRoles('Admin'), upload.single('image'), mealController.updateOne)
    .delete(authController.checkToken, authController.checkRoles('Admin'), mealController.deleteOne)
router.put('/meal/:id/change-status', authController.checkToken, authController.checkRoles('Admin'), mealController.changeActive)

// Table route.
router.route('/table')
    .post(authController.checkToken, authController.checkRoles('Admin'), tableController.createOne)
    .get(authController.checkToken, authController.checkRoles('Admin', 'Waitress', 'Waiter'), tableController.getAll)
router.route('/table/:id')
    .get(authController.checkToken, authController.checkRoles('Admin'), tableController.getOne)
    .put(authController.checkToken, authController.checkRoles('Admin'), tableController.updateOne)
    .delete(authController.checkToken, authController.checkRoles('Admin'), tableController.deleteOne)

// Order route.
router.route('/order')
    .post(authController.checkToken, authController.checkRoles('Admin', 'Waiter', 'Waitress'), orderController.createOne)
    .get(authController.checkToken, authController.checkRoles('Admin', 'Chef', 'Cook', 'Waiter', 'Waitress'), orderController.getAll)
router.route('/order/:id')
    .get(authController.checkToken, authController.checkRoles('Admin', 'Chef', 'Cook', 'Waiter', 'Waitress'), orderController.getOne)
    .delete(authController.checkToken, authController.checkRoles('Admin', 'Chef', 'Cook', 'Waiter', 'Waitress'), orderController.deleteOne)

// Order-item route.
router.put('/order-item/:id/prepared', authController.checkToken, authController.checkRoles('Admin', 'Chef', 'Cook',), orderItemController.changeToPrepared)
router.put('/order-item/:id/delivered', authController.checkToken, authController.checkRoles('Admin', 'Chef', 'Cook',), orderItemController.changeToDelivered)

// Handle not found route.
router.use('*', (req, res, next) => { next(new AppError(404, 'fail', 'Undefined route!')) })

export default router