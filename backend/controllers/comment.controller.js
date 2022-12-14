const {commentService, userService, restaurantService} = require("../services");
const {statusCode} = require("../constants");

module.exports = {
    createComment: async (req, res, next) => {
        try {
            const {_id} = req.tokenInfo.user;
            const {restId} = req.query;

            const userComments = await commentService.getCommentsByParams({user: _id});
            const restaurantComments = await commentService.getCommentsByParams({restaurant: restId});

            const comment = await commentService.createComment({...req.body, user: _id, restaurant: restId});

            await userService.updateUser(_id, {
                comments: [
                    ...userComments,
                    comment
                ]
            });

            await restaurantService.updateRestaurant(restId, {
                comments: [
                    ...restaurantComments,
                    comment
                ]
            });

            res.status(statusCode.CREATE).json(comment)

        } catch (e) {
            next(e)
        }
    },
    getComments: async (req, res, next) => {
        try {
            const comments = await commentService.getComments();
            res.json(comments)

        } catch (e) {
            next(e)
        }
    },
    getCommentById: async (req, res, next) => {
        try {
            const {comId} = req.params;
            const comment = await commentService.getCommentById(comId);
            res.json(comment)
        } catch (e) {
            next(e)
        }
    },
    updateComment: async (req, res, next) => {
        try {
            const {comId} = req.params;
            const comment = await commentService.updateComment(comId, req.body);
            res.json(comment)
// TODO обновити в юзерів і ресторанів
        } catch (e) {
            next(e)
        }
    },
    deleteComment: async (req, res, next) => {
        try {
            const {comId} = req.params;
            await commentService.deleteComment(comId);
            res.status(statusCode.NO_CONTENT)
// TODO обновити в юзерів і ресторанів
        } catch (e) {
            next(e)
        }
    }
}
