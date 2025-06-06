const connectionModel = require("../models/connectionModel");
const User = require("../models/user");
//jitni bhi req ayi sab lao jp bhi mere me interest h
const requestReceived = async(req,res) => {
    try{
        const loggedInId = req.user._id;
        const data = await connectionModel.find({
            toUserId:loggedInId,
            status:"interested"
        }).populate("fromUserId","firstName lastName avatarUrl galleryUrls age gender skills about linkdlnUrl GithubUrl")
        res.status(200).json(data)
    }catch(e) {
        return res.status(401).json({
            success:false,
            message:e.message,
        })
    }
}
const connections = async(req,res) => {
    try{
        const loggedInId = req.user._id;
        const data = await connectionModel.find({
            $or:[
                {toUserId:loggedInId},
                {fromUserId:loggedInId},
            ],
            status:"accepted",
        }) .populate("fromUserId", "firstName lastName avatarUrl galleryUrls age gender skills about linkdlnUrl GithubUrl")
         .populate("toUserId", "firstName lastName avatarUrl galleryUrls age gender skills about linkdlnUrl GithubUrl"); // Also populate toUserId

        const finalData = data.map((row) => {
            const connectedUser = row.fromUserId._id.toString() === loggedInId.toString() 
                ? row.toUserId 
                : row.fromUserId;

            return {
                ...connectedUser._doc, // Spread user fields
                connectionUpdatedAt: row.updatedAt, // Add timestamp from connection document
            };
        });

        res.status(200).json(finalData)

    }catch(e) {
        return res.status(401).json({
            success:false,
            message:e.message,
        })
    }
}

const feed = async (req, res) => {
    const USER_SAFE_DATA = "firstName lastName about age skills avatarUrl galleryUrls GithubUrl linkdlnUrl";
    
    try {
        const loggedInUserId = req.user._id.toString(); // always exclude self
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50); // enforce max cap
        const skip = (page - 1) * limit;

        // Step 1: Fetch all connections involving current user
        const connectionRequests = await connectionModel.find({
            $or: [
                { fromUserId: loggedInUserId },
                { toUserId: loggedInUserId }
            ]
        }).select("fromUserId toUserId");

        // Step 2: Create Set of users to exclude from feed
        const hideUsersFromFeed = new Set([loggedInUserId]);
        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        // Step 3: Count total eligible users
        const totalEligibleUsers = await User.countDocuments({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        });

        // Step 4: Fetch users for current page
        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        // Step 5: Determine if more pages are available
        const hasMore = skip + users.length < totalEligibleUsers;

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
            hasMore
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error in getting feed"
        });
    }
};

module.exports = { requestReceived, connections, feed };
