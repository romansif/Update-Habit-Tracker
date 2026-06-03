import { usersService } from "../services/users.service.js";

export const usersController = {
    async editUser (req, res, next) {
        try{
            const records = usersService.editUser(req.user.userId, req.params.habitId);
            res.json(records);
        } catch (error) {
            next(error);
        }
    }
}