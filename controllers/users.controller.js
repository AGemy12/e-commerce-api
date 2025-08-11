import { asyncWrapper } from "../middlewares/asyncWrapper.js";
import User from "../model/user.model.js";
import httpStatusText from "../utils/httpStatusText.js";

export const getAllUsers = asyncWrapper(async (req, res) => {
  const { name, email, limit = 10, page = 1 } = req.query;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (email) {
    query.email = { $regex: email, $options: "i" };
  }

  const [users, total] = await Promise.all([
    User.find(query, { __v: 0, password: 0 })
      .limit(limitNum)
      .skip(skip)
      .lean()
      .then((docs) =>
        docs.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }))
      ),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      users: users,
      meta: {
        total,
        lastPage: Math.ceil(total / limitNum),
        page: +page,
        limit,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    },
  });
});
