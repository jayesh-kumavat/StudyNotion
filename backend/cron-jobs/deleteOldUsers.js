const User = require('../models/User');
const Profile = require('../models/Profile');
const Course = require('../models/Course');
const cron = require('node-cron');

// Schedule the job to run every minute
cron.schedule('0 * * * *', async () => {
    try {
        // Get the current date and time
        const currentDate = new Date(); 
        // Find users who have requested deletion and whose request is older than 24 hours
        const usersToDelete = await User.find({
            deletedTequest: true,
            deleteRequestAt: { $lte: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000) }
        });
        if (usersToDelete.length > 0) {
            for (const user of usersToDelete) {
                // Delete the user's profile    
                await Profile.findByIdAndDelete({_id:user.additionalDetails});
                // Remove the user from any courses they are enrolled in
                await Course.updateMany(
                    { studentsEnrolled: user._id },
                    { $pull: { studentsEnrolled: user._id } }
                );
                // Delete the user
                await User.findByIdAndDelete({_id:user._id});
            }
            console.log(`Deleted ${usersToDelete.length} users who requested deletion more than 24 hrs ago.`);
        }
    } catch (error) {
        console.error('Error deleting old users:', error);
    }   
});
module.exports = cron;