const reviewModel = require("./ReviewModel")

exports.handleMessage = async (info)=>
{
    console.log(info);

    const reviewInfo = {
        classId: info.classRoomId,
        studentId: info.userId,
        title: info.title,
        commentList: [
            {
                comment: info.Message,
                date: info.Date,
                commentUser: info.userId
            }
        ]
      }
    
      const newReview = new reviewModel(reviewInfo)
    
      await newReview.save()
    
      return newReview._id
}